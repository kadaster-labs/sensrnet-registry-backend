import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { RemoveLegalEntityCommand } from '../../../model/legal-entity/remove-legal-entity.command';
import { DeviceCountService } from '../../../repositories/device-count.service';
import { LegalEntityRepository } from '../../../repositories/legal-entity.repository';
import { OrganizationHasDevices } from '../../error/organization-has-devices';
import { UnknowObjectException } from '../../error/unknow-object-exception';

@CommandHandler(RemoveLegalEntityCommand)
export class RemoveLegalEntityCommandHandler implements ICommandHandler<RemoveLegalEntityCommand> {
    constructor(
        private readonly publisher: EventPublisher,
        private readonly repository: LegalEntityRepository,
        protected readonly deviceCountService: DeviceCountService,
    ) {}

    async execute(command: RemoveLegalEntityCommand): Promise<void> {
        let aggregate = await this.repository.get(command.id);
        if (aggregate) {
            if (await this.deviceCountService.hasDevices(command.id)) {
                throw new OrganizationHasDevices();
            }

            aggregate = this.publisher.mergeObjectContext(aggregate);

            aggregate.remove();
            aggregate.commit();
        } else {
            throw new UnknowObjectException(command.id);
        }
    }
}
