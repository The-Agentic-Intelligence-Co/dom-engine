/**
 * DOM Engine - TypeScript library for DOM analysis and manipulation
 * 
 * @packageDocumentation
 */

// Core functionality - Only the main methods that users need
export { getInteractiveContext } from './core/dom-engine';
export { scrollToNewContent } from './actions/scroll';
export { executeActions } from './actions/executor';

// Main types for library usage
export type {
  DOMExtractionResult,
  CategorizedElements,
  InteractiveElementInfo,
  ScrollResult,
  InteractiveElementType,
  DOMAnalysisOptions,
  DOMContext,
  Action,
  ActionResult,
  ActionsResult,
  ActionType
} from './types';
