import { NonExistingOrganizationException } from '../error/non-existing-organization-exception';
import { OrganizationRepository } from '../../../core/repositories/organization-repository.service';

export async function validateOrganization(organizationRepository: OrganizationRepository, organizationId: string): Promise<void> {
    if (!await organizationRepository.get(organizationId)) {
        throw new NonExistingOrganizationException(organizationId);
    }
}
