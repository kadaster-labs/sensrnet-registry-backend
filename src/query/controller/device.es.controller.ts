import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../../core/guards/roles.guard';
import { AbstractEsController } from './abstract.es.controller';
import { DeviceEsListener } from '../processor/device.es.listener';
import { Controller, UseGuards, UseFilters } from '@nestjs/common';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';

@ApiBearerAuth()
@ApiTags('Device ES')
@Controller('device-es')
@UseFilters(new DomainExceptionFilter())
@UseGuards(RolesGuard)
export class DeviceEsController extends AbstractEsController {
  constructor(
      protected readonly eventStoreListener: DeviceEsListener,
  ) {
    super(eventStoreListener);
  }
}
