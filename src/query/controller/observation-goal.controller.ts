import { QueryBus } from '@nestjs/cqrs';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ObservationGoalQuery } from './query/observation-goal.query';
import { ObservationGoalsQuery } from './query/observation-goals.query';
import { ObservationGoalIdParams } from './model/observationgoal-id-params';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RetrieveObservationGoalsBody } from './model/retrieve-observationgoals-body';
import { IObservationGoal } from '../model/observation-goal.model';

@ApiBearerAuth()
@ApiTags('Observation Goal')
@Controller('observationgoal')
export class ObservationGoalController {
  constructor(
      private readonly queryBus: QueryBus,
      ) {}

  @Get(':observationGoalId')
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
  async retrieveObservationGoals(@Query() query: RetrieveObservationGoalsBody): Promise<IObservationGoal[]> {
    const pageSize = typeof query.pageSize === 'undefined' ? undefined : Number(query.pageSize);
    const pageIndex = typeof query.pageIndex === 'undefined' ? undefined : Number(query.pageIndex);
    return this.queryBus.execute(new ObservationGoalsQuery(query.name, pageIndex, pageSize, query.sortField, query.sortDirection));
  }
}
