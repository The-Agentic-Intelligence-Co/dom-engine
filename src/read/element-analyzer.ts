/**
 * DOM element analyzer
 */

import { TagName, TextExtractors, SiblingText, DOMContext } from '../types';
import { cleanText } from '../utils/helpers';

/**
 * Gets the text of an element according to its specific type
 * @param element - DOM element
 * @returns Extracted text from the element
 */
export function getElementText(element: Element): string {
  const tagName = element.tagName as TagName;
  
  // Determine the appropriate tagName for contenteditable elements
  const effectiveTagName = (element as HTMLElement).contentEditable === 'true' 
    ? 'CONTENTEDITABLE' 
    : tagName;
  
  const textExtractors: TextExtractors = {
    INPUT: () => {
      const input = element as HTMLInputElement;
      return [
        input.placeholder && `Placeholder: ${input.placeholder}`,
        input.value && `Value: ${input.value}`,
        input.getAttribute('aria-label') && `Aria-label: ${input.getAttribute('aria-label')}`,
        input.name && `Name: ${input.name}`
      ].filter(Boolean).join(' | ');
    },
    
    TEXTAREA: () => {
      const textarea = element as HTMLTextAreaElement;
      return [
        textarea.placeholder && `Placeholder: ${textarea.placeholder}`,
        textarea.value && `Value: ${textarea.value}`,
        textarea.getAttribute('aria-label') && `Aria-label: ${textarea.getAttribute('aria-label')}`,
        textarea.name && `Name: ${textarea.name}`
      ].filter(Boolean).join(' | ');
    },
    
    SELECT: () => {
      const select = element as HTMLSelectElement;
      return select.selectedOptions[0]?.textContent || '';
    },
    
    A: () => {
      const link = element as HTMLAnchorElement;
      return [
        link.textContent?.trim() && `Text: ${link.textContent.trim()}`,
        link.getAttribute('aria-label') && `Aria-label: ${link.getAttribute('aria-label')}`,
        link.title && `Title: ${link.title}`
      ].filter(Boolean).join(' | ');
    },
    
    CONTENTEDITABLE: () => {
      const text = element.textContent?.trim() || '';
      return [
        text && `Content: ${text}`,
        element.getAttribute('placeholder') && `Placeholder: ${element.getAttribute('placeholder')}`,
        element.getAttribute('aria-label') && `Aria-label: ${element.getAttribute('aria-label')}`,
        element.getAttribute('name') && `Name: ${element.getAttribute('name')}`,
        !text && '[Contenteditable Element]' // Fallback for empty contenteditable elements
      ].filter(Boolean).join(' | ');
    },
    
    DEFAULT: () => element.textContent || ''
  };
  
  const extractor = textExtractors[effectiveTagName as keyof TextExtractors] || textExtractors.DEFAULT;
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
 * @param context - DOM context (optional, defaults to current window/document)
 * @returns true if the element is visible, false otherwise
 */
export function isElementVisible(element: Element, context?: DOMContext): boolean {
  const domContext = context || { document, window };
  const rect = element.getBoundingClientRect();
  const style = domContext.window.getComputedStyle(element);
  
  return (
    // In viewport
    rect.top >= 0 && rect.left >= 0 && 
    rect.bottom <= domContext.window.innerHeight && rect.right <= domContext.window.innerWidth &&
    // Not hidden by CSS
    style.display !== 'none' && style.visibility !== 'hidden' && 
    style.opacity !== '0' && !(element as HTMLElement).hidden &&
    // Has size
    rect.width > 0 && rect.height > 0
  );
}

/**
 * Checks if a button element has SVG icon children (for icon-only buttons)
 * @param element - Button element to check
 * @returns true if the button has SVG children, false otherwise
 */
export function hasSvgIcon(element: Element): boolean {
  // Only check buttons
  if (element.tagName !== 'BUTTON' && element.getAttribute('role') !== 'button') {
    return false;
  }
  
  // Check all descendants for SVG elements
  return element.querySelector('svg') !== null;
}
