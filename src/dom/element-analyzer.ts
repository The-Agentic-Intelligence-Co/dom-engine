/**
 * DOM element analyzer
 */

import { ConstructorName, TextExtractors, SiblingText } from '../types';
import { cleanText } from '../utils/helpers';

/**
 * Gets the text of an element according to its specific type
 * @param element - DOM element
 * @returns Extracted text from the element
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
 * Gets the text of immediate siblings of an element
 * @param element - DOM element
 * @returns Object with left and right sibling text
 */
export function getSiblingText(element: Element): SiblingText {
  return {
    leftBrother: element.previousElementSibling ? getElementText(element.previousElementSibling) : '',
    rightBrother: element.nextElementSibling ? getElementText(element.nextElementSibling) : ''
  };
}

/**
 * Checks if an element is visible on screen
 * @param element - DOM element to check
 * @returns true if the element is visible, false otherwise
 */
export function isElementVisible(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  
  return (
    // In viewport
    rect.top >= 0 && rect.left >= 0 && 
    rect.bottom <= window.innerHeight && rect.right <= window.innerWidth &&
    // Not hidden by CSS
    style.display !== 'none' && style.visibility !== 'hidden' && 
    style.opacity !== '0' && !(element as HTMLElement).hidden &&
    // Has size
    rect.width > 0 && rect.height > 0
  );
}
