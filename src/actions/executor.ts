/**
 * Action executor for DOM interactions
 */

import { Action, ActionResult, ActionsResult, DOMContext } from '../types';
import { executeClickAction } from './click';
import { executeTypeAction } from './type';

/**
 * Executes a single action on an element
 */
function executeSingleAction(action: Action, context?: DOMContext): ActionResult {
  const domContext = context || { document, window };
  
  // Find element by agentic-purpose-id
  const element = domContext.document.querySelector(`[agentic-purpose-id="${action.agenticPurposeId}"]`);
  
  if (!element) {
    return {
      agenticPurposeId: action.agenticPurposeId,
      success: false,
      action: action.actionType,
      error: `Element with agentic-purpose-id "${action.agenticPurposeId}" not found`
    };
  }
  
  try {
    if (action.actionType === 'click') {
      return executeClickAction(element, action.agenticPurposeId);
    } else if (action.actionType === 'type') {
      if (!action.value) {
        return {
          agenticPurposeId: action.agenticPurposeId,
          success: false,
          action: action.actionType,
          error: 'Value is required for type action'
        };
      }
      return executeTypeAction(element, action.value, action.agenticPurposeId);
    } else {
      return {
        agenticPurposeId: action.agenticPurposeId,
        success: false,
        action: action.actionType,
        error: `Unknown action type: ${action.actionType}`
      };
    }
  } catch (actionError) {
    return {
      agenticPurposeId: action.agenticPurposeId,
      success: false,
      action: action.actionType,
      error: actionError instanceof Error ? actionError.message : 'Action execution failed'
    };
  }
}

/**
 * Executes multiple actions on DOM elements
 * @param actions - Array of actions to execute
 * @param context - DOM context (optional, defaults to current window/document)
 * @returns Object with execution results
 */
export function executeActions(actions: Action[], context?: DOMContext): ActionsResult {
  try {
    const results: ActionResult[] = [];
    
    for (const action of actions) {
      const result = executeSingleAction(action, context);
      results.push(result);
    }
    
    const allSuccessful = results.every(result => result.success);
    return {
      success: allSuccessful,
      results,
      message: allSuccessful 
        ? `Successfully executed ${actions.length} DOM actions`
        : `${results.filter(r => r.success).length}/${actions.length} DOM actions executed successfully`
    };
  } catch (error) {
    return {
      success: false,
      results: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
