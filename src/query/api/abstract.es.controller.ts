import { Get, Post, Body } from '@nestjs/common';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AbstractProcessor } from '../../commons/event-processing/abstract.processor';
import { Roles } from '../../commons/guards/roles.decorator';
import { UserRole } from '../../commons/user/user.schema';
import { OffsetBody } from './model/offset-body';

export abstract class AbstractEsController {
    protected constructor(protected readonly eventStoreListener: AbstractProcessor) {}

    @Roles(UserRole.SUPER_USER)
    @Post('subscription/open')
    @ApiOperation({ summary: 'Open subscription' })
    @ApiResponse({ status: 200, description: 'Subscription opened' })
    @ApiResponse({ status: 400, description: 'Failed to open subscription' })
    async openEventStoreSubscription(): Promise<void> {
        await this.eventStoreListener.openSubscription();
    }

    @Roles(UserRole.SUPER_USER)
    @Post('subscription/close')
    @ApiOperation({ summary: 'Close subscription' })
    @ApiResponse({ status: 200, description: 'Subscription closed' })
    @ApiResponse({ status: 400, description: 'Failed to close subscription' })
    closeEventStoreSubscription(): void {
        this.eventStoreListener.closeSubscription();
    }

    @Roles(UserRole.SUPER_USER)
    @Get('checkpoint')
    @ApiOperation({ summary: 'Retrieve checkpoint offset' })
    @ApiResponse({ status: 200, description: 'Checkpoint offset retrieved' })
    @ApiResponse({ status: 400, description: 'Failed to retrieve Checkpoint offset' })
    async retrieveEventStoreOffset(): Promise<number> {
        return this.eventStoreListener.getOffset();
    }

    @Roles(UserRole.SUPER_USER)
    @Post('checkpoint')
    @ApiOperation({ summary: 'Set checkpoint offset' })
    @ApiResponse({ status: 200, description: 'Checkpoint offset set' })
    @ApiResponse({ status: 400, description: 'Failed to set Checkpoint offset' })
    async setEventStoreOffset(@Body() body: OffsetBody): Promise<void> {
        await this.eventStoreListener.setOffset(body.offset);
    }
}
