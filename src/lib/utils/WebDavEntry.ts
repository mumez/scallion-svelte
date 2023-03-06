export default interface WebDavEntry {
	name: string;
	contentType?: string;
	contentLength: number;
	etag?: string;
	lastModified: string;
	href: string;
	status: string;
	isDirectory: boolean;
}