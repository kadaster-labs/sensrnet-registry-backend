import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../../commons/guards/roles.guard';
import { AbstractEsController } from './abstract.es.controller';
import { Controller, UseGuards, UseFilters } from '@nestjs/common';
import { DomainExceptionFilter } from '../../commons/errors/domain-exception.filter';
import { ObservationGoalEsListener } from '../processor/observationgoal.es.listener';

@ApiBearerAuth()
@ApiTags('Observation Goal ES')
@Controller('observation-goal-es')
@UseFilters(new DomainExceptionFilter())
@UseGuards(RolesGuard)
export class ObservationGoalEsController extends AbstractEsController {
  constructor(
      protected readonly eventStoreListener: ObservationGoalEsListener,
  ) {
    super(eventStoreListener);
  }
}
