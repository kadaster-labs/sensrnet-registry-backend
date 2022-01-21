import { Body, Controller, Delete, Param, Post, Put, UseFilters, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { v4 } from 'uuid';
import { ValidatedUser } from '../../auth/validated-user';
import { User } from '../../commons/decorators/user.decorator';
import { DomainExceptionFilter } from '../../commons/errors/domain-exception.filter';
import { Roles } from '../../commons/guards/roles.decorator';
import { RolesGuard } from '../../commons/guards/roles.guard';
import { UserRole } from '../../commons/user/user.schema';
import { AddDatastreamCommand } from '../model/data-stream/add-data-stream.command';
import { LinkObservationGoalCommand } from '../model/data-stream/link-observationgoal.command';
import { RemoveDatastreamCommand } from '../model/data-stream/remove-data-stream.command';
import { UnlinkObservationGoalCommand } from '../model/data-stream/unlink-observationgoal.command';
import { UpdateDatastreamCommand } from '../model/data-stream/update-data-stream.command';
import { AddDatastreamBody } from './model/data-stream/add-datastream.body';
import { DatastreamIdParams } from './model/data-stream/datastreamid.params';
import { ObservationGoalBody } from './model/data-stream/observation-goal.body';
import { UpdateDatastreamBody } from './model/data-stream/update-datastream.body';
import { SensorIdParams } from './model/sensor/sensorid.params';

@ApiBearerAuth()
@ApiTags('Datastream')
@Controller('device')
@UseGuards(RolesGuard)
export class DatastreamController {
    constructor(private readonly commandBus: CommandBus) {}

    @Post(':deviceId/sensor/:sensorId/datastream')
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Add datastream' })
    @ApiResponse({ status: 200, description: 'Datastream added' })
    @ApiResponse({ status: 400, description: 'Datastream addition failed' })
    async addDatastream(
        @User() user: ValidatedUser,
        @Param() params: SensorIdParams,
        @Body() datastreamBody: AddDatastreamBody,
    ): Promise<any> {
        const datastreamId = v4();

        await this.commandBus.execute(
            new AddDatastreamCommand(params.deviceId, params.sensorId, user.legalEntityId, {
                datastreamId,
                ...datastreamBody,
            }),
        );

        return { datastreamId };
    }

    @Put(':deviceId/sensor/:sensorId/datastream/:datastreamId')
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Update datastream' })
    @ApiResponse({ status: 200, description: 'Datastream updated' })
    @ApiResponse({ status: 400, description: 'Datastream update failed' })
    async updateDatastream(
        @User() user: ValidatedUser,
        @Param() params: DatastreamIdParams,
        @Body() datastreamBody: UpdateDatastreamBody,
    ): Promise<any> {
        return this.commandBus.execute(
            new UpdateDatastreamCommand(params.deviceId, params.sensorId, user.legalEntityId, {
                datastreamId: params.datastreamId,
                ...datastreamBody,
            }),
        );
    }

    @Put(':deviceId/sensor/:sensorId/datastream/:datastreamId/linkgoal')
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Link observation goal' })
    @ApiResponse({ status: 200, description: 'Observation goal linked' })
    @ApiResponse({ status: 400, description: 'Observation goal linking failed' })
    async linkObservationGoal(
        @User() user: ValidatedUser,
        @Param() params: DatastreamIdParams,
        @Body() observationGoalBody: ObservationGoalBody,
    ): Promise<any> {
        return this.commandBus.execute(
            new LinkObservationGoalCommand(
                params.deviceId,
                params.sensorId,
                user.legalEntityId,
                params.datastreamId,
                observationGoalBody.observationGoalId,
            ),
        );
    }

    @Put(':deviceId/sensor/:sensorId/datastream/:datastreamId/unlinkgoal')
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Unlink observation goal' })
    @ApiResponse({ status: 200, description: 'Observation goal unlinked' })
    @ApiResponse({ status: 400, description: 'Observation goal unlinking failed' })
    async unlinkObservationGoal(
        @User() user: ValidatedUser,
        @Param() params: DatastreamIdParams,
        @Body() observationGoalBody: ObservationGoalBody,
    ): Promise<any> {
        return this.commandBus.execute(
            new UnlinkObservationGoalCommand(
                params.deviceId,
                params.sensorId,
                user.legalEntityId,
                params.datastreamId,
                observationGoalBody.observationGoalId,
            ),
        );
    }

    @Roles(UserRole.ADMIN, UserRole.SUPER_USER)
    @Delete(':deviceId/sensor/:sensorId/datastream/:datastreamId')
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Remove datastream' })
    @ApiResponse({ status: 200, description: 'Datastream removed' })
    @ApiResponse({ status: 400, description: 'Datastream removal failed' })
    async removeDatastream(@User() user: ValidatedUser, @Param() params: DatastreamIdParams): Promise<any> {
        return this.commandBus.execute(
            new RemoveDatastreamCommand(params.deviceId, params.sensorId, user.legalEntityId, params.datastreamId),
        );
    }
}
