import { LegalEntityCommand } from './legal-entity.command';

export class RegisterOrganizationCommand extends LegalEntityCommand {
    constructor(
        public readonly legalEntityId: string,
        public readonly userId: string,
        public readonly name: string,
        public readonly website: string,
    ) {
        super(legalEntityId, name, website);
    }
}
