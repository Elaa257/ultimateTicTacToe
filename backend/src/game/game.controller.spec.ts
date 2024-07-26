import { Test, TestingModule } from '@nestjs/testing';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Game } from './game.entity';
import {GameLogicService} from "./game-logic.service";

describe('GameController', () => {
  let controller: GameController;
  let gameService: GameService;
  let gameLogicService: GameLogicService;

  const mockGameRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockGameLogicService = {
    calculateGameOutcome: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameController],
      providers: [
        GameService,
        {
          provide: getRepositoryToken(Game),
          useValue: mockGameRepo,
        },
        {
          provide: GameLogicService,
          useValue: mockGameLogicService,
        },
      ],
    }).compile();

    controller = module.get<GameController>(GameController);
    gameService = module.get<GameService>(GameService);
    gameLogicService = module.get<GameLogicService>(GameLogicService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
