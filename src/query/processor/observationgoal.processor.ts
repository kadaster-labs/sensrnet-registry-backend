import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IRelation } from '../model/relation.model';
import { AbstractProcessor } from './abstract.processor';
import { IObservationGoal } from '../model/observation-goal.model';
import { EventStorePublisher } from '../../event-store/event-store.publisher';
import { ObservationGoalEvent } from '../../core/events/observation-goal/observation-goal.event';
import { ObservationGoalRegistered, ObservationGoalRemoved, ObservationGoalUpdated } from '../../core/events/observation-goal';

@Injectable()
export class ObservationGoalProcessor extends AbstractProcessor {

  constructor(
    eventStore: EventStorePublisher,
    @InjectModel('Relation') public relationModel: Model<IRelation>,
    @InjectModel('ObservationGoal') private observationGoalModel: Model<IObservationGoal>,
  ) {
    super(eventStore, relationModel);
  }

  async process(event: ObservationGoalEvent): Promise<void> {
    if (event instanceof ObservationGoalRegistered) {
      await this.processObservationGoalRegistered(event);
    } else if (event instanceof ObservationGoalUpdated) {
      await this.processObservationGoalUpdated(event);
    } else if (event instanceof ObservationGoalRemoved) {
      await this.processObservationGoalRemoved(event);
    }
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
    } catch {
      this.errorCallback(event);
    }
  }

  async processObservationGoalUpdated(event: ObservationGoalUpdated): Promise<void> {
    const observationGoalUpdate: Record<string, any> = {};
    if (AbstractProcessor.defined(event.name)) {
      observationGoalUpdate.name = event.name;
    }
    if (AbstractProcessor.defined(event.description)) {
      observationGoalUpdate.description = event.description;
    }
    if (AbstractProcessor.defined(event.legalGround)) {
      observationGoalUpdate.legalGround = event.legalGround;
    }
    if (AbstractProcessor.defined(event.legalGroundLink)) {
      observationGoalUpdate.legalGroundLink = event.legalGroundLink;
    }

    try {
      await this.observationGoalModel.updateOne({ _id: event.observationGoalId }, { $set: observationGoalUpdate });
    } catch {
      this.errorCallback(event);
    }
  }

  async processObservationGoalRemoved(event: ObservationGoalRemoved): Promise<void> {
    try {
      await this.observationGoalModel.deleteOne({ _id: event.observationGoalId });
      await this.eventStore.deleteStream(ObservationGoalEvent.getStreamName(ObservationGoalEvent.streamRootValue,
          event.observationGoalId));
    } catch {
      this.errorCallback(event);
    }
  }

}
