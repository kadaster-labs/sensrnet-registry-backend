import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../../core/guards/roles.guard';
import { AbstractEsController } from './abstract.es.controller';
import { SensorEsListener } from '../processor/sensor.es.listener';
import { Controller, UseFilters } from '@nestjs/common';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';

@ApiBearerAuth()
@ApiTags('Sensor ES')
@Controller('sensor-es')
@UseFilters(new DomainExceptionFilter())
export class SensorESController extends AbstractEsController {
  constructor(
      protected readonly eventStoreListener: SensorEsListener,
  ) {
    super(eventStoreListener);
  }
}
