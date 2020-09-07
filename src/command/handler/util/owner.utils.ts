import { OwnerRepository } from '../../../core/repositories/owner.repository';
import { NonExistingOwnerException } from '../error/non-existing-owner-exception';

export async function validateOwner(ownerRepository: OwnerRepository, ownerId: string): Promise<void> {
    if (!await ownerRepository.get(ownerId)) {
        throw new NonExistingOwnerException(ownerId);
    }
}
