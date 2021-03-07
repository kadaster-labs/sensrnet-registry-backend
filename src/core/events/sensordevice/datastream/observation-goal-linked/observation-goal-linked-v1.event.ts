import { SensorDeviceEvent } from '../../sensordevice.event';

export class ObservationGoalLinked extends SensorDeviceEvent {
    static version = '1';

    readonly dataStreamId: string;
    readonly observationGoalId: string;

    constructor(deviceId: string, datastreamId: string, observationGoalId: string) {
        super(deviceId, ObservationGoalLinked.version);
        this.dataStreamId = datastreamId;
        this.observationGoalId = observationGoalId;
    }
}
