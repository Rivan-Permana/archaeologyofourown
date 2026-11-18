import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

// AD-6: HTML is injected only from renderArticleHtml() output and escaped JSON.
const ALLOWED = ['src/shared/render.ts', 'src/components/ArticleBody.astro', 'src/components/JsonScript.astro', 'src/components/ArtefactOfTheDay.astro', 'src/layouts/Base.astro'];

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? files(p) : [p];
  });
}

test('set:html and dangerouslySetInnerHTML appear only in allowed files', () => {
  const offenders = files('src').filter((f) => /set:html|dangerouslySetInnerHTML|innerHTML\s*=/.test(readFileSync(f, 'utf8')) && !ALLOWED.includes(f));
  assert.deepEqual(offenders, []);
});
