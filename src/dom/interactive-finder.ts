/**
 * Buscador de elementos interactivos
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
 * Obtiene selectores CSS para elementos interactivos
 * @returns Array de selectores CSS
 */
export function getInteractiveSelectors(): string[] {
  return [
    // Elementos de formulario
    'input:not([type="hidden"])',
    'input[type="checkbox"]',
    'textarea',
    'select',
    'button',
    
    // Enlaces
    'a[href]',
    'a[onclick]',
    
    // Elementos con eventos de click
    '[onclick]',
    '[onmousedown]',
    '[onmouseup]',
    
    // Elementos con roles interactivos
    '[role="button"]',
    '[role="link"]',
    '[role="menuitem"]',
    '[role="tab"]',
    '[role="option"]',
    
    // Elementos editables
    '[contenteditable="true"]',
    
    // Elementos con tabindex (navegables por teclado)
    '[tabindex]:not([tabindex="-1"])',
    
    // Elementos con cursor pointer
    '[style*="cursor: pointer"]',
    
    // Elementos con eventos personalizados
    '[data-action]',
    '[data-toggle]',
    '[data-target]'
  ];
}

/**
 * Encuentra y categoriza elementos interactivos visibles en el DOM
 * @param rootElement - Elemento raíz donde buscar
 * @returns Objeto con elementos categorizados y contador total
 */
export function findInteractiveElements(rootElement: Element): CategorizedElements {
  const selectors = getInteractiveSelectors().join(', ');
  const allElements = rootElement.querySelectorAll(selectors);
  
  // Categorizadores
  const categorizers: ElementCategorizers = {
    buttons: (el: Element) => el.constructor.name === 'HTMLButtonElement' || el.getAttribute('role') === 'button',
    inputs: (el: Element) => ['HTMLInputElement', 'HTMLTextAreaElement', 'HTMLSelectElement'].includes(el.constructor.name),
    links: (el: Element) => el.constructor.name === 'HTMLAnchorElement',
    editable: (el: Element) => (el as HTMLElement).contentEditable === 'true',
    custom: (el: Element) => !!(el as HTMLElement).onclick || !!el.getAttribute('onclick'),
    selectable: () => true // fallback
  };
  
  // Procesar elementos en una sola pasada
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
    
    // Encontrar categoría
    const category = Object.keys(categorizers).find(key => categorizers[key as keyof ElementCategorizers](element)) || 'selectable';
    (categorized[category as keyof CategorizedElements] as InteractiveElementInfo[]).push(elementInfo);
    totalProcessed++;
  }
  
  return { ...categorized, total: totalProcessed };
}
