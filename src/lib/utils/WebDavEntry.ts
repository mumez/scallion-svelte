export default interface WebDavEntry {
	name: string;
	href: string;
	contentType?: string;
	contentLength?: number;
	etag?: string;
	lastModified: string;
	status: string;
	isDirectory: boolean;
}