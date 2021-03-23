import { v4 } from 'uuid';
import { Request } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { UserRole } from '../../user/model/user.model';
import { Roles } from '../../core/guards/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { SensorIdParams } from './model/sensor/sensorid.params';
import { AddDatastreamBody } from './model/data-stream/add-datastream.body';
import { AccessJwtAuthGuard } from '../../auth/guard/access-jwt-auth.guard';
import { DataStreamIdParams } from './model/data-stream/datastreamid.params';
import { ObservationGoalBody } from './model/data-stream/observation-goal.body';
import { UpdateDatastreamBody } from './model/data-stream/update-datastream.body';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AddDataStreamCommand } from '../command/data-stream/add-data-stream.command';
import { RemoveDataStreamCommand } from '../command/data-stream/remove-data-stream.command';
import { UpdateDataStreamCommand } from '../command/data-stream/update-data-stream.command';
import { LinkObservationGoalCommand } from '../command/data-stream/link-observationgoal.command';
import { UnlinkObservationGoalCommand } from '../command/data-stream/unlink-observationgoal.command';
import { Controller, Param, Post, Put, Body, Delete, UseFilters, Req, UseGuards } from '@nestjs/common';

@ApiBearerAuth()
@ApiTags('Datastream')
@Controller('device')
@UseGuards(AccessJwtAuthGuard, RolesGuard)
export class DataStreamController {
    constructor(
        private readonly commandBus: CommandBus,
    ) {}

    @Post(':deviceId/sensor/:sensorId/datastream')
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Add datastream' })
    @ApiResponse({ status: 200, description: 'Datastream added' })
    @ApiResponse({ status: 400, description: 'Datastream addition failed' })
    async addDatastream(@Req() req: Request, @Param() params: SensorIdParams,
                        @Body() dataStreamBody: AddDatastreamBody): Promise<any> {
        const dataStreamId = v4();

        const user: Record<string, any> = req.user;
        await this.commandBus.execute(new AddDataStreamCommand(params.deviceId, params.sensorId, user.legalEntityId,
            dataStreamId, dataStreamBody.name, dataStreamBody.description, dataStreamBody.unitOfMeasurement,
            dataStreamBody.observedArea, dataStreamBody.theme, dataStreamBody.dataQuality, dataStreamBody.isActive,
            dataStreamBody.isPublic, dataStreamBody.isOpenData, dataStreamBody.containsPersonalInfoData,
            dataStreamBody.isReusable, dataStreamBody.documentation, dataStreamBody.dataLink));

        return { dataStreamId };
    }

    @Put(':deviceId/sensor/:sensorId/datastream/:dataStreamId')
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Update datastream' })
    @ApiResponse({ status: 200, description: 'Datastream updated' })
    @ApiResponse({ status: 400, description: 'Datastream update failed' })
    async updateDatastream(@Req() req: Request, @Param() params: DataStreamIdParams,
                           @Body() dataStreamBody: UpdateDatastreamBody): Promise<any> {
        const user: Record<string, any> = req.user;
        return await this.commandBus.execute(new UpdateDataStreamCommand(params.deviceId, params.sensorId,
            user.legalEntityId, params.dataStreamId, dataStreamBody.name, dataStreamBody.description,
            dataStreamBody.unitOfMeasurement, dataStreamBody.observedArea, dataStreamBody.theme,
            dataStreamBody.dataQuality, dataStreamBody.isActive, dataStreamBody.isPublic, dataStreamBody.isOpenData,
            dataStreamBody.containsPersonalInfoData, dataStreamBody.isReusable, dataStreamBody.documentation,
            dataStreamBody.dataLink));
    }

    @Put(':deviceId/sensor/:sensorId/datastream/:dataStreamId/linkgoal')
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Link observation goal' })
    @ApiResponse({ status: 200, description: 'Observation goal linked' })
    @ApiResponse({ status: 400, description: 'Observation goal linking failed' })
    async linkObservationGoal(@Req() req: Request, @Param() params: DataStreamIdParams,
                              @Body() observationGoalBody: ObservationGoalBody): Promise<any> {
        const user: Record<string, any> = req.user;
        return await this.commandBus.execute(new LinkObservationGoalCommand(params.deviceId, params.sensorId,
            user.legalEntityId, params.dataStreamId, observationGoalBody.observationGoalId));
    }

    @Put(':deviceId/sensor/:sensorId/datastream/:dataStreamId/unlinkgoal')
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Unlink observation goal' })
    @ApiResponse({ status: 200, description: 'Observation goal unlinked' })
    @ApiResponse({ status: 400, description: 'Observation goal unlinking failed' })
    async unlinkObservationGoal(@Req() req: Request, @Param() params: DataStreamIdParams,
                                @Body() observationGoalBody: ObservationGoalBody): Promise<any> {
        const user: Record<string, any> = req.user;
        return await this.commandBus.execute(new UnlinkObservationGoalCommand(params.deviceId, params.sensorId,
            user.legalEntityId, params.dataStreamId, observationGoalBody.observationGoalId));
    }

    @Roles(UserRole.ADMIN, UserRole.SUPER_USER)
    @Delete(':deviceId/sensor/:sensorId/datastream/:dataStreamId')
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Remove datastream' })
    @ApiResponse({ status: 200, description: 'Datastream removed' })
    @ApiResponse({ status: 400, description: 'Datastream removal failed' })
    async removeDatastream(@Req() req: Request, @Param() params: DataStreamIdParams): Promise<any> {
        const user: Record<string, any> = req.user;
        return await this.commandBus.execute(new RemoveDataStreamCommand(params.deviceId, params.sensorId,
            user.legalEntityId, params.dataStreamId));
    }
}
