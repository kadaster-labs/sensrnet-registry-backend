import { Test } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { OwnerController } from '../../../src/command/controller/owner.controller';
import { RegisterOwnerBody } from '../../../src/command/controller/model/register-owner.body';

const testOwner = {
  name: 'test-org',
  email: 'test-email',
  password: 'test-pass',
  website: 'test-website',
  contactEmail: 'test-email',
  contactPhone: 'test-phone',
  organisationName: 'test-org',
};

describe('OwnerController', () => {
  let commandBus: CommandBus;
  let ownerController: OwnerController;

  beforeAll(async () => {
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
    it('should create an Owner', async () => {
      jest.spyOn(commandBus, 'execute').mockImplementation(async () => true);
      const registerOwnerBody: RegisterOwnerBody = plainToClass(RegisterOwnerBody, testOwner as RegisterOwnerBody);

      const { ownerId } = await ownerController.createOwner(registerOwnerBody);
      expect(ownerId).toBeTruthy();
    });
  });
});
