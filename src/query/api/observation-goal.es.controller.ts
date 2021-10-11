import { Controller, UseGuards, UseFilters } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DomainExceptionFilter } from '../../commons/errors/domain-exception.filter';
import { RolesGuard } from '../../commons/guards/roles.guard';
import { QueryObservationGoalEsListener } from '../processor/query-observationgoal.es.listener';
import { AbstractEsController } from './abstract.es.controller';

@ApiBearerAuth()
@ApiTags('Observation Goal ES')
@Controller('observation-goal-es')
@UseFilters(new DomainExceptionFilter())
@UseGuards(RolesGuard)
export class ObservationGoalEsController extends AbstractEsController {
    constructor(protected readonly eventStoreListener: QueryObservationGoalEsListener) {
        super(eventStoreListener);
    }
}
