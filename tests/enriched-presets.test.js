import { describe, it, expect } from 'vitest';
import { PRESETS, mergeDefaults } from '../src/config.js';
import { generateSlides } from '../src/templates/slides.js';
import { generateMultiFile } from '../src/templates/multi-file.js';

function makeConfig(overrides = {}) {
  return mergeDefaults({ title: 'Test', author: 'Speaker', ...overrides });
}

// ─────────────────────────────────────────────────────
// T020 - Enriched existing presets
// ─────────────────────────────────────────────────────
describe('enriched presets - section counts', () => {
  it('conference should have 12-15 sections', () => {
    const sections = PRESETS.conference('fr');
    expect(sections.length).toBeGreaterThanOrEqual(12);
    expect(sections.length).toBeLessThanOrEqual(15);
  });

  it('workshop should have 12-15 sections', () => {
    const sections = PRESETS.workshop('fr');
    expect(sections.length).toBeGreaterThanOrEqual(12);
    expect(sections.length).toBeLessThanOrEqual(15);
  });

  it('lightning should have 6-8 sections', () => {
    const sections = PRESETS.lightning('fr');
    expect(sections.length).toBeGreaterThanOrEqual(6);
    expect(sections.length).toBeLessThanOrEqual(8);
  });

  it('pitch should have 10-12 sections', () => {
    const sections = PRESETS.pitch('fr');
    expect(sections.length).toBeGreaterThanOrEqual(10);
    expect(sections.length).toBeLessThanOrEqual(12);
  });
});

describe('enriched presets - type diversity', () => {
  it('conference should use section-divider type', () => {
    const sections = PRESETS.conference('fr');
    const types = sections.map(s => s.type);
    expect(types).toContain('section-divider');
  });

  it('conference should use steps type', () => {
    const sections = PRESETS.conference('fr');
    const types = sections.map(s => s.type);
    expect(types).toContain('steps');
  });

  it('conference should use at least 5 different types', () => {
    const sections = PRESETS.conference('fr');
    const uniqueTypes = new Set(sections.map(s => s.type));
    expect(uniqueTypes.size).toBeGreaterThanOrEqual(5);
  });

  it('workshop should use at least 5 different types', () => {
    const sections = PRESETS.workshop('fr');
    const uniqueTypes = new Set(sections.map(s => s.type));
    expect(uniqueTypes.size).toBeGreaterThanOrEqual(5);
  });

  it('lightning should use statement type', () => {
    const sections = PRESETS.lightning('fr');
    const types = sections.map(s => s.type);
    expect(types).toContain('statement');
  });

  it('pitch should use section-divider type', () => {
    const sections = PRESETS.pitch('fr');
    const types = sections.map(s => s.type);
    expect(types).toContain('section-divider');
  });

  it('pitch should use at least 5 different types', () => {
    const sections = PRESETS.pitch('fr');
    const uniqueTypes = new Set(sections.map(s => s.type));
    expect(uniqueTypes.size).toBeGreaterThanOrEqual(5);
  });
});

// ─────────────────────────────────────────────────────
// T021 - Keynote preset
// ─────────────────────────────────────────────────────
describe('keynote preset', () => {
  it('should exist in PRESETS', () => {
    expect(PRESETS.keynote).toBeDefined();
  });

  it('should have 15-20 sections', () => {
    const sections = PRESETS.keynote('fr');
    expect(sections.length).toBeGreaterThanOrEqual(15);
    expect(sections.length).toBeLessThanOrEqual(20);
  });

  it('should have 15-20 sections in EN', () => {
    const sections = PRESETS.keynote('en');
    expect(sections.length).toBeGreaterThanOrEqual(15);
    expect(sections.length).toBeLessThanOrEqual(20);
  });

  it('should use cover type', () => {
    const sections = PRESETS.keynote('fr');
    expect(sections.map(s => s.type)).toContain('cover');
  });

  it('should use statement type', () => {
    const sections = PRESETS.keynote('fr');
    expect(sections.map(s => s.type)).toContain('statement');
  });

  it('should use section-divider type', () => {
    const sections = PRESETS.keynote('fr');
    expect(sections.map(s => s.type)).toContain('section-divider');
  });

  it('should use fact type', () => {
    const sections = PRESETS.keynote('fr');
    expect(sections.map(s => s.type)).toContain('fact');
  });

  it('should use steps type', () => {
    const sections = PRESETS.keynote('fr');
    expect(sections.map(s => s.type)).toContain('steps');
  });

  it('should use diagram type', () => {
    const sections = PRESETS.keynote('fr');
    expect(sections.map(s => s.type)).toContain('diagram');
  });

  it('should use two-cols type', () => {
    const sections = PRESETS.keynote('fr');
    expect(sections.map(s => s.type)).toContain('two-cols');
  });

  it('should use code type', () => {
    const sections = PRESETS.keynote('fr');
    expect(sections.map(s => s.type)).toContain('code');
  });

  it('should use at least 8 different types', () => {
    const sections = PRESETS.keynote('fr');
    const uniqueTypes = new Set(sections.map(s => s.type));
    expect(uniqueTypes.size).toBeGreaterThanOrEqual(8);
  });

  it('should start with cover or statement', () => {
    const sections = PRESETS.keynote('fr');
    expect(['cover', 'statement']).toContain(sections[0].type);
  });

  it('should end with thanks', () => {
    const sections = PRESETS.keynote('fr');
    expect(sections[sections.length - 1].type).toBe('thanks');
  });

  it('should have qna before thanks', () => {
    const sections = PRESETS.keynote('fr');
    const qnaIdx = sections.findIndex(s => s.type === 'qna');
    const thanksIdx = sections.findIndex(s => s.type === 'thanks');
    expect(qnaIdx).toBeGreaterThan(-1);
    expect(qnaIdx).toBeLessThan(thanksIdx);
  });
});

// ─────────────────────────────────────────────────────
// Integration: enriched presets generate valid slides
// ─────────────────────────────────────────────────────
describe('enriched presets - slide generation', () => {
  const presetNames = ['conference', 'workshop', 'lightning', 'pitch', 'keynote'];

  for (const preset of presetNames) {
    it(`${preset} should generate valid single-file slides`, () => {
      const config = makeConfig({ preset });
      const slides = generateSlides(config);
      expect(slides).toContain('---');
      expect(slides).toContain('# ');
      expect(slides.length).toBeGreaterThan(500);
    });

    it(`${preset} should generate valid multi-file output`, () => {
      const config = makeConfig({ preset });
      const result = generateMultiFile(config);
      expect(result.pages.length).toBeGreaterThan(2);
      for (const page of result.pages) {
        expect(page.content).toContain('---');
      }
    });
  }
});
