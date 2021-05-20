interface SensorState {
  sensorId: string;
}

interface DataStreamState {
  dataStreamId: string;
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

  dataStreams: DataStreamState[];

  addDataStream(dataStreamId: string): void;
  removeDataStream(dataStreamId: string): void;
  hasDataStream(dataStreamId: string): boolean;

  addObservationGoalId(dataStreamId: string, observationGoalId: string): void;
  removeObservationGoalId(dataStreamId: string, observationGoalId: string): void;
  hasObservationGoalId(dataStreamId: string, observationGoalId: string): boolean;
}

export class DeviceStateImpl implements DeviceState {
  public location;
  public sensors = [];
  public dataStreams = [];

  constructor(
      public readonly id: string,
      public readonly legalEntityId: string,
  ) {}

  addSensor(sensorId: string): void {
    this.sensors.push({ sensorId });
  }

  removeSensor(sensorId: string): void {
    this.sensors = this.sensors.filter(x => x.sensorId !== sensorId);
  }

  hasSensor(sensorId: string): boolean {
    return this.sensors.some(x => x.sensorId === sensorId);
  }

  addDataStream(dataStreamId: string): void {
    this.dataStreams.push({ dataStreamId, observationGoalIds: [] });
  }

  removeDataStream(dataStreamId: string): void {
    this.dataStreams = this.dataStreams.filter(x => x.dataStreamId !== dataStreamId);
  }

  hasDataStream(dataStreamId: string): boolean {
    return this.dataStreams.some(x => x.dataStreamId === dataStreamId);
  }

  addObservationGoalId(dataStreamId: string, observationGoalId: string): void {
    this.dataStreams
        .filter(x => x.dataStreamId === dataStreamId)
        .forEach(x => x.observationGoalIds.push(observationGoalId));
  }

  removeObservationGoalId(dataStreamId: string, observationGoalId: string): void {
    this.dataStreams
        .filter(x => x.dataStreamId === dataStreamId)
        .forEach(x => x.observationGoalIds = x.observationGoalIds.filter(y => y !== observationGoalId));
  }

  hasObservationGoalId(dataStreamId: string, observationGoalId: string): boolean {
    return this.dataStreams
        .filter(x => x.dataStreamId === dataStreamId)
        .some(x => x.observationGoalIds.includes(observationGoalId));
  }
}
