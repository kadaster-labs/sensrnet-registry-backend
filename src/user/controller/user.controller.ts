import { UserService } from '../user.service';
import { UserRole } from '../model/user.model';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RetrieveUserQuery } from '../query/users.query';
import { Roles } from '../../core/guards/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { UpdateUserBody } from '../model/update-user.body';
import { User } from '../../core/decorators/user.decorator';
import { DeleteUserParams } from '../model/delete-user.params';
import { UpdateUserCommand } from '../command/update-user.command';
import { DeleteUserCommand } from '../command/delete-user.command';
import { UpdateUserRoleBody } from '../model/update-user-role.body';
import { UpdateUserRoleCommand } from '../command/update-user-role.command';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';
import { ApiTags, ApiResponse, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UseFilters, Controller, Delete, UseGuards, Param, Body, Put, Get } from '@nestjs/common';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
        private readonly userService: UserService,
    ) { }

    @Get()
    @ApiBearerAuth()
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Retrieve users' })
    @ApiResponse({ status: 200, description: 'Users retrieved' })
    @ApiResponse({ status: 400, description: 'Users retrieval failed' })
    async retrieveUsers(@User() user): Promise<void> {
        return user.legalEntityId ? await this.queryBus.execute(new RetrieveUserQuery(user.userId, user.legalEntityId)) : null;
    }

    @Put()
    @ApiBearerAuth()
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Update user' })
    @ApiResponse({ status: 200, description: 'User updated' })
    @ApiResponse({ status: 400, description: 'User update failed' })
    async updateUser(@User() user, @Body() userBody: UpdateUserBody): Promise<any> {
        return await this.commandBus.execute(new UpdateUserCommand(user.userId, userBody.legalEntityId, userBody.leaveLegalEntity));
    }

    @Put(':id')
    @ApiBearerAuth()
    @Roles(UserRole.ADMIN)
    @UseFilters(new DomainExceptionFilter())
    @UseGuards(RolesGuard)
    @ApiOperation({ summary: 'Update user' })
    @ApiResponse({ status: 200, description: 'User updated' })
    @ApiResponse({ status: 400, description: 'User update failed' })
    async updateUserById(@User() user, @Param() param: DeleteUserParams, @Body() userBody: UpdateUserRoleBody): Promise<any> {
        return await this.commandBus.execute(new UpdateUserRoleCommand(param.id, user.legalEntityId, userBody.role));
    }

    @Delete()
    @ApiBearerAuth()
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Remove user' })
    @ApiResponse({ status: 200, description: 'User removed' })
    @ApiResponse({ status: 400, description: 'User removal failed' })
    async removeUser(@User() user): Promise<any> {
        return await this.commandBus.execute(new DeleteUserCommand(user.userId));
    }

    @Delete(':id')
    @ApiBearerAuth()
    @Roles(UserRole.SUPER_USER)
    @UseFilters(new DomainExceptionFilter())
    @UseGuards(RolesGuard)
    @ApiOperation({ summary: 'Remove user' })
    @ApiResponse({ status: 200, description: 'User removed' })
    @ApiResponse({ status: 400, description: 'User removal failed' })
    async removeUserById(@Param() param: DeleteUserParams): Promise<any> {
        return await this.commandBus.execute(new DeleteUserCommand(param.id));
    }

    // @Get()
    // @ApiBearerAuth()
    // @ApiOperation({ summary: 'Get user info' })
    // @ApiResponse({ status: 200, description: 'User info retrieved' })
    // @ApiResponse({ status: 400, description: 'User info could not be retrieved' })
    // async user(@User() user) {
    //     const organizationId: string | undefined = await this.userService.getOrganizationId(user.userId);

    //     return {
    //         organizationId,
    //         ...user
    //     }
    // }
}
