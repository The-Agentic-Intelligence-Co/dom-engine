/**
 * Scroll and navigation manager
 */

import { ScrollInfo, ScrollResult } from '../types';

/**
 * Calculates detailed scroll information for the page
 * @returns Object with complete scroll information
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
    // Percentages
    verticalScrollPercentage: Math.round((base.scrollTop / (base.totalHeight - base.viewportHeight)) * 100),
    horizontalScrollPercentage: Math.round((base.scrollLeft / (base.totalWidth - base.viewportWidth)) * 100),
    visibleHeightPercentage: Math.round((base.viewportHeight / base.totalHeight) * 100),
    // Remaining content and limits
    remainingHeight,
    nextContentPixel,
    remainingHeightPercentage: Math.round((remainingHeight / base.totalHeight) * 100),
    scrollToSeeNewContent: remainingHeight > 0 ? 1 : 0,
    // AI-specific information
    currentScrollPosition: base.scrollTop,
    lastVisiblePixel: nextContentPixel - 1,
    firstNewContentPixel: nextContentPixel
  };
}

/**
 * Scrolls to new content on the page using current scroll information
 * @returns Object with scroll operation result
 */
export function scrollToNewContent(): ScrollResult {
  // Get current scroll information
  const scrollInfo = calculateScrollInfo();
  
  // Check if there's new content to scroll
  if (scrollInfo.firstNewContentPixel >= scrollInfo.totalHeight) {
    // If no new content, scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    return { 
      success: true, 
      scrolledTo: 0
    };
  }
  
  // Scroll to the first new content pixel
  window.scrollTo({
    top: scrollInfo.firstNewContentPixel,
    behavior: 'smooth'
  });
  
  return { 
    success: true, 
    scrolledTo: scrollInfo.firstNewContentPixel
  };
}
