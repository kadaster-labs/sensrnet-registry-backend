import { Controller, UseGuards, UseFilters } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DomainExceptionFilter } from '../../commons/errors/domain-exception.filter';
import { RolesGuard } from '../../commons/guards/roles.guard';
import { QueryLegalEntityProcessor } from '../processor/query-legal-entity.processor';
import { AbstractEsController } from './abstract.es.controller';

@ApiBearerAuth()
@ApiTags('Legal Entity ES')
@Controller('legal-entity-es')
@UseFilters(new DomainExceptionFilter())
@UseGuards(RolesGuard)
export class LegalEntityEsController extends AbstractEsController {
    constructor(protected readonly eventStoreListener: QueryLegalEntityProcessor) {
        super(eventStoreListener);
    }
}
