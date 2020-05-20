import { Injectable } from '@nestjs/common';
import { Owner } from '../models/owner.model';


@Injectable()
export class OwnerRepository {
  async registerOwner(ownerDto) {
    const owner = new Owner(undefined);
    owner.setData(ownerDto);
    owner.registerOwner();

    return owner;
  }

  async updateOwner(ownerDto) {
    const owner = new Owner(ownerDto.id);
    owner.setData(ownerDto);
    owner.updateOwner();

    return owner;
  }

  async removeOwner(ownerDto) {
    const owner = new Owner(ownerDto.id);
    owner.removeOwner();

    return owner;
  }
}
