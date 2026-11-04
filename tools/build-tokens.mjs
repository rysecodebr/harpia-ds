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
  return `--harpia-${key.replace(/^color\./, 'color-').replace(/([a-z])([A-Z])/g, '$1-$2').replaceAll('.', '-').toLowerCase()}`;
}

function dartName(key) {
  return key.replace(/^color\./, '').split('.').map((part, index) => index ? part[0].toUpperCase() + part.slice(1) : part).join('');
}

function dartColor(value) {
  const [red, green, blue, alpha] = parseColor(value);
  return `Color(0x${[alpha, red, green, blue].map((part) => part.toString(16).padStart(2, '0')).join('').toUpperCase()})`;
}

export function buildOutputs(paletteDocument, lightDocument, darkDocument) {
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
  const baseCss = paletteKeys.map((key) => `  ${cssName(key)}: ${light[key]};`);
  const themeCss = (values) => semanticKeys.map((key) => `  ${cssName(key)}: ${values[key]};`);
  const css = [
    '/* Generated from tokens/*.json. Edit the catalog, then run npm run tokens:build. */',
    ':root,',
    '[data-harpia-theme="light"] {',
    '  color-scheme: light;',
    ...baseCss,
    ...themeCss(light),
    '}',
    '',
    '[data-harpia-theme="dark"] {',
    '  color-scheme: dark;',
    ...themeCss(dark),
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
    '      colorScheme: scheme,',
    '      scaffoldBackgroundColor: tokens.backgroundPage,',
    '      extensions: [tokens],',
    '    );',
    '  }',
    '}',
    ''
  ].join('\n');
  return { css, dart, paletteKeys, semanticKeys, light, dark };
}

async function main() {
  const output = buildOutputs(await readJson('palette.json'), await readJson('light.json'), await readJson('dark.json'));
  const files = [
    [path.join(outputDir, 'harpia-tokens.css'), output.css],
    [path.join(outputDir, 'harpia_theme.dart'), output.dart]
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
  process.stdout.write(`Validated ${output.paletteKeys.length} palette and ${output.semanticKeys.length} theme colors.\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  });
}
