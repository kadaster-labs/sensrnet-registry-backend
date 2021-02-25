import { OffsetBody } from './model/offset-body';
import { Get, Post, Body } from '@nestjs/common';
import { UserRole } from '../../user/model/user.model';
import { Roles } from '../../core/guards/roles.decorator';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AbstractEsListener } from '../processor/abstract.es.listener';

export abstract class AbstractEsController {
    protected constructor(
        protected readonly eventStoreListener: AbstractEsListener,
    ) {}

    @Roles(UserRole.ADMIN)
    @Post('subscription/open')
    @ApiOperation({ summary: 'Open subscription' })
    @ApiResponse({ status: 200, description: 'Subscription opened' })
    @ApiResponse({ status: 400, description: 'Failed to open subscription' })
    async openEventStoreSubscription(): Promise<void> {
        await this.eventStoreListener.openSubscription();
    }

    @Roles(UserRole.ADMIN)
    @Post('subscription/close')
    @ApiOperation({ summary: 'Close subscription' })
    @ApiResponse({ status: 200, description: 'Subscription closed' })
    @ApiResponse({ status: 400, description: 'Failed to close subscription' })
    closeEventStoreSubscription(): void {
        this.eventStoreListener.closeSubscription();
    }

    @Roles(UserRole.ADMIN)
    @Get('checkpoint')
    @ApiOperation({ summary: 'Retrieve checkpoint offset' })
    @ApiResponse({ status: 200, description: 'Checkpoint offset retrieved' })
    @ApiResponse({ status: 400, description: 'Failed to retrieve Checkpoint offset' })
    async retrieveEventStoreOffset(): Promise<number> {
        return this.eventStoreListener.getOffset();
    }

    @Roles(UserRole.ADMIN)
    @Post('checkpoint')
    @ApiOperation({ summary: 'Set checkpoint offset' })
    @ApiResponse({ status: 200, description: 'Checkpoint offset set' })
    @ApiResponse({ status: 400, description: 'Failed to set Checkpoint offset' })
    async setEventStoreOffset(@Body() body: OffsetBody): Promise<void> {
        await this.eventStoreListener.setOffset(body.offset);
    }
}
