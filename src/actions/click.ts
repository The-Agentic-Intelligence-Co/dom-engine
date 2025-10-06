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
  
  // Global variables to track current click method and detection
  (window as any).currentClickMethod = '';
  (window as any).clickDetected = false;
  
  const clickMethods = [
    {
      name: 'Normal click',
      execute: () => {
        (window as any).currentClickMethod = 'Normal click';
        (element as HTMLElement).click();
      }
    },
    {
      name: 'Human-like simulation',
      execute: () => {
        (window as any).currentClickMethod = 'Human-like simulation';
        simulateHumanClick(element as HTMLElement);
      }
    },
    {
      name: 'Focus + Enter key',
      execute: () => {
        (window as any).currentClickMethod = 'Focus + Enter key';
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
        (window as any).currentClickMethod = 'Direct event dispatch with coordinates';
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
    },
    {
      name: 'User interaction simulation',
      execute: () => {
        (window as any).currentClickMethod = 'User interaction simulation';
        // Simular interacción completa del usuario
        if (element instanceof HTMLElement) {
          // 1. Hacer el elemento visible y accesible
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // 2. Focus del elemento
          element.focus();
          
          // 3. Disparar eventos de interacción
          const interactionEvents = [
            'mouseenter',
            'mouseover', 
            'focus',
            'activate'
          ];
          
          interactionEvents.forEach((eventType, index) => {
            setTimeout(() => {
              const event = new Event(eventType, {
                bubbles: true,
                cancelable: true
              });
              element.dispatchEvent(event);
            }, index * 10);
          });
          
          // 4. Para elementos específicos, ejecutar su acción
          if (element.tagName === 'A') {
            // Para enlaces, navegar
            const href = (element as HTMLAnchorElement).href;
            if (href) {
              setTimeout(() => {
                window.location.href = href;
              }, 50);
            }
          }
        }
      }
    },
  ];
  
  let anyMethodSucceeded = false;
  const errors: string[] = [];
  
  // Execute all methods
  clickMethods.forEach((method) => {
    // Verificar si ya se detectó click para detener ejecución
    if ((window as any).clickDetected) {
      return;
    }
    
    try {
      method.execute();
      console.log(`Click method "${method.name}" executed successfully`);
      anyMethodSucceeded = true;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.log(`Click method "${method.name}" failed: ${errorMessage}`);
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
      action: 'click',
      error: `All click methods failed. Errors: ${errors.join('; ')}`
    };
  }
}
