import { IEvent } from '@nestjs/cqrs';
import { UpdateOwnerDto } from '../../dtos/update-owner.dto';


export class OwnerUpdatedEvent implements IEvent {
  constructor(
    public readonly dto: UpdateOwnerDto) {}
}
