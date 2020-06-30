import { QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RetrieveOwnersQuery } from './queries/retrieve.query';
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
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
