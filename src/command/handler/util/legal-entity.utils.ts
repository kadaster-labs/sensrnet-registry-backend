import { NonExistingLegalEntityException } from '../error/non-existing-legal-entity-exception';
import { LegalEntityRepository } from '../../../core/repositories/legal-entity.repository';

export async function validateLegalEntity(legalEntityRepository: LegalEntityRepository, legalEntityId: string): Promise<void> {
    if (!await legalEntityRepository.get(legalEntityId)) {
        throw new NonExistingLegalEntityException(legalEntityId);
    }
}
