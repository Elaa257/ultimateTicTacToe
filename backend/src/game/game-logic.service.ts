import { Injectable } from '@nestjs/common';
import { Game } from './game.entity';
import { EndGameDTO } from './DTOs/endGameDTO';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { ResponseDTO } from '../DTOs/responseDTO';
import { UpdateUserDTO } from '../user/DTOs/updateUserDTO';

@Injectable()
export class GameLogicService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {}

  winnerElo: number;
  loserElo: number;

  async calculateGameOutcome(game: Game): Promise<EndGameDTO> {
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
        const winner = Number(board[a]) === 0 ? game.player1 : game.player2;
        const loser = Number(board[a]) === 0 ? game.player2 : game.player1;
        await this.updateWinningStatistic(winner, loser);
        if (winner.id === game.player1.id) {
          const endGameDTO = new EndGameDTO(
            winner,
            loser,
            this.winnerElo,
            this.loserElo,
            false
          );
          return endGameDTO;
        } else {
          const endGameDTO = new EndGameDTO(
            winner,
            loser,
            this.loserElo,
            this.winnerElo,
            false
          );
          return endGameDTO;
        }
      }
    }

    if (this.gameIsFinished(game)) {
      await this.updateDraw(game.player1, game.player2);
      const endGameDTO = new EndGameDTO(
        null,
        null,
        this.winnerElo,
        this.loserElo,
        true
      );
      return endGameDTO;
    }

    return null;
  }

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
      this.winnerElo = await this.calculateNewElo(winner, loser, 'winner');
      this.loserElo = await this.calculateNewElo(loser, winner, 'loser');
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
      this.winnerElo = await this.calculateNewElo(player1, player2);
      this.loserElo = await this.calculateNewElo(player2, player1);
      return new ResponseDTO(true, `Successfully updated winning statistic`);
    } catch (error) {
      return new ResponseDTO(
        false,
        `Winning statistic could not be updated. Error: ${error}`
      );
    }
  }

  async calculateNewElo(
    player: UpdateUserDTO,
    opponent: UpdateUserDTO,
    endState?: string
  ): Promise<number> {
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
      let newEloPoints =
        player.elo + adjustFactor * (gamePoint - expectedValue);
      if (newEloPoints < 0) {
        newEloPoints = 0;
      }
      await this.userRepo.update(
        { nickname: player.nickname },
        { elo: newEloPoints }
      );

      return newEloPoints;
    } catch (error) {
      return player.elo;
    }
  }
}
