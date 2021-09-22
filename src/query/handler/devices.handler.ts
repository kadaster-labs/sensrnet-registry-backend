import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, QueryOptions } from 'mongoose';
import { IDevice } from '../model/device.schema';
import { RetrieveDevicesQuery } from '../model/devices.query';
import { IRelation, TargetVariant } from '../model/relation.schema';

@QueryHandler(RetrieveDevicesQuery)
export class RetrieveDevicesQueryHandler implements IQueryHandler<RetrieveDevicesQuery> {
    private pageSize = 1000;
    private showDevicesDistance = 75 * 1000; // 75 km.

    constructor(
        @InjectModel('Device') private model: Model<IDevice>,
        @InjectModel('Relation') private relationModel: Model<IRelation>,
    ) {}

    getPointDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        if (lat1 === lat2 && lon1 === lon2) {
            return 0;
        } else {
            const radLat1 = (Math.PI * lat1) / 180;
            const radLat2 = (Math.PI * lat2) / 180;
            const theta = lon1 - lon2;
            const radTheta = (Math.PI * theta) / 180;

            let dist =
                Math.sin(radLat1) * Math.sin(radLat2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
            if (dist > 1) {
                dist = 1;
            }
            dist = Math.acos(dist);
            dist = (dist * 180) / Math.PI;
            dist = dist * 60 * 1.1515;
            dist = dist * 1609.344;

            return dist;
        }
    }

    async execute(query: RetrieveDevicesQuery): Promise<any> {
        const nameFilter: FilterQuery<IDevice> = {};
        if (query.name) {
            nameFilter.name = { $regex: `^${query.name}` };
        }

        let locationFilter: FilterQuery<IDevice> = {};
        const legalEntityFilter: FilterQuery<IDevice> = {};

        if (
            query.bottomLeftLongitude &&
            query.bottomLeftLatitude &&
            query.upperRightLongitude &&
            query.upperRightLatitude
        ) {
            const pointDistance = this.getPointDistance(
                query.bottomLeftLatitude,
                query.bottomLeftLongitude,
                query.upperRightLatitude,
                query.upperRightLongitude,
            );

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
                    let myDeviceIds: string[];
                    if (query.requestLegalEntityId) {
                        const relationFilter = {
                            legalEntityId: query.requestLegalEntityId,
                            targetVariant: TargetVariant.DEVICE,
                        };
                        const myRelations = await this.relationModel.find(relationFilter, {}, { limit: this.pageSize });
                        myDeviceIds = myRelations.map(x => x.targetId);
                    } else {
                        myDeviceIds = [];
                    }

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
            const myRelations = await this.relationModel.find(relationFilter, {}, { limit: this.pageSize });
            const myDeviceIds = myRelations.map(x => x.targetId);
            legalEntityFilter._id = {
                $in: myDeviceIds,
            };
        }

        const filters = [locationFilter, legalEntityFilter, nameFilter].filter(filter => this.isNotEmptyFilter(filter));

        let deviceFilter: FilterQuery<IDevice>;
        switch (filters.length) {
            case 0:
                deviceFilter = {};
                break;
            case 1:
                deviceFilter = filters[0];
                break;
            default:
                deviceFilter = { $and: filters };
                break;
        }

        const options: QueryOptions = this.buildOptions(query);

        const devices = [];
        if (this.isNotEmptyFilter(deviceFilter)) {
            const mongoDevices = await this.model.find(deviceFilter, {}, options);
            const targetIds = mongoDevices.map(x => x._id);

            const relationFilter = {
                legalEntityId: query.requestLegalEntityId,
                targetVariant: TargetVariant.DEVICE,
                targetId: { $in: targetIds },
            };
            const myRelations = await this.relationModel.find(
                relationFilter,
                { targetId: 1 },
                { limit: this.pageSize },
            );
            const myTargetIds = new Set(myRelations.map(x => x.targetId));
            for (const device of mongoDevices) {
                devices.push({ canEdit: myTargetIds.has(device._id), ...device.toObject() });
            }
        }

        return devices;
    }

    getFilterOrUndefined(filter: FilterQuery<IDevice>): FilterQuery<IDevice> | undefined {
        return this.isNotEmptyFilter(filter) ? filter : undefined;
    }

    private buildOptions(query: RetrieveDevicesQuery) {
        const pageSize = typeof query.pageSize === 'undefined' ? this.pageSize : query.pageSize;
        const start = typeof query.pageIndex === 'undefined' ? 0 : query.pageIndex * pageSize;

        const options: QueryOptions = {
            skip: start,
            limit: pageSize,
        };
        if (query.sortField) {
            options.sort = {};
            options.sort[query.sortField] = query.sortDirection === 'DESCENDING' ? -1 : 1;
        }
        return options;
    }

    private isNotEmptyFilter(filter: FilterQuery<IDevice>) {
        return filter && Object.keys(filter).length;
    }
}
