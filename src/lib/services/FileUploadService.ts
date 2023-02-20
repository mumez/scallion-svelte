import BaseService from './BaseService';

import WebDav from '@/utils/WebDav';
import appConfig from '@/configs';

import UserService from '@/services/UserService';
const userService = new UserService();

const webDav = new WebDav({jwt: userService.loadToken()});
const rootUri =  appConfig.webDav.rootUri;

class FileUploadService extends BaseService {
    public async files() {
        return await webDav.propfind(rootUri);
    }

    public async uploadFiles(files: File[]) {
        files.forEach((each) => {
            webDav.put(`${rootUri}/${each.name}`, each);
        });
    }
}

export default FileUploadService;
