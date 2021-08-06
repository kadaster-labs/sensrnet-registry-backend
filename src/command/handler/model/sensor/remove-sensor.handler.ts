import { ICommandHandler, EventPublisher, CommandHandler } from '@nestjs/cqrs';
import { RemoveSensorCommand } from '../../../model/sensor/remove-sensor.command';
import { DeviceRepository } from '../../../repositories/device.repository';
import { LegalEntityRepository } from '../../../repositories/legal-entity.repository';
import { NoLegalEntityException } from '../../error/no-legal-entity-exception';
import { UnknowObjectException } from '../../error/unknow-object-exception';
import { validateLegalEntity } from '../../util/legal-entity.utils';

@CommandHandler(RemoveSensorCommand)
export class RemoveSensorCommandHandler implements ICommandHandler<RemoveSensorCommand> {
    constructor(
        private readonly publisher: EventPublisher,
        private readonly repository: DeviceRepository,
        private readonly legalEntityRepository: LegalEntityRepository,
    ) {}

    async execute(command: RemoveSensorCommand): Promise<void> {
        if (command.legalEntityId) {
            await validateLegalEntity(this.legalEntityRepository, command.legalEntityId);
        } else {
            throw new NoLegalEntityException();
        }

        let aggregate = await this.repository.get(command.deviceId);
        if (aggregate) {
            aggregate = this.publisher.mergeObjectContext(aggregate);

            aggregate.removeSensor(command.sensorId, command.legalEntityId);
            aggregate.commit();
        } else {
            throw new UnknowObjectException(command.deviceId);
        }
    }
}
