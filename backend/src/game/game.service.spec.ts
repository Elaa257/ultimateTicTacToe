import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import {Repository} from "typeorm";
import {Game} from "./game.entity";
import {CreateGameDTO} from "./DTOs/createGameDTO";
import {User} from "../user/user.entity";
import {getRepositoryToken} from "@nestjs/typeorm";
import {GameLogicService} from "./game-logic.service";
import {UpdateGameDTO} from "./DTOs/updateGameDTO";
import {EndGameDTO} from "./DTOs/endGameDTO";

describe('GameService', () => {
  let provider: GameService;
  let gameRepo: Repository<Game>;
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
      jest.resetAllMocks();
    const module: TestingModule = await Test.createTestingModule({
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

    provider = module.get<GameService>(GameService);
    gameRepo = module.get<Repository<Game>>(getRepositoryToken(Game));
    gameLogicService = module.get<GameLogicService>(GameLogicService);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });

  describe('create', () => {
      beforeEach(() => {
          jest.resetAllMocks();
      });


      it('creates and saves a new game', async () => {
      const player1 = new User();
      const player2 = new User();
      const createGameDto: CreateGameDTO = new CreateGameDTO(player1, player2);

      (gameRepo.create as jest.Mock).mockImplementation((dto) => {
        return {
          id: Date.now(),
          ...dto,
        };
      });

      (gameRepo.save as jest.Mock).mockImplementation((game) => Promise.resolve(game));

      const result = await provider.create(createGameDto);

      expect(gameRepo.create).toHaveBeenCalledWith(createGameDto);
      expect(gameRepo.save).toHaveBeenCalledWith(expect.objectContaining(createGameDto));
      expect(result).toEqual(expect.objectContaining(createGameDto));
    });

    it('throws an error if creating the game is not possible', async () => {
      const player1 = new User();
      const player2 = new User();
      const createGameDto: CreateGameDTO = new CreateGameDTO(player1, player2);

      (gameRepo.create as jest.Mock).mockImplementation(() => {
        throw new Error('Database error');
      });

      await expect(provider.create(createGameDto)).rejects.toThrow('Could not create new game');
    });
  });

  describe('getGames', () => {
      beforeEach(() => {
          jest.resetAllMocks();
      });


      it('should return an array of games', async () => {
      (gameRepo.find as jest.Mock).mockResolvedValue([
        {
          id: 1,
          finished: false,
          draw: false,
          board: [null, null, null, null, null, null, null, null, null],
          player1: {},
          player2: {},
          turn: {},
          winner: null,
          loser: null,
          time: {},
          player1EloBefore: 1,
          player2EloBefore: 1,
          player1EloAfter: null,
          player2EloAfter: null,
        },
        {
          id: 2,
          finished: false,
          draw: false,
          board: [null, null, null, null, null, null, null, null, null],
          player1: {},
          player2: {},
          turn: {},
          winner: null,
          loser: null,
          time: {},
          player1EloBefore: 1,
          player2EloBefore: 1,
          player1EloAfter: null,
          player2EloAfter: null,
        },
      ]);

      const result = await provider.getGames();

      expect(gameRepo.find).toHaveBeenCalled();
      expect(result).toEqual([
        {
          id: 1,
          finished: false,
          draw: false,
          board: [null, null, null, null, null, null, null, null, null],
          player1: {},
          player2: {},
          turn: {},
          winner: null,
          loser: null,
          time: {},
          player1EloBefore: 1,
          player2EloBefore: 1,
          player1EloAfter: null,
          player2EloAfter: null,
        },
        {
          id: 2,
          finished: false,
          draw: false,
          board: [null, null, null, null, null, null, null, null, null],
          player1: {},
          player2: {},
          turn: {},
          winner: null,
          loser: null,
          time: {},
          player1EloBefore: 1,
          player2EloBefore: 1,
          player1EloAfter: null,
          player2EloAfter: null,
        },
      ]);
    });

    it('should return null if error occurs', async () => {
      (gameRepo.find as jest.Mock).mockRejectedValue(new Error('Database error'));

      const result = await provider.getGames();

      expect(gameRepo.find).toHaveBeenCalled();
      expect(result).toBeNull();
    });

  });

  describe('getGame', () => {
    it('should return the specific game', async() => {
      (gameRepo.findOne as jest.Mock).mockResolvedValue(
          {
            id: 1,
            finished: false,
            draw: false,
            board: [null, null, null, null, null, null, null, null, null],
            player1: {},
            player2: {},
            turn: {},
            winner: null,
            loser: null,
            time: {},
            player1EloBefore: 1,
            player2EloBefore: 1,
            player1EloAfter: null,
            player2EloAfter: null,
          },
      );

      const result = await provider.getGame(1);

      expect(gameRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 }});
      expect(result).toEqual(
          {
            id: 1,
            finished: false,
            draw: false,
            board: [null, null, null, null, null, null, null, null, null],
            player1: {},
            player2: {},
            turn: {},
            winner: null,
            loser: null,
            time: {},
            player1EloBefore: 1,
            player2EloBefore: 1,
            player1EloAfter: null,
            player2EloAfter: null,
          },
      );
    });

    it('should return null if error occurs', async () => {
      (gameRepo.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));

      const result = await provider.getGame(1);

      expect(gameRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 }});
      expect(result).toBeNull();
    });
  });

  describe('deleteGame', () => {
      beforeEach(() => {
          jest.resetAllMocks();
      });


      it('should throw an exception if game is not found', async() => {
      (gameRepo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(provider.deleteGame(1)).rejects.toThrow('Not Found');
      expect(gameRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 }});
    });

    it('should delete game when found', async() => {
      (gameRepo.findOne as jest.Mock).mockResolvedValue(
          {
            id: 1,
            finished: false,
            draw: false,
            board: [null, null, null, null, null, null, null, null, null],
            player1: {},
            player2: {},
            turn: {},
            winner: null,
            loser: null,
            time: {},
            player1EloBefore: 1,
            player2EloBefore: 1,
            player1EloAfter: null,
            player2EloAfter: null,
          },
      );
      (gameRepo.delete as jest.Mock).mockResolvedValue({});

      await provider.deleteGame(1);

      expect(gameRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 }});
      expect(gameRepo.delete).toHaveBeenCalledWith(1);
    });

    it('should throw an error if game could not be deleted', async() => {
      (gameRepo.findOne as jest.Mock).mockResolvedValue(
          {
            id: 1,
            finished: false,
            draw: false,
            board: [null, null, null, null, null, null, null, null, null],
            player1: {},
            player2: {},
            turn: {},
            winner: null,
            loser: null,
            time: {},
            player1EloBefore: 1,
            player21EloBefore: 1,
            player1EloAfter: null,
            player2EloAfter: null,
          },
      );
      (gameRepo.delete as jest.Mock).mockRejectedValue(new Error("Database error"));

      await expect(provider.deleteGame(1)).rejects.toThrow('Game could not be deleted');
      expect(gameRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 }});
      expect(gameRepo.delete).toHaveBeenCalledWith(1);
    });
  });

  describe('makeMove', () => {
      beforeEach(() => {
          jest.resetAllMocks();
      });

      it('should throw an exception if game is not found', async() => {
      const updateGameDTO = new UpdateGameDTO([null, null, 1, null, null, null, null, null, null]);

      (gameRepo.findOne as jest.Mock).mockResolvedValue(null);

      await expect(provider.makeMove(1, updateGameDTO)).rejects.toThrow('Not Found');
      expect(gameRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 }});
    });

    it('should safe the updated game board', async() => {
      const updatedBoard = [null, null, 1, null, null, null, null, null, null];
      const updateGameDTO = new UpdateGameDTO(updatedBoard);

      const game = {
            id: 1,
            finished: false,
            draw: false,
            board: [null, null, null, null, null, null, null, null, null],
            player1: new User(),
            player2: new User(),
            turn: new User(),
            winner: null,
            loser: null,
            time: new Date(),
            player1EloBefore: 1,
            player2EloBefore: 1,
            player1EloAfter: null,
            player2EloAfter: null,
          };

      (gameRepo.findOne as jest.Mock).mockResolvedValue(game);
      (gameRepo.save as jest.Mock).mockResolvedValue({
        ...game,
        board: updatedBoard
      });
      (mockGameLogicService.calculateGameOutcome as jest.Mock).mockResolvedValue(null);

      const result = await provider.makeMove(1, updateGameDTO);

      expect(gameRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 }});
      expect(gameRepo.save).toBeCalledTimes(1);
      expect(mockGameLogicService.calculateGameOutcome).toHaveBeenCalled();
      expect(result).toEqual({
        ...game,
        board: updatedBoard
      });
    });

    it('should safe the updated board and mark the game as finished if the game is done', async() => {
      const updatedBoard = [1, 1, 1, 0, null, 0, null, null, null];
      const updateGameDTO = new UpdateGameDTO(updatedBoard);

      const game = {
        id: 1,
        finished: false,
        draw: false,
        board: [1, null, 1, 0, null, 0, null, null, null],
        player1: new User(),
        player2: new User(),
        turn: new User(),
        winner: null,
        loser: null,
        time: new Date(),
        player1EloBefore: 1,
        player2EloBefore: 1,
        player1EloAfter: null,
        player2EloAfter: null,
      };

      const finishedGame = {
        ...game,
        winner: game.player1,
        loser: game.player2,
        draw: false,
        board: updatedBoard,
        finished: true,
        player1EloAfter: undefined,
        player2EloAfter: undefined,
      };

      (gameRepo.findOne as jest.Mock).mockResolvedValue(game);
      (gameRepo.save as jest.Mock).mockResolvedValue({
        ...game,
        board: updatedBoard
      });
      (mockGameLogicService.calculateGameOutcome as jest.Mock).mockResolvedValue(new EndGameDTO(game.player1, game.player2, game.player1, game.player2, false));

      const result = await provider.makeMove(1, updateGameDTO);

      expect(gameRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 }});
      expect(gameRepo.save).toBeCalledTimes(2);
      expect(mockGameLogicService.calculateGameOutcome).toHaveBeenCalled();
      expect(result).toEqual(finishedGame);
    });

    it('should throw an error if the move could not be made', async() => {
      const updatedBoard = [null, null, 1, null, null, null, null, null, null];
      const updateGameDTO = new UpdateGameDTO(updatedBoard);

      (gameRepo.findOne as jest.Mock).mockResolvedValue({});
      (gameRepo.save as jest.Mock).mockRejectedValue(new Error("Database error"));

      await expect(provider.makeMove(1, updateGameDTO)).rejects.toThrow('An error occured while making the move');
      expect(gameRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 }});
      expect(gameRepo.save).toBeCalledTimes(1);
      expect(mockGameLogicService.calculateGameOutcome).not.toHaveBeenCalled();
    });
  });

});
