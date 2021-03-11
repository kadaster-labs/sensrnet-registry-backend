import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { IDevice } from '../../model/device.model';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RetrieveDevicesQuery } from '../query/devices.query';
import { IRelation, TargetVariant } from '../../model/relation.model';

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
        let myDeviceIds;
        if (retrieveDevicesQuery.requestLegalEntityId) {
            const relationFilter = {
                legalEntityId: retrieveDevicesQuery.requestLegalEntityId,
                targetVariant: TargetVariant.DEVICE,
            };
            const myRelations = await this.relationModel.find(relationFilter);
            myDeviceIds = myRelations.map((x) => x.targetId);
        } else {
            myDeviceIds = [];
        }
        const myDeviceIdsSet = new Set(myDeviceIds);

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
            const relations = await this.relationModel.find(relationFilter);
            const deviceIds = relations.map((x) => x.targetId);
            legalEntityFilter._id = {
                $in: deviceIds,
            };
        }

        const start = retrieveDevicesQuery.pageIndex ? retrieveDevicesQuery.pageIndex * this.pageSize : 0;
        const stop = start + this.pageSize;

        let deviceFilter: Record<string, any>;
        const hasLocationFilter = Object.keys(locationFilter).length > 0;
        const hasLegalEntityFilter = Object.keys(legalEntityFilter).length > 0;
        if (hasLocationFilter && hasLegalEntityFilter) {
            deviceFilter = {
                $and: [
                    locationFilter,
                    legalEntityFilter,
                ],
            };
        } else if (hasLocationFilter) {
            deviceFilter = locationFilter;
        } else if (hasLegalEntityFilter) {
            deviceFilter = legalEntityFilter;
        } else {
            deviceFilter = {};
        }

        const devices = [];
        if (deviceFilter) {
            const mongoDevices = await this.model.find(deviceFilter, {}, { skip: start, limit: stop });
            for (const device of mongoDevices) {
                devices.push({canEdit: myDeviceIdsSet.has(device._id), ...device.toObject()});
            }
        }

        return devices;
    }
}
