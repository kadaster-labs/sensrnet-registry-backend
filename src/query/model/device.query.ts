import { IQuery } from '@nestjs/cqrs';

export class RetrieveDeviceQuery implements IQuery {
    constructor(public readonly id: string) {}
}
