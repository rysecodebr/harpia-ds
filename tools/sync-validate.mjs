import { copyFile, mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const target = path.join(root, 'apps', 'flutter-validate');
const files = [
  ['generated/harpia_theme.dart', 'lib/harpia_theme.dart'],
  ['generated/harpia_typography.dart', 'lib/harpia_typography.dart'],
  ['assets/fonts/montserrat/Montserrat[wght].ttf', 'assets/fonts/Montserrat[wght].ttf'],
  ['assets/fonts/montserrat/Montserrat-Italic[wght].ttf', 'assets/fonts/Montserrat-Italic[wght].ttf']
];

for (const [source, destination] of files) {
  const from = path.join(root, source);
  const to = path.join(target, destination);
  if (process.argv.includes('--check')) {
    const [expected, actual] = await Promise.all([readFile(from), readFile(to)]);
    if (!expected.equals(actual)) throw new Error(`Validation copy is stale: ${destination}`);
  } else {
    await mkdir(path.dirname(to), { recursive: true });
    await copyFile(from, to);
  }
}
process.stdout.write('Flutter validation copies match the Harpia catalog.\n');
