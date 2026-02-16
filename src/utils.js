export function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function validateHexColor(color) {
  if (!color || typeof color !== 'string') return false;
  return /^#[0-9a-fA-F]{6}$/.test(color);
}

export function sanitizeProjectName(name) {
  // Remove path traversal sequences and dots before slugifying
  const cleaned = name.replace(/\.\.\//g, '').replace(/\.\//g, '').replace(/^\.+/, '');
  const result = slugify(cleaned);
  if (!result) {
    throw new Error('Project name cannot be empty after sanitization');
  }
  return result;
}
