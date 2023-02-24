import ky from 'ky';

export class WebApiAccessor {
    protected headers: object = {};
    protected ky: typeof ky;
    protected baseUrl = '';

    constructor(headers: { jwt: string } = { jwt: '' }, baseUrl = '') {
        this.headers = headers;
        this.baseUrl = baseUrl;
        this.ky = ky.extend({
            hooks: {
                beforeRequest: [
                    (request) => {
                        request.headers.set('Authorization', `Bearer ${headers.jwt}`);
                    },
                ],
            },
        });
    }

    public async get(url: string): Promise<any> {
        const resp = await this.ky(url, {
            method: 'GET',
            mode: 'cors',
        });
        return resp.json();
    }

    public async post(url: string, body: body): Promise<boolean> {
        const resp = await this.ky(url, {
            method: 'PUT',
            body: body,
            mode: 'cors',
        });
        return (resp.ok && resp.status === 201);
    }

    public async put(url: string, body: body): Promise<boolean> {
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
