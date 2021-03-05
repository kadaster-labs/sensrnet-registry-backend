import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from '../../core/guards/roles.guard';
import { AbstractEsController } from './abstract.es.controller';
import { Controller, UseGuards, UseFilters } from '@nestjs/common';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';
import { OrganizationEsListener } from '../processor/organization-es-listener';

@ApiBearerAuth()
@ApiTags('Organization ES')
@Controller('organization-es')
@UseFilters(new DomainExceptionFilter())
export class OrganizationEsController extends AbstractEsController {
  constructor(
      protected readonly eventStoreListener: OrganizationEsListener,
  ) {
    super(eventStoreListener);
  }
}
