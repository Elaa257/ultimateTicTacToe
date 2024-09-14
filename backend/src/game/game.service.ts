//controls general game operations

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from './game.entity';
import { Repository } from 'typeorm';
import { CreateGameRequestDto } from './DTOs/createGameRequestDto';
import { UpdateGameRequestDto } from './DTOs/updateGameRequestDto';
import { GameLogicService } from './game-logic.service';
import { GameResponseDto } from './DTOs/gameResponseDto';
import { ResponseDTO } from '../DTOs/responseDTO';
import { MultiGamesResponseDTO } from './DTOs/multiGamesResponseDTO';
import { UserService } from '../user/user.service';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private gameRepo: Repository<Game>,
    private gameLogicService: GameLogicService,
    private userService: UserService,
  ) {}

  //create new game
  async create(
    createGameRequestDto: CreateGameRequestDto,
  ): Promise<ResponseDTO> {
    try {
      const newGame = this.gameRepo.create(createGameRequestDto);
      await this.gameRepo.save(newGame);
      return new ResponseDTO(true, 'Game successfully created');
    } catch (error) {
      return new ResponseDTO(false, `Could not create new game. ${error}`);
    }
  }

  //get all games
  async getGames(): Promise<MultiGamesResponseDTO> {
    try {
      const games = await this.gameRepo.find();
      return new MultiGamesResponseDTO(
        `Successfully retrieved all available games.`,
        games,
      );
    } catch (error) {
      return new MultiGamesResponseDTO(
        `There was an error queueing games: ${error}`,
      );
    }
  }

  //get specific game
  async getGame(id: number): Promise<GameResponseDto> {
    try {
      const game = await this.gameRepo.findOne({ where: { id: id } });
      if (game === null) {
        return new GameResponseDto(
          `Game with id ${id} could not be found.`,
          null,
        );
      }
      return new GameResponseDto(
        `Successfully retrieved game with id ${id}.`,
        game,
      );
    } catch (error) {
      return new GameResponseDto(
        `There was an error queueing game with id ${id}: ${error}`,
      );
    }
  }

  //get games for a specific user
  async getUserGames(userId: number): Promise<MultiGamesResponseDTO> {
    try {
      const user = await this.userService.getUser(userId);
      const userGames = await this.gameRepo.find({
        where: [{ player1: user.user }, { player2: user.user }],
      });
      return new MultiGamesResponseDTO(
        `Successfully retrieved all available games for user ${userId}.`,
        userGames,
      );
    } catch(error) {
      return new MultiGamesResponseDTO(
        `There was an error queueing games for user ${userId}: ${error}`,
      );
    }
  }

  //get wins for a specific user
  async getWins(userId: number): Promise<MultiGamesResponseDTO> {
    try {
      const user = await this.userService.getUser(userId);
      const userGames = await this.gameRepo.find({
        where: { winner: user.user }
      });
      return new MultiGamesResponseDTO(
        `Successfully retrieved all available wins for user ${userId}.`,
        userGames,
      );
    } catch(error) {
      return new MultiGamesResponseDTO(
        `There was an error queueing wins for user ${userId}: ${error}`,
      );
    }
  }

  //get loses for a specific user
  async getLoses(userId: number): Promise<MultiGamesResponseDTO> {
    try {
      const user = await this.userService.getUser(userId);
      const userGames = await this.gameRepo.find({
        where: { loser: user.user }
      });
      return new MultiGamesResponseDTO(
        `Successfully retrieved all available loses for user ${userId}.`,
        userGames,
      );
    } catch(error) {
      return new MultiGamesResponseDTO(
        `There was an error queueing loses for user ${userId}: ${error}`,
      );
    }
  }

  //get drwas for a specific user
  async getDraws(userId: number): Promise<MultiGamesResponseDTO> {
    try {
      const user = await this.userService.getUser(userId);
      const userGames = await this.gameRepo.find({
        where: [
          { player1: user.user, draw: true },
          { player2: user.user, draw: true }
        ]
      });

      return new MultiGamesResponseDTO(
        `Successfully retrieved all available draws for user ${userId}.`,
        userGames,
      );
    } catch(error) {
      return new MultiGamesResponseDTO(
        `There was an error queueing draws for user ${userId}: ${error}`,
      );
    }
  }

  //delete a specific game
  async deleteGame(id: number): Promise<ResponseDTO> {
    const game: Game = await this.gameRepo.findOne({
      where: {
        id: id,
      },
    });
    if (game == null) {
      return new ResponseDTO(false, `Game with id ${id} could not be found`);
    }
    try {
      await this.gameRepo.delete(id);
      return new ResponseDTO(true, `Game with id ${id} successfully deleted`);
    } catch (error) {
      return new ResponseDTO(
        false,
        `Game with id ${id} could not be deleted. ${error}`,
      );
    }
  }

  //make a move
  async makeMove(
    id: number,
    updateGameRequestDTO: UpdateGameRequestDto,
  ): Promise<GameResponseDto> {
    let game: Game = await this.gameRepo.findOne({
      where: {
        id: id,
      },
    });

    if (game === null) {
      return new GameResponseDto(`Game with id ${id} could not be found`);
    }

    try {
      Object.assign(game, updateGameRequestDTO);
      game = await this.gameRepo.save(game);

      const gameOutcome =
        await this.gameLogicService.calculateGameOutcome(game);
      if (gameOutcome !== null) {
        Object.assign(game, gameOutcome);
        game = await this.gameRepo.save(game);
      }
      return new GameResponseDto(`Successfully made move`, game);
    } catch (error) {
      return new GameResponseDto(
        `An error occured while making the move: ${error}`,
      );
    }
  }
}
