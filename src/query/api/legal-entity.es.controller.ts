import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../../commons/guards/roles.guard';
import { AbstractEsController } from './abstract.es.controller';
import { Controller, UseGuards, UseFilters } from '@nestjs/common';
import { LegalEntityEsListener } from '../processor/legal-entity.es.listener';
import { DomainExceptionFilter } from '../../commons/errors/domain-exception.filter';

@ApiBearerAuth()
@ApiTags('Legal Entity ES')
@Controller('legal-entity-es')
@UseFilters(new DomainExceptionFilter())
@UseGuards(RolesGuard)
export class LegalEntityEsController extends AbstractEsController {
  constructor(
      protected readonly eventStoreListener: LegalEntityEsListener,
  ) {
    super(eventStoreListener);
  }
}
