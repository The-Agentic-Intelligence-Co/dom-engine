/**
 * Types and interfaces for the DOM Engine library
 */

// Types for interactive elements
export type InteractiveElementType = 'buttons' | 'inputs' | 'links' | 'editable' | 'custom' | 'selectable';

export type ConstructorName = 
  | 'HTMLInputElement' 
  | 'HTMLTextAreaElement' 
  | 'HTMLSelectElement' 
  | 'HTMLButtonElement' 
  | 'HTMLAnchorElement' 
  | 'HTMLElement';

// Information about an interactive element
export interface InteractiveElementInfo {
  text: string;
  constructorName: ConstructorName;
  agenticPurposeId: string;
  type?: string;
  id?: string;
  className: string;
  rect: DOMRect;
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
  HTMLInputElement: TextExtractor;
  HTMLTextAreaElement: TextExtractor;
  HTMLSelectElement: TextExtractor;
  DEFAULT: TextExtractor;
}

// DOM analysis options
export interface DOMAnalysisOptions {
  withTracking?: boolean;
}
