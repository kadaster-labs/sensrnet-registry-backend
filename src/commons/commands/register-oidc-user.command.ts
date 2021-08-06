import { ICommand } from '@nestjs/cqrs';

export class RegisterOidcUserCommand implements ICommand {
    constructor(public readonly id: string, public readonly email: string, public readonly oidc: Record<string, any>) {}
}
