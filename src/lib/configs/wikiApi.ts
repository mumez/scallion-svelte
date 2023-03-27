import { PUBLIC_WIKI_API_BASE_URL } from '$env/static/public';

const wikiApiConfig = {
	baseUrl: PUBLIC_WIKI_API_BASE_URL || 'http://localhost:2016/api/'
};

export default wikiApiConfig;
