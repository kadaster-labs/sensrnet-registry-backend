import { QueryBus } from '@nestjs/cqrs';
import { RetrieveOwnersQuery } from './queries/retrieve.query';
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AccessJwtAuthGuard } from '../../auth/access-jwt-auth.guard';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AccessJwtAuthGuard)
@ApiTags('Owner')
@Controller('Owner')
export class OwnerController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  @ApiOperation({ summary: 'Retrieve Owner' })
  @ApiResponse({ status: 200, description: 'Owner retrieved' })
  @ApiResponse({ status: 400, description: 'Owner retrieval failed' })
  async retrieveOwner(@Request() req) {
    return await this.queryBus.execute(new RetrieveOwnersQuery(req.user.ownerId));
  }
}
