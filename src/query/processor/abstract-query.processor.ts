import { Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { AbstractProcessor } from '../../commons/event-processing/abstract.processor';
import { EventStorePublisher } from '../../commons/event-store/event-store.publisher';
import { IRelation } from '../model/relation.schema';

export abstract class AbstractQueryProcessor extends AbstractProcessor {
    protected constructor(
        protected readonly eventStore: EventStorePublisher,
        protected readonly relationModel: Model<IRelation>,
    ) {
        super(eventStore);
    }

    public async saveRelation(
        legalEntityId: string,
        relationVariant: number,
        targetVariant: number,
        targetId: string,
    ): Promise<IRelation> {
        let relation: IRelation;
        try {
            relation = await new this.relationModel({ legalEntityId, relationVariant, targetVariant, targetId }).save();
        } catch (e) {
            Logger.error(e);
        }

        return relation;
    }

    public async deleteRelations(legalEntityId: string, targetVariant: number, targetId: string): Promise<void> {
        try {
            await this.relationModel.deleteMany({ legalEntityId, targetVariant, targetId });
        } catch (e) {
            Logger.error(e);
        }
    }
}
