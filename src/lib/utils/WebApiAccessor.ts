import ky from 'ky';

export class WebApiAccessor {
    protected ky: typeof ky;

    constructor(baseUrl = '') {
        this.ky = ky.create({ prefixUrl: baseUrl });
    }

    public setJwt(jwt: string) {
        this.ky = ky.extend({
            headers: {
                authorization: `Bearer ${jwt}`
            }
        });
    }

    public async get(url: string): Promise<unknown> {
        const resp = await this.ky(url, {
            method: 'GET',
            mode: 'cors',
        });
        return resp.json();
    }

    public async post(url: string, body: BodyInit): Promise<boolean> {
        const resp = await this.ky(url, {
            method: 'PUT',
            body: body,
            mode: 'cors',
        });
        return (resp.ok && resp.status === 201);
    }

    public async put(url: string, body: BodyInit): Promise<boolean> {
        const resp = await this.ky(url, {
            method: 'PUT',
            body: body,
            mode: 'cors',
        });
        return (resp.ok && resp.status === 201);
    }

    public async delete(url: string): Promise<boolean> {
        const resp = await this.ky(url, {
            method: 'DELETE',
            mode: 'cors',
        });
        return (resp.ok && resp.status === 201);
    }

}

export default WebApiAccessor;
