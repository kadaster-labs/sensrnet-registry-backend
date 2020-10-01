import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-anonymous';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AnonymousStrategy extends PassportStrategy(Strategy, 'anonymous') {
    constructor() {
        super();
    }

    authenticate(): any {
        return this.success({});
    }
}
