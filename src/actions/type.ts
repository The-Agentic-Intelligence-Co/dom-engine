/**
 * Type action functionality
 */

import { ActionResult } from '../types';

/**
 * Simulates human-like interaction for input elements
 */
function simulateHumanInputInteraction(inputElement: HTMLInputElement | HTMLTextAreaElement, textValue: string): void {
  // Get element position for realistic mouse events
  const rect = inputElement.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  
  // Simulate mouse events with real coordinates
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
  
  // Dispatch mouse events in sequence
  mouseEvents.forEach(event => {
    inputElement.dispatchEvent(event);
  });
  
  // Focus element (after mouse events)
  inputElement.focus();
  
  // Simulate keyboard events for activation
  const keyboardEvents = [
    new KeyboardEvent('keydown', { 
      bubbles: true, 
      cancelable: true, 
      key: 'Tab',
      code: 'Tab',
      keyCode: 9
    }),
    new KeyboardEvent('keyup', { 
      bubbles: true, 
      cancelable: true, 
      key: 'Tab',
      code: 'Tab',
      keyCode: 9
    })
  ];
  
  keyboardEvents.forEach(event => {
    inputElement.dispatchEvent(event);
  });
  
  // Set the value
  inputElement.value = textValue || '';
  
  // Simulate input/change events with realistic details
  const inputEvent = new InputEvent('input', {
    bubbles: true,
    cancelable: true,
    inputType: 'insertText',
    data: textValue || ''
  });
  
  const changeEvent = new Event('change', {
    bubbles: true,
    cancelable: true
  });
  
  inputElement.dispatchEvent(inputEvent);
  inputElement.dispatchEvent(changeEvent);
  
  // Simulate final keyboard events
  const finalKeyboardEvents = [
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
  
  finalKeyboardEvents.forEach(event => {
    inputElement.dispatchEvent(event);
  });
}

/**
 * Simulates human-like interaction for contentEditable elements
 */
function simulateHumanContentEditableInteraction(contentElement: HTMLElement, textValue: string): void {
  // Get element position for realistic mouse events
  const rect = contentElement.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  
  // Simulate mouse events with real coordinates
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
  
  // Dispatch mouse events in sequence
  mouseEvents.forEach(event => {
    contentElement.dispatchEvent(event);
  });
  
  // Focus element (after mouse events)
  contentElement.focus();
  
  // Simulate keyboard events for activation
  const keyboardEvents = [
    new KeyboardEvent('keydown', { 
      bubbles: true, 
      cancelable: true, 
      key: 'Tab',
      code: 'Tab',
      keyCode: 9
    }),
    new KeyboardEvent('keyup', { 
      bubbles: true, 
      cancelable: true, 
      key: 'Tab',
      code: 'Tab',
      keyCode: 9
    })
  ];
  
  keyboardEvents.forEach(event => {
    contentElement.dispatchEvent(event);
  });
  
  // Set element content
  contentElement.textContent = textValue || '';
  
  // Simulate input/change events with realistic details
  const inputEvent = new InputEvent('input', {
    bubbles: true,
    cancelable: true,
    inputType: 'insertText',
    data: textValue || ''
  });
  
  const changeEvent = new Event('change', {
    bubbles: true,
    cancelable: true
  });
  
  contentElement.dispatchEvent(inputEvent);
  contentElement.dispatchEvent(changeEvent);
  
  // Simulate final keyboard events
  const finalKeyboardEvents = [
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
  
  finalKeyboardEvents.forEach(event => {
    contentElement.dispatchEvent(event);
  });
}

/**
 * Executes type action on an element
 * @param element - Element to type into
 * @param value - Text value to type
 * @param agenticPurposeId - Unique identifier of the element
 * @returns ActionResult with execution result
 */
export function executeTypeAction(element: Element, value: string, agenticPurposeId: string): ActionResult {
  if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
    // Simulate human interaction
    simulateHumanInputInteraction(element, value);
    
    return {
      agenticPurposeId,
      success: true,
      action: 'type',
      message: `Text "${value}" typed successfully`
    };
  } else if (element instanceof HTMLElement && element.contentEditable === 'true') {
    // Simulate human interaction for contentEditable elements
    simulateHumanContentEditableInteraction(element, value);
    
    return {
      agenticPurposeId,
      success: true,
      action: 'type',
      message: `Text "${value}" typed successfully in contentEditable element`
    };
  } else {
    return {
      agenticPurposeId,
      success: false,
      error: 'Element is not a text input field'
    };
  }
}
