import { Test, TestingModule } from '@nestjs/testing';
import { GameLogicService } from './game-logic.service';
import {Game} from "./game.entity";
import {User} from "../user/user.entity";
import {EndGameDTO} from "./DTOs/endGameDTO";

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

  describe('gameIsFinished', () => {
    const game: Game = {
      id: 1,
      finished: false,
      draw: false,
      board: [null, null, null, null, null, null, null, null, null],
      turn: new User(),
      player1: new User(),
      player2: new User(),
      winner: null,
      loser: null,
      time: new Date(),
      player1EloBefore: 1200,
      player2EloBefore: 1200,
      player1EloAfter: 1200,
      player2EloAfter: 1200,
      users: [new User(), new User()],
      validate: jest.fn(),
    };

    it('should return false if any row or column or diagonal contains a null value', () => {
      const newGame: Game = {
        ...game,
        board: [1, 1, null, 0, 0, 1, 0, 1, 0],
        validate: jest.fn(),
      };
      expect(provider.gameIsFinished(newGame)).toBe(false);
    });

    it('should return true if no rows or columns or diagonals contain a null value', () => {
      const newGame: Game = {
        ...game,
        board: [1, 0, 1, 0, 0, 1, 0, 1, 0],
        validate: jest.fn(),
      };
      expect(provider.gameIsFinished(newGame)).toBe(true);
    });
  });

  describe('calculateGameOutcome', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    const gameData: Game = {
      id: 1,
      finished: false,
      draw: false,
      board: [null, null, null, null, null, null, null, null, null],
      turn: new User(),
      player1: new User(),
      player2: new User(),
      winner: null,
      loser: null,
      time: new Date(),
      player1EloBefore: 1200,
      player2EloBefore: 1200,
      player1EloAfter: 1200,
      player2EloAfter: 1200,
      users: [new User(), new User()],
      validate: jest.fn()
    };

    it('should return an EndGameDTO with player2 as the winner if sum is 3', () => {
      const game = {
        ...gameData,
        board: [1, 1, 1, 0, 0, null, null, null, null],
        validate: jest.fn(),
      }
      const result = provider.calculateGameOutcome(game);
      expect(result).toEqual(new EndGameDTO(game.player2, game.player1, game.player1, game.player2, false));
    });

    it('should return an EndGameDTO with player1 as the winner if sum is 0', () => {
      const game = {
        ...gameData,
        board: [0, 0, 0, 1, 1, null, null, null, null],
        validate: jest.fn(),
      };

      const result = provider.calculateGameOutcome(game);
      expect(result).toEqual(new EndGameDTO(game.player1, game.player2, game.player1, game.player2, false));
    });

    it('should return an EndGameDTO with a draw if the game is finished and no winner', () => {
      const game = {
        ...gameData,
        board: [1, 1, 0, 0, 0, 1, 1, 0, 1],
        validate: jest.fn(),
      };

      const result = provider.calculateGameOutcome(game);
      expect(result).toEqual(new EndGameDTO(null, null, game.player1, game.player2, true));
    });

    it('should return null if the game is not finished and no winner', () => {
      const game = {
        ...gameData,
        board: [1, 1, 0, 0, null, 1, 1, 0, null],
        validate: jest.fn(),
      };

      const result = provider.calculateGameOutcome(game);
      expect(result).toBeNull();
    });
  });
});
