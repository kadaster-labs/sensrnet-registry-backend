import { QueryBus } from '@nestjs/cqrs';
import { LegalEntityQuery } from '../model/legal-entity.query';
import { Controller, Get } from '@nestjs/common';
import { User } from '../../commons/decorators/user.decorator';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ValidatedUser } from '../../auth/validated-user';

@ApiBearerAuth()
@ApiTags('LegalEntity')
@Controller('legalentity')
export class LegalEntityController {
  constructor(
      private readonly queryBus: QueryBus,
      ) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve Legal Entity' })
  @ApiResponse({ status: 200, description: 'Legal Entity retrieved' })
  @ApiResponse({ status: 400, description: 'Legal Entity retrieval failed' })
  async retrieveOrganization(@User() user: ValidatedUser): Promise<any> {
    return await this.queryBus.execute(new LegalEntityQuery(user.legalEntityId));
  }
}
