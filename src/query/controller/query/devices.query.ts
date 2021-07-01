import { IQuery } from '@nestjs/cqrs';

export class RetrieveDevicesQuery implements IQuery {
    constructor(
        public readonly requestLegalEntityId?: string,
        public readonly bottomLeftLongitude?: number,
        public readonly bottomLeftLatitude?: number,
        public readonly upperRightLongitude?: number,
        public readonly upperRightLatitude?: number,
        public readonly pageIndex?: number,
        public readonly pageSize?: number,
        public readonly legalEntityId?: string,
        public readonly sortField?: string,
        public readonly sortDirection?: string,
        public readonly name?: string,
    ) {}
}
