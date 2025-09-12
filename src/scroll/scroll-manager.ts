/**
 * Gestor de scroll y navegación
 */

import { ScrollInfo, ScrollResult } from '../types';

/**
 * Calcula información detallada del scroll de la página
 * @returns Objeto con información completa del scroll
 */
export function calculateScrollInfo(): ScrollInfo {
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

/**
 * Scrollea al píxel especificado de contenido nuevo en la página
 * @param firstNewContentPixel - Píxel al cual scrollear
 * @param totalHeight - Altura total del documento (opcional, para validación)
 * @returns Objeto con resultado de la operación de scroll
 */
export function scrollToNewContent(firstNewContentPixel: number, totalHeight?: number): ScrollResult {
  // Verificar si hay contenido nuevo para scrollear (solo si se proporciona totalHeight)
  if (totalHeight && firstNewContentPixel >= totalHeight) {
    return { success: false, error: 'No hay contenido nuevo para scrollear' };
  }
  
  // Scrollear al píxel especificado
  window.scrollTo({
    top: firstNewContentPixel,
    behavior: 'smooth'
  });
  
  return { 
    success: true, 
    scrolledTo: firstNewContentPixel
  };
}
