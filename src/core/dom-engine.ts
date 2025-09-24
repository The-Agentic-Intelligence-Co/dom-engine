/**
 * Main DOM analysis engine
 */

import { DOMExtractionResult, DOMAnalysisOptions } from '../types';
import { findInteractiveElements } from '../read/interactive-finder';
import { calculateScrollInfo } from '../scroll/scroll-manager';

/**
 * Main function to get interactive elements from the DOM
 * @param options - Configuration options for DOM analysis
 * @returns Object with interactive elements and scroll information
 */
export function getInteractiveContext(options: DOMAnalysisOptions = {}): DOMExtractionResult {
  const { injectTrackers = false, context } = options;
  
  return {
    interactiveElements: findInteractiveElements({ injectTrackers, ...(context && { context }) }),
    scrollInfo: calculateScrollInfo(context)
  };
}
