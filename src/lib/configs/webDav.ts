import { PUBLIC_WEBDAV_BASE_URL } from '$env/static/public';

const webDavConfig = {
	baseUrl: PUBLIC_WEBDAV_BASE_URL || 'http://localhost:2016/dav/'
};

export default webDavConfig;
