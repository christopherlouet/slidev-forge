import { generateSectionIds } from './utils.js';
import { generateSlides } from './templates/slides.js';
import { parseSlides, extractMarkerId } from './parser.js';
import type { Section, ResolvedConfig, ParsedSlide, DiffAction } from './types.js';

export function computeDiff(yamlSections: Section[], parsedSlides: ParsedSlide[]): DiffAction[] {
  const actions: DiffAction[] = [];
  const sectionIds = generateSectionIds(yamlSections);

  // Collect marker ids from parsed slides
  const existingIds = new Set<string>();
  for (const slide of parsedSlides) {
    if (slide.id && !slide.isFrontmatter && slide.id !== '__title__' && slide.id !== '__toc__') {
      existingIds.add(slide.id);
    }
  }

  // Frontmatter is always updated
  actions.push({
    type: 'update-meta',
    sectionId: '__frontmatter__',
    sectionName: 'Frontmatter',
    detail: 'Regenerated from YAML',
  });

  // Build set of YAML section ids
  const yamlIds = new Set<string>();
  for (const section of yamlSections) {
    const id = sectionIds.get(section)!;
    yamlIds.add(id);

    if (existingIds.has(id)) {
      actions.push({ type: 'keep', sectionId: id, sectionName: section.name });
    } else {
      actions.push({ type: 'add', sectionId: id, sectionName: section.name });
    }
  }

  // Detect removed sections
  for (const existingId of existingIds) {
    if (!yamlIds.has(existingId)) {
      const slide = parsedSlides.find((s) => s.id === existingId);
      const name = extractSectionName(slide) || existingId;
      actions.push({ type: 'remove', sectionId: existingId, sectionName: name });
    }
  }

  return actions;
}

export function mergeSlides(config: ResolvedConfig, parsedSlides: ParsedSlide[]): string {
  const sectionIds = generateSectionIds(config.sections);

  // Build a map of existing slide content by marker id
  const existingContent = new Map<string, string>();
  for (const slide of parsedSlides) {
    if (slide.id) {
      existingContent.set(slide.id, slide.rawContent);
    }
  }

  // Collect manual slides (no marker) and their anchor (the marker id before them)
  const manualSlidesAfter = new Map<string | null, ParsedSlide[]>();
  let lastMarkerId: string | null = null;

  for (const slide of parsedSlides) {
    if (slide.isFrontmatter) {
      lastMarkerId = '__frontmatter__';
      continue;
    }
    if (slide.id) {
      lastMarkerId = slide.id;
      continue;
    }
    // Manual slide: anchor to the previous marked section
    const list = manualSlidesAfter.get(lastMarkerId) || [];
    list.push(slide);
    manualSlidesAfter.set(lastMarkerId, list);
  }

  // Generate fresh slides to get new section content for added sections
  const freshSlides = generateSlides(config);
  const freshParsed = parseSlides(freshSlides);
  const freshContent = new Map<string, string>();
  for (const slide of freshParsed) {
    if (slide.id) {
      freshContent.set(slide.id, slide.rawContent);
    }
  }

  // Build the output
  const parts: string[] = [];

  // 1. Frontmatter (always regenerated)
  const freshFm = freshParsed.find((s) => s.isFrontmatter);
  if (freshFm) {
    parts.push(freshFm.rawContent);
  }

  // Manual slides after frontmatter
  for (const manual of manualSlidesAfter.get('__frontmatter__') || []) {
    parts.push(manual.rawContent);
  }

  // 2. Title slide (always regenerated)
  const freshTitle = freshContent.get('__title__');
  if (freshTitle) {
    parts.push(freshTitle);
  }

  // Manual slides after title
  for (const manual of manualSlidesAfter.get('__title__') || []) {
    parts.push(manual.rawContent);
  }

  // 3. TOC slide (always regenerated)
  const freshToc = freshContent.get('__toc__');
  if (freshToc) {
    parts.push(freshToc);
  }

  // Manual slides after toc
  for (const manual of manualSlidesAfter.get('__toc__') || []) {
    parts.push(manual.rawContent);
  }

  // 4. Sections in YAML order
  const yamlIds = new Set<string>();
  for (const section of config.sections) {
    const id = sectionIds.get(section)!;
    yamlIds.add(id);

    if (existingContent.has(id)) {
      // Preserve user content
      parts.push(existingContent.get(id)!);
    } else {
      // New section: use freshly generated content
      const fresh = freshContent.get(id);
      if (fresh) {
        parts.push(fresh);
      }
    }

    // Manual slides anchored after this section
    for (const manual of manualSlidesAfter.get(id) || []) {
      parts.push(manual.rawContent);
    }
  }

  return '---\n' + parts.join('\n---\n');
}

function extractSectionName(slide: ParsedSlide | undefined): string | null {
  if (!slide) return null;
  const match = slide.rawContent.match(/^#\s+(.+)$/m);
  return match ? match[1] : null;
}
