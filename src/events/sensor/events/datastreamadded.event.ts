import { Event } from '../../../event-store/event';

export class DatastreamAdded extends Event {
  constructor(aggregatedId: string, dataStreamId: string, name: string, reason: string, description: string,
              observedProperty: string, unitOfMeasurement: string, isPublic: boolean, isOpenData: boolean,
              isReusable: boolean, documentationUrl: string, dataLink: string,
              dataFrequency: number, dataQuality: number) {
    super(`sensor-${aggregatedId}`, DatastreamAdded.name, {
      sensorId: aggregatedId,
      dataStreamId,
      name,
      reason,
      description,
      observedProperty,
      unitOfMeasurement,
      isPublic,
      isOpenData,
      isReusable,
      documentationUrl,
      dataLink,
      dataFrequency,
      dataQuality,
    });
  }
}
