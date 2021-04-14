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
    ) { }

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

    async execute(query: RetrieveDevicesQuery): Promise<any> {
        let myDeviceIds;
        if (query.requestLegalEntityId) {
            const relationFilter = {
                legalEntityId: query.requestLegalEntityId,
                targetVariant: TargetVariant.DEVICE,
            };
            const myRelations = await this.relationModel.find(relationFilter);
            myDeviceIds = myRelations.map(x => x.targetId);
        } else {
            myDeviceIds = [];
        }
        const myDeviceIdsSet = new Set(myDeviceIds);

        let locationFilter: Record<string, any> = {};
        const legalEntityFilter: Record<string, any> = {};

        if (query.bottomLeftLongitude && query.bottomLeftLatitude &&
            query.upperRightLongitude && query.upperRightLatitude) {
            const pointDistance = this.getPointDistance(query.bottomLeftLatitude,
                query.bottomLeftLongitude, query.upperRightLatitude,
                query.upperRightLongitude);

            locationFilter.location = {
                $geoWithin: {
                    $box: [
                        [query.bottomLeftLongitude, query.bottomLeftLatitude],
                        [query.upperRightLongitude, query.upperRightLatitude],
                    ],
                },
            };

            if (pointDistance > this.showDevicesDistance) {
                if (query.requestLegalEntityId) {
                    legalEntityFilter._id = {
                        $in: myDeviceIds,
                    };
                } else {
                    locationFilter = null;
                }
            }
        } else if (query.legalEntityId) {
            const relationFilter = {
                legalEntityId: query.legalEntityId,
                targetVariant: TargetVariant.DEVICE,
            };
            const relations = await this.relationModel.find(relationFilter);
            const deviceIds = relations.map((x) => x.targetId);
            legalEntityFilter._id = {
                $in: deviceIds,
            };
        }

        const pageSize = typeof query.pageSize === 'undefined' ? this.pageSize : query.pageSize;
        const start = typeof query.pageIndex === 'undefined' ? 0 : query.pageIndex * pageSize;

        let deviceFilter: Record<string, any>;
        const hasLocationFilter = locationFilter && Object.keys(locationFilter).length;
        const hasLegalEntityFilter = legalEntityFilter && Object.keys(legalEntityFilter).length;
        if (hasLocationFilter && hasLegalEntityFilter) {
            deviceFilter = { $and: [locationFilter, legalEntityFilter] };
        } else if (hasLocationFilter) {
            deviceFilter = locationFilter;
        } else if (hasLegalEntityFilter) {
            deviceFilter = legalEntityFilter;
        } else {
            deviceFilter = {};
        }

        const options: Record<string, any> = {
            skip: start, limit: pageSize,
        };
        if (query.sortField) {
            options.sort = {};
            options.sort[query.sortField] = query.sortDirection === 'DESCENDING' ? -1 : 1;
        }

        const devices = [];
        if (deviceFilter && Object.keys(deviceFilter).length) {
            const mongoDevices = await this.model.find(deviceFilter, {}, options);
            for (const device of mongoDevices) {
                devices.push({ canEdit: myDeviceIdsSet.has(device._id), ...device.toObject() });
            }
        }

        return devices;
    }
}
