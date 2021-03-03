import { Logger } from '@nestjs/common';
import { Event } from '../../event-store/event';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { IRelation } from '../model/relation.model';
import { Model } from 'mongoose';

export abstract class AbstractProcessor {
    protected logger: Logger = new Logger(this.constructor.name);

    protected constructor(
        protected readonly eventStore: EventStorePublisher,
        protected readonly relationModel: Model<IRelation>,
    ) {}

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    protected static defined(value: any): boolean {
        return typeof value !== 'undefined' && value !== null;
    }

    protected errorCallback(event: Event): void {
        if (event) {
            this.logError(event);
        }
    }

    protected logError(event: Event): void {
        this.logger.error(`Error while updating projection for ${event.aggregateId}.`);
    }

    public async saveRelation(legalEntityId: string, relationVariant: number, deviceId: string): Promise<IRelation> {
        let relation: IRelation;
        try {
            relation = await new this.relationModel({legalEntityId, relationVariant, deviceId}).save();
        } catch (e) {
            Logger.error(e);
        }

        return relation;
    }

    public async deleteRelations(deviceId: string): Promise<void> {
        try {
            await this.relationModel.deleteMany({deviceId});
        } catch (e) {
            Logger.error(e);
        }
    }

    abstract process(event: Event, originSync: boolean): Promise<void>;
}
