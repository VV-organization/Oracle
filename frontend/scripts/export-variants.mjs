import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const dist = new URL('../dist/', import.meta.url);
const destination = new URL('../../Oracle/', import.meta.url);
const html = await readFile(new URL('index.html', dist), 'utf8');
for (const variant of ['green', 'orange']) {
  const folder = new URL(`${variant}/`, destination);
  await rm(folder, { recursive: true, force: true });
  await mkdir(folder, { recursive: true });
  await cp(dist, folder, { recursive: true });
  await writeFile(new URL('index.html', folder), html.replace('<html lang="ru">', `<html lang="ru" data-variant="${variant}">`));
  console.log(`Exported ${fileURLToPath(folder)}`);
}
