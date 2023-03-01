import ky from 'ky';

export class WebApiAccessor {
    protected ky: typeof ky;

    constructor(baseUrl = '') {
        this.ky = ky.create({ prefixUrl: baseUrl });
    }

    public setJwt(jwt: string) {
        this.ky = this.ky.extend({
            headers: {
                authorization: `Bearer ${jwt}`
            }
        });
    }

    public async get(url: string): Promise<unknown> {
        return (await this.request('GET', url)).json();
    }

    public async post(url: string, body: BodyInit): Promise<boolean> {
        return (await this.updateRequest('POST', url, body)).json();
    }

    public async put(url: string, body: BodyInit): Promise<unknown> {
        return (await this.updateRequest('PUT', url, body)).json();
    }

    public async delete(url: string): Promise<boolean> {
        const resp = await this.request('DELETE', url);
        return (resp.ok && resp.status === 201);
    }

    private async request(method: string, url: string) {
        const resp = await this.ky(url, {
            method: method,
            mode: 'cors',
        });
        return resp;
    }
    private async updateRequest(method: string, url: string, body: BodyInit) {
        const resp = await this.ky(url, {
            method: method,
            body: body,
            mode: 'cors',
        });
        return resp;
    }

}

export default WebApiAccessor;
