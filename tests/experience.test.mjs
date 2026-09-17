import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { after, before, test } from 'node:test';
import { createServer } from 'vite';

const baseline = JSON.parse(await readFile(new URL('./fixtures/original-experience.json', import.meta.url)));
let server;
let model;
let timing;
let lighting;
let content;
before(async () => {
  server = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    optimizeDeps: { noDiscovery: true, include: [], entries: [] },
  });
  [model, timing, lighting, content] = await Promise.all([
    server.ssrLoadModule('/src/data/burjKhalifaData.ts'),
    server.ssrLoadModule('/src/data/scrollConfig.ts'),
    server.ssrLoadModule('/src/hooks/useDayNight.ts'),
    server.ssrLoadModule('/src/data/constructionStages.ts'),
  ]);
});
after(async () => { await server?.close(); });

test('six phases retain the original rounded scroll boundaries', () => {
  assert.deepEqual(timing.PHASES, baseline.phases);
  const phases = Object.values(timing.PHASES);
  assert.equal(phases.length, 6);
  assert.equal(phases[0].start, 0);
  assert.equal(phases.at(-1).end, 1);
  phases.slice(1).forEach((phase, index) => assert.equal(phase.start, phases[index].end));
});

test('six editorial sections cover seven pages, with a double illumination section', () => {
  assert.equal(timing.SECTION_HEIGHTS.reduce((sum, height) => sum + height, 0), timing.SCROLL_CONFIG.pages);
  assert.deepEqual([...timing.SECTION_HEIGHTS], [1, 1, 1, 1, 2, 1]);
  assert.deepEqual(content.CONSTRUCTION_STAGES.map(stage => stage.title),
    ['Foundation', 'The Core', 'Setbacks', 'Cladding', 'Illumination', 'The Spire']);
  assert.equal(content.CONSTRUCTION_STAGES.length, timing.SECTION_HEIGHTS.length);
  assert.equal(new Set(content.CONSTRUCTION_STAGES.map(stage => stage.image)).size, 6);
});

test('model dimensions and every tier match the pre-refactor geometry', () => {
  assert.deepEqual(model.BUILDING, baseline.building);
  assert.deepEqual(model.TIER_DATA, baseline.tiers);
  assert.deepEqual(model.getTierPositions(), baseline.tierPositions);
  assert.equal(model.getTowerTopY(), baseline.towerTop);
});

test('day, sunset, twilight and night preserve the original lighting at transition boundaries', () => {
  for (const { progress, state } of baseline.lighting) {
    assert.deepEqual(lighting.getDayNightState(progress), state, `scroll progress ${progress}`);
  }
  assert.deepEqual(lighting.generateWindowPattern(4, 6, .7), baseline.windowPattern);
});

test('lighting remains finite and normalized throughout forward and reverse scrolling', () => {
  for (let step = 1000; step >= 0; step--) {
    const state = lighting.getDayNightState(step / 1000);
    for (const key of ['dayIntensity', 'nightIntensity', 'sunsetProgress']) {
      // The original bell curve has floating-point residue at sunset boundaries.
      const epsilon = 1e-12;
      assert.ok(Number.isFinite(state[key]) && state[key] >= -epsilon && state[key] <= 1 + epsilon, `${key} at ${step}`);
    }
  }
});

test('all six sections preserve their complete editorial content and photo assignment', () => {
  const sections = content.CONSTRUCTION_STAGES.map(stage => ({ ...stage, image: stage.image.split('/').at(-1) }));
  assert.deepEqual(sections, baseline.stageContent);
});

test('theme writes occur at palette changes and unmount reset restores daylight', async () => {
  const theme = await server.ssrLoadModule('/src/hooks/useTheme.ts');
  const properties = new Map();
  let writes = 0;
  const previousDocument = globalThis.document;
  globalThis.document = { documentElement: { style: { setProperty(name, value) { properties.set(name, value); writes++; } } } };
  try {
    theme.resetTheme();
    const daylightWrites = writes;
    theme.setThemeProgress(.2);
    theme.setThemeProgress(.6);
    assert.equal(writes, daylightWrites);
    theme.setThemeProgress(.7);
    assert.equal(properties.get('--ui-text-primary'), '#f5f3f0');
    const nightWrites = writes;
    theme.setThemeProgress(.95);
    assert.equal(writes, nightWrites);
    theme.resetTheme();
    assert.equal(properties.get('--ui-text-primary'), '#1a1a1a');
    assert.equal(properties.get('--ui-gold'), '#1a1a1a');
  } finally {
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
  }
});
