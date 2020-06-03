import { Event } from '../../../event-store/event';

export class SensorUpdated extends Event {
  constructor(aggregatedId: string, name: string, aim: string, description: string, manufacturer: string,
              observationArea: object, documentationUrl: string, theme: string[], typeName: string, typeDetails: object) {
    super(`sensor-${aggregatedId}`, SensorUpdated.name, {
      sensorId: aggregatedId,
      name,
      aim,
      description,
      manufacturer,
      observationArea,
      documentationUrl,
      theme,
      typeName,
      typeDetails,
    });
  }
}
