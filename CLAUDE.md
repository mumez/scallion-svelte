# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SvelteKit-based wiki frontend application that works with the [scallion-wiki-api](https://github.com/mumez/scallion-wiki-api) backend. The app provides a complete wiki system with Markdown editing, Firebase authentication, file attachments, versioning, and support for multiple wikis.

## Development Commands

**Note**: This project uses `pnpm` as the package manager. Node.js 22.x is required.

### Core Commands

- `pnpm dev` - Start development server on port 8081
- `pnpm build` - Build the application for production
- `pnpm preview` - Preview production build locally

### Quality Assurance

- `pnpm lint` - Run Prettier and ESLint checks
- `pnpm format` - Format code with Prettier
- `pnpm check` - Run Svelte type checking
- `pnpm check:watch` - Run Svelte type checking in watch mode
- `pnpm test:unit` - Run all tests with Vitest (33 tests passing)

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

### Completed Migrations

The project has successfully completed major framework migrations:

1. **Skeleton UI Migration**: Successfully migrated from v2 to v3
2. **Tailwind CSS**: Upgraded to v4 with new Vite plugin architecture
3. **Svelte**: Upgraded to v5 with new syntax and features
4. **Testing Infrastructure**: Fully restored and updated for new frameworks

### Migration Progress

- ✅ Updated dependencies in package.json
- ✅ Added @tailwindcss/vite plugin
- ✅ Skeleton UI component migration
- ✅ CSS import statements update
- ✅ Full build verification
- ✅ Unit and integration tests fully operational

### Testing Status

All tests are now fully functional after migration:

- **Test Files**: 6 passed
- **Total Tests**: 33 passed
- **Coverage**: Unit tests, integration tests with MSW, and component tests

#### Test Configuration

- **Framework**: Vitest with jsdom environment
- **Component Testing**: @testing-library/svelte with Svelte 5 support
- **API Mocking**: MSW (Mock Service Worker) v1.x for integration tests
- **Assertions**: @testing-library/jest-dom matchers enabled

#### Active Test Suites

1. **Service Layer Tests**: PageService, WikiBookService, WikiBooksService
2. **Integration Tests**: Full API integration with MSW mocks
3. **Component Tests**: MarkdownViewer with proper Svelte 5 rendering
4. **Route Tests**: HomePage integration testing

#### Migration Fixes Applied

- ✅ Fixed Svelte 5 component mounting compatibility
- ✅ Updated MSW from v2.x to stable v1.x for Vitest compatibility
- ✅ Configured proper DOM environment with jsdom
- ✅ Added @testing-library/jest-dom for modern assertion matchers
- ✅ Updated PageService API calls to match current implementation
- ✅ Fixed error handling in services for robust test scenarios