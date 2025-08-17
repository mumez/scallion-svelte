import { describe, it, expect, beforeEach } from 'vitest';
import WikiBooksService from '../WikiBooksService';
import type { WikiBook } from '$lib/models/WikiBook';

// This test uses the MSW mocks defined in src/lib/mocks/api.ts
// The MSW server is automatically started by setupTests.ts

describe('WikiBooksService Integration Tests', () => {
	let wikiBooksService: WikiBooksService;

	beforeEach(() => {
		// Use the default fetch function
		wikiBooksService = new WikiBooksService(global.fetch);
	});

	describe('listBooks', () => {
		it('fetches all wiki books from API', async () => {
			const result = await wikiBooksService.listBooks();

			expect(result).toHaveLength(2);
			
			// Should include both mock wikis
			expect(result).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						name: 'ume',
						title: 'ume wiki',
						count: 6,
						ownedBy: '4saYpbYbngfMl6N4YPLWn8kJHAC2'
					}),
					expect.objectContaining({
						name: 'squeak',
						title: 'squeak wiki',
						count: 1,
						ownedBy: '4saYpbYbngfMl6N4YPLWn8kJHAC2'
					})
				])
			);
		});

		it('returns wikis sorted alphabetically by name', async () => {
			const result = await wikiBooksService.listBooks();

			// Should be sorted: squeak comes before ume alphabetically
			expect(result[0]?.name).toBe('squeak');
			expect(result[1]?.name).toBe('ume');
		});

		it('returns empty array when API fails', async () => {
			// Create a service with a custom fetch that will fail
			const failingFetch = async () => {
				throw new Error('Network error');
			};
			
			const failingService = new WikiBooksService(failingFetch);
			const result = await failingService.listBooks();

			expect(result).toEqual([]);
		});

		it('includes all required WikiBook properties', async () => {
			const result = await wikiBooksService.listBooks();

			result.forEach((wikiBook: WikiBook) => {
				// Verify all required properties are present
				expect(wikiBook).toHaveProperty('id');
				expect(wikiBook).toHaveProperty('name');
				expect(wikiBook).toHaveProperty('title');
				expect(wikiBook).toHaveProperty('count');
				expect(wikiBook).toHaveProperty('ownedBy');
				
				// Verify property types
				expect(typeof wikiBook.id).toBe('string');
				expect(typeof wikiBook.name).toBe('string');
				expect(typeof wikiBook.title).toBe('string');
				expect(typeof wikiBook.count).toBe('number');
				expect(typeof wikiBook.ownedBy).toBe('string');
				
				// Verify non-empty values
				expect(wikiBook.id.length).toBeGreaterThan(0);
				expect(wikiBook.name.length).toBeGreaterThan(0);
				expect(wikiBook.title.length).toBeGreaterThan(0);
				expect(wikiBook.count).toBeGreaterThanOrEqual(0);
				expect(wikiBook.ownedBy.length).toBeGreaterThan(0);
			});
		});

		it('handles optional initialPageName property', async () => {
			// The mock data doesn't include initialPageName, so it should be undefined
			const result = await wikiBooksService.listBooks();

			result.forEach((wikiBook: WikiBook) => {
				// initialPageName is optional and should be undefined in our mock data
				expect(wikiBook.initialPageName).toBeUndefined();
			});
		});

		it('correctly uses the serviceName property', () => {
			// Test that the service uses the correct endpoint
			expect(wikiBooksService.serviceName).toBe('wikis');
		});

		it('handles large number of wikis', async () => {
			// This test verifies the service can handle multiple wikis
			// and that sorting works correctly with the actual data
			const result = await wikiBooksService.listBooks();

			// Verify sorting logic with actual data
			for (let i = 1; i < result.length; i++) {
				const current = result[i];
				const previous = result[i - 1];
				
				if (current && previous) {
					expect(current.name >= previous.name).toBe(true);
				}
			}
		});

		it('preserves all data from API response', async () => {
			const result = await wikiBooksService.listBooks();

			// Verify that specific mock data values are preserved
			const umeWiki = result.find(wiki => wiki.name === 'ume');
			const squeakWiki = result.find(wiki => wiki.name === 'squeak');

			expect(umeWiki).toMatchObject({
				id: '4mmw6ztlrzrrr1nv9hszjk3vy',
				title: 'ume wiki',
				name: 'ume',
				count: 6,
				ownedBy: '4saYpbYbngfMl6N4YPLWn8kJHAC2'
			});

			expect(squeakWiki).toMatchObject({
				id: 'a3g5xislem5pgvmqxga6qus18',
				title: 'squeak wiki',
				name: 'squeak',
				count: 1,
				ownedBy: '4saYpbYbngfMl6N4YPLWn8kJHAC2'
			});
		});
	});
});