import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { RelocateDeviceCommand } from '../../../model/device/relocate-device.command';
import { DeviceRepository } from '../../../repositories/device.repository';
import { LegalEntityRepository } from '../../../repositories/legal-entity.repository';
import { NoLegalEntityException } from '../../error/no-legal-entity-exception';
import { UnknowObjectException } from '../../error/unknow-object-exception';
import { validateLegalEntity } from '../../util/legal-entity.utils';

@CommandHandler(RelocateDeviceCommand)
export class RelocateDeviceCommandHandler implements ICommandHandler<RelocateDeviceCommand> {
    constructor(
        private readonly publisher: EventPublisher,
        private readonly repository: DeviceRepository,
        private readonly legalEntityRepository: LegalEntityRepository,
    ) {}

    async execute(command: RelocateDeviceCommand): Promise<void> {
        if (command.legalEntityId) {
            await validateLegalEntity(this.legalEntityRepository, command.legalEntityId);
        } else {
            throw new NoLegalEntityException();
        }

        let aggregate = await this.repository.get(command.deviceId);
        if (aggregate) {
            aggregate = this.publisher.mergeObjectContext(aggregate);

            aggregate.relocateDevice(command.legalEntityId, command.location);
            aggregate.commit();
        } else {
            throw new UnknowObjectException(command.deviceId);
        }
    }
}
