interface SensorState {
    sensorId: string;
}

interface DatastreamState {
    datastreamId: string;
    observationGoalIds: string[];
}

export interface DeviceState {
    id: string;
    legalEntityId: string;

    location?: number[];

    sensors: SensorState[];

    addSensor(sensorId: string): void;
    removeSensor(sensorId: string): void;
    hasSensor(sensorId: string): boolean;

    datastreams: DatastreamState[];

    addDatastream(datastreamId: string): void;
    removeDatastream(datastreamId: string): void;
    hasDatastream(datastreamId: string): boolean;

    addObservationGoalId(datastreamId: string, observationGoalId: string): void;
    removeObservationGoalId(datastreamId: string, observationGoalId: string): void;
    hasObservationGoalId(datastreamId: string, observationGoalId: string): boolean;
}

export class DeviceStateImpl implements DeviceState {
    public location: number[];
    public sensors: SensorState[] = [];
    public datastreams: DatastreamState[] = [];

    constructor(public readonly id: string, public readonly legalEntityId: string) {}

    addSensor(sensorId: string): void {
        this.sensors.push({ sensorId });
    }

    removeSensor(sensorId: string): void {
        this.sensors = this.sensors.filter(x => x.sensorId !== sensorId);
    }

    hasSensor(sensorId: string): boolean {
        return this.sensors.some(x => x.sensorId === sensorId);
    }

    addDatastream(datastreamId: string): void {
        this.datastreams.push({ datastreamId, observationGoalIds: [] });
    }

    removeDatastream(datastreamId: string): void {
        this.datastreams = this.datastreams.filter(x => x.datastreamId !== datastreamId);
    }

    hasDatastream(datastreamId: string): boolean {
        return this.datastreams.some(x => x.datastreamId === datastreamId);
    }

    addObservationGoalId(datastreamId: string, observationGoalId: string): void {
        this.datastreams
            .filter(x => x.datastreamId === datastreamId)
            .forEach(x => x.observationGoalIds.push(observationGoalId));
    }

    removeObservationGoalId(datastreamId: string, observationGoalId: string): void {
        this.datastreams
            .filter(x => x.datastreamId === datastreamId)
            .forEach(x => (x.observationGoalIds = x.observationGoalIds.filter(y => y !== observationGoalId)));
    }

    hasObservationGoalId(datastreamId: string, observationGoalId: string): boolean {
        return this.datastreams
            .filter(x => x.datastreamId === datastreamId)
            .some(x => x.observationGoalIds.includes(observationGoalId));
    }
}
