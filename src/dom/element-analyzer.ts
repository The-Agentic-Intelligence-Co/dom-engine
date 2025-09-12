/**
 * Analizador de elementos del DOM
 */

import { ConstructorName, TextExtractors, SiblingText } from '../types';
import { cleanText } from '../utils/helpers';

/**
 * Obtiene el texto de un elemento según su tipo específico
 * @param element - Elemento del DOM
 * @returns Texto extraído del elemento
 */
export function getElementText(element: Element): string {
  const constructorName = element.constructor.name as ConstructorName;
  
  const textExtractors: TextExtractors = {
    HTMLInputElement: () => {
      const input = element as HTMLInputElement;
      return [
        input.placeholder && `Placeholder: ${input.placeholder}`,
        input.value && `Value: ${input.value}`
      ].filter(Boolean).join(' | ');
    },
    
    HTMLTextAreaElement: () => {
      const textarea = element as HTMLTextAreaElement;
      return textarea.value || '';
    },
    
    HTMLSelectElement: () => {
      const select = element as HTMLSelectElement;
      return select.selectedOptions[0]?.textContent || '';
    },
    
    DEFAULT: () => element.textContent || ''
  };
  
  const extractor = textExtractors[constructorName as keyof TextExtractors] || textExtractors.DEFAULT;
  return cleanText(extractor());
}

/**
 * Obtiene el texto de los hermanos inmediatos de un elemento
 * @param element - Elemento del DOM
 * @returns Objeto con texto de hermanos izquierdo y derecho
 */
export function getSiblingText(element: Element): SiblingText {
  return {
    leftBrother: element.previousElementSibling ? getElementText(element.previousElementSibling) : '',
    rightBrother: element.nextElementSibling ? getElementText(element.nextElementSibling) : ''
  };
}

/**
 * Verifica si un elemento está visible en pantalla
 * @param element - Elemento del DOM a verificar
 * @returns true si el elemento es visible, false en caso contrario
 */
export function isElementVisible(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  
  return (
    // En viewport
    rect.top >= 0 && rect.left >= 0 && 
    rect.bottom <= window.innerHeight && rect.right <= window.innerWidth &&
    // No oculto por CSS
    style.display !== 'none' && style.visibility !== 'hidden' && 
    style.opacity !== '0' && !(element as HTMLElement).hidden &&
    // Tiene tamaño
    rect.width > 0 && rect.height > 0
  );
}
