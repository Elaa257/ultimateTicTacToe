import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';

describe('GameService', () => {
  let provider: GameService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameService],
    }).compile();

    provider = module.get<GameService>(GameService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
