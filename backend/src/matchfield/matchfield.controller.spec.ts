import { Test, TestingModule } from '@nestjs/testing';
import { MatchfieldController } from './matchfield.controller';

describe('MatchfieldController', () => {
  let controller: MatchfieldController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchfieldController],
    }).compile();

    controller = module.get<MatchfieldController>(MatchfieldController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
