# Contributing to DOM Engine

This guide explains how to contribute to the DOM Engine project and how to perform releases.

## Development Workflow

### 1. Making Changes

1. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** to the source files in `src/`

3. **Build the project:**
   ```bash
   npm run build
   ```

4. **Test your changes:**
   ```bash
   npm run lint
   ```

### 2. Committing Changes

1. **Stage your changes:**
   ```bash
   git add .
   ```

2. **Commit with a descriptive message:**
   ```bash
   git commit -m "feat: Add new functionality"
   ```

   **Commit message format:**
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `refactor:` for code refactoring
   - `test:` for adding tests

### 3. Pushing Changes

1. **Push to your branch:**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub

## Release Process

### Development Release (Prerelease)

For development versions with new features:

1. **Update version in package.json:**
   ```bash
   # Edit package.json and update version (e.g., 1.2.0-dev.0)
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Stage and commit changes:**
   ```bash
   git add .
   git commit -m "feat: Add new functionality"
   ```

4. **Push to main:**
   ```bash
   git push origin main
   ```

5. **Create and push tag:**
   ```bash
   git tag v1.2.0-dev.0
   git push origin v1.2.0-dev.0
   ```

6. **Push all tags:**
   ```bash
   git push --tags
   ```

### Production Release

For stable releases:

1. **Update version in package.json:**
   ```bash
   # Edit package.json and update version (e.g., 1.2.0)
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Stage and commit changes:**
   ```bash
   git add .
   git commit -m "release: v1.2.0"
   ```

4. **Push to main:**
   ```bash
   git push origin main
   ```

5. **Create and push tag:**
   ```bash
   git tag v1.2.0
   git push origin v1.2.0
   ```

6. **Push all tags:**
   ```bash
   git push --tags
   ```

## NPM Publishing

### Prerelease to NPM

1. **Login to NPM:**
   ```bash
   npm login
   ```

2. **Publish with dev tag:**
   ```bash
   npm publish --tag dev
   ```

### Production Release to NPM

1. **Login to NPM:**
   ```bash
   npm login
   ```

2. **Publish:**
   ```bash
   npm publish
   ```

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

## Available Scripts

- `npm run build` - Build the project (CJS + ESM)
- `npm run build:cjs` - Build CommonJS version
- `npm run build:esm` - Build ES Modules version
- `npm run build:watch` - Watch mode for development
- `npm run dev` - Development mode with watch
- `npm run clean` - Clean dist folder
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## Version Numbering

- **Major.Minor.Patch** for stable releases (e.g., `1.2.0`)
- **Major.Minor.Patch-dev.X** for development releases (e.g., `1.2.0-dev.0`)

## Installation from GitHub

### Install specific version:
```bash
npm install git+https://github.com/The-Agentic-Intelligence-Co/dom-engine.git#v1.2.0-dev.0
```

### Install latest from main:
```bash
npm install git+https://github.com/The-Agentic-Intelligence-Co/dom-engine.git
```

## Pull Request Guidelines

1. **Create a descriptive title**
2. **Provide a detailed description** of changes
3. **Reference any related issues**
4. **Ensure all tests pass** (when available)
5. **Update documentation** if needed
6. **Follow the commit message format**

## Getting Help

- Check existing issues on GitHub
- Create a new issue for bugs or feature requests
- Join discussions in GitHub Discussions

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.
