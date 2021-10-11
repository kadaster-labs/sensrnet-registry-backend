import { Controller, UseGuards, UseFilters } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DomainExceptionFilter } from '../../commons/errors/domain-exception.filter';
import { RolesGuard } from '../../commons/guards/roles.guard';
import { QueryLegalEntityEsListener } from '../listeners/query-legal-entity-es-listener.service';
import { AbstractEsController } from './abstract.es.controller';

@ApiBearerAuth()
@ApiTags('Legal Entity ES')
@Controller('legal-entity-es')
@UseFilters(new DomainExceptionFilter())
@UseGuards(RolesGuard)
export class LegalEntityEsController extends AbstractEsController {
    constructor(protected readonly eventStoreListener: QueryLegalEntityEsListener) {
        super(eventStoreListener);
    }
}
