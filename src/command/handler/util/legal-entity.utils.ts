import { LegalEntityRepository } from '../../repositories/legal-entity.repository';
import { NonExistingLegalEntityException } from '../error/non-existing-legal-entity-exception';

export async function validateLegalEntity(
    legalEntityRepository: LegalEntityRepository,
    legalEntityId: string,
): Promise<void> {
    if (!(await legalEntityRepository.get(legalEntityId))) {
        throw new NonExistingLegalEntityException(legalEntityId);
    }
}
