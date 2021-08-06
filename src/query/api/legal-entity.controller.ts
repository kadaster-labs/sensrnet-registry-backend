import { Controller, Get } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ValidatedUser } from '../../auth/validated-user';
import { User } from '../../commons/decorators/user.decorator';
import { LegalEntityQuery } from '../model/legal-entity.query';

@ApiBearerAuth()
@ApiTags('LegalEntity')
@Controller('legalentity')
export class LegalEntityController {
    constructor(private readonly queryBus: QueryBus) {}

    @Get()
    @ApiOperation({ summary: 'Retrieve Legal Entity' })
    @ApiResponse({ status: 200, description: 'Legal Entity retrieved' })
    @ApiResponse({ status: 400, description: 'Legal Entity retrieval failed' })
    async retrieveOrganization(@User() user: ValidatedUser): Promise<any> {
        return this.queryBus.execute(new LegalEntityQuery(user.legalEntityId));
    }
}
