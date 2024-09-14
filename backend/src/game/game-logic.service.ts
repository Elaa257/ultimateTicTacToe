import { Injectable } from '@nestjs/common';
import { Game } from './game.entity';
import { EndGameDTO } from './DTOs/endGameDTO';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { ResponseDTO } from '../DTOs/responseDTO';
import { UpdateUserDTO } from '../user/DTOs/updateUserDTO';
//TODO: add elo calculation before creating new EndGameDTO -> will be part of the user service
@Injectable()
export class GameLogicService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {}

  //checks whether there is winner or if the game is draw
  calculateGameOutcome(game: Game): EndGameDTO {
    const board: number[] = game.board;

    const rows: number[][] = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const row of rows) {
      const [a, b, c] = row;
      if (
        Number(board[a]) !== -1 &&
        Number(board[a]) === Number(board[b]) &&
        Number(board[b]) === Number(board[c])
      ) {
        const winner = board[a] === 0 ? game.player1 : game.player2;
        const loser = board[a] === 0 ? game.player2 : game.player1;
        this.updateWinningStatistic(winner, loser);
        const endGameDTO = new EndGameDTO(
          winner,
          loser,
          game.player1,
          game.player2,
          false
        );
        return endGameDTO;
      }
    }

    if (this.gameIsFinished(game)) {
      this.updateDraw(game.player1, game.player2);
      const endGameDTO = new EndGameDTO(
        null,
        null,
        game.player1,
        game.player2,
        true
      );
      return endGameDTO;
    }

    return null;
  }

  //checks whether all fields are occupied
  gameIsFinished(game: Game): boolean {
    const board: number[] = game.board;

    const rows: number[][] = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const row of rows) {
      console.log(board[row[0]]);
      console.log(board[row[1]]);
      console.log(board[row[2]]);
      if (
        Number(board[row[0]]) === -1 ||
        Number(board[row[1]]) === -1 ||
        Number(board[row[2]]) === -1
      )
        return false;
    }
    return true;
  }

  async updateWinningStatistic(
    winner: User,
    loser: User
  ): Promise<ResponseDTO> {
    try {
      winner.wins += 1;
      await this.userRepo.save(winner);
      loser.loses += 1;
      await this.userRepo.save(loser);
      await this.calculateNewElo(winner, loser, 'winner');
      await this.calculateNewElo(loser, winner, 'loser');
      return new ResponseDTO(true, `Successfully updated winning statistic`);
    } catch (error) {
      return new ResponseDTO(
        false,
        `Winning statistic could not be updated. Error: ${error}`
      );
    }
  }

  async updateDraw(player1: User, player2: User): Promise<ResponseDTO> {
    try {
      player1.draw += 1;
      await this.userRepo.save(player1);
      player2.draw += 1;
      await this.userRepo.save(player2);
      await this.calculateNewElo(player1, player2);
      await this.calculateNewElo(player2, player1);
      return new ResponseDTO(true, `Successfully updated winning statistic`);
    } catch (error) {
      return new ResponseDTO(
        false,
        `Winning statistic could not be updated. Error: ${error}`
      );
    }
  }

  /**
   * CalculateNewElo needs two valid UserObjects and an calculated endstate.
   * @param player
   * @param opponent
   * @param endState
   */
  async calculateNewElo(
    player: UpdateUserDTO,
    opponent: UpdateUserDTO,
    endState?: string
  ): Promise<ResponseDTO> {
    try {
      const adjustFactor: number = 20;
      let gamePoint: number = 0.5;
      const expectedValue: number =
        1 / (1 + 10 ** ((opponent.elo - player.elo) / 400));
      switch (endState) {
        case 'winner':
          gamePoint = 1;
          break;
        case 'loser':
          gamePoint = 0;
          break;
      }
      //calculate the new elo points
      let newEloPoints =
        player.elo + adjustFactor * (gamePoint - expectedValue);
      if (newEloPoints < 0) {
        newEloPoints = 0;
      }
      await this.userRepo.update(player.nickname, { elo: newEloPoints });

      return new ResponseDTO(
        true,
        `the new Elo-Points of ${player.nickname} are ${newEloPoints} now.`
      );
    } catch (error) {
      return new ResponseDTO(
        false,
        `Elo-Points of ${player.nickname} could not be updated.`
      );
    }
  }
}
