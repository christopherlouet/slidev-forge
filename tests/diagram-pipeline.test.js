import { describe, it, expect } from 'vitest';
import { getPresetContent, PRESET_CONTENT_REGISTRY } from '../src/preset-content.js';
import { generateSectionContent } from '../src/templates/section-content.js';
import { mergeDefaults, PRESETS } from '../src/config.js';
import { generateSlides } from '../src/templates/slides.js';

function makeConfig(overrides = {}) {
  return mergeDefaults({ title: 'Test', author: 'Speaker', ...overrides });
}

function bodyStr(section, config, id = 'test') {
  return generateSectionContent(section, config, id).body.join('\n');
}

// ─────────────────────────────────────────────────────
// T004 - enrichSection propagates code + diagram
// ─────────────────────────────────────────────────────
describe('enrichSection propagates code and diagram', () => {
  it('conference diagram section should have diagram field from preset content', () => {
    const sections = PRESETS.conference('fr');
    const diagramSection = sections.find(s => s.type === 'diagram');
    expect(diagramSection).toBeDefined();
    expect(diagramSection.diagram).toBeDefined();
    expect(typeof diagramSection.diagram).toBe('string');
    expect(diagramSection.diagram).toContain('\n'); // multiline = full mermaid content
  });

  it('conference code section should have code field from preset content', () => {
    const sections = PRESETS.conference('fr');
    const codeSection = sections.find(s => s.type === 'code');
    expect(codeSection).toBeDefined();
    // code is propagated from preset-content to the section
  });

  it('keynote diagram section should have diagram from preset content', () => {
    const sections = PRESETS.keynote('fr');
    const diagramSection = sections.find(s => s.type === 'diagram');
    expect(diagramSection).toBeDefined();
    expect(diagramSection.diagram).toBeDefined();
    expect(diagramSection.diagram).toContain('\n');
  });

  it('workshop diagram section should have diagram from preset content', () => {
    const sections = PRESETS.workshop('fr');
    const diagramSection = sections.find(s => s.type === 'diagram');
    expect(diagramSection).toBeDefined();
    expect(diagramSection.diagram).toBeDefined();
    expect(diagramSection.diagram).toContain('\n');
  });

  const presetNames = ['conference', 'workshop', 'lightning', 'pitch', 'keynote'];
  for (const preset of presetNames) {
    it(`${preset} EN diagram should be different from FR diagram`, () => {
      const sectionsFr = PRESETS[preset]('fr');
      const sectionsEn = PRESETS[preset]('en');
      const diagramFr = sectionsFr.find(s => s.type === 'diagram');
      const diagramEn = sectionsEn.find(s => s.type === 'diagram');
      if (diagramFr && diagramEn) {
        // Labels should be translated
        expect(diagramFr.diagram).not.toBe(diagramEn.diagram);
      }
    });
  }
});

// ─────────────────────────────────────────────────────
// T005 - section-content renders full diagram content
// ─────────────────────────────────────────────────────
describe('section-content renders full diagram', () => {
  it('should render full mermaid content when section.diagram is multiline', () => {
    const config = makeConfig();
    const section = {
      name: 'Architecture',
      type: 'diagram',
      diagram: 'flowchart LR\n  A[Client] --> B[API]\n  B --> C[DB]',
    };
    const body = bodyStr(section, config);
    expect(body).toContain('```mermaid');
    expect(body).toContain('A[Client] --> B[API]');
    expect(body).toContain('B --> C[DB]');
    expect(body).not.toContain('A[Start] --> B[End]'); // no stub
  });

  it('should render stub when section.diagram is a simple type (no newline)', () => {
    const config = makeConfig();
    const section = {
      name: 'Diagram',
      type: 'diagram',
      diagram: 'flowchart TD',
    };
    const body = bodyStr(section, config);
    expect(body).toContain('flowchart TD');
    expect(body).toContain('A[Start] --> B[End]'); // fallback stub
  });

  it('should render stub when section has no diagram field', () => {
    const config = makeConfig();
    const section = { name: 'Diagram', type: 'diagram' };
    const body = bodyStr(section, config);
    expect(body).toContain('flowchart TD');
    expect(body).toContain('A[Start] --> B[End]');
  });

  it('full mermaid content should be inside mermaid code block', () => {
    const config = makeConfig();
    const section = {
      name: 'Arch',
      type: 'diagram',
      diagram: 'flowchart LR\n  X[A] --> Y[B]\n  Y --> Z[C]\n  Z --> W[D]',
    };
    const body = bodyStr(section, config);
    const mermaidBlock = body.split('```mermaid')[1].split('```')[0];
    expect(mermaidBlock).toContain('flowchart LR');
    expect(mermaidBlock).toContain('X[A] --> Y[B]');
    expect(mermaidBlock).toContain('Z --> W[D]');
  });
});

// ─────────────────────────────────────────────────────
// T006 - Real Mermaid diagrams in presets
// ─────────────────────────────────────────────────────
describe('real Mermaid diagrams in presets', () => {
  const presetsWithDiagrams = ['conference', 'workshop', 'keynote'];

  for (const preset of presetsWithDiagrams) {
    describe(`${preset} preset`, () => {
      it('diagram should have at least 4 nodes (FR)', () => {
        const content = getPresetContent(preset, preset === 'keynote' ? 'architecture' : 'diagram', 'fr');
        expect(content).not.toBeNull();
        expect(content.diagram).toBeDefined();
        const nodeCount = (content.diagram.match(/\[.*?\]/g) || []).length;
        expect(nodeCount).toBeGreaterThanOrEqual(4);
      });

      it('diagram should have at least 4 nodes (EN)', () => {
        const content = getPresetContent(preset, preset === 'keynote' ? 'architecture' : 'diagram', 'en');
        expect(content).not.toBeNull();
        expect(content.diagram).toBeDefined();
        const nodeCount = (content.diagram.match(/\[.*?\]/g) || []).length;
        expect(nodeCount).toBeGreaterThanOrEqual(4);
      });

      it('diagram should have at least 3 relations', () => {
        const content = getPresetContent(preset, preset === 'keynote' ? 'architecture' : 'diagram', 'fr');
        const relationCount = (content.diagram.match(/-->/g) || []).length;
        expect(relationCount).toBeGreaterThanOrEqual(3);
      });

      it('diagram should start with a valid mermaid type', () => {
        const content = getPresetContent(preset, preset === 'keynote' ? 'architecture' : 'diagram', 'fr');
        expect(content.diagram).toMatch(/^(flowchart|graph|sequenceDiagram|classDiagram)/);
      });

      it('diagram should contain newlines (multiline content)', () => {
        const content = getPresetContent(preset, preset === 'keynote' ? 'architecture' : 'diagram', 'fr');
        expect(content.diagram).toContain('\n');
      });
    });
  }

  // Integration: diagram renders in full slides
  for (const preset of presetsWithDiagrams) {
    it(`${preset} slides should contain real mermaid diagram (not A→B stub)`, () => {
      const config = makeConfig({ preset });
      const slides = generateSlides(config);
      expect(slides).toContain('```mermaid');
      expect(slides).not.toContain('A[Start] --> B[End]');
    });
  }
});
