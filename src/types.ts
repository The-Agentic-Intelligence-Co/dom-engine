/**
 * Types and interfaces for the DOM Engine library
 */

// Types for interactive elements
export type InteractiveElementType = 'buttons' | 'inputs' | 'links' | 'editable' | 'custom' | 'selectable';


// Information about an interactive element
export interface InteractiveElementInfo {
  text: string;
  agenticPurposeId: string;
  id?: string;
  className: string;
  onclick: 'Yes' | 'No';
  tabindex: number;
  role?: string | null;
  href?: string | null;
  title?: string | null;
  ariaLabel?: string | null;
  leftBrother?: string;
  rightBrother?: string;
}

// Information about element siblings
export interface SiblingText {
  leftBrother: string;
  rightBrother: string;
}

// Scroll information
export interface ScrollInfo {
  totalHeight: number;
  viewportHeight: number;
  scrollTop: number;
  scrollLeft: number;
  totalWidth: number;
  viewportWidth: number;
  verticalScrollPercentage: number;
  horizontalScrollPercentage: number;
  visibleHeightPercentage: number;
  remainingHeight: number;
  nextContentPixel: number;
  remainingHeightPercentage: number;
  scrollToSeeNewContent: number;
  currentScrollPosition: number;
  lastVisiblePixel: number;
  firstNewContentPixel: number;
}

// Result of categorized interactive elements
export interface CategorizedElements {
  total: number;
  buttons: InteractiveElementInfo[];
  inputs: InteractiveElementInfo[];
  links: InteractiveElementInfo[];
  editable: InteractiveElementInfo[];
  custom: InteractiveElementInfo[];
  selectable: InteractiveElementInfo[];
}

// Main DOM extraction result
export interface DOMExtractionResult {
  interactiveElements: CategorizedElements;
  scrollInfo: ScrollInfo;
}

// Scroll result
export interface ScrollResult {
  success: boolean;
  scrolledTo?: number;
  error?: string;
}

// Element categorizer function
export type ElementCategorizer = (element: Element) => boolean;

// Available categorizers
export interface ElementCategorizers {
  buttons: ElementCategorizer;
  inputs: ElementCategorizer;
  links: ElementCategorizer;
  editable: ElementCategorizer;
  custom: ElementCategorizer;
  selectable: ElementCategorizer;
}

// Text extractor by element type
export type TextExtractor = () => string;

// Available text extractors
export interface TextExtractors {
  INPUT: TextExtractor;
  TEXTAREA: TextExtractor;
  SELECT: TextExtractor;
  A: TextExtractor;
  CONTENTEDITABLE: TextExtractor;
  DEFAULT: TextExtractor;
}

// DOM context interface for cross-frame/extension support
export interface DOMContext {
  document: Document;
  window: Window;
}

// DOM analysis options
export interface DOMAnalysisOptions {
  injectTrackers?: boolean;
  context?: DOMContext;
}

// Action types for DOM interaction
export type ActionType = 'click' | 'type';

// Individual action to execute
export interface Action {
  agenticPurposeId: string;
  actionType: ActionType;
  value?: string; // Required only when actionType is 'type'
}

// Result of a single action execution
export interface ActionResult {
  agenticPurposeId: string;
  success: boolean;
  action?: ActionType;
  message?: string;
  error?: string;
}

// Result of executing multiple actions
export interface ActionsResult {
  success: boolean;
  results: ActionResult[];
  message?: string;
  error?: string;
}
