import { Request } from 'express';
import { QueryBus } from '@nestjs/cqrs';
import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AccessJwtAuthGuard } from '../../auth/access-jwt-auth.guard';
import { RetrieveOrganizationQuery } from '../model/retrieve-organization.query';
import { RetrieveOrganizationsQuery } from '../model/retrieve-organizations.query';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AccessJwtAuthGuard)
@ApiTags('Organizations')
@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve Organizations' })
  @ApiResponse({ status: 200, description: 'Organizations retrieved' })
  @ApiResponse({ status: 400, description: 'Organizations retrieval failed' })
  async retrieveOrganizations(): Promise<any> {
    return await this.queryBus.execute(new RetrieveOrganizationsQuery());
  }
}
