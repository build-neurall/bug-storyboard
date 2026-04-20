# Contributing to Bug Storyboard

We love your input! We want to make contributing as easy as possible.

## Development Setup

### 1. Clone the repo

```bash
git clone https://github.com/build-neurall/bug-storyboard.git
cd bug-storyboard
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Build all packages

```bash
pnpm build
```

### 4. Run tests

```bash
pnpm test
```

## Package Structure

```
packages/
├── shared/       # Types only - cd packages/shared && pnpm build
├── sdk/          # React hooks - cd packages/sdk && pnpm build
├── collector/    # Node server - cd packages/collector && pnpm dev
└── viewer/       # React app - cd packages/viewer && pnpm dev
```

## Pull Request Process

1. Fork the repo and create your branch from `master`
2. If you've added code that needs tests, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Coding Standards

- TypeScript strict mode enabled
- Use meaningful variable and function names
- Document public APIs with JSDoc comments
- Add tests for new functionality

## Bug Reports

Use the GitHub Issues template. Include:
- Your OS and Node.js version
- Minimal reproduction steps
- Expected vs actual behavior
- `console.log` output if relevant
