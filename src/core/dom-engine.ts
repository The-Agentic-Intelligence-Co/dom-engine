/**
 * Main DOM analysis engine
 */

import { DOMExtractionResult } from '../types';
import { findInteractiveElements } from '../dom/interactive-finder';
import { calculateScrollInfo } from '../scroll/scroll-manager';

/**
 * Main function to get interactive elements from the DOM
 * @param rootElement - Root DOM element to analyze (e.g., document.body)
 * @returns Object with interactive elements and scroll information
 */
export function getInteractiveContext(rootElement: Element): DOMExtractionResult {
  return {
    interactiveElements: findInteractiveElements(rootElement),
    scrollInfo: calculateScrollInfo()
  };
}
