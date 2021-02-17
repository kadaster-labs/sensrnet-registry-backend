import { UnknowObjectException } from '../../error/unknow-object-exception';
import { validateLegalEntity } from '../../util/legal-entity.utils';
import { RegisterSensorCommand } from '../../../command/sensor/register-sensor.command';
import { SensorAggregate } from '../../../../core/aggregates/sensor.aggregate';
import { LegalEntityRepository } from '../../../../core/repositories/legal-entity.repository';
import { NoLegalEntityException } from '../../error/no-legal-entity-exception';
import { SensorRepository } from '../../../../core/repositories/sensor.repository';
import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { ObjectAlreadyExistsException } from '../../error/object-already-exists-exception';
import { DeviceRepository } from '../../../../core/repositories/device.repository';
import { DataStreamRepository } from '../../../../core/repositories/data-stream.repository';
import { DataStreamAggregate } from '../../../../core/aggregates/data-stream.aggregate';

@CommandHandler(RegisterSensorCommand)
export class RegisterSensorCommandHandler implements ICommandHandler<RegisterSensorCommand> {
  constructor(
    private readonly publisher: EventPublisher,
    private readonly sensorRepository: SensorRepository,
    private readonly legalEntityRepository: LegalEntityRepository,
    private readonly deviceRepository: DeviceRepository,
    private readonly dataStreamRepository: DataStreamRepository,
  ) {}

  async execute(command: RegisterSensorCommand): Promise<void> {
    if (!command.legalEntityId) {
      throw new NoLegalEntityException();
    }

    let aggregate = await this.sensorRepository.get(command.sensorId);
    const deviceAggregate = await this.deviceRepository.get(command.deviceId);
    if (deviceAggregate) {
      if (aggregate) {
        throw new ObjectAlreadyExistsException(command.sensorId);
      } else {
        await validateLegalEntity(this.legalEntityRepository, command.legalEntityId);

        aggregate = new SensorAggregate(command.sensorId);
        aggregate = this.publisher.mergeObjectContext(aggregate);

        aggregate.register(command.legalEntityId, command.deviceId, command.name, command.description,
            deviceAggregate.state.location, command.supplier, command.manufacturer, command.documentationUrl,
            command.active);
        aggregate.commit();

        for (const dataStream of command.dataStreams) {
          let dataStreamAggregate = await this.dataStreamRepository.get(dataStream.dataStreamId);
          if (dataStreamAggregate) {
            throw new ObjectAlreadyExistsException(dataStream.dataStreamId);
          } else {
            dataStreamAggregate = this.publisher.mergeObjectContext(new DataStreamAggregate(dataStream.dataStreamId));

            dataStreamAggregate.register(command.legalEntityId, command.sensorId, dataStream.name, dataStream.description,
                dataStream.unitOfMeasurement, dataStream.isPublic, dataStream.isOpenData, dataStream.isReusable,
                dataStream.containsPersonalInfoData, dataStream.documentationUrl, dataStream.dataLink, dataStream.dataFrequency,
                dataStream.dataQuality, dataStream.theme, dataStream.observation);
            dataStreamAggregate.commit();
          }
        }
      }
    } else {
      throw new UnknowObjectException(command.deviceId);
    }
  }
}
