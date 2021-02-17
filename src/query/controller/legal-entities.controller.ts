import { QueryBus } from '@nestjs/cqrs';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AccessJwtAuthGuard } from '../../auth/access-jwt-auth.guard';
import { LegalEntitiesQuery } from './query/legal-entities.query';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LegalEntitiesParams } from './model/legal-entities-params';

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
