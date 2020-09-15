import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../../core/guards/roles.guard';
import { AbstractEsController } from './abstract.es.controller';
import { OwnerEsListener } from '../processor/owner.es.listener';
import { Controller, UseGuards, UseFilters } from '@nestjs/common';
import { AccessJwtAuthGuard } from '../../auth/access-jwt-auth.guard';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';

@ApiBearerAuth()
@ApiTags('OwnerES')
@Controller('OwnerES')
@UseFilters(new DomainExceptionFilter())
@UseGuards(AccessJwtAuthGuard, RolesGuard)
export class OwnerEsController extends AbstractEsController {
  constructor(
      protected readonly eventStoreListener: OwnerEsListener,
  ) {
    super(eventStoreListener);
  }
}
