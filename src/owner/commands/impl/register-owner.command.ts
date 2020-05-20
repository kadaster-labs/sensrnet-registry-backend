import { ICommand } from '@nestjs/cqrs';
import { RegisterOwnerDto } from '../../dtos/register-owner.dto';


export class RegisterCommand implements ICommand {
  constructor(
    public readonly dto: RegisterOwnerDto,
  ) {}
}
