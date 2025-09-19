/**
 * DOM Engine - TypeScript library for DOM analysis and manipulation
 * 
 * @packageDocumentation
 */

// Core functionality - Only the main methods that users need
export { getInteractiveContext } from './core/dom-engine';
export { scrollToNewContent } from './scroll/scroll-manager';

// Main types for library usage
export type {
  DOMExtractionResult,
  CategorizedElements,
  InteractiveElementInfo,
  ScrollResult,
  InteractiveElementType,
  DOMAnalysisOptions
} from './types';
