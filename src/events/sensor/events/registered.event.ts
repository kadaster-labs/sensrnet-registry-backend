import { Event } from '../../../event-store/event';
import { LocationBody } from '../../../commands/sensor/models/bodies/location-body';

export class SensorRegistered extends Event {
  constructor(aggregatedId: string, nodeId: string, ownerIds: string[],
              name: string, location: LocationBody, aim: string, description: string,
              manufacturer: string, active: boolean, observationArea: object,
              documentationUrl: string, theme: string[], typeName: string,
              typeDetails: object) {
    super(`sensor-${aggregatedId}`, SensorRegistered.name, {
      sensorId: aggregatedId,
      nodeId,
      ownerIds,
      name,
      location,
      aim,
      description,
      manufacturer,
      active,
      observationArea,
      documentationUrl,
      theme,
      typeName,
      typeDetails,
    });
  }
}
