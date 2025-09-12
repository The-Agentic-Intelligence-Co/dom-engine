/**
 * Utilidades generales para la biblioteca DOM Engine
 */

/**
 * Genera un ID único usando crypto.randomUUID()
 */
export function generateUniqueId(): string {
  return crypto.randomUUID();
}

/**
 * Limpia texto eliminando saltos de línea y espacios múltiples
 * @param text - Texto a limpiar
 * @returns Texto limpio o cadena vacía si es null/undefined
 */
export function cleanText(text: string | null | undefined): string {
  return text?.replace(/\s+/g, ' ').trim() || '';
}

/**
 * Filtra propiedades de un objeto eliminando valores vacíos o nulos
 * @param obj - Objeto a filtrar
 * @returns Objeto con solo propiedades válidas
 */
export function filterValidProperties<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => 
      value !== 'N/A' && 
      value !== '' && 
      value != null
    )
  ) as Partial<T>;
}

/**
 * Filtra clases CSS de estilado, manteniendo solo clases semánticas
 * @param className - Clase CSS a filtrar
 * @returns Clase filtrada sin estilos
 */
export function filterStylingClasses(className: string | null | undefined): string {
  if (!className) return '';
  
  return className
    .split(' ')
    .filter(cls => {
      const trimmed = cls.trim();
      // Filtrar clases que contienen caracteres típicos de estilado
      return !trimmed.match(/^[a-z]+-[a-z0-9\/-]+$|^[a-z]+:\w+|^#[0-9a-f]{3,6}$|^(bg|text|border|w|h|p|m|flex|grid|absolute|relative|rounded|shadow|hover|focus|btn|card|container|row|col)-/) && 
             !['flex', 'grid', 'block', 'hidden', 'visible', 'absolute', 'relative', 'fixed', 'sticky', 'primary', 'secondary', 'success', 'warning', 'error'].includes(trimmed);
    })
    .join(' ');
}
