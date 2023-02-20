export default class WebDavEntry {
    public name: string;
    public href: string;
    public contentType: string;
    public contentLength: number;
    public lastModified: string;
    public etag: string;
    public status: string;
    public isDirectory: boolean;

    constructor() {
        this.name = '';
        this.href = '';
        this.contentType = '';
        this.contentLength = 0;
        this.lastModified = '';
        this.etag = '';
        this.status = '';
        this.isDirectory = false;
    }
}
