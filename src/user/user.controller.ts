import { CommandBus } from '@nestjs/cqrs';
import { UpdateUserBody } from './model/update-user.body';
import { UpdateUserCommand } from './command/update-user.command';
import { DomainExceptionFilter } from '../core/errors/domain-exception.filter';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UseFilters, Controller, Req, Body, Put, Get, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
        const user: any = req['user'] as any;
        return await this.commandBus.execute(new UpdateUserCommand(user.userinfo.sub, userBody.organization));
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    async user(@Request() req) {

        const organizationId: string | undefined = await this.userService.getOrganizationId(req.user.userinfo.sub);

        return {
            organizationId,
            ...req.user
        }
    }
}
