import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RetrieveDevicesQuery } from '../query/devices.query';
import { IRelation, TargetVariant } from '../../model/relation.model';
import { IDevice } from '../../model/device.model';

@QueryHandler(RetrieveDevicesQuery)
export class RetrieveDevicesQueryHandler implements IQueryHandler<RetrieveDevicesQuery> {
    private pageSize = 10000;
    private showDevicesDistance = 75 * 1000; // 75 km.

    constructor(
        @InjectModel('Device') private model: Model<IDevice>,
        @InjectModel('Relation') private relationModel: Model<IRelation>,
    ) {}

    getPointDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        if ((lat1 === lat2) && (lon1 === lon2)) {
            return 0;
        } else {
            const radLat1 = Math.PI * lat1 / 180;
            const radLat2 = Math.PI * lat2 / 180;
            const theta = lon1 - lon2;
            const radTheta = Math.PI * theta / 180;

            let dist = Math.sin(radLat1) * Math.sin(radLat2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = dist * 180 / Math.PI;
            dist = dist * 60 * 1.1515;
            dist = dist * 1609.344;

            return dist;
        }
    }

    async execute(retrieveDevicesQuery: RetrieveDevicesQuery): Promise<any> {
        const locationFilter: Record<string, any> = {};
        const legalEntityFilter: Record<string, any> = {};

        if (retrieveDevicesQuery.bottomLeftLongitude && retrieveDevicesQuery.bottomLeftLatitude &&
            retrieveDevicesQuery.upperRightLongitude && retrieveDevicesQuery.upperRightLatitude) {
            const pointDistance = this.getPointDistance(retrieveDevicesQuery.bottomLeftLatitude,
                retrieveDevicesQuery.bottomLeftLongitude, retrieveDevicesQuery.upperRightLatitude,
                retrieveDevicesQuery.upperRightLongitude);

            locationFilter.location = {
                $geoWithin: {
                    $box: [
                        [retrieveDevicesQuery.bottomLeftLongitude, retrieveDevicesQuery.bottomLeftLatitude],
                        [retrieveDevicesQuery.upperRightLongitude, retrieveDevicesQuery.upperRightLatitude],
                    ],
                },
            };

            if (pointDistance > this.showDevicesDistance) {
                if (retrieveDevicesQuery.requestLegalEntityId) {
                    const relationFilter = {
                        legalEntityId: retrieveDevicesQuery.requestLegalEntityId,
                        targetVariant: TargetVariant.DEVICE,
                    };
                    const myRelations = await this.relationModel.find(relationFilter);
                    const myDeviceIds = myRelations.map((x) => x.targetId);
                    legalEntityFilter._id = {
                        $in: myDeviceIds,
                    };
                }
            }
        } else if (retrieveDevicesQuery.legalEntityId) {
            const relationFilter = {
                legalEntityId: retrieveDevicesQuery.legalEntityId,
                targetVariant: TargetVariant.DEVICE,
            };
            const myRelations = await this.relationModel.find(relationFilter);
            const myDeviceIds = myRelations.map((x) => x.targetId);
            legalEntityFilter._id = {
                $in: myDeviceIds,
            };
        }

        const start = retrieveDevicesQuery.pageIndex ? retrieveDevicesQuery.pageIndex * this.pageSize : 0;
        const stop = start + this.pageSize;

        let deviceFilter: Record<string, any>;
        const hasLocationFilter = Object.keys(locationFilter).length > 0;
        const hasLegalEntityFilter = Object.keys(legalEntityFilter).length > 0;
        if (hasLocationFilter && hasLegalEntityFilter) {
            deviceFilter = {
                $or: [
                    hasLocationFilter,
                    hasLegalEntityFilter,
                ],
            };
        } else if (hasLocationFilter) {
            deviceFilter = locationFilter;
        } else if (hasLegalEntityFilter) {
            deviceFilter = legalEntityFilter;
        } else {
            deviceFilter = {};
        }

        return deviceFilter ? this.model.find(deviceFilter, {}, { skip: start, limit: stop }) : [];
    }
}
