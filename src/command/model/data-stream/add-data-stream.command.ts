import Datastream from '../../interfaces/datastream.interface';
import { AbstractDatastreamCommand } from './abstract-datastream.command';

export class AddDatastreamCommand extends AbstractDatastreamCommand {
    constructor(
        public readonly deviceId: string,
        public readonly sensorId: string,
        public readonly legalEntityId: string,
        datastream: Datastream,
    ) {
        super(deviceId, sensorId, legalEntityId, datastream);
    }
}
