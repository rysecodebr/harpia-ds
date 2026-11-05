import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { buildOutputs, parseColor } from '../tools/build-tokens.mjs';

const read = async (name) => JSON.parse(await readFile(new URL(`../tokens/${name}.json`, import.meta.url), 'utf8'));
const [palette, light, dark, dimensions, typography] = await Promise.all(['palette', 'light', 'dark', 'dimensions', 'typography'].map(read));
const build = (paletteValue = palette, lightValue = light, darkValue = dark, dimensionsValue = dimensions, typographyValue = typography) =>
  buildOutputs(paletteValue, lightValue, darkValue, dimensionsValue, typographyValue);

test('shared keys resolve to identical CSS and Dart colors', async () => {
  const output = build();
  const css = await readFile(new URL('../generated/harpia-tokens.css', import.meta.url), 'utf8');
  const dart = await readFile(new URL('../generated/harpia_theme.dart', import.meta.url), 'utf8');
  assert.equal(css, output.css);
  assert.equal(dart, output.dart);
  assert.equal(output.semanticKeys.length, 36);
  for (const key of output.semanticKeys) {
    const cssKey = `--harpia-${key.replace(/^color\./, 'color-').replace(/([a-z])([A-Z])/g, '$1-$2').replaceAll('.', '-').toLowerCase()}`;
    for (const theme of ['light', 'dark']) {
      const value = output[theme][key];
      assert.ok(css.includes(`${cssKey}: ${value};`), `${theme} CSS missing ${key}`);
      const [r, g, b, a] = parseColor(value);
      const dartValue = `Color(0x${[a, r, g, b].map((part) => part.toString(16).padStart(2, '0')).join('').toUpperCase()})`;
      assert.ok(dart.includes(`'${key}': ${dartValue},`), `${theme} Dart missing ${key}`);
    }
  }
  assert.ok(css.includes('[data-harpia-theme="dark"]'));
  assert.ok(!css.includes('--aurum-'));
});

test('approved light muted text and light default are preserved', () => {
  const output = build();
  assert.equal(output.light['color.text.muted'], '#4b5563');
  assert.match(output.css, /:root,\n\[data-harpia-theme="light"\]/);
  assert.match(output.dart, /static ThemeData get light/);
  assert.match(output.dart, /static ThemeData get dark/);
});

test('official Montserrat assets and both platform declarations are pinned', async () => {
  const output = build();
  assert.match(output.css, /font-family: "Montserrat"/);
  assert.match(output.css, /Montserrat\[wght\]\.ttf/);
  assert.match(output.css, /Montserrat-Italic\[wght\]\.ttf/);
  assert.match(output.dart, /fontFamily: 'Montserrat'/);
  const expectedBlobs = new Map([
    ['Montserrat[wght].ttf', 'c97aca18592834d8706549c279cb8d5ac5d85f69'],
    ['Montserrat-Italic[wght].ttf', 'c8b8441744f2092ea8cbeb7b6f881e53bfe9c623'],
    ['OFL.txt', 'fe576a2ee1f96353b05d030c0b7620d525cc53a8']
  ]);
  for (const [name, expected] of expectedBlobs) {
    const bytes = await readFile(new URL(`../assets/fonts/montserrat/${name}`, import.meta.url));
    const blob = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
    assert.equal(blob, expected, `${name} differs from pinned official source`);
  }
});

test('dark muted text remains readable and distinct from secondary text', () => {
  const output = build();
  const muted = output.dark['color.text.muted'];
  assert.equal(muted, '#8493a9');
  assert.notEqual(muted, output.dark['color.text.secondary']);
  const luminance = (hex) => {
    const channels = parseColor(hex).slice(0, 3).map((channel) => channel / 255);
    const [red, green, blue] = channels.map((channel) =>
      channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  };
  const contrast = (a, b) => {
    const [lighter, darker] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (lighter + 0.05) / (darker + 0.05);
  };
  for (const background of ['#151a23', '#111722', '#1f2937']) {
    assert.ok(contrast(muted, background) >= 4.5, `Insufficient contrast on ${background}`);
  }
});

test('invalid references and divergent theme surfaces fail generation', () => {
  const badLight = structuredClone(light);
  badLight.colors['color.text.primary'] = '{color.missing}';
  assert.throws(() => build(palette, badLight), /Unknown token reference/);
  const missingDark = structuredClone(dark);
  delete missingDark.colors['color.text.primary'];
  assert.throws(() => build(palette, light, missingDark), /token keys differ/);
});

test('alpha colors have the same rounded 8-bit representation', () => {
  assert.deepEqual(parseColor('rgba(31, 42, 68, 0.16)'), [31, 42, 68, 41]);
  assert.throws(() => parseColor('rgba(256, 0, 0, 1)'), /Out-of-range/);
});

test('spacing, control sizes and radius values match both generated platforms', async () => {
  const output = build();
  const dart = await readFile(new URL('../generated/harpia_dimensions.dart', import.meta.url), 'utf8');
  assert.equal(dart, output.dimensions.dart);
  assert.equal(output.dimensions.keys.length, 33);
  for (const key of output.dimensions.keys) {
    const value = dimensions.values[key];
    const cssKey = `--harpia-${key.replace(/([a-z])([A-Z])/g, '$1-$2').replaceAll('.', '-').toLowerCase()}`;
    const cssValue = value === 0 ? '0' : key === 'spacing.px' || key === 'radius.full' ? `${value}px` : `${value / 16}rem`;
    assert.ok(output.css.includes(`${cssKey}: ${cssValue};`), `CSS missing ${key}`);
    assert.ok(dart.includes(`= ${value.toFixed(1)}; // ${key}`), `Dart missing ${key}`);
  }
  assert.equal(dimensions.values['size.touchTargetMin'], 44);
  assert.equal(dimensions.values['radius.full'], 9999);
});

test('invalid dimensions fail before generation', () => {
  const invalid = structuredClone(dimensions);
  invalid.values['spacing.2'] = -8;
  assert.throws(() => build(palette, light, dark, invalid), /Invalid dimension/);
});

test('Montserrat typography values agree in CSS and Dart', async () => {
  const output = build();
  const dart = await readFile(new URL('../generated/harpia_typography.dart', import.meta.url), 'utf8');
  assert.equal(dart, output.typography.dart);
  assert.equal(output.typography.sizes.length, 12);
  assert.equal(output.typography.weights.length, 5);
  assert.equal(output.typography.lineHeights.length, 6);
  for (const [key, value] of Object.entries(typography.sizes)) {
    assert.ok(output.css.includes(`--harpia-font-size-${key}: ${value / 16}rem;`));
    assert.ok(dart.includes(`fontSize${key[0].toUpperCase() + key.slice(1)} = ${value.toFixed(1)};`));
  }
  for (const [key, value] of Object.entries(typography.weights)) {
    assert.ok(output.css.includes(`--harpia-font-weight-${key}: ${value};`));
    assert.ok(dart.includes(`fontWeight${key[0].toUpperCase() + key.slice(1)} = FontWeight.w${value};`));
  }
  for (const [key, value] of Object.entries(typography.lineHeights)) {
    assert.ok(output.css.includes(`--harpia-line-height-${key}: ${value};`));
    assert.ok(dart.includes(`lineHeight${key[0].toUpperCase() + key.slice(1)} = ${Number.isInteger(value) ? `${value}.0` : value};`));
  }
  assert.equal(typography.family, 'Montserrat');
  assert.ok(!('sm' in typography.lineHeights));
});

test('invalid typography scale fails generation', () => {
  const invalid = structuredClone(typography);
  invalid.weights.bold = 725;
  assert.throws(() => build(palette, light, dark, dimensions, invalid), /Invalid typography token/);
});

test('approved typography roles resolve through the same scale on CSS and Flutter', async () => {
  const output = build();
  const dart = await readFile(new URL('../generated/harpia_typography.dart', import.meta.url), 'utf8');
  assert.equal(output.typography.roles.length, 6);
  for (const [key, role] of Object.entries(typography.roles)) {
    const cssKey = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    assert.ok(output.css.includes(`--harpia-text-${cssKey}-size: var(--harpia-font-size-${role.size});`));
    assert.ok(output.css.includes(`--harpia-text-${cssKey}-weight: var(--harpia-font-weight-${role.weight});`));
    assert.ok(output.css.includes(`--harpia-text-${cssKey}-line-height: var(--harpia-line-height-${role.lineHeight});`));
    assert.ok(dart.includes(`static const TextStyle ${key} = TextStyle(`));
    assert.ok(dart.includes(`fontSize: fontSize${role.size[0].toUpperCase() + role.size.slice(1)}, fontWeight: fontWeight${role.weight[0].toUpperCase() + role.weight.slice(1)}, height: lineHeight${role.lineHeight[0].toUpperCase() + role.lineHeight.slice(1)}, letterSpacing: 0.0`));
  }
  const invalid = structuredClone(typography);
  invalid.roles.body.size = 'missing';
  assert.throws(() => build(palette, light, dark, dimensions, invalid), /Invalid typography role/);
});
