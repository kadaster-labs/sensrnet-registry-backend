import { Controller, UseGuards, UseFilters } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DomainExceptionFilter } from '../../commons/errors/domain-exception.filter';
import { RolesGuard } from '../../commons/guards/roles.guard';
import { DeviceEsListener } from '../processor/device.es.listener';
import { AbstractEsController } from './abstract.es.controller';

@ApiBearerAuth()
@ApiTags('Device ES')
@Controller('device-es')
@UseFilters(new DomainExceptionFilter())
@UseGuards(RolesGuard)
export class DeviceEsController extends AbstractEsController {
    constructor(protected readonly eventStoreListener: DeviceEsListener) {
        super(eventStoreListener);
    }
}
