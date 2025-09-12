/**
 * General utilities for the DOM Engine library
 */

/**
 * Generates a unique ID using crypto.randomUUID()
 */
export function generateUniqueId(): string {
  return crypto.randomUUID();
}

/**
 * Cleans text by removing line breaks and multiple spaces
 * @param text - Text to clean
 * @returns Clean text or empty string if null/undefined
 */
export function cleanText(text: string | null | undefined): string {
  return text?.replace(/\s+/g, ' ').trim() || '';
}

/**
 * Filters object properties by removing empty or null values
 * @param obj - Object to filter
 * @returns Object with only valid properties
 */
export function filterValidProperties<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => 
      value !== 'N/A' && 
      value !== '' && 
      value != null
    )
  ) as Partial<T>;
}

/**
 * Filters CSS styling classes, keeping only semantic classes
 * @param className - CSS class to filter
 * @returns Filtered class without styles
 */
export function filterStylingClasses(className: string | null | undefined): string {
  if (!className) return '';
  
  return className
    .split(' ')
    .filter(cls => {
      const trimmed = cls.trim();
      // Filter classes that contain typical styling characters
      return !trimmed.match(/^[a-z]+-[a-z0-9/-]+$|^[a-z]+:\w+|^#[0-9a-f]{3,6}$|^(bg|text|border|w|h|p|m|flex|grid|absolute|relative|rounded|shadow|hover|focus|btn|card|container|row|col)-/) && 
             !['flex', 'grid', 'block', 'hidden', 'visible', 'absolute', 'relative', 'fixed', 'sticky', 'primary', 'secondary', 'success', 'warning', 'error'].includes(trimmed);
    })
    .join(' ');
}
