import { v4 } from 'uuid';
import { Request } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { AccessJwtAuthGuard } from '../../auth/guard/access-jwt-auth.guard';
import { DatastreamIdParams } from './model/observation-goal/datastream-id.params';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ObservationGoalIdParams } from './model/observation-goal/observation-goal-id.params';
import { UpdateObservationGoalBody } from './model/observation-goal/update-observation-goal.body';
import { AddObservationGoalCommand } from '../command/observation-goal/add-observation-goal.command';
import { RegisterObservationGoalBody } from './model/observation-goal/register-observation-goal.body';
import { Controller, Param, Post, Put, Body, Delete, UseFilters, Req, UseGuards } from '@nestjs/common';
import { UpdateObservationGoalCommand } from '../command/observation-goal/update-observation-goal.command';
import { RemoveObservationGoalCommand } from '../command/observation-goal/remove-observation-goal.command';

@ApiBearerAuth()
@UseGuards(AccessJwtAuthGuard)
@ApiTags('Observation Goal')
@Controller('device')
export class ObservationGoalController {
  constructor(
      private readonly commandBus: CommandBus,
  ) {}

  @Post(':deviceId/datastream/:dataStreamId')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Add observation goal' })
  @ApiResponse({ status: 200, description: 'Observation goal added' })
  @ApiResponse({ status: 400, description: 'Observation goal addition failed' })
  async addObservationGoal(@Req() req: Request, @Param() params: DatastreamIdParams,
                           @Body() observationGoalBody: RegisterObservationGoalBody): Promise<Record<string, any>> {
    const observationGoalId = v4();

    const user: Record<string, any> = req.user;
    await this.commandBus.execute(new AddObservationGoalCommand(params.deviceId, params.dataStreamId,
        observationGoalId, user.legalEntityId, observationGoalBody.name, observationGoalBody.description,
        observationGoalBody.legalGround, observationGoalBody.legalGroundLink));

    return { observationGoalId };
  }

  @Put(':deviceId/datastream/:dataStreamId/observationgoal/:observationGoalId')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Update observation goal' })
  @ApiResponse({ status: 200, description: 'Observation goal updated' })
  @ApiResponse({ status: 400, description: 'Observation goal update failed' })
  async updateObservationGoal(@Req() req: Request, @Param() params: ObservationGoalIdParams,
                              @Body() observationGoalBody: UpdateObservationGoalBody): Promise<any> {
    const user: Record<string, any> = req.user;
    return await this.commandBus.execute(new UpdateObservationGoalCommand(params.deviceId, params.dataStreamId,
        params.observationGoalId, user.legalEntityId, observationGoalBody.name, observationGoalBody.description,
        observationGoalBody.legalGround, observationGoalBody.legalGroundLink));
  }

  @Delete(':deviceId/datastream/:dataStreamId/observationgoal/:observationGoalId')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Remove observation goal' })
  @ApiResponse({ status: 200, description: 'Observation goal removed' })
  @ApiResponse({ status: 400, description: 'Observation goal removal failed' })
  async removeObservationGoal(@Req() req: Request, @Param() params: ObservationGoalIdParams): Promise<any> {
    const user: Record<string, any> = req.user;
    return await this.commandBus.execute(new RemoveObservationGoalCommand(params.deviceId, params.dataStreamId,
        params.observationGoalId, user.legalEntityId));
  }
}
