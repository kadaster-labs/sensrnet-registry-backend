import { CommandBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { OwnerIdDto } from '../dtos/owner.dto';
import { UpdateOwnerDto } from '../dtos/update-owner.dto';
import { RegisterOwnerDto } from '../dtos/register-owner.dto';
import { RemoveOwnerCommand } from '../commands/impl/remove-owner.command';
import { RegisterOwnerCommand } from '../commands/impl/register-owner.command';
import { UpdateOwnerCommand } from '../commands/impl/update-owner.command';


@Injectable()
export class OwnerService {
  constructor(private readonly commandBus: CommandBus) {}

  async registerOwner(owner: RegisterOwnerDto) {
    return await this.commandBus.execute(
      new RegisterOwnerCommand(owner),
    );
  }

  async updateOwner(owner: UpdateOwnerDto) {
    const commandPromises = [];

    if (Object.keys(owner).length > 1) {
      const updateOwnerPromise = this.commandBus.execute(
        new UpdateOwnerCommand(owner),
      )
      commandPromises.push(updateOwnerPromise);
    }

    return await Promise.all(commandPromises);
  }

  async removeOwner(owner: OwnerIdDto) {
    return await this.commandBus.execute(
      new RemoveOwnerCommand(owner),
    );
  }
}
