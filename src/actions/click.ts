/**
 * Click action functionality
 */

import { ActionResult } from '../types';

/**
 * Simulates human-like click interaction with multiple fallback methods
 */
function simulateHumanClick(element: HTMLElement): void {
  // Get element position for realistic mouse events
  const rect = element.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  
  // Simulate mouse events with real coordinates and human sequence
  const mouseEvents = [
    new MouseEvent('mouseover', { 
      bubbles: true, 
      cancelable: true, 
      clientX: x, 
      clientY: y,
      button: 0,
      buttons: 0
    }),
    new MouseEvent('mousemove', { 
      bubbles: true, 
      cancelable: true, 
      clientX: x, 
      clientY: y,
      button: 0,
      buttons: 0
    }),
    new MouseEvent('mousedown', { 
      bubbles: true, 
      cancelable: true, 
      clientX: x, 
      clientY: y,
      button: 0,
      buttons: 1
    }),
    new MouseEvent('mouseup', { 
      bubbles: true, 
      cancelable: true, 
      clientX: x, 
      clientY: y,
      button: 0,
      buttons: 0
    }),
    new MouseEvent('click', { 
      bubbles: true, 
      cancelable: true, 
      clientX: x, 
      clientY: y,
      button: 0,
      buttons: 0
    })
  ];
  
  // Dispatch mouse events in sequence with small pauses
  mouseEvents.forEach((event, index) => {
    setTimeout(() => {
      element.dispatchEvent(event);
    }, index * 10); // Small pause between events
  });
  
  // Focus element if focusable
  if (element instanceof HTMLInputElement || 
      element instanceof HTMLButtonElement || 
      element instanceof HTMLAnchorElement ||
      element.tabIndex >= 0) {
    setTimeout(() => {
      element.focus();
    }, 50);
  }
  
  // Simulate keyboard events for activation (Enter/Space)
  setTimeout(() => {
    const keyboardEvents = [
      new KeyboardEvent('keydown', { 
        bubbles: true, 
        cancelable: true, 
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      }),
      new KeyboardEvent('keyup', { 
        bubbles: true, 
        cancelable: true, 
        key: 'Enter',
        code: 'Enter',
        keyCode: 13
      })
    ];
    
    keyboardEvents.forEach(event => {
      element.dispatchEvent(event);
    });
  }, 100);
}

/**
 * Executes click action on an element using multiple methods
 * @param element - Element to click
 * @param agenticPurposeId - Unique identifier of the element
 * @returns ActionResult with execution result
 */
export function executeClickAction(element: Element, agenticPurposeId: string): ActionResult {
  const clickMethods = [
    {
      name: 'Normal click',
      execute: () => {
        (element as HTMLElement).click();
      }
    },
    {
      name: 'Human-like simulation',
      execute: () => {
        simulateHumanClick(element as HTMLElement);
      }
    },
    {
      name: 'Focus + Enter key',
      execute: () => {
        (element as HTMLElement).focus();
        const enterEvent = new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          key: 'Enter',
          code: 'Enter',
          keyCode: 13
        });
        (element as HTMLElement).dispatchEvent(enterEvent);
      }
    },
    {
      name: 'Direct event dispatch with coordinates',
      execute: () => {
        const rect = (element as HTMLElement).getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        const clickEvent = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          clientX: x,
          clientY: y,
          button: 0,
          buttons: 0
        });
        
        (element as HTMLElement).dispatchEvent(clickEvent);
      }
    }
  ];
  
  let anyMethodSucceeded = false;
  const errors: string[] = [];
  
  // Execute all methods
  clickMethods.forEach((method) => {
    try {
      method.execute();
      anyMethodSucceeded = true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`${method.name}: ${errorMessage}`);
    }
  });
  
  if (anyMethodSucceeded) {
    return {
      agenticPurposeId,
      success: true,
      action: 'click',
      message: 'Element clicked successfully'
    };
  } else {
    return {
      agenticPurposeId,
      success: false,
      error: `All click methods failed. Errors: ${errors.join('; ')}`
    };
  }
}
