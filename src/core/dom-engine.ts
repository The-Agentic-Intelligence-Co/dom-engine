/**
 * Main DOM analysis engine
 */

import { DOMExtractionResult } from '../types';
import { findInteractiveElements } from '../dom/interactive-finder';
import { calculateScrollInfo } from '../scroll/scroll-manager';

/**
 * Main function to get interactive elements from the DOM
 * @returns Object with interactive elements and scroll information
 */
export function getInteractiveContext(): DOMExtractionResult {
  return {
    interactiveElements: findInteractiveElements(),
    scrollInfo: calculateScrollInfo()
  };
}
