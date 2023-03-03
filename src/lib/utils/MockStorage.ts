const MockStorage = {
	async put(key: string, value: string) {
		await null;
		return localStorage.setItem(key, value);
	},
	async get(key: string) {
		await null;
		return localStorage.getItem(key);
	}
};

export default MockStorage;
