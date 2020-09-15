import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../../core/guards/roles.guard';
import { AbstractEsController } from './abstract.es.controller';
import { SensorEsListener } from '../processor/sensor.es.listener';
import { Controller, UseGuards, UseFilters } from '@nestjs/common';
import { AccessJwtAuthGuard } from '../../auth/access-jwt-auth.guard';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';

@ApiBearerAuth()
@ApiTags('SensorES')
@Controller('SensorES')
@UseFilters(new DomainExceptionFilter())
@UseGuards(AccessJwtAuthGuard, RolesGuard)
export class SensorESController extends AbstractEsController {
  constructor(
      protected readonly eventStoreListener: SensorEsListener,
  ) {
    super(eventStoreListener);
  }
}
