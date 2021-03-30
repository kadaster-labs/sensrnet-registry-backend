import { v4 } from 'uuid';
import { CommandBus } from '@nestjs/cqrs';
import { UserRole } from '../../user/model/user.model';
import { Roles } from '../../core/guards/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { User } from '../../core/decorators/user.decorator';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ObservationGoalIdParams } from './model/observation-goal/observation-goal-id.params';
import { UpdateObservationGoalBody } from './model/observation-goal/update-observation-goal.body';
import { RegisterObservationGoalBody } from './model/observation-goal/register-observation-goal.body';
import { Controller, Param, Post, Put, Body, Delete, UseFilters, UseGuards } from '@nestjs/common';
import { UpdateObservationGoalCommand } from '../command/observation-goal/update-observation-goal.command';
import { RemoveObservationGoalCommand } from '../command/observation-goal/remove-observation-goal.command';
import { RegisterObservationGoalCommand } from '../command/observation-goal/register-observation-goal.command';

@ApiBearerAuth()
@UseGuards(RolesGuard)
@ApiTags('Observation Goal')
@Controller('observationgoal')
export class ObservationGoalController {
  constructor(
      private readonly commandBus: CommandBus,
  ) {}

  @Post()
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Register observation goal' })
  @ApiResponse({ status: 200, description: 'Observation goal registered' })
  @ApiResponse({ status: 400, description: 'Observation goal registration failed' })
  async registerObservationGoal(@User() user,
                                @Body() observationGoalBody: RegisterObservationGoalBody): Promise<Record<string, any>> {
    const observationGoalId = v4();

    await this.commandBus.execute(new RegisterObservationGoalCommand(observationGoalId, user.legalEntityId,
        observationGoalBody.name, observationGoalBody.description, observationGoalBody.legalGround,
        observationGoalBody.legalGroundLink));

    return { observationGoalId };
  }

  @Put(':observationGoalId')
  @UseFilters(new DomainExceptionFilter())
  @ApiOperation({ summary: 'Update observation goal' })
  @ApiResponse({ status: 200, description: 'Observation goal updated' })
  @ApiResponse({ status: 400, description: 'Observation goal update failed' })
  async updateObservationGoal(@User() user, @Param() params: ObservationGoalIdParams,
                              @Body() observationGoalBody: UpdateObservationGoalBody): Promise<any> {
    return await this.commandBus.execute(new UpdateObservationGoalCommand(params.observationGoalId, user.legalEntityId,
        observationGoalBody.name, observationGoalBody.description, observationGoalBody.legalGround,
        observationGoalBody.legalGroundLink));
  }

  @Delete(':observationGoalId')
  @UseFilters(new DomainExceptionFilter())
  @Roles(UserRole.ADMIN, UserRole.SUPER_USER)
  @ApiOperation({ summary: 'Remove observation goal' })
  @ApiResponse({ status: 200, description: 'Observation goal removed' })
  @ApiResponse({ status: 400, description: 'Observation goal removal failed' })
  async removeObservationGoal(@User() user, @Param() params: ObservationGoalIdParams): Promise<any> {
    return await this.commandBus.execute(new RemoveObservationGoalCommand(params.observationGoalId, user.legalEntityId));
  }
}
