/**
 * Interactive elements finder
 */

import { 
  InteractiveElementInfo, 
  CategorizedElements, 
  ElementCategorizers, 
  TagName,
  DOMAnalysisOptions
} from '../types';
import { generateUniqueId, filterValidProperties, filterStylingClasses } from '../utils/helpers';
import { getElementText, getSiblingText, isElementVisible, hasSvgIcon } from './element-analyzer';

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
 * @param options - Configuration options for element analysis
 * @returns Object with categorized elements and total counter
 */
export function findInteractiveElements(options: DOMAnalysisOptions = {}): CategorizedElements {
  const { injectTrackers = false, context } = options;
  
  // Use provided context or default to current document/window
  const domContext = context || { document, window };
  const selectors = getInteractiveSelectors().join(', ');
  const allElements = domContext.document.body.querySelectorAll(selectors);
  
  // Categorizers
  const categorizers: ElementCategorizers = {
    buttons: (el: Element) => el.tagName === 'BUTTON' || el.getAttribute('role') === 'button',
    inputs: (el: Element) => ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName),
    links: (el: Element) => el.tagName === 'A',
    editable: (el: Element) => (el as HTMLElement).contentEditable === 'true',
    custom: (el: Element) => !!(el as HTMLElement).onclick || !!el.getAttribute('onclick'),
    selectable: () => true // fallback
  };
  
  // Process elements in a single pass
  const categorized = Object.keys(categorizers).reduce((acc, key) => ({ ...acc, [key]: [] }), {}) as CategorizedElements;
  let totalProcessed = 0;
  
  for (const element of allElements) {
    if (!isElementVisible(element, domContext)) continue;
    
    let textContent = getElementText(element);
    const isButtonWithSvgIcon = !textContent && hasSvgIcon(element);
    
    // Skip elements without text content, unless it's a button with SVG icon
    if (!textContent && !isButtonWithSvgIcon) continue;
    
    // Handle button with SVG icon - assign text content
    if (isButtonWithSvgIcon) {
      textContent = '[This is an Icon Button]';
    }
    
    // Only add tracking ID if injectTrackers is enabled
    const domId = injectTrackers ? generateUniqueId() : '';
    if (injectTrackers) {
      element.setAttribute('agentic-purpose-id', domId);
    }
    
    const elementInfo = filterValidProperties({
      text: textContent,
      tagName: element.tagName as TagName,
      agenticPurposeId: injectTrackers ? domId : '',
      type: (element as HTMLInputElement).type,
      id: element.id?.substring(0, 40),
      className: filterStylingClasses(element.className),
      rect: element.getBoundingClientRect(),
      onclick: (element as HTMLElement).onclick ? 'Yes' : 'No',
      tabindex: (element as HTMLElement).tabIndex,
      role: element.getAttribute('role'),
      href: element.getAttribute('href'),
      title: element.getAttribute('title'),
      ariaLabel: element.getAttribute('aria-label'),
      ...(element.tagName === 'INPUT' && getSiblingText(element))
    }) as InteractiveElementInfo;
    
    // Find category
    const category = Object.keys(categorizers).find(key => categorizers[key as keyof ElementCategorizers](element)) || 'selectable';
    (categorized[category as keyof CategorizedElements] as InteractiveElementInfo[]).push(elementInfo);
    totalProcessed++;
  }
  
  return { ...categorized, total: totalProcessed };
}
