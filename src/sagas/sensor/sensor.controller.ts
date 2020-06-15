import { Controller } from '@nestjs/common';
import { CommandBus, QueryBus, EventBus } from '@nestjs/cqrs';

@Controller('sagas')
export class SensorSagasController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly eventBus: EventBus,
  ) {}
}
