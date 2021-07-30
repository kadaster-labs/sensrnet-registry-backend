import { Body, Controller, Delete, Get, Param, Put, UseFilters, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DomainException } from '../../core/errors/domain-exception';
import { ValidatedUser } from '../../auth/validated-user';
import { User } from '../../core/decorators/user.decorator';
import { DomainExceptionFilter } from '../../core/errors/domain-exception.filter';
import { Roles } from '../../core/guards/roles.decorator';
import { RolesGuard } from '../../core/guards/roles.guard';
import { DeleteUserCommand } from '../command/delete-user.command';
import { JoinLegalEntityCommand } from '../command/join-legal-entity.command';
import { LeaveLegalEntityCommand } from '../command/leave-legal-entity.command';
import { UpdateUserRoleCommand } from '../command/update-user-role.command';
import { DeleteUserParams } from '../model/delete-user.params';
import { UpdateUserRoleBody } from '../model/update-user-role.body';
import { UpdateUserBody } from '../model/update-user.body';
import { UserRole } from '../model/user.model';
import { RetrieveUserQuery } from '../query/users.query';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(
        private readonly queryBus: QueryBus,
        private readonly commandBus: CommandBus,
    ) { }

    @Get()
    @ApiBearerAuth()
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Retrieve users' })
    @ApiResponse({ status: 200, description: 'Users retrieved' })
    @ApiResponse({ status: 400, description: 'Users retrieval failed' })
    async retrieveUsers(@User() user: ValidatedUser): Promise<void> {
        return user.legalEntityId ? await this.queryBus.execute(new RetrieveUserQuery(user.userId, user.legalEntityId)) : null;
    }

    @Put()
    @ApiBearerAuth()
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Update user' })
    @ApiResponse({ status: 200, description: 'User updated' })
    @ApiResponse({ status: 400, description: 'User update failed' })
    async updateUser(@User() user: ValidatedUser, @Body() userBody: UpdateUserBody): Promise<any> {
        if (userBody.legalEntityId) {
            return await this.commandBus.execute(new JoinLegalEntityCommand(user.userId, userBody.legalEntityId));
        }
        else if (userBody.leaveLegalEntity) {
            return await this.commandBus.execute(new LeaveLegalEntityCommand(user.userId, user.legalEntityId));
        }
        else {
            throw new DomainException('Unsupported combination of parameters');
        }
    }

    @Put(':id')
    @ApiBearerAuth()
    @Roles(UserRole.ADMIN)
    @UseFilters(new DomainExceptionFilter())
    @UseGuards(RolesGuard)
    @ApiOperation({ summary: 'Update user' })
    @ApiResponse({ status: 200, description: 'User updated' })
    @ApiResponse({ status: 400, description: 'User update failed' })
    async updateUserById(@User() user: ValidatedUser, @Param() param: DeleteUserParams, @Body() userBody: UpdateUserRoleBody): Promise<any> {
        return await this.commandBus.execute(new UpdateUserRoleCommand(param.id, user.legalEntityId, userBody.role));
    }

    @Delete()
    @ApiBearerAuth()
    @UseFilters(new DomainExceptionFilter())
    @ApiOperation({ summary: 'Remove user' })
    @ApiResponse({ status: 200, description: 'User removed' })
    @ApiResponse({ status: 400, description: 'User removal failed' })
    async removeUser(@User() user: ValidatedUser): Promise<any> {
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
}
