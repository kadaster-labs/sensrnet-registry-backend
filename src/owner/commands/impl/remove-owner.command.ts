import { ICommand } from '@nestjs/cqrs';
import { OwnerIdDto } from '../../dtos/owner.dto';


export class RemoveOwnerCommand implements ICommand {
  constructor(
    public readonly dto: OwnerIdDto,
  ) {}
}
