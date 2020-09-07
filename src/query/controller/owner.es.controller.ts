import { OffsetBody } from './model/offset-body';
import { Roles } from '../../core/guards/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { OwnerEsListener } from '../processor/owner.es.listener';
import { AccessJwtAuthGuard } from '../../auth/access-jwt-auth.guard';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Controller, Get, UseGuards, UseFilters, Post, Body } from '@nestjs/common';

@ApiBearerAuth()
@ApiTags('OwnerES')
@Controller('OwnerES')
@UseFilters(new DomainExceptionFilter())
@UseGuards(AccessJwtAuthGuard, RolesGuard)
export class OwnerEsController {
  constructor(
      private readonly eventStoreListener: OwnerEsListener,
  ) {}

  @Roles('admin')
  @Post('subscription/open')
  @ApiOperation({ summary: 'Open subscription' })
  @ApiResponse({ status: 200, description: 'Subscription opened' })
  @ApiResponse({ status: 400, description: 'Failed to open subscription' })
  async openEventStoreSubscription(): Promise<void> {
    await this.eventStoreListener.openSubscription();
  }

  @Roles('admin')
  @Post('subscription/close')
  @ApiOperation({ summary: 'Close subscription' })
  @ApiResponse({ status: 200, description: 'Subscription closed' })
  @ApiResponse({ status: 400, description: 'Failed to close subscription' })
  closeEventStoreSubscription(): void {
    this.eventStoreListener.closeSubscription();
  }

  @Roles('admin')
  @Get('checkpoint')
  @ApiOperation({ summary: 'Retrieve checkpoint offset' })
  @ApiResponse({ status: 200, description: 'Checkpoint offset retrieved' })
  @ApiResponse({ status: 400, description: 'Failed to retrieve Checkpoint offset' })
  async retrieveEventStoreOffset(): Promise<number> {
    return this.eventStoreListener.getOffset();
  }

  @Roles('admin')
  @Post('checkpoint')
  @ApiOperation({ summary: 'Set checkpoint offset' })
  @ApiResponse({ status: 200, description: 'Checkpoint offset set' })
  @ApiResponse({ status: 400, description: 'Failed to set Checkpoint offset' })
  async setEventStoreOffset(@Body() body: OffsetBody): Promise<void> {
    await this.eventStoreListener.setOffset(body.offset);
  }
}
