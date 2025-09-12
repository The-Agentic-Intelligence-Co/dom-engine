/**
 * Interactive elements finder
 */

import { 
  InteractiveElementInfo, 
  CategorizedElements, 
  ElementCategorizers, 
  ConstructorName 
} from '../types';
import { generateUniqueId, filterValidProperties, filterStylingClasses } from '../utils/helpers';
import { getElementText, getSiblingText, isElementVisible } from './element-analyzer';

/**
 * Gets CSS selectors for interactive elements
 * @returns Array of CSS selectors
 */
export function getInteractiveSelectors(): string[] {
  return [
    // Form elements
    'input:not([type="hidden"])',
    'input[type="checkbox"]',
    'textarea',
    'select',
    'button',
    
    // Links
    'a[href]',
    'a[onclick]',
    
    // Elements with click events
    '[onclick]',
    '[onmousedown]',
    '[onmouseup]',
    
    // Elements with interactive roles
    '[role="button"]',
    '[role="link"]',
    '[role="menuitem"]',
    '[role="tab"]',
    '[role="option"]',
    
    // Editable elements
    '[contenteditable="true"]',
    
    // Elements with tabindex (keyboard navigable)
    '[tabindex]:not([tabindex="-1"])',
    
    // Elements with pointer cursor
    '[style*="cursor: pointer"]',
    
    // Elements with custom events
    '[data-action]',
    '[data-toggle]',
    '[data-target]'
  ];
}

/**
 * Finds and categorizes visible interactive elements in the DOM
 * @param rootElement - Root element where to search
 * @returns Object with categorized elements and total counter
 */
export function findInteractiveElements(rootElement: Element): CategorizedElements {
  const selectors = getInteractiveSelectors().join(', ');
  const allElements = rootElement.querySelectorAll(selectors);
  
  // Categorizers
  const categorizers: ElementCategorizers = {
    buttons: (el: Element) => el.constructor.name === 'HTMLButtonElement' || el.getAttribute('role') === 'button',
    inputs: (el: Element) => ['HTMLInputElement', 'HTMLTextAreaElement', 'HTMLSelectElement'].includes(el.constructor.name),
    links: (el: Element) => el.constructor.name === 'HTMLAnchorElement',
    editable: (el: Element) => (el as HTMLElement).contentEditable === 'true',
    custom: (el: Element) => !!(el as HTMLElement).onclick || !!el.getAttribute('onclick'),
    selectable: () => true // fallback
  };
  
  // Process elements in a single pass
  const categorized = Object.keys(categorizers).reduce((acc, key) => ({ ...acc, [key]: [] }), {}) as CategorizedElements;
  let totalProcessed = 0;
  
  for (const element of allElements) {
    if (!isElementVisible(element)) continue;
    
    const textContent = getElementText(element);
    if (!textContent) continue;
    
    const domId = generateUniqueId();
    element.setAttribute('agentic-purpose-id', domId);
    
    const elementInfo = filterValidProperties({
      text: textContent,
      constructorName: element.constructor.name as ConstructorName,
      agenticPurposeId: domId,
      type: (element as HTMLInputElement).type,
      id: element.id?.substring(0, 40),
      className: filterStylingClasses(element.className),
      rect: element.getBoundingClientRect(),
      onclick: (element as HTMLElement).onclick ? 'Yes' : 'No',
      tabindex: (element as HTMLElement).tabIndex,
      role: element.getAttribute('role'),
      href: element.getAttribute('href'),
      title: element.getAttribute('title'),
      ...(element.constructor.name === 'HTMLInputElement' && getSiblingText(element))
    }) as InteractiveElementInfo;
    
    // Find category
    const category = Object.keys(categorizers).find(key => categorizers[key as keyof ElementCategorizers](element)) || 'selectable';
    (categorized[category as keyof CategorizedElements] as InteractiveElementInfo[]).push(elementInfo);
    totalProcessed++;
  }
  
  return { ...categorized, total: totalProcessed };
}
