import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'apps', 'flutter-validate');
const check = process.argv.includes('--check');
const files = [
  ['generated/harpia_theme.dart', 'lib/harpia_theme.dart'],
  ['generated/harpia_typography.dart', 'lib/harpia_typography.dart'],
  ['generated/harpia_shadows.dart', 'lib/harpia_shadows.dart'],
  ['assets/fonts/montserrat/Montserrat[wght].ttf', 'assets/fonts/Montserrat[wght].ttf'],
  ['assets/fonts/montserrat/Montserrat-Italic[wght].ttf', 'assets/fonts/Montserrat-Italic[wght].ttf']
];

for (const [source, destination] of files) {
  const from = path.join(root, source);
  const to = path.join(target, destination);
  if (check) {
    const [expected, actual] = await Promise.all([readFile(from), readFile(to)]);
    if (!expected.equals(actual)) throw new Error(`Validation copy is stale: ${destination}`);
  } else {
    await mkdir(path.dirname(to), { recursive: true });
    await copyFile(from, to);
  }
}

const typography = JSON.parse(await readFile(path.join(root, 'tokens', 'typography.json'), 'utf8'));
const entries = (key) => Object.entries(typography[key]);
const dartNumber = (value) => Number.isInteger(value) ? `${value}.0` : String(value);
const upperFirst = (value) => value[0].toUpperCase() + value.slice(1);
const cssRole = (key) => key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
const typescript = [
  '// Generated from tokens/typography.json by tools/sync-validate.mjs.',
  `export const sizeSamples = ${JSON.stringify(entries('sizes').map(([key, value]) => ({ key, value })))} as const;`,
  `export const weightSamples = ${JSON.stringify(entries('weights').map(([key, value]) => ({ key, value })))} as const;`,
  `export const lineHeightSamples = ${JSON.stringify(entries('lineHeights').map(([key, value]) => ({ key, value })))} as const;`,
  `export const roleSamples = ${JSON.stringify(entries('roles').map(([key, role]) => ({ key, cssKey: cssRole(key), ...role, sizeValue: typography.sizes[role.size], weightValue: typography.weights[role.weight], lineHeightValue: typography.lineHeights[role.lineHeight] })))} as const;`,
  ''
].join('\n');
const dart = [
  '// Generated from tokens/typography.json by tools/sync-validate.mjs.',
  "import 'package:flutter/material.dart';",
  "import 'harpia_typography.dart';",
  '',
  'const sizeSamples = <({String key, double value})>[',
  ...entries('sizes').map(([key]) => `  (key: '${key}', value: HarpiaTypography.fontSize${upperFirst(key)}),`),
  '];',
  'const weightSamples = <({String key, int value, FontWeight weight})>[',
  ...entries('weights').map(([key, value]) => `  (key: '${key}', value: ${value}, weight: HarpiaTypography.fontWeight${upperFirst(key)}),`),
  '];',
  'const lineHeightSamples = <({String key, double value})>[',
  ...entries('lineHeights').map(([key]) => `  (key: '${key}', value: HarpiaTypography.lineHeight${upperFirst(key)}),`),
  '];',
  'const roleSamples = <({String key, String size, int sizeValue, String weight, int weightValue, String lineHeight, double lineHeightValue, double letterSpacing, TextStyle style})>[',
  ...entries('roles').map(([key, role]) => `  (key: '${key}', size: '${role.size}', sizeValue: ${typography.sizes[role.size]}, weight: '${role.weight}', weightValue: ${typography.weights[role.weight]}, lineHeight: '${role.lineHeight}', lineHeightValue: ${dartNumber(typography.lineHeights[role.lineHeight])}, letterSpacing: ${dartNumber(role.letterSpacing)}, style: HarpiaTypography.${key}),`),
  '];',
  ''
].join('\n');
for (const [destination, contents] of [
  ['apps/angular-validate/src/app/typography-samples.ts', typescript],
  ['apps/flutter-validate/lib/typography_samples.dart', dart]
]) {
  const file = path.join(root, destination);
  if (check) {
    if (await readFile(file, 'utf8') !== contents) throw new Error(`Validation samples are stale: ${destination}`);
  } else {
    await writeFile(file, contents, 'utf8');
  }
}
process.stdout.write('Validation samples and Flutter copies match the Harpia catalog.\n');
