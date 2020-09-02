import { Test } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { OwnerController } from './owner.controller';
import { RegisterOwnerBody } from './model/register-owner.body';

describe('OwnerController', () => {
  let commandBus: CommandBus;
  let ownerController: OwnerController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [
        OwnerController,
      ],
      providers: [
        CommandBus,
      ],
    }).compile();

    commandBus = moduleRef.get<CommandBus>(CommandBus);
    ownerController = moduleRef.get<OwnerController>(OwnerController);
  });

  describe('createOwner', () => {
    it('should create an Owner with given arguments', async () => {
      const plainOwner = {
        organisationName: 'org',
        website: 'www.website.com',
        name: 'owner',
        contactEmail: 'www.owner.com',
        contactPhone: '0600000000',
        email: 'owner@email.com',
        password: 'password',
      };

      jest.spyOn(commandBus, 'execute').mockImplementation(async () => plainOwner);
      const registerOwnerBody: RegisterOwnerBody = plainToClass(RegisterOwnerBody, plainOwner as RegisterOwnerBody);

      const { ownerId } = await ownerController.createOwner(registerOwnerBody);
      expect(ownerId).toBeTruthy();
    });
  });
});
