// DOM Analyzer Library

// Función para generar ID único
function generateUniqueId() {
  return crypto.randomUUID();
}

// Función para limpiar texto (saltos de línea y espacios múltiples)
function cleanText(text) {
  return text?.replace(/\s+/g, ' ').trim() || '';
}

// Función para filtrar propiedades con valores reales
function filterValidProperties(obj) {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) => 
      value !== 'N/A' && 
      value !== '' && 
      value != null
    )
  );
}

// Función para detectar y filtrar clases de estilado CSS
function filterStylingClasses(className) {
  if (!className) return '';
  
  return className
    .split(' ')
    .filter(cls => {
      const trimmed = cls.trim();
      // Filtrar clases que contienen caracteres típicos de estilado
      return !trimmed.match(/^[a-z]+-[a-z0-9\/-]+$|^[a-z]+:\w+|^#[0-9a-f]{3,6}$|^(bg|text|border|w|h|p|m|flex|grid|absolute|relative|rounded|shadow|hover|focus|btn|card|container|row|col)-/) && 
             !['flex', 'grid', 'block', 'hidden', 'visible', 'absolute', 'relative', 'fixed', 'sticky', 'primary', 'secondary', 'success', 'warning', 'error'].includes(trimmed);
    })
    .join(' ');
}

// Función para obtener el texto de un elemento según su tipo
function getElementText(element) {
  const constructorName = element.constructor.name;
  
  const textExtractors = {
    HTMLInputElement: () => [
      element.placeholder && `Placeholder: ${element.placeholder}`,
      element.value && `Value: ${element.value}`
    ].filter(Boolean).join(' | '),
    
    HTMLTextAreaElement: () => element.value || '',
    HTMLSelectElement: () => element.selectedOptions[0]?.textContent || '',
    DEFAULT: () => element.textContent || ''
  };
  
  const extractor = textExtractors[constructorName] || textExtractors.DEFAULT;
  return cleanText(extractor());
}

// Función para obtener hermanos inmediatos de un elemento
function getSiblingText(element) {
  return {
    leftBrother: element.previousElementSibling ? getElementText(element.previousElementSibling) : '',
    rightBrother: element.nextElementSibling ? getElementText(element.nextElementSibling) : ''
  };
}

// Función para verificar si un elemento está visible en pantalla
function isElementVisible(element) {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  
  return (
    // En viewport
    rect.top >= 0 && rect.left >= 0 && 
    rect.bottom <= window.innerHeight && rect.right <= window.innerWidth &&
    // No oculto por CSS
    style.display !== 'none' && style.visibility !== 'hidden' && 
    style.opacity !== '0' && !element.hidden &&
    // Tiene tamaño
    rect.width > 0 && rect.height > 0
  );
}

// Función para obtener selectores de elementos interactivos
function getInteractiveSelectors() {
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

// Función para encontrar elementos interactivos visibles
function findInteractiveElements(rootElement) {
  const selectors = getInteractiveSelectors().join(', ');
  const allElements = rootElement.querySelectorAll(selectors);
  
  // Categorizadores
  const categorizers = {
    buttons: el => el.constructor.name === 'HTMLButtonElement' || el.getAttribute('role') === 'button',
    inputs: el => ['HTMLInputElement', 'HTMLTextAreaElement', 'HTMLSelectElement'].includes(el.constructor.name),
    links: el => el.constructor.name === 'HTMLAnchorElement',
    editable: el => el.contentEditable === 'true',
    custom: el => el.onclick || el.getAttribute('onclick'),
    selectable: () => true // fallback
  };
  
  // Procesar elementos en una sola pasada
  const categorized = Object.keys(categorizers).reduce((acc, key) => ({ ...acc, [key]: [] }), {});
  let totalProcessed = 0;
  
  for (const element of allElements) {
    if (!isElementVisible(element)) continue;
    
    const textContent = getElementText(element);
    if (!textContent) continue;
    
    const domId = generateUniqueId();
    element.setAttribute('agentic-purpose-id', domId);
    
    const elementInfo = filterValidProperties({
      text: textContent,
      constructorName: element.constructor.name,
      agenticPurposeId: domId,
      type: element.type,
      id: element.id?.substring(0, 40),
      className: filterStylingClasses(element.className),
      rect: element.getBoundingClientRect(),
      onclick: element.onclick ? 'Yes' : 'No',
      tabindex: element.tabIndex,
      role: element.getAttribute('role'),
      href: element.getAttribute('href'),
      title: element.getAttribute('title'),
      ...(element.constructor.name === 'HTMLInputElement' && getSiblingText(element))
    });
    
    // Encontrar categoría
    const category = Object.keys(categorizers).find(key => categorizers[key](element)) || 'selectable';
    categorized[category].push(elementInfo);
    totalProcessed++;
  }
  
  return { total: totalProcessed, ...categorized };
}

// Función para calcular información detallada del scroll
function calculateScrollInfo() {
  const base = {
    totalHeight: document.documentElement.scrollHeight,
    viewportHeight: window.innerHeight,
    scrollTop: window.pageYOffset || document.documentElement.scrollTop,
    scrollLeft: window.pageXOffset || document.documentElement.scrollLeft,
    totalWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth
  };
  
  const remainingHeight = base.totalHeight - (base.scrollTop + base.viewportHeight);
  const nextContentPixel = base.scrollTop + base.viewportHeight;
  
  return {
    ...base,
    // Porcentajes
    verticalScrollPercentage: Math.round((base.scrollTop / (base.totalHeight - base.viewportHeight)) * 100),
    horizontalScrollPercentage: Math.round((base.scrollLeft / (base.totalWidth - base.viewportWidth)) * 100),
    visibleHeightPercentage: Math.round((base.viewportHeight / base.totalHeight) * 100),
    // Contenido restante y límites
    remainingHeight,
    nextContentPixel,
    remainingHeightPercentage: Math.round((remainingHeight / base.totalHeight) * 100),
    scrollToSeeNewContent: remainingHeight > 0 ? 1 : 0,
    // Información específica para IA
    currentScrollPosition: base.scrollTop,
    lastVisiblePixel: nextContentPixel - 1,
    firstNewContentPixel: nextContentPixel
  };
}

// Función principal para extraer información del DOM
function extractDOM() {
  if (!document.body) return null;
  
  return {
    interactiveElements: findInteractiveElements(document.body),
    scrollInfo: calculateScrollInfo()
  };
}

// Función para scrollear al primer píxel de contenido nuevo
function scrollToNewContent() {
  const scrollInfo = calculateScrollInfo();
  
  // Calcular el primer píxel de contenido nuevo
  const firstNewContentPixel = scrollInfo.firstNewContentPixel;
  
  // Verificar si hay contenido nuevo para scrollear
  if (firstNewContentPixel >= scrollInfo.totalHeight) {
    return { success: false, error: 'No hay contenido nuevo para scrollear' };
  }
  
  // Scrollear al primer píxel de contenido nuevo
  window.scrollTo({
    top: firstNewContentPixel,
    behavior: 'smooth'
  });
  
  
  return { 
    success: true, 
    scrolledTo: firstNewContentPixel,
    previousPosition: scrollInfo.scrollTop
  };
}

