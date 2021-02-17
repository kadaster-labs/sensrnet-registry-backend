import { Event } from '../../../event-store/event';

export abstract class DataStreamEvent extends Event {

  static streamRootValue = 'datastream';

  readonly dataStreamId: string;

  protected constructor(dataStreamId: string, version: string) {
    super(dataStreamId, version);

    this.dataStreamId = dataStreamId;
  }

  streamRoot(): string {
    return DataStreamEvent.streamRootValue;
  }

}
