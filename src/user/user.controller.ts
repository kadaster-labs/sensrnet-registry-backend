import { Request } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { Roles } from '../core/guards/roles.decorator';
import { RolesGuard } from '../core/guards/roles.guard';
import { UpdateUserBody } from './model/update-user.body';
import { RegisterUserBody } from './model/register-user.body';
import { UpdateUserCommand } from './command/update-user.command';
import { DeleteUserCommand } from './command/delete-user.command';
import { AccessJwtAuthGuard } from '../auth/access-jwt-auth.guard';
import { RegisterUserCommand } from './command/register-user.command';
import { DomainExceptionFilter } from '../core/errors/domain-exception.filter';
import { DeleteUserParams } from '../command/controller/model/delete-user.params';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UseFilters, Controller, Delete, UseGuards, Req, Param, Post, Body, Put } from '@nestjs/common';

@ApiTags('User')
@Controller('User')
export class UserController {
    constructor(
        private readonly commandBus: CommandBus,
    ) {}

    @Post()
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Register user' })
    @ApiResponse({ status: 200, description: 'User registered' })
    @ApiResponse({ status: 400, description: 'User registration failed' })
    async createUser(@Body() userBody: RegisterUserBody): Promise<void> {
        await this.commandBus.execute(new RegisterUserCommand(userBody.email, undefined, userBody.password));
    }

    @Put()
    @ApiBearerAuth()
    @UseGuards(AccessJwtAuthGuard)
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Update user' })
    @ApiResponse({ status: 200, description: 'User updated' })
    @ApiResponse({ status: 400, description: 'User update failed' })
    async updateUser(@Body() userBody: UpdateUserBody, @Req() req: Request): Promise<any> {
        const user: Record<string, any> = req.user;
        return await this.commandBus.execute(new UpdateUserCommand(user.userId, userBody.ownerId, userBody.password));
    }

    @Delete()
    @ApiBearerAuth()
    @UseGuards(AccessJwtAuthGuard)
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Remove user' })
    @ApiResponse({ status: 200, description: 'User removed' })
    @ApiResponse({ status: 400, description: 'User removal failed' })
    async removeUser(@Req() req: Request): Promise<any> {
        const user: Record<string, any> = req.user;
        return await this.commandBus.execute(new DeleteUserCommand(user.userId));
    }

    @Delete(':id')
    @ApiBearerAuth()
    @Roles('admin')
    @UseFilters(new DomainExceptionFilter())
    @UseGuards(AccessJwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Remove user' })
    @ApiResponse({ status: 200, description: 'User removed' })
    @ApiResponse({ status: 400, description: 'User removal failed' })
    async removeUserById(@Param() param: DeleteUserParams): Promise<any> {
        return await this.commandBus.execute(new DeleteUserCommand(param.id));
    }
}
