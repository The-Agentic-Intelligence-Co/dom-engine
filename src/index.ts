/**
 * DOM Engine - Biblioteca TypeScript para análisis y manipulación del DOM
 * 
 * @packageDocumentation
 */

// Core functionality - Solo los métodos principales que necesitan los usuarios
export { getInteractiveElements } from './core/dom-engine';
export { scrollToNewContent } from './scroll/scroll-manager';

// Types principales para el uso de la librería
export type {
  DOMExtractionResult,
  CategorizedElements,
  InteractiveElementInfo,
  ScrollResult,
  InteractiveElementType
} from './types';
