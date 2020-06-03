import {SensorEvent} from './sensor.event';

export class SensorRegistered extends SensorEvent {

  readonly nodeId: string;
  readonly ownerIds: string[];
  readonly name: string;
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly epsgCode: number;
  readonly baseObjectId: string;
  readonly aim: string;
  readonly description: string;
  readonly manufacturer: string;
  readonly active: boolean;
  readonly observationArea: object;
  readonly documentationUrl: string;
  readonly theme: string[];
  readonly typeName: string;
  readonly typeDetails: object;

  constructor(sensorId: string, nodeId: string, ownerIds: string[],
              name: string, x: number, y: number, z: number, epsgCode: number,
              baseObjectId: string, aim: string, description: string,
              manufacturer: string, active: boolean, observationArea: object,
              documentationUrl: string, theme: string[], typeName: string,
              typeDetails: object) {
    super(sensorId);
    this.nodeId = nodeId;
    this.ownerIds = ownerIds;
    this.name = name;
    this.x = x;
    this.y = y;
    this.z = z;
    this.epsgCode = epsgCode;
    this.baseObjectId = baseObjectId;
    this.aim = aim;
    this.description = description;
    this.manufacturer = manufacturer;
    this.active = active;
    this.observationArea = observationArea;
    this.documentationUrl = documentationUrl;
    this.theme = theme;
    this.typeName = typeName;
    this.typeDetails = typeDetails;
  }
}
