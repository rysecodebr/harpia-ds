import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tokenDir = path.join(root, 'tokens');
const outputDir = path.join(root, 'generated');
const referencePattern = /^\{(color\.[A-Za-z0-9.]+)\}$/;
const hexPattern = /^#[0-9a-fA-F]{6}$/;
const rgbaPattern = /^rgba\((\d{1,3}), (\d{1,3}), (\d{1,3}), (0|1|0\.\d+)\)$/;
const keyPattern = /^color\.[A-Za-z][A-Za-z0-9]*(\.[A-Za-z0-9]+)*$/;

const readJson = async (name) => JSON.parse(await readFile(path.join(tokenDir, name), 'utf8'));

export function parseColor(value) {
  if (hexPattern.test(value)) {
    return [1, 3, 5].map((index) => Number.parseInt(value.slice(index, index + 2), 16)).concat(255);
  }
  const match = rgbaPattern.exec(value);
  if (!match) throw new Error(`Invalid color: ${value}`);
  const channels = match.slice(1, 4).map(Number);
  const alpha = Number(match[4]);
  if (channels.some((channel) => channel > 255) || alpha > 1) {
    throw new Error(`Out-of-range color: ${value}`);
  }
  return channels.concat(Math.round(alpha * 255));
}

function validateDocument(document, kind, name) {
  if (document.kind !== kind || (name && document.name !== name)) {
    throw new Error(`Unexpected token document kind/name: ${kind}/${name ?? ''}`);
  }
  if (!document.source || !document.colors || Array.isArray(document.colors)) {
    throw new Error(`Invalid token document: ${kind}/${name ?? ''}`);
  }
  for (const [key, value] of Object.entries(document.colors)) {
    if (!keyPattern.test(key) || typeof value !== 'string') {
      throw new Error(`Invalid token: ${key}`);
    }
    if (!referencePattern.test(value)) parseColor(value);
  }
}

function resolveColors(palette, theme) {
  const all = { ...palette, ...theme };
  const resolved = {};
  const visiting = new Set();
  function resolve(key) {
    if (resolved[key]) return resolved[key];
    if (!(key in all)) throw new Error(`Unknown token reference: ${key}`);
    if (visiting.has(key)) throw new Error(`Circular token reference: ${key}`);
    visiting.add(key);
    const reference = referencePattern.exec(all[key]);
    const value = reference ? resolve(reference[1]) : all[key];
    parseColor(value);
    visiting.delete(key);
    resolved[key] = value;
    return value;
  }
  for (const key of Object.keys(all)) resolve(key);
  return resolved;
}

function cssName(key) {
  return `--harpia-${key.replace(/([a-z])([A-Z])/g, '$1-$2').replaceAll('.', '-').toLowerCase()}`;
}

function dartName(key) {
  return key.replace(/^color\./, '').split('.').map((part, index) => index ? part[0].toUpperCase() + part.slice(1) : part).join('');
}

function dartColor(value) {
  const [red, green, blue, alpha] = parseColor(value);
  return `Color(0x${[alpha, red, green, blue].map((part) => part.toString(16).padStart(2, '0')).join('').toUpperCase()})`;
}

function validateDimensions(document) {
  if (document.kind !== 'dimensions' || document.unit !== 'reference-px-at-16px-root' ||
      !document.source || !document.values || Array.isArray(document.values)) {
    throw new Error('Invalid dimensions document');
  }
  for (const [key, value] of Object.entries(document.values)) {
    if (!/^(spacing|size|radius)\.[A-Za-z0-9][A-Za-z0-9.-]*$/.test(key) ||
        typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
      throw new Error(`Invalid dimension: ${key}`);
    }
  }
}

function dimensionCssValue(key, value) {
  if (value === 0) return '0';
  if (key === 'spacing.px' || key === 'radius.full') return `${value}px`;
  return `${value / 16}rem`;
}

function dimensionDartName(key) {
  return key.split('.').map((part, index) => {
    const normalized = part.replaceAll('-', '_');
    return index ? normalized[0].toUpperCase() + normalized.slice(1) : normalized;
  }).join('');
}

export function buildDimensions(document) {
  validateDimensions(document);
  const keys = Object.keys(document.values).sort();
  const css = keys.map((key) => `  ${cssName(key)}: ${dimensionCssValue(key, document.values[key])};`);
  const dart = [
    '// Generated from tokens/dimensions.json. Values use reference pixels / Flutter logical pixels.',
    'class HarpiaDimensions {',
    '  HarpiaDimensions._();',
    ...keys.map((key) => `  static const double ${dimensionDartName(key)} = ${document.values[key].toFixed(1)}; // ${key}`),
    '}',
    ''
  ].join('\n');
  return { keys, css, dart };
}

export function buildEffects(document) {
  const roles = ['card', 'popover', 'dialog', 'tooltip'];
  if (document?.kind !== 'effects' || !document.source || !document.shadows ||
      Object.keys(document.shadows).length !== roles.length || roles.some((role) => !(role in document.shadows))) {
    throw new Error('Invalid effects document');
  }
  if (JSON.stringify(document.layers) !== JSON.stringify(['card', 'popover', 'backdrop', 'dialog', 'tooltip', 'toast'])) {
    throw new Error('Invalid partial layer order');
  }
  for (const role of roles) {
    const themes = document.shadows[role];
    if (!themes || Object.keys(themes).length !== 2 || !('light' in themes) || !('dark' in themes)) {
      throw new Error(`Invalid shadow themes: ${role}`);
    }
    for (const theme of ['light', 'dark']) {
      const shadow = themes[theme];
      if (shadow === null) {
        if (role !== 'card') throw new Error(`Unexpected empty shadow: ${role}.${theme}`);
        continue;
      }
      if (!shadow || Object.keys(shadow).length !== 5 ||
          ['x', 'y', 'blur', 'spread'].some((key) => typeof shadow[key] !== 'number' || !Number.isFinite(shadow[key])) ||
          shadow.blur < 0 || typeof shadow.color !== 'string') {
        throw new Error(`Invalid shadow: ${role}.${theme}`);
      }
      parseColor(shadow.color);
    }
  }
  const css = (theme) => roles.map((role) => {
    const shadow = document.shadows[role][theme];
    const value = shadow === null ? 'none' : `${shadow.x}px ${shadow.y}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`;
    return `  --harpia-shadow-${role}: ${value};`;
  });
  const dart = [
    '// Generated from tokens/effects.json. CSS pixels are references; Flutter uses logical pixels.',
    "import 'package:flutter/material.dart';",
    '',
    'class HarpiaShadows {',
    '  HarpiaShadows._();',
    ...['light', 'dark'].flatMap((theme) => roles.map((role) => {
      const shadow = document.shadows[role][theme];
      if (shadow === null) return `  static const List<BoxShadow> ${theme}${upperFirst(role)} = [];`;
      const [red, green, blue, alpha] = parseColor(shadow.color);
      const color = `0x${[alpha, red, green, blue].map((part) => part.toString(16).padStart(2, '0')).join('').toUpperCase()}`;
      return `  static const List<BoxShadow> ${theme}${upperFirst(role)} = [BoxShadow(color: Color(${color}), offset: Offset(${shadow.x}, ${shadow.y}), blurRadius: ${shadow.blur}.0, spreadRadius: ${shadow.spread}.0)];`;
    })),
    '}',
    ''
  ].join('\n');
  return { roles, layers: document.layers, css, dart };
}

export function buildMotion(document) {
  if (document?.kind !== 'motion' || !document.source || document.durationUnit !== 'ms' ||
      !document.durations || Object.keys(document.durations).length !== 1 || document.durations.controlState !== 150 ||
      !document.easings || Object.keys(document.easings).length !== 1 || document.easings.controlState !== 'ease') {
    throw new Error('Invalid motion document');
  }
  const css = [
    `  --harpia-motion-duration-control-state: ${document.durations.controlState}ms;`,
    `  --harpia-motion-easing-control-state: ${document.easings.controlState};`
  ];
  const dart = [
    '// Generated from tokens/motion.json. Durations use milliseconds.',
    "import 'package:flutter/material.dart';",
    '',
    'class HarpiaMotion {',
    '  HarpiaMotion._();',
    `  static const Duration controlStateDuration = Duration(milliseconds: ${document.durations.controlState});`,
    '  static const Curve controlStateEasing = Curves.ease;',
    '}',
    ''
  ].join('\n');
  return { css, dart };
}

function validateTypography(document) {
  if (document.kind !== 'typography' || document.family !== 'Montserrat' ||
      document.sizeUnit !== 'reference-px-at-16px-root' || !document.source) {
    throw new Error('Invalid typography document');
  }
  const groups = [
    ['sizes', /^(?:[2-6]?(?:xs|xl)|sm|md|base|lg)$/, (value) => value > 0],
    ['weights', /^(?:regular|medium|semibold|bold|extrabold)$/, (value) => Number.isInteger(value) && value >= 100 && value <= 900 && value % 100 === 0],
    ['lineHeights', /^(?:none|tight|snug|normal|relaxed|loose)$/, (value) => value > 0]
  ];
  for (const [group, pattern, validValue] of groups) {
    const values = document[group];
    if (!values || Array.isArray(values) || !Object.keys(values).length) {
      throw new Error(`Invalid typography group: ${group}`);
    }
    for (const [key, value] of Object.entries(values)) {
      if (!pattern.test(key) || typeof value !== 'number' || !Number.isFinite(value) || !validValue(value)) {
        throw new Error(`Invalid typography token: ${group}.${key}`);
      }
    }
  }
  const roles = ['pageTitle', 'sectionTitle', 'componentTitle', 'body', 'supporting', 'controlLabel'];
  if (!document.roles || Array.isArray(document.roles) ||
      Object.keys(document.roles).length !== roles.length || roles.some((key) => !(key in document.roles))) {
    throw new Error('Invalid typography roles');
  }
  for (const [key, role] of Object.entries(document.roles)) {
    if (!role || Array.isArray(role) || Object.keys(role).length !== 4 ||
        !(role.size in document.sizes) || !(role.weight in document.weights) ||
        !(role.lineHeight in document.lineHeights) || role.letterSpacing !== 0) {
      throw new Error(`Invalid typography role: ${key}`);
    }
  }
}

function upperFirst(value) {
  return value[0].toUpperCase() + value.slice(1);
}

export function buildTypography(document) {
  validateTypography(document);
  const sizes = Object.keys(document.sizes).sort();
  const weights = Object.keys(document.weights).sort();
  const lineHeights = Object.keys(document.lineHeights).sort();
  const roles = Object.keys(document.roles).sort();
  const css = [
    ...sizes.map((key) => `  --harpia-font-size-${key}: ${document.sizes[key] / 16}rem;`),
    ...weights.map((key) => `  --harpia-font-weight-${key}: ${document.weights[key]};`),
    ...lineHeights.map((key) => `  --harpia-line-height-${key}: ${document.lineHeights[key]};`),
    ...roles.flatMap((key) => {
      const role = document.roles[key];
      const name = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      return [
        `  --harpia-text-${name}-size: var(--harpia-font-size-${role.size});`,
        `  --harpia-text-${name}-weight: var(--harpia-font-weight-${role.weight});`,
        `  --harpia-text-${name}-line-height: var(--harpia-line-height-${role.lineHeight});`,
        `  --harpia-text-${name}-letter-spacing: 0;`
      ];
    })
  ];
  const dart = [
    '// Generated from tokens/typography.json. Sizes use reference pixels / Flutter logical pixels.',
    "import 'package:flutter/material.dart';",
    '',
    'class HarpiaTypography {',
    '  HarpiaTypography._();',
    "  static const String fontFamily = 'Montserrat';",
    ...sizes.map((key) => `  static const double fontSize${upperFirst(key)} = ${document.sizes[key].toFixed(1)};`),
    ...weights.map((key) => `  static const FontWeight fontWeight${upperFirst(key)} = FontWeight.w${document.weights[key]};`),
    ...lineHeights.map((key) => `  static const double lineHeight${upperFirst(key)} = ${Number.isInteger(document.lineHeights[key]) ? `${document.lineHeights[key]}.0` : document.lineHeights[key]};`),
    ...roles.map((key) => {
      const role = document.roles[key];
      return `  static const TextStyle ${key} = TextStyle(fontFamily: fontFamily, fontSize: fontSize${upperFirst(role.size)}, fontWeight: fontWeight${upperFirst(role.weight)}, height: lineHeight${upperFirst(role.lineHeight)}, letterSpacing: 0.0);`;
    }),
    '}',
    ''
  ].join('\n');
  return { sizes, weights, lineHeights, roles, css, dart };
}

export function buildOutputs(paletteDocument, lightDocument, darkDocument, dimensionsDocument, typographyDocument, effectsDocument, motionDocument) {
  validateDocument(paletteDocument, 'palette');
  validateDocument(lightDocument, 'theme', 'light');
  validateDocument(darkDocument, 'theme', 'dark');
  const palette = paletteDocument.colors;
  const lightKeys = Object.keys(lightDocument.colors);
  const darkKeys = Object.keys(darkDocument.colors);
  if (lightKeys.length !== darkKeys.length || lightKeys.some((key) => !(key in darkDocument.colors))) {
    throw new Error('Light and dark theme token keys differ');
  }
  if (lightKeys.some((key) => key in palette)) throw new Error('Theme token collides with palette token');
  const light = resolveColors(palette, lightDocument.colors);
  const dark = resolveColors(palette, darkDocument.colors);
  const paletteKeys = Object.keys(palette).sort();
  const semanticKeys = lightKeys.sort();
  const dimensions = buildDimensions(dimensionsDocument);
  const typography = buildTypography(typographyDocument);
  const effects = buildEffects(effectsDocument);
  const motion = buildMotion(motionDocument);
  const baseCss = paletteKeys.map((key) => `  ${cssName(key)}: ${light[key]};`);
  const themeCss = (values) => semanticKeys.map((key) => `  ${cssName(key)}: ${values[key]};`);
  const css = [
    '/* Generated from tokens/*.json. Edit the catalog, then run npm run tokens:build. */',
    '@font-face {',
    '  font-family: "Montserrat";',
    '  src: url("../assets/fonts/montserrat/Montserrat[wght].ttf") format("truetype");',
    '  font-style: normal;',
    '  font-weight: 100 900;',
    '  font-display: swap;',
    '}',
    '',
    '@font-face {',
    '  font-family: "Montserrat";',
    '  src: url("../assets/fonts/montserrat/Montserrat-Italic[wght].ttf") format("truetype");',
    '  font-style: italic;',
    '  font-weight: 100 900;',
    '  font-display: swap;',
    '}',
    '',
    ':root,',
    '[data-harpia-theme="light"] {',
    '  color-scheme: light;',
    '  --harpia-font-family-sans: "Montserrat", sans-serif;',
    ...baseCss,
    ...themeCss(light),
    ...dimensions.css,
    ...typography.css,
    ...motion.css,
    ...effects.css('light'),
    '}',
    '',
    '[data-harpia-theme="dark"] {',
    '  color-scheme: dark;',
    ...themeCss(dark),
    ...effects.css('dark'),
    '}',
    ''
  ].join('\n');
  const dartEntries = (values) => semanticKeys.map((key) => `    '${key}': ${dartColor(values[key])},`);
  const getters = semanticKeys.map((key) => `  Color get ${dartName(key)} => values['${key}']!;`);
  const dart = [
    '// Generated from tokens/*.json. Edit the catalog, then run npm run tokens:build.',
    "import 'package:flutter/material.dart';",
    '',
    'class HarpiaColorTokens extends ThemeExtension<HarpiaColorTokens> {',
    '  const HarpiaColorTokens(this.values);',
    '  final Map<String, Color> values;',
    ...getters,
    '',
    '  @override',
    '  HarpiaColorTokens copyWith({Map<String, Color>? values}) =>',
    '      HarpiaColorTokens(values ?? this.values);',
    '',
    '  @override',
    '  HarpiaColorTokens lerp(ThemeExtension<HarpiaColorTokens>? other, double t) {',
    '    if (other is! HarpiaColorTokens) return this;',
    '    return HarpiaColorTokens({',
    '      for (final key in values.keys)',
    '        key: Color.lerp(values[key], other.values[key], t)!,',
    '    });',
    '  }',
    '}',
    '',
    'class HarpiaTheme {',
    '  HarpiaTheme._();',
    '  static const lightColors = HarpiaColorTokens({',
    ...dartEntries(light),
    '  });',
    '  static const darkColors = HarpiaColorTokens({',
    ...dartEntries(dark),
    '  });',
    '',
    '  static ThemeData get light => _build(lightColors, Brightness.light);',
    '  static ThemeData get dark => _build(darkColors, Brightness.dark);',
    '',
    '  static ThemeData _build(HarpiaColorTokens tokens, Brightness brightness) {',
    '    final scheme = brightness == Brightness.light',
    '        ? ColorScheme.light(',
    '            primary: tokens.actionPrimary,',
    '            onPrimary: tokens.actionOnPrimary,',
    '            surface: tokens.backgroundSurface,',
    '            onSurface: tokens.textPrimary,',
    '            error: tokens.statusDangerText,',
    '            onError: tokens.textInverted,',
    '          )',
    '        : ColorScheme.dark(',
    '            primary: tokens.actionPrimary,',
    '            onPrimary: tokens.actionOnPrimary,',
    '            surface: tokens.backgroundSurface,',
    '            onSurface: tokens.textPrimary,',
    '            error: tokens.statusDangerText,',
    '            onError: tokens.textInverted,',
    '          );',
    '    return ThemeData(',
    "      fontFamily: 'Montserrat',",
    '      colorScheme: scheme,',
    '      scaffoldBackgroundColor: tokens.backgroundPage,',
    '      extensions: [tokens],',
    '    );',
    '  }',
    '}',
    ''
  ].join('\n');
  return { css, dart, dimensions, typography, effects, motion, paletteKeys, semanticKeys, light, dark };
}

async function main() {
  const output = buildOutputs(await readJson('palette.json'), await readJson('light.json'), await readJson('dark.json'), await readJson('dimensions.json'), await readJson('typography.json'), await readJson('effects.json'), await readJson('motion.json'));
  const files = [
    [path.join(outputDir, 'harpia-tokens.css'), output.css],
    [path.join(outputDir, 'harpia_theme.dart'), output.dart],
    [path.join(outputDir, 'harpia_dimensions.dart'), output.dimensions.dart],
    [path.join(outputDir, 'harpia_typography.dart'), output.typography.dart],
    [path.join(outputDir, 'harpia_shadows.dart'), output.effects.dart],
    [path.join(outputDir, 'harpia_motion.dart'), output.motion.dart]
  ];
  if (process.argv.includes('--check')) {
    for (const [file, expected] of files) {
      const actual = await readFile(file, 'utf8');
      if (actual !== expected) throw new Error(`Generated output is stale: ${file}`);
    }
  } else {
    await mkdir(outputDir, { recursive: true });
    for (const [file, contents] of files) await writeFile(file, contents, 'utf8');
  }
  process.stdout.write(`Validated ${output.paletteKeys.length} palette colors, ${output.semanticKeys.length} theme colors, ${output.dimensions.keys.length} dimensions and ${output.typography.sizes.length + output.typography.weights.length + output.typography.lineHeights.length} typography tokens.\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
