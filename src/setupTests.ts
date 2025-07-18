import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './lib/mocks/node';

// Start server before all tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => server.resetHandlers());

// Close server after all tests
afterAll(() => server.close());