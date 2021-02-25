import { v4 } from 'uuid';
import { Request } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { SensorIdParams } from './model/sensor/sensorid.params';
import { DataStreamIdParams } from './model/data-stream/datastreamid.params';
import { RegisterDatastreamBody } from './model/data-stream/register-datastream.body';
import { AccessJwtAuthGuard } from '../../auth/guard/access-jwt-auth.guard';
import { UpdateDatastreamBody } from './model/data-stream/update-datastream.body';
import { RegisterDataStreamCommand } from '../command/data-stream/register-data-stream.command';
import { DeleteDataStreamCommand } from '../command/data-stream/delete-data-stream.command';
import { UpdateDataStreamCommand } from '../command/data-stream/update-data-stream.command';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Param, Post, Put, Body, Delete, UseFilters, Req, UseGuards } from '@nestjs/common';

@ApiBearerAuth()
@UseGuards(AccessJwtAuthGuard)
@ApiTags('DataStream')
@Controller('datastream')
export class DataStreamController {
    constructor(
        private readonly commandBus: CommandBus,
    ) {}

    @Post(':sensorId/datastream')
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Add data stream' })
    @ApiResponse({ status: 200, description: 'Datastream added' })
    @ApiResponse({ status: 400, description: 'Datastream addition failed' })
    async registerDatastream(@Req() req: Request, @Param() params: SensorIdParams,
                             @Body() dataStreamBody: RegisterDatastreamBody): Promise<any> {
        const dataStreamId = v4();

        const user: Record<string, any> = req.user;
        await this.commandBus.execute(new RegisterDataStreamCommand(params.sensorId, user.legalEntityId,
            dataStreamId, dataStreamBody.name, dataStreamBody.description, dataStreamBody.unitOfMeasurement,
            dataStreamBody.isPublic, dataStreamBody.isOpenData, dataStreamBody.isReusable, dataStreamBody.containsPersonalInfoData,
            dataStreamBody.documentationUrl, dataStreamBody.dataLink, dataStreamBody.dataFrequency, dataStreamBody.dataQuality,
            dataStreamBody.theme, dataStreamBody.observation));

        return { dataStreamId };
    }

    @Put(':sensorId/datastream/:dataStreamId')
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Update data stream' })
    @ApiResponse({ status: 200, description: 'Datastream updated' })
    @ApiResponse({ status: 400, description: 'Datastream update failed' })
    async updateDatastream(@Req() req: Request, @Param() params: DataStreamIdParams,
                           @Body() dataStreamBody: UpdateDatastreamBody): Promise<any> {
        const user: Record<string, any> = req.user;
        return await this.commandBus.execute(new UpdateDataStreamCommand(params.sensorId, user.legalEntityId,
            params.dataStreamId, dataStreamBody.name, dataStreamBody.description, dataStreamBody.unitOfMeasurement,
            dataStreamBody.isPublic, dataStreamBody.isOpenData, dataStreamBody.isReusable, dataStreamBody.containsPersonalInfoData,
            dataStreamBody.documentationUrl, dataStreamBody.dataLink, dataStreamBody.dataFrequency, dataStreamBody.dataQuality,
            dataStreamBody.theme, dataStreamBody.observation));
    }

    @Delete(':sensorId/datastream/:dataStreamId')
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Remove data stream' })
    @ApiResponse({ status: 200, description: 'Datastream removed' })
    @ApiResponse({ status: 400, description: 'Datastream removal failed' })
    async removeSensorDatastream(@Req() req: Request, @Param() params: DataStreamIdParams): Promise<any> {
        const user: Record<string, any> = req.user;
        return await this.commandBus.execute(new DeleteDataStreamCommand(params.sensorId, user.legalEntityId,
            params.dataStreamId));
    }
}
