import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventStorePublisher } from '../../commons/event-store/event-store.publisher';
import {
    ObservationGoalRegistered,
    ObservationGoalRemoved,
    ObservationGoalUpdated,
} from '../../commons/events/observation-goal';
import { ObservationGoalEvent } from '../../commons/events/observation-goal/observation-goal.event';
import { IDevice } from '../model/device.schema';
import { IObservationGoal } from '../model/observation-goal.schema';
import { IRelation, RelationVariant, TargetVariant } from '../model/relation.schema';
import { AbstractQueryEsListener } from './abstract-query.es.listener';

@Injectable()
export class ObservationGoalEsListener extends AbstractQueryEsListener {
    constructor(
        eventStore: EventStorePublisher,
        @InjectModel('Device') public deviceModel: Model<IDevice>,
        @InjectModel('Relation') public relationModel: Model<IRelation>,
        @InjectModel('ObservationGoal') private observationGoalModel: Model<IObservationGoal>,
    ) {
        super(eventStore, relationModel);
    }

    async processObservationGoalRegistered(event: ObservationGoalRegistered): Promise<void> {
        const observationGoalData = {
            _id: event.observationGoalId,
            name: event.name,
            description: event.description,
            legalGround: event.legalGround,
            legalGroundLink: event.legalGroundLink,
        };

        try {
            await new this.observationGoalModel(observationGoalData).save();
            await this.saveRelation(
                event.legalEntityId,
                RelationVariant.ACCOUNTABLE,
                TargetVariant.OBSERVATION_GOAL,
                event.observationGoalId,
            );
        } catch {
            this.errorCallback(event);
        }
    }

    async processObservationGoalUpdated(event: ObservationGoalUpdated): Promise<void> {
        const observationGoalUpdate: Record<string, any> = {};
        if (AbstractQueryEsListener.defined(event.name)) {
            observationGoalUpdate.name = event.name;
        }
        if (AbstractQueryEsListener.defined(event.description)) {
            observationGoalUpdate.description = event.description;
        }
        if (AbstractQueryEsListener.defined(event.legalGround)) {
            observationGoalUpdate.legalGround = event.legalGround;
        }
        if (AbstractQueryEsListener.defined(event.legalGroundLink)) {
            observationGoalUpdate.legalGroundLink = event.legalGroundLink;
        }

        try {
            await this.observationGoalModel.updateOne(
                { _id: event.observationGoalId },
                { $set: observationGoalUpdate },
            );
        } catch {
            this.errorCallback(event);
        }
    }

    async processObservationGoalRemoved(event: ObservationGoalRemoved): Promise<void> {
        try {
            const deviceFilter = { 'datastreams.observationGoalIds': event.observationGoalId };
            const deviceUpdate = { $pull: { 'datastreams.$.observationGoalIds': event.observationGoalId } };
            await this.deviceModel.updateMany(deviceFilter, deviceUpdate);

            await this.deleteRelations(event.legalEntityId, TargetVariant.OBSERVATION_GOAL, event.observationGoalId);
            await this.observationGoalModel.deleteOne({ _id: event.observationGoalId });
            const streamName = ObservationGoalEvent.getStreamName(
                ObservationGoalEvent.streamRootValue,
                event.observationGoalId,
            );
            await this.eventStore.deleteStream(streamName);
        } catch {
            this.errorCallback(event);
        }
    }
}
