import { describe, it, expect, vi } from 'vitest';
import WikiBookService from '../WikiBookService';
import { server } from '../../mocks/node';

describe('WikiBookService', () => {
	it('should get wiki book description', async () => {
		const service = new WikiBookService('ume');
		const result = await service.getDescription();
		
		expect(result).toMatchObject({
			name: 'ume',
			title: 'ume wiki',
			count: 6,
			ownedBy: '4saYpbYbngfMl6N4YPLWn8kJHAC2'
		});
	});

	it('should check page existence', async () => {
		const service = new WikiBookService('ume');
		const result = await service.hasPages(['index', 'nonexistent', 'test1']);
		
		expect(result).toEqual([true, false, true]);
	});

	it('should handle non-existent wiki', async () => {
		const service = new WikiBookService('nonexistent');
		const result = await service.getDescription();
		
		expect(result).toEqual({});
	});
});