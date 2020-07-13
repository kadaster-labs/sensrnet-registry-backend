import { DomainException } from './domain-exception';

export class DeleteFailedException extends DomainException {
  constructor(email: string) {
    super(`Failed to delete User ${email}.`);
  }
}
