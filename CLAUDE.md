# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SvelteKit-based wiki frontend application that works with the [scallion-wiki-api](https://github.com/mumez/scallion-wiki-api) backend. The app provides a complete wiki system with Markdown editing, Firebase authentication, file attachments, versioning, and support for multiple wikis.

## Development Commands

**Note**: This project uses `pnpm` as the package manager. Node.js 22.x is required.

### Core Commands

- `pnpm dev` - Start development server on port 8081
- `pnpm build` - Build the application for production ⚠️ Currently failing due to Skeleton migration
- `pnpm preview` - Preview production build locally

### Quality Assurance

- `pnpm lint` - Run Prettier and ESLint checks
- `pnpm format` - Format code with Prettier
- `pnpm check` - Run Svelte type checking
- `pnpm check:watch` - Run Svelte type checking in watch mode
- `pnpm test:unit` - Run unit tests with Vitest

## Project Architecture

### Service Layer Architecture

The application follows a layered service architecture:

- **BaseService**: Abstract base class for all services
- **BaseApiService**: Extends BaseService with HTTP API functionality and JWT authentication
- **Domain Services**: WikiBookService, PageService, AuthService, etc. extend BaseApiService

All API communication goes through the `WebApiAccessor` utility class, which handles JWT tokens and HTTP requests to the backend API.

### Key Components Structure

#### Configuration (`src/lib/configs/`)

- Central configuration system combining Firebase, Wiki API, and WebDAV settings
- Environment-specific configurations are managed here

#### Models (`src/lib/models/`)

- `WikiBook`: Represents a wiki with metadata (id, name, title, count, owner)
- `PageContent`: Represents wiki page content with versioning information
- `User`: User authentication and profile information

#### Services (`src/lib/services/`)

- **AuthService**: Firebase authentication with JWT token management
- **WikiBookService**: Wiki metadata and page existence checking
- **PageService**: CRUD operations for wiki pages
- **FilesService**: File attachment management
- **SearchService**: Full-text search functionality
- **VersionsService**: Page versioning and history

#### Stores (`src/lib/stores/`)

Svelte stores for global state management:

- `isAuthenticated`: User authentication state
- `wikiPage`: Current wiki page data
- `headerTitle`: Dynamic page titles
- `parentLink`: Navigation breadcrumb state

### Route Structure

The app uses SvelteKit's file-based routing with dynamic segments:

- `/wikis/[wiki]/[[page]]` - Main wiki page view
- `/blikis/[wiki]/[[page]]` - Blog-style wiki pages
- `/attachments/[wiki]/[[page]]` - File attachments
- `/versions/[wiki]/[[page]]` - Page version history
- `/search/[wiki]/[[page]]` - Search results

### Authentication Flow

1. Firebase authentication via popup
2. JWT token extraction and storage
3. Token passed to API services through `WebApiAccessor`
4. Authentication state managed in `isAuthenticated` store

## Technology Stack

- **Frontend**: SvelteKit 2.x + TypeScript + Svelte 5
- **UI Framework**: Skeleton UI v3 + Tailwind CSS v4
- **Authentication**: Firebase Auth (JWT tokens)
- **Testing**: Vitest with MSW for API mocking
- **Markdown**: Marked.js with syntax highlighting (highlight.js)
- **Internationalization**: svelte-i18n
- **File Storage**: WebDAV support for attachments
- **Package Manager**: pnpm (v8.15.4)

## API Integration

### Backend API

The frontend integrates with the [scallion-wiki-api](https://github.com/mumez/scallion-wiki-api) backend. The API specification is documented in `api-spec/wikis.yaml`.

### Key API Endpoints

- `GET /wikis` - List all wiki books
- `GET /wiki?name={name}` - Get wiki book metadata
- `GET /pages?wiki={wiki}&exist={pageNames}` - Check page existence
- `GET /page?wiki={wiki}&name={page}` - Get page content
- `POST /page` - Create new page (requires JWT)
- `PUT /page` - Update existing page (requires JWT)
- `GET /versions?wiki={wiki}&page={page}&from={from}&size={size}` - Get page versions
- `GET /updates?wiki={wiki}&from={from}&size={size}` - Get recent updates
- `GET /search?wiki={wiki}&q={query}` - Search pages

### Authentication

- JWT tokens are passed via Authorization header
- Authentication is required for creating/updating pages
- Page locking is enforced server-side based on `ownedBy` field

### Data Models

- **WikiBook**: `{id, name, title, count, ownedBy, initialPageName?}`
- **WikiPage**: `{id, name, content, wiki, bookId, number, updatedAt, updatedBy, isLocked}`

## Development Notes

### API Integration

Configure the backend API endpoint in `src/lib/configs/wikiApi.ts`. The base URL should point to your scallion-wiki-api instance (default: `https://softumeya.com/scallion/api`).

### Environment Configuration

Configure Firebase and API endpoints in the respective config files before running the application.

### Testing

Tests are configured to run with Vitest and include files matching `src/**/*.{test,spec}.{js,ts}`.

## Current Status

### Active Migration Work

The project is currently undergoing major framework migrations:

1. **Skeleton UI Migration**: Migrating from v2 to v3 (see https://www.skeleton.dev/docs/get-started/migrate-from-v2)
2. **Tailwind CSS**: Upgraded to v4 with new Vite plugin architecture
3. **Svelte**: Upgraded to v5 with new syntax and features

### Known Issues

- **Build Failure**: `pnpm build` currently fails due to incomplete Skeleton migration:
- **Component Updates**: Several components need updates for Skeleton v3 API changes
```
x Build failed in 1.88s
error during build:
src/routes/+layout.svelte (9:18): "AppShell" is not exported by "node_modules/.pnpm/@skeletonlabs+skeleton-svelte@1.3.1_svelte@5.36.7/node_modules/@skeletonlabs/skeleton-svelte/dist/index.js", imported by "src/routes/+layout.svelte".
file: D:/git/scallion-svelte/src/routes/+layout.svelte:9:18

 7:   import { onMount } from 'svelte';
 8:   import { page } from '$app/stores';
 9:   import { AppBar, AppShell } from '@skeletonlabs/skeleton-svelte';
                       ^
10:   import ActionsMenuBar from '$lib/components/ActionsMenuBar.svelte';
11:   import WikiBookIndexLink from '$lib/components/WikiBookIndexLink.svelte';

    at getRollupError (file:///D:/git/scallion-svelte/node_modules/.pnpm/rollup@4.45.1/node_modules/rollup/dist/es/shared/parseAst.js:401:41)
    at error (file:///D:/git/scallion-svelte/node_modules/.pnpm/rollup@4.45.1/node_modules/rollup/dist/es/shared/parseAst.js:397:42)     
    at Module.error (file:///D:/git/scallion-svelte/node_modules/.pnpm/rollup@4.45.1/node_modules/rollup/dist/es/shared/node-entry.js:16830:16)
    at Module.traceVariable (file:///D:/git/scallion-svelte/node_modules/.pnpm/rollup@4.45.1/node_modules/rollup/dist/es/shared/node-entry.js:17279:29)
    at ModuleScope.findVariable (file:///D:/git/scallion-svelte/node_modules/.pnpm/rollup@4.45.1/node_modules/rollup/dist/es/shared/node-entry.js:14925:39)
    at FunctionScope.findVariable (file:///D:/git/scallion-svelte/node_modules/.pnpm/rollup@4.45.1/node_modules/rollup/dist/es/shared/node-entry.js:5620:38)
    at FunctionBodyScope.findVariable (file:///D:/git/scallion-svelte/node_modules/.pnpm/rollup@4.45.1/node_modules/rollup/dist/es/shared/node-entry.js:5620:38)
    at BlockScope.findVariable (file:///D:/git/scallion-svelte/node_modules/.pnpm/rollup@4.45.1/node_modules/rollup/dist/es/shared/node-entry.js:5620:38)
    at Identifier.bind (file:///D:/git/scallion-svelte/node_modules/.pnpm/rollup@4.45.1/node_modules/rollup/dist/es/shared/node-entry.js:5394:40)
    at CallExpression.bind (file:///D:/git/scallion-svelte/node_modules/.pnpm/rollup@4.45.1/node_modules/rollup/dist/es/shared/node-entry.js:2785:23)
 ELIFECYCLE  Command failed with exit code 1.
```
- **Import Statements**: Old Skeleton imports need to be updated throughout the codebase

### Migration Progress

- ✅ Updated dependencies in package.json
- ✅ Added @tailwindcss/vite plugin
- ⚠️ **In Progress**: Skeleton UI component migration
- ⚠️ **In Progress**: CSS import statements update
- ❌ **Pending**: Full build verification