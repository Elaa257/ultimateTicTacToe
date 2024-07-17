import { Test, TestingModule } from '@nestjs/testing';
import { GameLogicService } from './game-logic.service';

describe('GameLogicService', () => {
  let provider: GameLogicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameLogicService],
    }).compile();

    provider = module.get<GameLogicService>(GameLogicService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
