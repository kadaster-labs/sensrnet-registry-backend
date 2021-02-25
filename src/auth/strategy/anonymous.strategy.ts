import { Injectable } from '@nestjs/common';
import { Strategy } from 'passport-anonymous';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class AnonymousStrategy extends PassportStrategy(Strategy, 'anonymous') {
    constructor() {
        super();
    }

    authenticate(): any {
        return this.success({});
    }
}
