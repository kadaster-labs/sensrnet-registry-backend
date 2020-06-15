import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { EmitUpdateCommand } from './emitupdate.command';
import { SensorGateway } from '../sensor.gateway';

@CommandHandler(EmitUpdateCommand)
export class EmitUpdateHandler
    implements ICommandHandler<EmitUpdateCommand> {
    constructor(
        private readonly sensorGateway: SensorGateway,
        private readonly publisher: EventPublisher,
    ) { }

    async execute(command: EmitUpdateCommand) {
        // const { heroId, itemId } = command;
        // const hero = this.publisher.mergeObjectContext(
        //     await this.repository.findOneById(+heroId),
        // );
        console.log('emitting event');
        this.sensorGateway.emit('Event', {});
    }
}
