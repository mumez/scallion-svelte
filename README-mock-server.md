# Mock Server for scallion-svelte

This document describes how to use the mock server for testing the scallion-svelte application.

## Overview

The mock server is based on Mock Service Worker (MSW) and provides a complete mock implementation of the [scallion-wiki-api](https://github.com/mumez/scallion-wiki-api) endpoints defined in `api-spec/wikis.yaml`.

## Files Created

- `src/lib/mocks/api.ts` - Mock API handlers based on the OpenAPI specification
- `src/lib/mocks/browser.ts` - Browser MSW setup
- `src/lib/mocks/node.ts` - Node.js MSW setup (for testing)
- `src/lib/mocks/index.ts` - Exports for all mock functionality
- `src/setupTests.ts` - Test setup file for Vitest
- `src/lib/services/__tests__/WikiBookService.test.ts` - Example test using the mock server

## Usage

### For Testing

The mock server is automatically configured for unit tests. Simply run:

```bash
npm run test:unit
```

### For Development

To use the mock server in development, you can start the MSW worker in your browser:

```typescript
// In your app initialization
import { worker } from '$lib/mocks/browser';

if (import.meta.env.DEV) {
  worker.start();
}
```

## Mock Data

The mock server includes sample data for:

- 2 wiki books ("ume" and "squeak")
- 2 pages ("index" and "test1")
- Proper page existence checking
- Version management
- Search functionality

## API Endpoints Mocked

All endpoints from the OpenAPI specification are implemented:

- `GET /wikis` - List all wiki books
- `GET /wiki` - Get wiki book metadata
- `GET /pages` - Check page existence
- `GET /page` - Get page content
- `POST /page` - Create new page
- `PUT /page` - Update existing page
- `GET /versions` - Get page versions
- `GET /version` - Get last version number
- `GET /updates` - Get recent updates
- `GET /search` - Search pages

## Configuration

The mock server uses the same data models as the real application:

- `WikiBook` from `$lib/models/WikiBook`
- `PageContent` from `$lib/models/PageContent`

## Dependencies

- `msw` - Mock Service Worker library (installed as dev dependency)