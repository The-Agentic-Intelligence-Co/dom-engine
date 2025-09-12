// Content script que se ejecuta en la página web

// Flag para prevenir ejecuciones múltiples de extractDOM
let isExtractingDOM = false;

// Función para verificar si un elemento está visible en pantalla
function isElementVisible(element) {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  
  // Verificar que el elemento esté en el viewport
  const inViewport = (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth
  );
  
  // Verificar que no esté oculto por CSS
  const notHidden = (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0' &&
    !element.hidden
  );
  
  // Verificar que tenga tamaño
  const hasSize = rect.width > 0 && rect.height > 0;
  
  return inViewport && notHidden && hasSize;
}

// Función para encontrar elementos interactivos visibles
function findInteractiveElements() {
  // Selectores para elementos interactivos
  const interactiveSelectors = [
    // Elementos de formulario
    'input:not([type="hidden"])',
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
  
  // Buscar todos los elementos interactivos
  const allInteractive = document.querySelectorAll(interactiveSelectors.join(', '));
  
  // Filtrar solo los visibles
  const visibleInteractive = Array.from(allInteractive).filter(isElementVisible);
  
  // Categorizar los elementos
  const categorized = {
    buttons: [],
    inputs: [],
    links: [],
    selectable: [],
    editable: [],
    custom: []
  };
  
  visibleInteractive.forEach(element => {
    const textContent = element.textContent?.trim();
    
    // Filtrar elementos sin texto visible
    if (!textContent || textContent.length === 0) {
      return;
    }
    
    const elementInfo = {
      tagName: element.tagName,
      type: element.type || 'N/A',
      id: element.id || 'N/A',
      className: element.className || 'N/A',
      text: textContent,
      rect: element.getBoundingClientRect(),
      attributes: {
        onclick: element.onclick ? 'Yes' : 'No',
        tabindex: element.tabIndex || 'N/A',
        role: element.getAttribute('role') || 'N/A',
        href: element.getAttribute('href') || 'N/A',
        title: element.getAttribute('title') || 'N/A'
      }
    };
    
    // Categorizar
    if (element.tagName === 'BUTTON' || element.getAttribute('role') === 'button') {
      categorized.buttons.push(elementInfo);
    } else if (['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)) {
      categorized.inputs.push(elementInfo);
    } else if (element.tagName === 'A') {
      categorized.links.push(elementInfo);
    } else if (element.contentEditable === 'true') {
      categorized.editable.push(elementInfo);
    } else if (element.onclick || element.getAttribute('onclick')) {
      categorized.custom.push(elementInfo);
    } else {
      categorized.selectable.push(elementInfo);
    }
  });
  
  return {
    total: visibleInteractive.length,
    categorized: categorized,
    elements: visibleInteractive
  };
}

// Función para calcular información detallada del scroll
function calculateScrollInfo() {
  const scrollInfo = {
    totalHeight: document.documentElement.scrollHeight,
    viewportHeight: window.innerHeight,
    scrollTop: window.pageYOffset || document.documentElement.scrollTop,
    scrollLeft: window.pageXOffset || document.documentElement.scrollLeft,
    totalWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth
  };
  
  // Calcular porcentajes
  scrollInfo.verticalScrollPercentage = Math.round((scrollInfo.scrollTop / (scrollInfo.totalHeight - scrollInfo.viewportHeight)) * 100);
  scrollInfo.horizontalScrollPercentage = Math.round((scrollInfo.scrollLeft / (scrollInfo.totalWidth - scrollInfo.viewportWidth)) * 100);
  scrollInfo.visibleHeightPercentage = Math.round((scrollInfo.viewportHeight / scrollInfo.totalHeight) * 100);
  
  // Calcular contenido restante y límites
  scrollInfo.remainingHeight = scrollInfo.totalHeight - (scrollInfo.scrollTop + scrollInfo.viewportHeight);
  scrollInfo.nextContentPixel = scrollInfo.scrollTop + scrollInfo.viewportHeight;
  scrollInfo.remainingHeightPercentage = Math.round((scrollInfo.remainingHeight / scrollInfo.totalHeight) * 100);
  scrollInfo.scrollToSeeNewContent = scrollInfo.remainingHeight > 0 ? 1 : 0; // 1 píxel mínimo para ver contenido nuevo
  
  // Información específica para IA
  scrollInfo.currentScrollPosition = scrollInfo.scrollTop;
  scrollInfo.lastVisiblePixel = scrollInfo.scrollTop + scrollInfo.viewportHeight - 1;
  scrollInfo.firstNewContentPixel = scrollInfo.scrollTop + scrollInfo.viewportHeight;
  
  return scrollInfo;
}

function extractDOM() {
  // Obtener el body del documento
  const bodyElement = document.body;
  
  if (!bodyElement) {
    console.error('No se encontró el elemento body');
    return null;
  }
  
  // Clonar el body para no modificar el original
  const bodyClone = bodyElement.cloneNode(true);
  
  // Remover todos los elementos script del clon
  const scripts = bodyClone.querySelectorAll('script');
  scripts.forEach(script => script.remove());
  
  // Obtener el HTML del body sin scripts
  const bodyContent = bodyClone.outerHTML;
  
  // Encontrar elementos interactivos visibles
  const interactiveElements = findInteractiveElements();
  
  // Obtener información de scroll usando la función separada
  const scrollInfo = calculateScrollInfo();
  
  // Imprimir en la consola de la página web
  console.log('=== ELEMENTOS INTERACTIVOS ENCONTRADOS (PAGE CONSOLE) ===');
  console.log('\n=== INFORMACIÓN DE SCROLL ===');
  console.log(`Altura total del contenido: ${scrollInfo.totalHeight}px`);
  console.log(`Altura visible (viewport): ${scrollInfo.viewportHeight}px`);
  console.log(`Scroll vertical actual: ${scrollInfo.scrollTop}px`);
  console.log(`Porcentaje de scroll vertical: ${scrollInfo.verticalScrollPercentage}%`);
  console.log(`Porcentaje de contenido visible: ${scrollInfo.visibleHeightPercentage}%`);
  console.log(`\n--- INFORMACIÓN PARA IA ---`);
  console.log(`Posición actual de scroll: ${scrollInfo.currentScrollPosition}px`);
  console.log(`Último píxel visible: ${scrollInfo.lastVisiblePixel}px`);
  console.log(`Primer píxel de contenido nuevo: ${scrollInfo.firstNewContentPixel}px`);
  console.log(`Contenido restante: ${scrollInfo.remainingHeight}px`);
  console.log(`\n--- CONTENIDO RESTANTE ---`);
  console.log(`Altura restante por ver: ${scrollInfo.remainingHeight}px`);
  console.log(`Porcentaje de contenido restante: ${scrollInfo.remainingHeightPercentage}%`);
  console.log(`Próximo píxel de contenido nuevo: ${scrollInfo.nextContentPixel}px`);
  console.log(`Píxeles a scrollear para ver contenido nuevo: ${scrollInfo.scrollToSeeNewContent}px`);
  console.log(`\n--- INFORMACIÓN HORIZONTAL ---`);
  console.log(`Ancho total del contenido: ${scrollInfo.totalWidth}px`);
  console.log(`Ancho visible (viewport): ${scrollInfo.viewportWidth}px`);
  console.log(`Scroll horizontal actual: ${scrollInfo.scrollLeft}px`);
  console.log(`Porcentaje de scroll horizontal: ${scrollInfo.horizontalScrollPercentage}%`);
  console.log('Scripts removidos del body:', scripts.length);
  console.log('Total elementos interactivos visibles:', interactiveElements.total);
  console.log('Botones:', interactiveElements.categorized.buttons.length);
  console.log('Inputs:', interactiveElements.categorized.inputs.length);
  console.log('Enlaces:', interactiveElements.categorized.links.length);
  console.log('Editables:', interactiveElements.categorized.editable.length);
  console.log('Personalizados:', interactiveElements.categorized.custom.length);
  console.log('Seleccionables:', interactiveElements.categorized.selectable.length);
  
  // Mostrar detalles de cada elemento interactivo
  Object.keys(interactiveElements.categorized).forEach(category => {
    if (interactiveElements.categorized[category].length > 0) {
      console.log(`\n--- ${category.toUpperCase()} ---`);
      interactiveElements.categorized[category].forEach((element, index) => {
      console.log(`${index + 1}. <${element.tagName}> ${element.type !== 'N/A' ? `(${element.type})` : ''}`);
      console.log(`   ID: ${element.id}, Texto: "${element.text}"`);
      console.log(`   Posición: (${Math.round(element.rect.left)}, ${Math.round(element.rect.top)})`);
      console.log(`   Tamaño: ${Math.round(element.rect.width)}x${Math.round(element.rect.height)}`);
      console.log(`   Href: ${element.attributes.href}`);
      console.log(`   Title: ${element.attributes.title}`);
      });
    }
  });
  
  console.log('=== END ELEMENTOS INTERACTIVOS (PAGE CONSOLE) ===');
  
  return {
    scriptsRemoved: scripts.length,
    interactiveElements: interactiveElements,
    scrollInfo: scrollInfo
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
  
  console.log(`Scrolleando al píxel ${firstNewContentPixel} (primer píxel de contenido nuevo)`);
  
  return { 
    success: true, 
    scrolledTo: firstNewContentPixel,
    previousPosition: scrollInfo.scrollTop
  };
}

// Escuchar mensajes del popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script recibió mensaje:', request);
  
  if (request.action === 'extractDOM') {
    // Verificar si ya se está ejecutando extractDOM
    if (isExtractingDOM) {
      console.log('extractDOM ya está en ejecución, ignorando solicitud duplicada');
      sendResponse({ 
        success: false, 
        error: 'extractDOM ya está en ejecución' 
      });
      return;
    }
    
    // Marcar como en ejecución
    isExtractingDOM = true;
    console.log('Iniciando extractDOM...');
    
    try {
      const result = extractDOM();
      console.log('Resultado de extractDOM:', result);
      
      if (result) {
        const response = { 
          success: true, 
          scriptsRemoved: result.scriptsRemoved,
          interactiveElements: result.interactiveElements
        };
        sendResponse(response);
      } else {
        console.log('extractDOM retornó null/undefined');
        sendResponse({ success: false, error: 'No se pudo extraer el body' });
      }
    } catch (error) {
      console.error('Error en extractDOM:', error);
      sendResponse({ success: false, error: error.message });
    } finally {
      // Resetear el flag siempre, independientemente del resultado
      isExtractingDOM = false;
      console.log('extractDOM completado, flag reseteado');
    }
  } else if (request.action === 'scrollToNewContent') {
    try {
      const result = scrollToNewContent();
      sendResponse(result);
    } catch (error) {
      console.error('Error en scrollToNewContent:', error);
      sendResponse({ success: false, error: error.message });
    }
  }
});
