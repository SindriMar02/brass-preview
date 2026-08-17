import { mkdir, writeFile, cp, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { COPY } from './content.mjs';
import { render } from './template.mjs';

/* A preview build carries a brand on a URL that is not its own:
   noindex + canonical whenever PREVIEW_ORIGIN is set. */
const PREVIEW_ORIGIN = process.env.PREVIEW_ORIGIN || '';
const isPreview = Boolean(PREVIEW_ORIGIN);

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const dist = join(root, 'dist');

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(join(root, 'public'), dist, { recursive: true });

/* favicon ships relative and self-contained, never inherited from the host */
await writeFile(
  join(dist, 'favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<rect width="64" height="64" fill="#14181B"/>
<g fill="#C8813C">
<rect x="14" y="14" width="16" height="6"/><rect x="14" y="14" width="6" height="16"/>
<rect x="34" y="14" width="16" height="6"/><rect x="44" y="14" width="6" height="16"/>
<rect x="14" y="44" width="16" height="6"/><rect x="14" y="34" width="6" height="16"/>
<rect x="34" y="44" width="16" height="6"/><rect x="44" y="34" width="6" height="16"/>
</g>
</svg>`
);

await writeFile(
  join(dist, 'index.html'),
  render(COPY, { noindex: isPreview, canonical: isPreview ? '' : '' })
);

if (isPreview) await writeFile(join(dist, '.nojekyll'), '');
await writeFile(
  join(dist, 'robots.txt'),
  isPreview ? 'User-agent: *\nDisallow: /\n' : 'User-agent: *\nAllow: /\n'
);

console.log(`built dist/ ${isPreview ? '(preview: noindex)' : '(public)'}`);
