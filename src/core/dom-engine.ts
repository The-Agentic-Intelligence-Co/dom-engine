/**
 * Motor principal de análisis DOM
 */

import { DOMExtractionResult } from '../types';
import { findInteractiveElements } from '../dom/interactive-finder';
import { calculateScrollInfo } from '../scroll/scroll-manager';

/**
 * Función principal para obtener elementos interactivos del DOM
 * @param rootElement - Elemento raíz del DOM a analizar (ej: document.body)
 * @returns Objeto con elementos interactivos e información de scroll
 */
export function getInteractiveElements(rootElement: Element): DOMExtractionResult {
  return {
    interactiveElements: findInteractiveElements(rootElement),
    scrollInfo: calculateScrollInfo()
  };
}
