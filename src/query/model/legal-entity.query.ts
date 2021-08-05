import { IQuery } from '@nestjs/cqrs';

export class LegalEntityQuery implements IQuery {
    constructor(
        public readonly id: string,
    ) {}
}
