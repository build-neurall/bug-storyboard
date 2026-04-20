# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2024-04-20

### Added

- Monorepo setup with pnpm workspaces
- `@neurall/bug-storyboard-shared` - Shared TypeScript interfaces and types
- `@neurall/bug-storyboard-sdk` - React SDK with:
  - `initBugStoryboard()` - Initialize with app config
  - `useTrackedState()` - Hook for tracking state changes
  - `trackAction()` - Track user actions
  - `captureBug()` - Capture and send bug stories
  - Automatic global error and unhandled rejection tracking
- `@neurall/bug-storyboard-collector` - Node.js Express server with:
  - `POST /stories` - Save bug stories as JSON
  - `GET /stories` - List all stories
  - `GET /stories/:id` - Get full story
- `@neurall/bug-storyboard-viewer` - React + Vite timeline viewer with:
  - Story list page (`/`)
  - Story detail page with timeline (`/story/:id`)
- README with full documentation
- CONTRIBUTING.md for development guidelines
- MIT License
