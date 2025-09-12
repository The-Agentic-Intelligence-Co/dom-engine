# Agentic DOM Intelligence

[![npm version](https://img.shields.io/npm/v/@agentic-intelligence/dom-engine.svg)](https://www.npmjs.com/package/@agentic-intelligence/dom-engine)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)

A lightweight TypeScript library that interprets and synthesizes website DOM structures, providing browser agents with contextual understanding for intelligent and cost-effective navigation and interaction.

## Installation

```bash
npm install @agentic-intelligence/dom-engine
```

## Usage

### Basic Usage

```typescript
import { getInteractiveElements, scrollToNewContent } from '@agentic-intelligence/dom-engine';

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
import { getInteractiveElements } from '@agentic-intelligence/dom-engine';

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
import { getInteractiveElements, scrollToNewContent } from '@agentic-intelligence/dom-engine';

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


## Contributing

Contributions are welcome! Please:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
