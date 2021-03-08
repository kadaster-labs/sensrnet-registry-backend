import { UserinfoResponse } from 'openid-client';

export class UserToken implements Express.User {
    readonly id_token: string;
    readonly access_token: string;
    readonly refresh_token: string;
    readonly userinfo: UserinfoResponse;
}
