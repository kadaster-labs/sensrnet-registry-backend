import { CommandBus } from '@nestjs/cqrs';
import { UpdateUserBody } from './model/update-user.body';
import { UpdateUserCommand } from './command/update-user.command';
import { DomainExceptionFilter } from '../core/errors/domain-exception.filter';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UseFilters, Controller, Req, Body, Put, Get, UseGuards, Request } from '@nestjs/common';
import { UserToken } from '../auth/models/user-token';
import { AuthenticatedGuard } from '../auth/authenticated.guard';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly userService: UserService,
    ) {}

    @Put()
    @ApiBearerAuth()
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Update user' })
    @ApiResponse({ status: 200, description: 'User updated' })
    @ApiResponse({ status: 400, description: 'User update failed' })
    async updateUser(@Request() req, @Body() userBody: UpdateUserBody): Promise<any> {
        const user: UserToken = req.user as UserToken;
        return await this.commandBus.execute(new UpdateUserCommand(user.userinfo.sub, userBody.organization));
    }

    @UseGuards(AuthenticatedGuard)
    @Get()
    async user(@Request() req) {

        const organizationId: string | undefined = await this.userService.getOrganizationId(req.user.userinfo.sub);

        return {
            organizationId,
            ...req.user
        }
    }
}
