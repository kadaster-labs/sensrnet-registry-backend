import { IQuery } from "@nestjs/cqrs";


export class RetrieveOwnersQuery implements IQuery{
    constructor(
        public readonly id: string,
    ) {}
}
