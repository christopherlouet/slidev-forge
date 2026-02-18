import { describe, it, expect } from 'vitest';
import { getPresetContent, PRESET_CONTENT_REGISTRY } from '../src/preset-content.js';
import { mergeDefaults, PRESETS } from '../src/config.js';
import { generateSlides } from '../src/templates/slides.js';

function makeConfig(overrides = {}) {
  return mergeDefaults({ title: 'Test', author: 'Speaker', ...overrides });
}

// Generic phrases that should NOT appear in professional preset content
const GENERIC_BLOCKLIST_FR = [
  'Concept principal et definition',
  'Concept principal et son application',
  'Bonnes pratiques a adopter',
  'Erreurs courantes a eviter',
  'Concepts theoriques cles',
  'Points d\'attention et pieges courants',
  'Comprendre le concept principal',
  'Savoir l\'appliquer en pratique',
  'Identifier les cas limites',
  'Le probleme que nous resolvons',
  'Notre approche en une phrase',
  'Douleur identifiee sur le marche',
  'Notre solution en une phrase',
  'Fonctionnalite cle 1',
  'Fonctionnalite cle 2',
  'Fonctionnalite cle 3',
  'Etat des lieux du secteur',
  'Les defis actuels',
  'Concept 1 :',
  'Concept 2 :',
  'Concept 3 :',
];

const GENERIC_BLOCKLIST_EN = [
  'Main concept and definition',
  'Main concept and its application',
  'Best practices to adopt',
  'Common mistakes to avoid',
  'Key theoretical concepts',
  'Pitfalls and common mistakes',
  'Understand the main concept',
  'Know how to apply it in practice',
  'Identify edge cases',
  'The problem we are solving',
  'Our approach in one sentence',
  'Identified market pain',
  'Our solution in one sentence',
  'Key feature 1',
  'Key feature 2',
  'Key feature 3',
  'Current state of the industry',
  'Today\'s challenges',
  'Concept 1:',
  'Concept 2:',
  'Concept 3:',
];

// ─────────────────────────────────────────────────────
// T008a - No generic placeholders in content
// ─────────────────────────────────────────────────────
describe('no generic placeholders in preset content', () => {
  const allPresets = Object.keys(PRESET_CONTENT_REGISTRY);

  for (const preset of allPresets) {
    describe(`${preset} preset (FR)`, () => {
      const sectionKeys = Object.keys(PRESET_CONTENT_REGISTRY[preset]);

      for (const key of sectionKeys) {
        it(`${key} should not contain generic placeholder text`, () => {
          const content = getPresetContent(preset, key, 'fr');
          const allText = [
            ...content.content,
            ...(content.items || []),
            content.description || '',
          ].join(' ');

          for (const generic of GENERIC_BLOCKLIST_FR) {
            expect(allText, `Found generic text "${generic}" in ${preset}/${key}`).not.toContain(generic);
          }
        });
      }
    });

    describe(`${preset} preset (EN)`, () => {
      const sectionKeys = Object.keys(PRESET_CONTENT_REGISTRY[preset]);

      for (const key of sectionKeys) {
        it(`${key} should not contain generic placeholder text`, () => {
          const content = getPresetContent(preset, key, 'en');
          const allText = [
            ...content.content,
            ...(content.items || []),
            content.description || '',
          ].join(' ');

          for (const generic of GENERIC_BLOCKLIST_EN) {
            expect(allText, `Found generic text "${generic}" in ${preset}/${key}`).not.toContain(generic);
          }
        });
      }
    });
  }
});

// ─────────────────────────────────────────────────────
// T008b - Domain-specific content (Dev/Arch + Cloud/DevOps)
// ─────────────────────────────────────────────────────
describe('domain-specific content in presets', () => {
  // Conference should have architecture/dev terms
  it('conference topic content should reference architecture or dev patterns', () => {
    const content = getPresetContent('conference', 'topic', 'fr');
    const text = content.content.join(' ').toLowerCase();
    const hasDomainTerm = /architect|pattern|composant|couche|module|service|api|depend|inject|solid|clean|event/.test(text);
    expect(hasDomainTerm, 'Conference topic should mention architecture/dev terms').toBe(true);
  });

  it('conference takeaways should be specific and actionable', () => {
    const content = getPresetContent('conference', 'takeaways', 'fr');
    expect(content.items).toBeDefined();
    expect(content.items.length).toBeGreaterThanOrEqual(3);
    // Each item should be substantial (> 20 chars)
    for (const item of content.items) {
      expect(item.length).toBeGreaterThan(20);
    }
  });

  // Workshop should have CI/CD or hands-on dev terms
  it('workshop module content should reference practical dev concepts', () => {
    const content = getPresetContent('workshop', 'module', 'fr');
    const text = content.content.join(' ').toLowerCase();
    const hasDomainTerm = /docker|ci|cd|pipeline|deploy|container|git|test|build|integrat/.test(text);
    expect(hasDomainTerm, 'Workshop module should mention CI/CD or dev tooling').toBe(true);
  });

  it('workshop recap items should be specific', () => {
    const content = getPresetContent('workshop', 'recap', 'fr');
    expect(content.items).toBeDefined();
    for (const item of content.items) {
      expect(item.length).toBeGreaterThan(20);
    }
  });

  // Lightning should have a punchy hook
  it('lightning hook should be impactful', () => {
    const contentFr = getPresetContent('lightning', 'hook', 'fr');
    const contentEn = getPresetContent('lightning', 'hook', 'en');
    expect(contentFr.content[0].length).toBeGreaterThan(15);
    expect(contentEn.content[0].length).toBeGreaterThan(15);
  });

  // Keynote should reference transformation/cloud/architecture
  it('keynote context should reference cloud or architecture', () => {
    const content = getPresetContent('keynote', 'context', 'fr');
    const text = content.content.join(' ').toLowerCase();
    const hasDomainTerm = /cloud|microservice|monolith|architect|distribu|scalab|conteneur|kubernetes|devops/.test(text);
    expect(hasDomainTerm, 'Keynote context should mention cloud/architecture').toBe(true);
  });

  it('keynote steps should be specific to a transformation journey', () => {
    const content = getPresetContent('keynote', 'steps', 'fr');
    expect(content.items).toBeDefined();
    expect(content.items.length).toBeGreaterThanOrEqual(4);
    for (const item of content.items) {
      expect(item.length).toBeGreaterThan(15);
    }
  });

  // Pitch should have realistic metrics
  it('pitch market value should look realistic', () => {
    const content = getPresetContent('pitch', 'market', 'fr');
    expect(content.value).toBeDefined();
    expect(content.value.length).toBeGreaterThan(1);
    expect(content.description.length).toBeGreaterThan(10);
  });

  it('pitch product features should be specific', () => {
    const content = getPresetContent('pitch', 'product', 'fr');
    const text = content.content.join(' ').toLowerCase();
    const hasTechTerm = /deploy|ci|cd|pipeline|monitoring|alert|incident|sla|api|integrat|automat|infra/.test(text);
    expect(hasTechTerm, 'Pitch product should mention DevOps/dev terms').toBe(true);
  });
});

// ─────────────────────────────────────────────────────
// T008c - Fact sections have realistic values
// ─────────────────────────────────────────────────────
describe('fact sections have realistic values and descriptions', () => {
  const factSections = [
    { preset: 'conference', key: 'impact' },
    { preset: 'keynote', key: 'impact' },
    { preset: 'keynote', key: 'result' },
    { preset: 'pitch', key: 'market' },
    { preset: 'pitch', key: 'impact' },
  ];

  for (const { preset, key } of factSections) {
    it(`${preset}/${key} description should be specific (>= 20 chars)`, () => {
      const content = getPresetContent(preset, key, 'fr');
      expect(content.description).toBeDefined();
      expect(content.description.length).toBeGreaterThanOrEqual(20);
    });

    it(`${preset}/${key} FR and EN descriptions should differ`, () => {
      const fr = getPresetContent(preset, key, 'fr');
      const en = getPresetContent(preset, key, 'en');
      expect(fr.description).not.toBe(en.description);
    });
  }
});

// ─────────────────────────────────────────────────────
// T008d - Integration: slides output has real content
// ─────────────────────────────────────────────────────
describe('integration: slides output has domain-specific content', () => {
  for (const preset of ['conference', 'workshop', 'keynote']) {
    it(`${preset} slides should not contain generic "Concept principal"`, () => {
      const config = makeConfig({ preset });
      const slides = generateSlides(config);
      expect(slides).not.toContain('Concept principal et definition');
      expect(slides).not.toContain('Concept principal et son application');
    });
  }
});
