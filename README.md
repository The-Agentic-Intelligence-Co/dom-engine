DOM Engine

[![npm version](https://img.shields.io/npm/v/@agentic-intelligence/dom-engine.svg)](https://www.npmjs.com/package/@agentic-intelligence/dom-engine)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

A simple, lightweight library that turns website DOMs into actionable context for browser agents. Supports both browser extension environments and headless browser automation via Puppeteer.

## Installation

```bash
npm install @agentic-intelligence/dom-engine
```

## Usage

### Basic Usage

```typescript
import { getInteractiveContext, scrollToNewContent, executeActions } from '@agentic-intelligence/dom-engine';

// 1. Analyze page and get interactive elements
const domData = getInteractiveContext({ injectTrackers: true });
console.log('Interactive elements:', domData.interactiveElements);
console.log('Scroll info:', domData.scrollInfo);

// 2. Execute actions on elements
const actions = [
  {
    agenticPurposeId: domData.interactiveElements.inputs[0].agenticPurposeId,
    actionType: "type",
    value: "hello@example.com"
  },
  {
    agenticPurposeId: domData.interactiveElements.buttons[0].agenticPurposeId,
    actionType: "click"
  }
];

const result = executeActions(actions);
console.log('Actions executed:', result.results);

// 3. Navigate with smart scroll
const scrollResult = scrollToNewContent();
if (scrollResult.success) {
  console.log('Scrolled to:', scrollResult.scrolledTo);
}
```

**Note:** `injectTrackers` adds a unique `agenticPurposeId` to each element that AI agents can use to reference and interact with elements. It also injects event listeners to detect clicks and evaluate if interactions were successful.

### DOM Analysis

```typescript
import { getInteractiveContext } from '@agentic-intelligence/dom-engine';

// Analyze entire page
const domData = getInteractiveContext({ injectTrackers: true });
console.log('Buttons found:', domData.interactiveElements.buttons);
console.log('Inputs found:', domData.interactiveElements.inputs);
console.log('Links found:', domData.interactiveElements.links);
console.log('Total elements:', domData.interactiveElements.total);
```

### Example Response

Here's what a typical response looks like:

```typescript
const domData = getInteractiveContext({ injectTrackers: true });

// Example response structure:
// Note: agenticPurposeId is a unique identifier that AI agents can use to reference
// and interact with specific elements when performing actions on the page.
{
  interactiveElements: {
    total: 5,
    buttons: [
      {
        text: "Submit",
        agenticPurposeId: "a1b2c3d4",
        className: "btn btn-primary",
        ...
      }
    ],
    inputs: [
      {
        text: "Placeholder: Enter your email | Name: email",
        agenticPurposeId: "e5f6g7h8",
        type: "email",
        className: "form-control",
        ...
      }
    ],
    links: [
      {
        text: "Text: Learn more | Title: Documentation",
        agenticPurposeId: "i9j0k1l2",
        href: "/docs",
        className: "nav-link",
        ...
      }
    ],
    ...
  },
  scrollInfo: {
    totalHeight: 2000,
    viewportHeight: 800,
    scrollTop: 0,
    verticalScrollPercentage: 0,
    remainingHeight: 1200,
    nextContentPixel: 800
  }
}
```

### Scroll Management

```typescript
import { getInteractiveContext, scrollToNewContent } from '@agentic-intelligence/dom-engine';

// Get scroll information (no parameters needed!)
const domData = getInteractiveContext();
console.log('Scroll percentage:', domData.scrollInfo.verticalScrollPercentage);
console.log('Remaining content:', domData.scrollInfo.remainingHeight);

// Scroll to new content (automatically handles scroll to top if no new content)
const result = scrollToNewContent();
console.log('Scrolled to:', result.scrolledTo);
```

### Action Execution

```typescript
import { executeActions } from '@agentic-intelligence/dom-engine';

// Execute multiple actions
const actions = [
  {
    agenticPurposeId: "a1b2c3d4",
    actionType: "type",
    value: "user@example.com"
  },
  {
    agenticPurposeId: "a1b2c3d4",
    actionType: "click"
  }
];

const result = executeActions(actions);
console.log('Results:', result.results);
```

**Available Action Types:**
- `click`: Click on buttons, links, or any clickable element
- `type`: Type text into inputs, textareas, or contentEditable elements

**Human-like Interaction:**
- Simulates realistic mouse events with coordinates
- Multiple fallback methods for reliable clicking
- Proper event sequences (mouseover, mousedown, mouseup, click)
- Keyboard events for activation

### Scroll Management

```typescript
import { scrollToNewContent } from '@agentic-intelligence/dom-engine';

// Smart scroll to new content
const scrollResult = scrollToNewContent();
console.log('Scrolled to:', scrollResult.scrolledTo);
```

**Smart Scroll Behavior:**
- If there's new content below: scrolls to the next unseen content
- If no new content available: scrolls back to the top (pixel 0)
- Always returns `success: true` with the scroll position

## Using with Puppeteer & Headless Browsers

### Building the Bundle

Before using with Puppeteer, create a browser-compatible bundle:

```javascript
// bundle-dom-engine.js
const esbuild = require('esbuild');

async function bundleDomEngine() {
    try {
        await esbuild.build({
            entryPoints: [require.resolve('@agentic-intelligence/dom-engine')],
            bundle: true,
            format: 'iife',
            globalName: 'DomEngine',
            platform: 'browser',
            target: 'es2015',
            outfile: './dom-engine-bundle.js',
            minify: false
        });
        console.log('✅ Bundle created successfully');
    } catch (error) {
        console.error('❌ Error creating bundle:', error);
    }
}

bundleDomEngine();
```

### Injecting and Using with Puppeteer

```javascript
const puppeteer = require('puppeteer');
const path = require('path');

// Launch browser and navigate
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.goto('https://example.com', { waitUntil: 'networkidle2' });

// Inject the bundle
const bundlePath = path.join(__dirname, 'dom-engine-bundle.js');
await page.addScriptTag({ path: bundlePath });

// Use dom-engine
const domData = await page.evaluate(() => {
    return DomEngine.getInteractiveContext({ 
        injectTrackers: true
    });
});

console.log('Found buttons:', domData.interactiveElements.buttons);

// Click element by agenticPurposeId
const button = domData.interactiveElements.buttons[0];
await page.evaluate((purposeId) => {
    const element = document.querySelector(`[data-agentic-purpose-id="${purposeId}"]`);
    element?.click();
}, button.agenticPurposeId);

await browser.close();

## Project Structure

```
src/
├── core/
│   └── dom-engine.ts          # Main DOM analysis engine
├── read/
│   ├── element-analyzer.ts    # Element text extraction and analysis
│   └── interactive-finder.ts  # Interactive element detection
├── scroll/
│   └── scroll-manager.ts      # Scroll calculation and navigation
├── actions/
│   ├── executor.ts            # Action coordination and execution
│   ├── click.ts               # Click action implementation
│   ├── type.ts                # Type action implementation
│   └── raw.ts                 # Original extracted code
├── utils/
│   └── helpers.ts             # Utility functions
├── types.ts                   # TypeScript type definitions
└── index.ts                   # Public API exports
```

## Use Case Example

### 🤖 AI Agents & Automation
```typescript
// AI agent workflow
const domData = getInteractiveContext({ injectTrackers: true });
const actions = aiAgent.decideActions(domData.interactiveElements);
const result = executeActions(actions);
```

### 🧪 E2E Testing
```typescript
// Automated testing
const domData = getInteractiveContext({ injectTrackers: true });
const actions = [
  { agenticPurposeId: "email-input", actionType: "type", value: "test@example.com" },
  { agenticPurposeId: "submit-btn", actionType: "click" }
];
const result = executeActions(actions);
assert(result.results.every(r => r.success));
```

## Features

### ✅ Core Functionality
- **Smart Element Analysis**: Automatically detects interactive elements (buttons, inputs, links)
- **Advanced Categorization**: Classifies elements by type and functionality
- **Human-like Actions**: Click and type with realistic event simulation
- **Smart Scroll Management**: Intelligent scroll control with automatic top return
- **Visibility Filtering**: Only processes actually visible elements
- **Element Tracking**: Inject unique IDs for agent tracking and interaction

### ✅ Technical Features
- **Zero Dependencies**: Pure JavaScript, no external libraries
- **Cross-Platform**: Works in modern browsers and Node.js
- **Custom DOM Context**: Support for analyzing different document contexts (extensions, iframes)
- **TypeScript Support**: Full type definitions and IntelliSense
- **Modular Architecture**: Clean separation of concerns

### 🔲 Planned Features
- **Interaction History**: Track and maintain history of interacted elements
- **Advanced Actions**: Hover, drag & drop, keyboard shortcuts
- **Iframe Processing**: Enhanced support for analyzing and interacting with iframe content
- **Performance Optimization**: Lazy loading and caching for large pages

## API Reference

### Core Functions

#### `getInteractiveContext(options?)`
Analyzes the DOM and returns interactive elements with scroll information.

**Parameters:**
- `options.injectTrackers?: boolean` - Inject unique IDs for action tracking
- `options.context?: DOMContext` - Custom DOM context for extensions/iframes

**Returns:** `DOMExtractionResult`

#### `executeActions(actions, context?)`
Executes multiple actions on DOM elements.

**Parameters:**
- `actions: Action[]` - Array of actions to execute
- `context?: DOMContext` - Custom DOM context

**Returns:** `ActionsResult`

#### `scrollToNewContent(context?)`
Scrolls to new content or returns to top if no new content available.

**Parameters:**
- `context?: DOMContext` - Custom DOM context

**Returns:** `ScrollResult`

### Types

## Roadmap

- ✅ **Smart Element Analysis**: Automatically detects interactive elements (buttons, inputs, links)
- ✅ **Advanced Categorization**: Classifies elements by type and functionality
- ✅ **Smart Scroll Management**: Intelligent scroll control with automatic top return
- ✅ **Visibility Filtering**: Only processes actually visible elements
- ✅ **Zero Dependencies**: Pure JavaScript, no external libraries
- ✅ **Cross-Platform**: Works in modern browsers and Node.js
- ✅ **Custom DOM Context**: Support for analyzing different document contexts (extensions, iframes)
- ✅ **Element Tracking**: Inject unique IDs for agent tracking and interaction
- 🔲 **Interaction History**: Track and maintain history of interacted elements
- 🔲 **Iframe Processing**: Support for analyzing and interacting with iframe content


## Contributing

Contributions are welcome! Please:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Made with ❤️ by **Luis Chapa Morin**
