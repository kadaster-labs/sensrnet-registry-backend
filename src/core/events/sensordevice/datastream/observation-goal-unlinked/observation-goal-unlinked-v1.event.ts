import { SensorDeviceEvent } from '../../sensordevice.event';

export class ObservationGoalUnlinked extends SensorDeviceEvent {
    static version = '1';

    readonly dataStreamId: string;
    readonly observationGoalId: string;

    constructor(sensorDeviceId: string, datastreamId: string, observationGoalId: string) {
        super(sensorDeviceId, ObservationGoalUnlinked.version);
        this.dataStreamId = datastreamId;
        this.observationGoalId = observationGoalId;
    }
}
