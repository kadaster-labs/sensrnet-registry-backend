import { Test } from '@nestjs/testing';
import { CommandBus } from '@nestjs/cqrs';
import { plainToClass } from 'class-transformer';
import { OrganizationController } from './organization.controller';
import { RegisterOrganizationBody } from './model/register-organization.body';

const testOrganization = {
  website: 'test-website',
  contactName: 'test-name',
  contactEmail: 'test-email',
  contactPhone: 'test-phone',
};

describe('OrganizationController', () => {
  let commandBus: CommandBus;
  let ownerController: OrganizationController;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [
        OrganizationController,
      ], providers: [
        CommandBus,
      ],
    }).compile();

    commandBus = moduleRef.get<CommandBus>(CommandBus);
    ownerController = moduleRef.get<OrganizationController>(OrganizationController);
  });

  describe('registerOrganization', () => {
    it('should register an Organization', async () => {
      jest.spyOn(commandBus, 'execute').mockImplementation(async () => true);
      const registerOrganizationBody: RegisterOrganizationBody = plainToClass(RegisterOrganizationBody,
          testOrganization as RegisterOrganizationBody);

      const { organizationId } = await ownerController.registerOrganization(registerOrganizationBody);
      expect(organizationId).toBeDefined();
    });
  });
});
