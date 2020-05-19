import { RemoveOwnerHandler } from './remove-owner.handler';
import { UpdateOwnerHandler } from './update-owner.handler';
import { RegisterOwnerHandler } from './register-owner.handler';


export const CommandHandlers = [
  UpdateOwnerHandler,
  RemoveOwnerHandler,
  RegisterOwnerHandler
];
