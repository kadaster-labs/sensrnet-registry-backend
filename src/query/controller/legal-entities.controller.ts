import { QueryBus } from '@nestjs/cqrs';
import { LegalEntitiesQuery } from './query/legal-entities.query';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LegalEntitiesParams } from './model/legal-entities-params';
import { AccessJwtAuthGuard } from '../../auth/guard/access-jwt-auth.guard';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AccessJwtAuthGuard)
@ApiTags('LegalEntities')
@Controller('legalentities')
export class LegalEntitiesController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve Legal Entities' })
  @ApiResponse({ status: 200, description: 'Legal Entities retrieved' })
  @ApiResponse({ status: 400, description: 'Legal Entities retrieval failed' })
  async retrieveOrganizations(@Query() legalEntitiesParams: LegalEntitiesParams): Promise<any> {
    return await this.queryBus.execute(new LegalEntitiesQuery(legalEntitiesParams.name));
  }
}
