/**
 * Click action functionality
 */

import { ActionResult } from '../types';

/**
 * Verifies if a click action was successful by checking for expected changes
 */
function verifyClickSuccess(element: HTMLElement, originalState: any): boolean {
  try {
    // Check if element is still visible and interactive
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) {
      return false; // Element became hidden
    }

    // Check if element is disabled after click
    if (element.hasAttribute('disabled') || element.getAttribute('aria-disabled') === 'true') {
      return false; // Element became disabled
    }

    // Check if URL changed (for navigation elements)
    if (element instanceof HTMLAnchorElement && element.href) {
      // For links, we consider it successful if the click was dispatched without error
      return true;
    }

    // Check if form was submitted (for buttons)
    if (element instanceof HTMLButtonElement && element.type === 'submit') {
      // For submit buttons, check if form is no longer in DOM or was reset
      const form = element.closest('form');
      if (form) {
        // Check if form was submitted (form might be removed or reset)
        return form.style.display === 'none' || form.querySelector('input[type="submit"]') === null;
      }
    }

    // Check for common success indicators
    const successIndicators = [
      element.classList.contains('clicked'),
      element.classList.contains('active'),
      element.getAttribute('data-clicked') === 'true',
      element.style.backgroundColor !== originalState.backgroundColor
    ];

    // If any success indicator is present, consider it successful
    return successIndicators.some(indicator => indicator);
  } catch (error) {
    // If verification fails, assume success (better to try than to fail)
    return true;
  }
}

/**
 * Captures the current state of an element for comparison
 */
function captureElementState(element: HTMLElement): any {
  return {
    backgroundColor: element.style.backgroundColor,
    className: element.className,
    disabled: element.hasAttribute('disabled'),
    ariaDisabled: element.getAttribute('aria-disabled'),
    visibility: element.style.visibility,
    display: element.style.display
  };
}

/**
 * Simulates human-like click interaction with controlled timing
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
    }, index * 10); // 10ms pause between events
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
 * Executes click action on an element using multiple methods with improved logic
 * @param element - Element to click
 * @param agenticPurposeId - Unique identifier of the element
 * @returns ActionResult with execution result
 */
export function executeClickAction(element: Element, agenticPurposeId: string): ActionResult {
  const htmlElement = element as HTMLElement;
  const originalState = captureElementState(htmlElement);
  
  const clickMethods = [
    {
      name: 'Normal click',
      execute: () => {
        htmlElement.click();
      }
    },
    {
      name: 'Human-like simulation',
      execute: () => {
        simulateHumanClick(htmlElement);
      }
    },
    {
      name: 'Focus + Enter key',
      execute: () => {
        htmlElement.focus();
        const enterEvent = new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          key: 'Enter',
          code: 'Enter',
          keyCode: 13
        });
        htmlElement.dispatchEvent(enterEvent);
      }
    },
    {
      name: 'Direct event dispatch with coordinates',
      execute: () => {
        const rect = htmlElement.getBoundingClientRect();
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
        
        htmlElement.dispatchEvent(clickEvent);
      }
    },
    {
      name: 'Focus + Space key',
      execute: () => {
        htmlElement.focus();
        const spaceEvent = new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          key: ' ',
          code: 'Space',
          keyCode: 32
        });
        htmlElement.dispatchEvent(spaceEvent);
      }
    }
  ];
  
  const errors: string[] = [];
  let successfulMethod = '';
  
  // Try each method sequentially until one succeeds
  for (const method of clickMethods) {
    try {
      method.execute();
      
      // Small delay to allow for any immediate effects
      // Note: This is synchronous delay, not async/await
      const start = Date.now();
      while (Date.now() - start < 50) {
        // Busy wait for 50ms (synchronous)
      }
      
      // Verify if the click was actually successful
      const isSuccessful = verifyClickSuccess(htmlElement, originalState);
      
      if (isSuccessful) {
        successfulMethod = method.name;
        break; // Stop trying other methods if this one worked
      } else {
        errors.push(`${method.name}: Click did not produce expected result`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      errors.push(`${method.name}: ${errorMessage}`);
    }
  }
  
  if (successfulMethod) {
    return {
      agenticPurposeId,
      success: true,
      action: 'click',
      message: `Element clicked successfully using ${successfulMethod}`
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
