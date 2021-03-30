import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../../core/guards/roles.guard';
import { AbstractEsController } from './abstract.es.controller';
import { Controller, UseGuards, UseFilters } from '@nestjs/common';
import { AccessJwtAuthGuard } from '../../auth/guard/access-jwt-auth.guard';
import { LegalEntityEsListener } from '../processor/legal-entity.es.listener';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';

@ApiBearerAuth()
@ApiTags('Legal Entity ES')
@Controller('legal-entity-es')
@UseFilters(new DomainExceptionFilter())
@UseGuards(AccessJwtAuthGuard, RolesGuard)
export class LegalEntityEsController extends AbstractEsController {
  constructor(
      protected readonly eventStoreListener: LegalEntityEsListener,
  ) {
    super(eventStoreListener);
  }
}
