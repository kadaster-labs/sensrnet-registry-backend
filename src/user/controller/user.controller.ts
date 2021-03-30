import { v4 } from 'uuid';
import { Request } from 'express';
import { UserRole } from '../model/user.model';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RetrieveUserQuery } from '../query/users.query';
import { Roles } from '../../core/guards/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { UpdateUserBody } from '../model/update-user.body';
import { DeleteUserParams } from '../model/delete-user.params';
import { RegisterUserBody } from '../model/register-user.body';
import { UpdateUserCommand } from '../command/update-user.command';
import { DeleteUserCommand } from '../command/delete-user.command';
import { UpdateUserRoleBody } from '../model/update-user-role.body';
import { RegisterUserCommand } from '../command/register-user.command';
import { UpdateUserRoleCommand } from '../command/update-user-role.command';
import { AccessJwtAuthGuard } from '../../auth/guard/access-jwt-auth.guard';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UseFilters, Controller, Delete, UseGuards, Req, Param, Post, Body, Put, Get } from '@nestjs/common';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
    ) {}

    @Get()
    @ApiBearerAuth()
    @UseGuards(AccessJwtAuthGuard)
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Retrieve users' })
    @ApiResponse({ status: 200, description: 'Users retrieved' })
    @ApiResponse({ status: 400, description: 'Users retrieval failed' })
    async retrieveUsers(@Req() req: Request): Promise<void> {
        const user: Record<string, any> = req.user;
        return user.legalEntityId ? await this.queryBus.execute(new RetrieveUserQuery(user.userId, user.legalEntityId)) : null;
    }

    @Post()
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Register user' })
    @ApiResponse({ status: 200, description: 'User registered' })
    @ApiResponse({ status: 400, description: 'User registration failed' })
    async createUser(@Body() userBody: RegisterUserBody): Promise<void> {
        const userId = v4();
        return await this.commandBus.execute(new RegisterUserCommand(userId, userBody.email, userBody.password));
    }

    @Put()
    @ApiBearerAuth()
    @UseGuards(AccessJwtAuthGuard)
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Update user' })
    @ApiResponse({ status: 200, description: 'User updated' })
    @ApiResponse({ status: 400, description: 'User update failed' })
    async updateUser(@Req() req: Request, @Body() userBody: UpdateUserBody): Promise<any> {
        const user: Record<string, any> = req.user;
        return await this.commandBus.execute(new UpdateUserCommand(user.userId, userBody.legalEntityId, userBody.leaveLegalEntity,
            userBody.password));
    }

    @Put(':id')
    @ApiBearerAuth()
    @Roles(UserRole.ADMIN)
    @UseFilters(new DomainExceptionFilter())
    @UseGuards(AccessJwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Update user' })
    @ApiResponse({ status: 200, description: 'User updated' })
    @ApiResponse({ status: 400, description: 'User update failed' })
    async updateUserById(@Req() req: Request, @Param() param: DeleteUserParams, @Body() userBody: UpdateUserRoleBody): Promise<any> {
        const user: Record<string, any> = req.user;
        return await this.commandBus.execute(new UpdateUserRoleCommand(param.id, user.legalEntityId, userBody.role));
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
    @Roles(UserRole.SUPER_USER)
    @UseFilters(new DomainExceptionFilter())
    @UseGuards(AccessJwtAuthGuard, RolesGuard)
    @ApiOperation({ summary: 'Remove user' })
    @ApiResponse({ status: 200, description: 'User removed' })
    @ApiResponse({ status: 400, description: 'User removal failed' })
    async removeUserById(@Param() param: DeleteUserParams): Promise<any> {
        return await this.commandBus.execute(new DeleteUserCommand(param.id));
    }
}
