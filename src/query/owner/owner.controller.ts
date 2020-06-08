import { QueryBus } from '@nestjs/cqrs';
import { OwnerIdParams } from './models/id-params';
import { RetrieveOwnersQuery } from './queries/retrieve.query';
import {ApiTags, ApiResponse, ApiOperation, ApiBearerAuth} from '@nestjs/swagger';
import {Controller, Get, Param, UseGuards} from '@nestjs/common';
import {JwtAuthGuard} from '../../auth/jwt-auth.guard';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiTags('Owner')
@Controller('Owner')
export class OwnerController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get(':ownerId')
  @ApiOperation({ summary: 'Retrieve Owner' })
  @ApiResponse({ status: 200, description: 'Owner retrieved' })
  @ApiResponse({ status: 400, description: 'Owner retrieval failed' })
  async retrieveOwner(@Param() ownerIdParams: OwnerIdParams) {
    return await this.queryBus.execute(new RetrieveOwnersQuery(ownerIdParams.ownerId));
  }
}
