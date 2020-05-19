import { IEvent } from '@nestjs/cqrs';
import { RegisterOwnerDto } from '../../dtos/register-owner.dto';


export class OwnerRegisteredEvent implements IEvent {
  constructor(
    public readonly dto: RegisterOwnerDto) {}
}
