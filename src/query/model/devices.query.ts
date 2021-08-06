import { IQuery } from '@nestjs/cqrs';
import { RetrieveDevicesParams } from '../api/model/retrieve-devices-params';

export class RetrieveDevicesQuery implements IQuery {
    public readonly bottomLeftLongitude?: number;
    public readonly bottomLeftLatitude?: number;
    public readonly upperRightLongitude?: number;
    public readonly upperRightLatitude?: number;
    public readonly legalEntityId?: string;
    public readonly sortField?: string;
    public readonly sortDirection?: string;
    public readonly name?: string;

    constructor(
        params: RetrieveDevicesParams,
        public readonly requestLegalEntityId?: string,
        public readonly pageIndex?: number,
        public readonly pageSize?: number,
    ) {
        this.bottomLeftLongitude = params.bottomLeftLongitude;
        this.bottomLeftLatitude = params.bottomLeftLatitude;
        this.upperRightLongitude = params.upperRightLongitude;
        this.upperRightLatitude = params.upperRightLatitude;
        this.legalEntityId = params.legalEntityId;
        this.sortField = params.sortField;
        this.sortDirection = params.sortDirection;
        this.name = params.name;
    }
}
