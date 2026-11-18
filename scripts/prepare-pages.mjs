import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export function preparePages(root = process.cwd()) {
  const store = JSON.parse(readFileSync(resolve(root, 'data/portfolio-store.json'), 'utf8'));
  if (!Array.isArray(store.startups) || !Array.isArray(store.projects)) {
    throw new Error('Portfolio data must contain startups and projects arrays.');
  }

  const output = resolve(root, 'dist');
  mkdirSync(resolve(output, 'data'), { recursive: true });
  writeFileSync(resolve(output, 'data/startups.json'), JSON.stringify(store.startups));
  const published = store.projects
    .filter((project) => project.is_published)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));
  writeFileSync(resolve(output, 'data/projects.json'), JSON.stringify(published));

  // Pages serves directory index files, so direct visits to /admin and /404 work.
  if (existsSync(resolve(output, 'index.html'))) {
    mkdirSync(resolve(output, 'admin'), { recursive: true });
    copyFileSync(resolve(output, 'index.html'), resolve(output, 'admin/index.html'));
    copyFileSync(resolve(output, 'index.html'), resolve(output, '404.html'));
  }
  writeFileSync(resolve(output, '.nojekyll'), '');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  preparePages();
}
