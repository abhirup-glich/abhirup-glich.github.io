import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { preparePages } from './prepare-pages.mjs';

test('Pages publishes ordered public projects and supports direct admin visits', () => {
  const root = mkdtempSync(join(tmpdir(), 'portfolio-pages-'));
  try {
    mkdirSync(join(root, 'data'));
    mkdirSync(join(root, 'dist'));
    writeFileSync(join(root, 'dist/index.html'), '<html>Portfolio</html>');
    writeFileSync(join(root, 'data/portfolio-store.json'), JSON.stringify({
      startups: [{ id: 'startup' }],
      projects: [
        { id: 'later', is_published: true, display_order: 2 },
        { id: 'draft', is_published: false, display_order: 0 },
        { id: 'first', is_published: true, display_order: 1 },
      ],
    }));
    preparePages(root);
    assert.deepEqual(JSON.parse(readFileSync(join(root, 'dist/data/projects.json'), 'utf8')).map(p => p.id), ['first', 'later']);
    assert.deepEqual(JSON.parse(readFileSync(join(root, 'dist/data/startups.json'), 'utf8')), [{ id: 'startup' }]);
    assert.equal(readFileSync(join(root, 'dist/admin/index.html'), 'utf8'), '<html>Portfolio</html>');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('Pages rejects malformed portfolio data', () => {
  const root = mkdtempSync(join(tmpdir(), 'portfolio-pages-'));
  try {
    mkdirSync(join(root, 'data'));
    writeFileSync(join(root, 'data/portfolio-store.json'), JSON.stringify({ startups: [], projects: {} }));
    assert.throws(() => preparePages(root), /startups and projects arrays/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
