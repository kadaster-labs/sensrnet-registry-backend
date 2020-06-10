import { QueryBus } from '@nestjs/cqrs';
import { RetrieveOwnersQuery } from './queries/retrieve.query';
import {ApiTags, ApiResponse, ApiOperation, ApiBearerAuth} from '@nestjs/swagger';
import {Controller, Get, UseGuards, Request} from '@nestjs/common';
import {JwtAuthGuard} from '../../auth/jwt-auth.guard';

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
