import type { ParsedSlide } from './types.js';

const MARKER_REGEX = /<!--\s*section:id=([a-z0-9_-]+)\s*-->/;

export function extractMarkerId(content: string): string | null {
  const match = content.match(MARKER_REGEX);
  return match ? match[1] : null;
}

export function parseSlides(content: string): ParsedSlide[] {
  if (!content.trim()) return [];

  const rawSections = splitBySeparator(content);
  if (rawSections.length === 0) return [];

  const slides: ParsedSlide[] = [];
  let isFrontmatterParsed = false;

  for (let i = 0; i < rawSections.length; i++) {
    const raw = rawSections[i];
    const isFrontmatter = !isFrontmatterParsed && i === 0 && looksLikeFrontmatter(raw, content);

    if (isFrontmatter) {
      isFrontmatterParsed = true;
      slides.push({ id: null, rawContent: raw, isFrontmatter: true });
    } else {
      slides.push({
        id: extractMarkerId(raw),
        rawContent: raw,
        isFrontmatter: false,
      });
    }
  }

  return slides;
}

function looksLikeFrontmatter(_section: string, fullContent: string): boolean {
  return fullContent.trimStart().startsWith('---');
}

/**
 * Check if lines from startIdx look like YAML sub-frontmatter
 * (key: value pairs until a closing ---).
 * Returns the index of the closing --- or -1 if not sub-frontmatter.
 */
function findSubFrontmatterEnd(lines: string[], startIdx: number): number {
  for (let j = startIdx; j < lines.length; j++) {
    const trimmed = lines[j].trim();
    if (trimmed === '---') {
      return j;
    }
    if (trimmed === '') continue;
    // Must look like YAML: "key: value" or "  key: value"
    if (!/^[\s]*[a-zA-Z_][a-zA-Z0-9_-]*\s*:/.test(lines[j]) &&
        !/^[\s]*-\s+/.test(lines[j]) &&   // YAML list item
        !/^[\s]+\S/.test(lines[j])) {      // continuation/indented value
      return -1;
    }
  }
  return -1;
}

function splitBySeparator(content: string): string[] {
  const lines = content.split('\n');
  const sections: string[] = [];
  let current: string[] = [];
  let inCodeBlock = false;
  let codeBlockFence = '';
  let foundFirstSeparator = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Track fenced code blocks (``` or ~~~)
    if (!inCodeBlock) {
      if (trimmed.startsWith('```') || trimmed.startsWith('~~~')) {
        inCodeBlock = true;
        codeBlockFence = trimmed.slice(0, 3);
        current.push(line);
        continue;
      }
    } else {
      if (trimmed === codeBlockFence) {
        inCodeBlock = false;
        codeBlockFence = '';
      }
      current.push(line);
      continue;
    }

    // Check for --- separator
    if (trimmed === '---') {
      if (!foundFirstSeparator) {
        foundFirstSeparator = true;
        continue;
      }

      // Check if this --- starts a sub-frontmatter block
      const subFmEnd = findSubFrontmatterEnd(lines, i + 1);
      if (subFmEnd !== -1) {
        // This is a slide separator followed by sub-frontmatter.
        // Flush current section, then collect sub-frontmatter + content as one section.
        sections.push(current.join('\n'));
        current = [];
        // Include sub-frontmatter lines in the new section
        for (let j = i + 1; j <= subFmEnd; j++) {
          current.push(lines[j]);
        }
        i = subFmEnd;
        continue;
      }

      // Regular slide separator
      sections.push(current.join('\n'));
      current = [];
      continue;
    }

    current.push(line);
  }

  // Push remaining content
  if (current.length > 0) {
    const remaining = current.join('\n');
    if (remaining.trim() || sections.length === 0) {
      sections.push(remaining);
    }
  }

  if (!foundFirstSeparator && sections.length === 0) {
    return [content];
  }

  return sections;
}
