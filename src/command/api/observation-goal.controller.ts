import { Body, Controller, Delete, Param, Post, Put, UseFilters, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { v4 } from 'uuid';
import { ValidatedUser } from '../../auth/validated-user';
import { InjectUser } from '../../commons/decorators/user.decorator';
import { DomainExceptionFilter } from '../../commons/errors/domain-exception.filter';
import { Roles } from '../../commons/guards/roles.decorator';
import { RolesGuard } from '../../commons/guards/roles.guard';
import { UserRole } from '../../commons/user/user-permissions.schema';
import { RegisterObservationGoalCommand } from '../model/observation-goal/register-observation-goal.command';
import { RemoveObservationGoalCommand } from '../model/observation-goal/remove-observation-goal.command';
import { UpdateObservationGoalCommand } from '../model/observation-goal/update-observation-goal.command';
import { ObservationGoalIdParams } from './model/observation-goal/observation-goal-id.params';
import { RegisterObservationGoalBody } from './model/observation-goal/register-observation-goal.body';
import { UpdateObservationGoalBody } from './model/observation-goal/update-observation-goal.body';

@ApiBearerAuth()
@UseGuards(RolesGuard)
@ApiTags('Observation Goal')
@Controller('observationgoal')
export class ObservationGoalController {
    constructor(private readonly commandBus: CommandBus) {}

    @Post()
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Register observation goal' })
    @ApiResponse({ status: 200, description: 'Observation goal registered' })
    @ApiResponse({ status: 400, description: 'Observation goal registration failed' })
    async registerObservationGoal(
        @InjectUser() user: ValidatedUser,
        @Body() observationGoalBody: RegisterObservationGoalBody,
    ): Promise<Record<string, any>> {
        const observationGoalId = v4();

        await this.commandBus.execute(
            new RegisterObservationGoalCommand(user.legalEntityId, { observationGoalId, ...observationGoalBody }),
        );

        return { observationGoalId };
    }

    @Put(':observationGoalId')
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Update observation goal' })
    @ApiResponse({ status: 200, description: 'Observation goal updated' })
    @ApiResponse({ status: 400, description: 'Observation goal update failed' })
    async updateObservationGoal(
        @InjectUser() user: ValidatedUser,
        @Param() params: ObservationGoalIdParams,
        @Body() observationGoalBody: UpdateObservationGoalBody,
    ): Promise<any> {
        return this.commandBus.execute(
            new UpdateObservationGoalCommand(user.legalEntityId, {
                observationGoalId: params.observationGoalId,
                ...observationGoalBody,
            }),
        );
    }

    @Delete(':observationGoalId')
    @UseFilters(new DomainExceptionFilter())
    @Roles(UserRole.ADMIN, UserRole.SUPER_USER)
    @ApiOperation({ summary: 'Remove observation goal' })
    @ApiResponse({ status: 200, description: 'Observation goal removed' })
    @ApiResponse({ status: 400, description: 'Observation goal removal failed' })
    async removeObservationGoal(@InjectUser() user: ValidatedUser, @Param() params: ObservationGoalIdParams): Promise<any> {
        return this.commandBus.execute(new RemoveObservationGoalCommand(params.observationGoalId, user.legalEntityId));
    }
}
