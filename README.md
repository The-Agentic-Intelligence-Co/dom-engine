# DOM Engine

[![npm version](https://badge.fury.io/js/%40dom-engine%2Fcore.svg)](https://badge.fury.io/js/%40dom-engine%2Fcore)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

A lightweight TypeScript library that interprets and synthesizes website DOM structures, providing browser agents with contextual understanding for intelligent and cost-effective navigation and interaction.

## Features

- **Smart Analysis**: Automatically detects interactive elements (buttons, inputs, links)
- **Advanced Categorization**: Classifies elements by type and functionality
- **Scroll Management**: Precise scroll control with detailed metrics
- **Visibility Filtering**: Only processes actually visible elements
- **Strong Typing**: Fully typed with TypeScript
- **Zero Dependencies**: Pure JavaScript, no external libraries
- **Cross-Platform**: Works in modern browsers and Node.js

## Installation

```bash
npm install @dom-engine/core
```

## Usage

### Basic Usage

```typescript
import { getInteractiveElements, scrollToNewContent } from '@dom-engine/core';

// Get interactive elements from DOM
const domData = getInteractiveElements(document.body);
console.log('Interactive elements:', domData.interactiveElements);
console.log('Scroll info:', domData.scrollInfo);

// Scroll to new content
const scrollResult = scrollToNewContent(
  domData.scrollInfo.firstNewContentPixel, 
  domData.scrollInfo.totalHeight
);
if (scrollResult.success) {
  console.log('Scroll successful');
}
```

### Interactive Elements Analysis

```typescript
import { getInteractiveElements } from '@dom-engine/core';

// Analyze entire page
const domData = getInteractiveElements(document.body);
console.log('Buttons found:', domData.interactiveElements.buttons);
console.log('Inputs found:', domData.interactiveElements.inputs);
console.log('Links found:', domData.interactiveElements.links);
console.log('Total elements:', domData.interactiveElements.total);

// Analyze specific container
const container = document.querySelector('#my-container');
if (container) {
  const containerData = getInteractiveElements(container);
  console.log('Container elements:', containerData.interactiveElements);
}
```

### Scroll Management

```typescript
import { getInteractiveElements, scrollToNewContent } from '@dom-engine/core';

// Get scroll information
const domData = getInteractiveElements(document.body);
console.log('Scroll percentage:', domData.scrollInfo.verticalScrollPercentage);
console.log('Remaining content:', domData.scrollInfo.remainingHeight);

// Scroll to new content
const result = scrollToNewContent(
  domData.scrollInfo.firstNewContentPixel, 
  domData.scrollInfo.totalHeight
);
```

## API

```bash
# Clone repository
git clone https://github.com/yourusername/dom-engine.git
cd dom-engine

# Install dependencies
npm install

# Build TypeScript
npm run build

# Watch mode
npm run build:watch

# Lint code
npm run lint

# Clean build
npm run clean
```

## Project Structure

```
src/
├── core/
│   └── dom-engine.ts          # Main engine
├── dom/
│   ├── element-analyzer.ts    # Element analysis
│   └── interactive-finder.ts  # Interactive element finder
├── scroll/
│   └── scroll-manager.ts      # Scroll management
├── utils/
│   └── helpers.ts             # Utilities
├── types.ts                   # Type definitions
└── index.ts                   # Entry point
```

## Use Cases

- **E2E Testing**: Automated testing tools
- **Web Scraping**: Intelligent data extraction
- **Browser Agents**: AI agents that interact with web pages

## Roadmap

- ✅ **Smart Element Analysis**: Automatically detects interactive elements (buttons, inputs, links)
- ✅ **Advanced Categorization**: Classifies elements by type and functionality
- ✅ **Scroll Management**: Precise scroll control with detailed metrics
- ✅ **Visibility Filtering**: Only processes actually visible elements
- ✅ **Strong Typing**: Fully typed with TypeScript
- ✅ **Zero Dependencies**: Pure JavaScript, no external libraries
- ✅ **Cross-Platform**: Works in modern browsers and Node.js
- 🔲 **Interaction History**: Track and maintain history of interacted elements
- 🔲 **Iframe Processing**: Support for analyzing and interacting with iframe content

## API Reference

### Main Functions

#### `getInteractiveElements(rootElement: Element): DOMExtractionResult`
Gets interactive elements from the specified DOM element.

**Parameters:**
- `rootElement`: Root DOM element to analyze (e.g., `document.body`)

**Returns:**
- Object with interactive elements and scroll information

#### `scrollToNewContent(firstNewContentPixel: number, totalHeight?: number): ScrollResult`
Scrolls to the specified pixel of new content on the page.

**Parameters:**
- `firstNewContentPixel`: Pixel to scroll to (from `scrollInfo.firstNewContentPixel`)
- `totalHeight`: Total document height (optional, for validation)

**Returns:**
- Object with scroll operation result


## Contributing

Contributions are welcome! Please:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by modern web automation needs
- Designed for the AI agent developer community
- Built with TypeScript for maximum type safety
