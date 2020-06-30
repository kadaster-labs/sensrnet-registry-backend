import { UserException } from './user-exception';

export class UserAlreadyExistsException extends UserException {
  constructor(name: string) {
    super(`User ${name} already exists.`);
  }
}
