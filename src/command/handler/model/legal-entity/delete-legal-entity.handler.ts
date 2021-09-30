import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRelation, TargetVariant } from '../../../../query/model/relation.schema';
import { RemoveLegalEntityCommand } from '../../../model/legal-entity/remove-legal-entity.command';
import { LegalEntityRepository } from '../../../repositories/legal-entity.repository';
import { OrganizationHasDevices } from '../../error/organization-has-devices';
import { UnknowObjectException } from '../../error/unknow-object-exception';

@CommandHandler(RemoveLegalEntityCommand)
export class RemoveLegalEntityCommandHandler implements ICommandHandler<RemoveLegalEntityCommand> {
    constructor(
        private readonly publisher: EventPublisher,
        private readonly repository: LegalEntityRepository,
        @InjectModel('Relation') public relationModel: Model<IRelation>,
    ) {}

    async execute(command: RemoveLegalEntityCommand): Promise<void> {
        if (await this.hasDevices(command.id)) {
            throw new OrganizationHasDevices();
        }

        let aggregate = await this.repository.get(command.id);
        if (aggregate) {
            aggregate = this.publisher.mergeObjectContext(aggregate);

            aggregate.remove();
            aggregate.commit();
        } else {
            throw new UnknowObjectException(command.id);
        }
    }

    private async hasDevices(legalEntityId: string): Promise<boolean> {
        const relationFilter = { legalEntityId, targetVariant: TargetVariant.DEVICE };
        return await this.relationModel.exists(relationFilter);
    }
}
