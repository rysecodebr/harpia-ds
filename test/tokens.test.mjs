import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { buildOutputs, parseColor } from '../tools/build-tokens.mjs';

const read = async (name) => JSON.parse(await readFile(new URL(`../tokens/${name}.json`, import.meta.url), 'utf8'));
const [palette, light, dark] = await Promise.all(['palette', 'light', 'dark'].map(read));

test('shared keys resolve to identical CSS and Dart colors', async () => {
  const output = buildOutputs(palette, light, dark);
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
  const output = buildOutputs(palette, light, dark);
  assert.equal(output.light['color.text.muted'], '#4b5563');
  assert.match(output.css, /^\/\*.*\*\/\n:root,\n\[data-harpia-theme="light"\]/);
  assert.match(output.dart, /static ThemeData get light/);
  assert.match(output.dart, /static ThemeData get dark/);
});

test('invalid references and divergent theme surfaces fail generation', () => {
  const badLight = structuredClone(light);
  badLight.colors['color.text.primary'] = '{color.missing}';
  assert.throws(() => buildOutputs(palette, badLight, dark), /Unknown token reference/);
  const missingDark = structuredClone(dark);
  delete missingDark.colors['color.text.primary'];
  assert.throws(() => buildOutputs(palette, light, missingDark), /token keys differ/);
});

test('alpha colors have the same rounded 8-bit representation', () => {
  assert.deepEqual(parseColor('rgba(31, 42, 68, 0.16)'), [31, 42, 68, 41]);
  assert.throws(() => parseColor('rgba(256, 0, 0, 1)'), /Out-of-range/);
});
