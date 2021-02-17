import { Model } from 'mongoose';
import { ISensor } from '../../model/sensor.model';
import { InjectModel } from '@nestjs/mongoose';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { RetrieveSensorsQuery } from '../query/sensors.query';
import { IRelation, ObjectVariant } from '../../model/relation.model';

@QueryHandler(RetrieveSensorsQuery)
export class RetrieveSensorsQueryHandler implements IQueryHandler<RetrieveSensorsQuery> {
    private pageSize = 10000;
    private showSensorsDistance = 75 * 1000; // 75 km.

    constructor(
        @InjectModel('Sensor') private model: Model<ISensor>,
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

    async execute(retrieveSensorsQuery: RetrieveSensorsQuery): Promise<any> {
        const locationFilter: Record<string, any> = {};
        const legalEntityFilter: Record<string, any> = {};

        if (retrieveSensorsQuery.bottomLeftLongitude && retrieveSensorsQuery.bottomLeftLatitude &&
            retrieveSensorsQuery.upperRightLongitude && retrieveSensorsQuery.upperRightLatitude) {
            const pointDistance = this.getPointDistance(retrieveSensorsQuery.bottomLeftLatitude,
                retrieveSensorsQuery.bottomLeftLongitude, retrieveSensorsQuery.upperRightLatitude,
                retrieveSensorsQuery.upperRightLongitude);

            locationFilter.location = {
                $geoWithin: {
                    $box: [
                        [retrieveSensorsQuery.bottomLeftLongitude, retrieveSensorsQuery.bottomLeftLatitude],
                        [retrieveSensorsQuery.upperRightLongitude, retrieveSensorsQuery.upperRightLatitude],
                    ],
                },
            };

            if (pointDistance > this.showSensorsDistance) {
                if (retrieveSensorsQuery.requestLegalEntityId) {
                    const relationFilter = {
                        legalEntityId: retrieveSensorsQuery.requestLegalEntityId,
                        objectVariant: ObjectVariant.SENSOR,
                    };
                    const myRelations = await this.relationModel.find(relationFilter);
                    const mySensorIds = myRelations.map((x) => x.objectId);
                    legalEntityFilter._id = {
                        $in: mySensorIds,
                    };
                }
            }
        } else if (retrieveSensorsQuery.legalEntityId) {
            const relationFilter = {
                legalEntityId: retrieveSensorsQuery.legalEntityId,
                objectVariant: ObjectVariant.SENSOR,
            };
            const relations = await this.relationModel.find(relationFilter);
            const sensorIds = relations.map((x) => x.objectId);
            legalEntityFilter._id = {
                $in: sensorIds,
            };
        }

        const start = retrieveSensorsQuery.pageIndex ? retrieveSensorsQuery.pageIndex * this.pageSize : 0;
        const stop = start + this.pageSize;

        let sensorFilter: Record<string, any>;
        const hasLocationFilter = Object.keys(locationFilter).length > 0;
        const hasLegalEntityFilter = Object.keys(legalEntityFilter).length > 0;
        if (hasLocationFilter && hasLegalEntityFilter) {
            sensorFilter = {
                $or: [
                    hasLocationFilter,
                    hasLegalEntityFilter,
                ],
            };
        } else if (hasLocationFilter) {
            sensorFilter = locationFilter;
        } else if (hasLegalEntityFilter) {
            sensorFilter = legalEntityFilter;
        } else {
            sensorFilter = {};
        }

        return sensorFilter ? this.model.find(sensorFilter, {}, { skip: start, limit: stop }) : [];
    }
}
