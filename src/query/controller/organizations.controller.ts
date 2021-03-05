import { QueryBus } from '@nestjs/cqrs';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { RetrieveOrganizationsQuery } from '../model/retrieve-organizations.query';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsParams } from './model/organizations-params';

@ApiBearerAuth()
@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve Organizations' })
  @ApiResponse({ status: 200, description: 'Organizations retrieved' })
  @ApiResponse({ status: 400, description: 'Organizations retrieval failed' })
  async retrieveOrganizations(@Query() organizationsParams: OrganizationsParams): Promise<any> {
    return await this.queryBus.execute(new RetrieveOrganizationsQuery(organizationsParams.name));
  }
}
