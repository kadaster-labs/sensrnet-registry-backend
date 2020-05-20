import { CommandBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';
import { OwnerIdDto } from '../dtos/owner.dto';
import { UpdateOwnerDto } from '../dtos/update-owner.dto';
import { RegisterOwnerDto } from '../dtos/register-owner.dto';
import { RegisterCommand } from '../commands/impl/register-owner.command';
import { RemoveOwnerCommand } from '../commands/impl/remove-owner.command';
import { UpdateOwnerCommand } from '../commands/impl/update-owner.command';


@Injectable()
export class OwnerService {
  constructor(private readonly commandBus: CommandBus) {}

  async registerOwner(owner: RegisterOwnerDto) {
    return await this.commandBus.execute(
      new RegisterCommand(owner),
    );
  }

  async updateOwner(owner: UpdateOwnerDto) {
    const commandPromises = [];

    if (Object.keys(owner).length > 1) {
      commandPromises.push(this.commandBus.execute(
        new UpdateOwnerCommand(owner),
      ));
    }

    return await Promise.all(commandPromises);
  }

  async removeOwner(owner: OwnerIdDto) {
    return await this.commandBus.execute(
      new RemoveOwnerCommand(owner),
    );
  }
}
