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
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private gameRepo: Repository<Game>,
    private gameLogicService: GameLogicService,
    private userService: UserService,
    private eventEmitter: EventEmitter2
  ) {}

  //create new game
  async create(player1Id: number, player2Id: number): Promise<ResponseDTO> {
    try {
      const player1 = await this.userService.getUser(player1Id);
      const player2 = await this.userService.getUser(player2Id);

      if (!player1.user || !player2.user) {
        return new ResponseDTO(
          false,
          `Could not find one or both players: ${player1.message}, ${player2.message}`
        );
      }

      const newGame = await this.gameRepo.create(
        new CreateGameRequestDto(player1.user, player2.user)
      );
      const saveGame = await this.gameRepo.save(newGame);
      this.eventEmitter.emit('game.started', newGame);
      console.log("new game emmited to admin")

      if (!saveGame.id) {
        return new ResponseDTO(false, 'Failed to generate game ID');
      }

      console.log('gameID: ', saveGame.id);

      return new ResponseDTO(
        true,
        'Game successfully created',
        undefined,
        saveGame.id
      );
    } catch (error) {
      return new ResponseDTO(false, `Could not create new game. ${error}`);
    }
  }

  //get all games
  async getGames(): Promise<MultiGamesResponseDTO> {
    try {
      const games = await this.gameRepo.find({
        relations: ['player1', 'player2', 'turn', 'winner', 'loser'],
      });
      return new MultiGamesResponseDTO(
        `Successfully retrieved all available games.`,
        games
      );
    } catch (error) {
      return new MultiGamesResponseDTO(
        `There was an error retrieving games: ${error}`
      );
    }
  }

  //get specific game
  async getGame(id: number): Promise<GameResponseDto> {
    try {
      const game = await this.gameRepo.findOne({
        where: { id: id },
        relations: ['player1', 'player2', 'turn', 'winner', 'loser'],
      });
      if (game === null) {
        return new GameResponseDto(
          `Game with id ${id} could not be found.`,
          null
        );
      }
      return new GameResponseDto(
        `Successfully retrieved game with id ${id}.`,
        game
      );
    } catch (error) {
      return new GameResponseDto(
        `There was an error retrieving game with id ${id}: ${error}`
      );
    }
  }

  //get games for a specific user
  async getUserGames(userId: number): Promise<MultiGamesResponseDTO> {
    try {
      const user = await this.userService.getUser(userId);
      const userGames = await this.gameRepo.find({
        where: [{ player1: user.user }, { player2: user.user }],
        relations: ['player1', 'player2', 'turn', 'winner', 'loser'], // Include the related users
      });
      console.log(userGames);
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
        userGames
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
      this.eventEmitter.emit('game.ended', game);
      await this.gameRepo.delete(id);
      return new ResponseDTO(true, `Game with id ${id} successfully deleted`);
    } catch (error) {
      return new ResponseDTO(
        false,
        `Game with id ${id} could not be deleted. ${error}`
      );
    }
  }

  //make a move
  async makeMove(id: number, boardIndex: number): Promise<GameResponseDto> {
    console.log('id: ', id);
    console.log('type id: ', typeof id);
    let game = await this.gameRepo.findOne({
      where: { id: id },
      relations: ['player1', 'player2', 'turn', 'winner', 'loser'],
    });
    if (game === null) {
      return new GameResponseDto(`Game with id ${id} could not be found`);
    }

    this;
    try {
      const player = (await this.userService.getUser(game.turn.id)).user;
      this.updateGame(game, boardIndex, player);
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
        `An error occured while making the move: ${error}`
      );
    }
  }

  private updateGame(game: Game, index: number, player: User): void {
    if (game.turn.id !== player.id) {
      throw new Error(`Es ist nicht der Zug von Spieler ${player.id}`);
    }

    if (index < 0 || index >= game.board.length) {
      throw new Error(`Index ${index} liegt außerhalb des gültigen Bereichs`);
    }

    if (
      game.board[index] !== null &&
      game.board[index] !== undefined &&
      Number(game.board[index]) !== -1
    ) {
      throw new Error(`Feld an Index ${index} ist bereits belegt`);
    }

    const PLAYER1_SYMBOL = 0;
    const PLAYER2_SYMBOL = 1;
    const playerSymbol =
      player.id === game.player1.id ? PLAYER1_SYMBOL : PLAYER2_SYMBOL;
    game.board[index] = playerSymbol;

    game.turn = player.id === game.player1.id ? game.player2 : game.player1;
  }
}
