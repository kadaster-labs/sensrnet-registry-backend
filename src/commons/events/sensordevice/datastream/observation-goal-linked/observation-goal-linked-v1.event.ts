import { SensorDeviceEvent } from '../../sensordevice.event';

export class ObservationGoalLinked extends SensorDeviceEvent {
    static version = '1';

    readonly sensorId: string;
    readonly legalEntityId: string;
    readonly datastreamId: string;
    readonly observationGoalId: string;

    constructor(sensorDeviceId: string, sensorId: string, legalEntityId: string, datastreamId: string,
                observationGoalId: string) {
        super(sensorDeviceId, ObservationGoalLinked.version);
        this.sensorId = sensorId;
        this.legalEntityId = legalEntityId;
        this.datastreamId = datastreamId;
        this.observationGoalId = observationGoalId;
    }
}
