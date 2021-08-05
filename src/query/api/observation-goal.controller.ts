import { QueryBus } from '@nestjs/cqrs';
import { Public } from '../../auth/public';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ObservationGoalQuery } from '../model/observation-goal.query';
import { ObservationGoalsQuery } from '../model/observation-goals.query';
import { ObservationGoalIdParams } from './model/observationgoal-id-params';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RetrieveObservationGoalsBody } from './model/retrieve-observationgoals-body';
import { IObservationGoal } from '../model/observation-goal.schema';
import { User } from '../../commons/decorators/user.decorator';
import { ValidatedUser } from '../../auth/validated-user';

@ApiBearerAuth()
@ApiTags('Observation Goal')
@Controller('observationgoal')
export class ObservationGoalController {
  constructor(
      private readonly queryBus: QueryBus,
      ) {}

  @Get(':observationGoalId')
  @Public()
  @ApiOperation({ summary: 'Retrieve Observation Goal' })
  @ApiResponse({ status: 200, description: 'Observation goal retrieved' })
  @ApiResponse({ status: 400, description: 'Observation goal retrieval failed' })
  async retrieveObservationGoal(@Param() observationGoalIdParams: ObservationGoalIdParams): Promise<IObservationGoal> {
    return this.queryBus.execute(new ObservationGoalQuery(observationGoalIdParams.observationGoalId));
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve Observation Goals' })
  @ApiResponse({ status: 200, description: 'Observation goals retrieved' })
  @ApiResponse({ status: 400, description: 'Observation goals retrieval failed' })
  async retrieveObservationGoals(@User() user: ValidatedUser,
                                 @Query() query: RetrieveObservationGoalsBody): Promise<IObservationGoal[]> {
    const requestLegalEntityId = user ? user.legalEntityId : undefined;

    const pageSize = typeof query.pageSize === 'undefined' ? undefined : Number(query.pageSize);
    const pageIndex = typeof query.pageIndex === 'undefined' ? undefined : Number(query.pageIndex);
    return this.queryBus.execute(new ObservationGoalsQuery(requestLegalEntityId, query.name, pageIndex, pageSize,
        query.sortField, query.sortDirection));
  }
}
