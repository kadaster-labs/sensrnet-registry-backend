import {NonExistingOwnerException} from '../../sensor/errors/non-existing-owner-exception';

export async function validateOwner(ownerRepository, ownerId) {
    if (!await ownerRepository.get(ownerId)) {
        throw new NonExistingOwnerException(ownerId);
    }
}
