import { IQuery } from "@nestjs/cqrs";


export class RetrieveSensorQuery implements IQuery{
    constructor(
        public readonly id: string,
    ) {}
}
