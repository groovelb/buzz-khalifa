import assert from 'node:assert/strict';
import { cp, readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const app = new URL('dist/index.html', root);
const storybook = new URL('storybook-static/', root);
const destination = new URL('dist/storybook/', root);

await stat(app);
await stat(new URL('index.html', storybook));
await stat(new URL('iframe.html', storybook));
const index = JSON.parse(await readFile(new URL('index.json', storybook), 'utf8'));
const entries = Object.values(index.entries);
assert.ok(entries.some(entry => entry.type === 'story'), 'Storybook must contain runnable examples');
assert.ok(entries.some(entry => entry.title.startsWith('Overview/Buzz Khalifa/')), 'Planning docs must be included');
await cp(storybook, destination, { recursive: true });
console.log(`Deployment ready: ${fileURLToPath(new URL('dist/', root))}`);
console.log('Application: / | Storybook: /storybook/');
