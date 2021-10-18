import { Controller, UseGuards, UseFilters } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DomainExceptionFilter } from '../../commons/errors/domain-exception.filter';
import { RolesGuard } from '../../commons/guards/roles.guard';
import { QueryDeviceProcessor } from '../processor/query-device.processor';
import { AbstractEsController } from './abstract.es.controller';

@ApiBearerAuth()
@ApiTags('Device ES')
@Controller('device-es')
@UseFilters(new DomainExceptionFilter())
@UseGuards(RolesGuard)
export class DeviceEsController extends AbstractEsController {
    constructor(protected readonly eventStoreListener: QueryDeviceProcessor) {
        super(eventStoreListener);
    }
}
