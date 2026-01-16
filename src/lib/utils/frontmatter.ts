/**
 * Parses YAML-style frontmatter from markdown content
 */
export function parseFrontmatter(markdown: string): { frontmatter: Record<string, any>; content: string } | null {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = markdown.match(frontmatterRegex);

  if (!match) {
    return null;
  }

  const [, frontmatterText, content] = match;
  const frontmatter = parseYAML(frontmatterText);

  return { frontmatter, content };
}

/**
 * Simple YAML parser for frontmatter
 * Supports: strings, numbers, booleans, arrays, dates
 */
function parseYAML(yamlText: string): Record<string, any> {
  const result: Record<string, any> = {};
  const lines = yamlText.split('\n');

  let currentKey = '';
  let inArray = false;
  let arrayItems: string[] = [];

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('#')) continue;

    // Array item
    if (line.startsWith('- ')) {
      if (inArray) {
        const value = line.substring(2).trim();
        arrayItems.push(parseValue(value));
      }
      continue;
    }

    // If we were processing an array, save it
    if (inArray && !line.startsWith('- ')) {
      result[currentKey] = arrayItems;
      inArray = false;
      arrayItems = [];
    }

    // Key-value pair
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;

    const key = line.substring(0, colonIndex).trim();
    const value = line.substring(colonIndex + 1).trim();

    currentKey = key;

    // Check if it's the start of an array
    if (value === '' || value === '[]') {
      inArray = true;
      arrayItems = [];
      continue;
    }

    // Handle inline arrays: [item1, item2, item3]
    if (value.startsWith('[') && value.endsWith(']')) {
      const items = value
        .substring(1, value.length - 1)
        .split(',')
        .map(item => parseValue(item.trim()));
      result[key] = items;
      continue;
    }

    result[key] = parseValue(value);
  }

  // Save last array if any
  if (inArray) {
    result[currentKey] = arrayItems;
  }

  return result;
}

/**
 * Parse individual YAML value
 */
function parseValue(value: string): any {
  // Remove quotes
  if ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.substring(1, value.length - 1);
  }

  // Boolean
  if (value === 'true') return true;
  if (value === 'false') return false;

  // Null
  if (value === 'null') return null;

  // Number
  if (!isNaN(Number(value))) {
    return Number(value);
  }

  // Date (YYYY-MM-DD format)
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  // String
  return value;
}

/**
 * Extracts slug from filename
 */
export function getSlugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, '');
}
