import { Test, TestingModule } from '@nestjs/testing';
import { OwnerController } from './owner.controller';
import { OwnerService } from '../services/owner.service';


describe('Owners Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [OwnerController],
      providers: [OwnerService],
    }).compile();
  });
  it('should be defined', () => {
    const controller: OwnerController = module.get<OwnerController>(OwnerController);
    expect(controller).toBeDefined();
  });
});
