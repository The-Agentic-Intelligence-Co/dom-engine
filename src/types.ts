/**
 * Tipos e interfaces para la biblioteca DOM Engine
 */

// Tipos para elementos interactivos
export type InteractiveElementType = 'buttons' | 'inputs' | 'links' | 'editable' | 'custom' | 'selectable';

export type ConstructorName = 
  | 'HTMLInputElement' 
  | 'HTMLTextAreaElement' 
  | 'HTMLSelectElement' 
  | 'HTMLButtonElement' 
  | 'HTMLAnchorElement' 
  | 'HTMLElement';

// Información de un elemento interactivo
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
  leftBrother?: string;
  rightBrother?: string;
}

// Información de hermanos de un elemento
export interface SiblingText {
  leftBrother: string;
  rightBrother: string;
}

// Información de scroll
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

// Resultado de elementos interactivos categorizados
export interface CategorizedElements {
  total: number;
  buttons: InteractiveElementInfo[];
  inputs: InteractiveElementInfo[];
  links: InteractiveElementInfo[];
  editable: InteractiveElementInfo[];
  custom: InteractiveElementInfo[];
  selectable: InteractiveElementInfo[];
}

// Resultado principal de extracción DOM
export interface DOMExtractionResult {
  interactiveElements: CategorizedElements;
  scrollInfo: ScrollInfo;
}

// Resultado de scroll
export interface ScrollResult {
  success: boolean;
  scrolledTo?: number;
  error?: string;
}

// Función categorizadora de elementos
export type ElementCategorizer = (element: Element) => boolean;

// Categorizadores disponibles
export interface ElementCategorizers {
  buttons: ElementCategorizer;
  inputs: ElementCategorizer;
  links: ElementCategorizer;
  editable: ElementCategorizer;
  custom: ElementCategorizer;
  selectable: ElementCategorizer;
}

// Extractor de texto por tipo de elemento
export type TextExtractor = () => string;

// Extractores de texto disponibles
export interface TextExtractors {
  HTMLInputElement: TextExtractor;
  HTMLTextAreaElement: TextExtractor;
  HTMLSelectElement: TextExtractor;
  DEFAULT: TextExtractor;
}
