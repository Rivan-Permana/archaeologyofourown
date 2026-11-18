import { test } from 'node:test';
import assert from 'node:assert/strict';
import { routeFor, otherLocale } from '../src/i18n/routes.ts';
import id from '../src/i18n/id.json' with { type: 'json' };
import en from '../src/i18n/en.json' with { type: 'json' };

test('home route pair', () => {
  assert.equal(routeFor('home', 'id'), '/');
  assert.equal(routeFor('home', 'en'), '/en/');
  assert.equal(otherLocale('id'), 'en');
});

test('id and en strings have identical keys', () => {
  const keys = (o: object, p = ''): string[] =>
    Object.entries(o).flatMap(([k, v]) => (typeof v === 'object' ? keys(v, `${p}${k}.`) : [`${p}${k}`]));
  assert.deepEqual(keys(id).sort(), keys(en).sort());
});
