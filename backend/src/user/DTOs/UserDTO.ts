import { Game } from '../../game/game.entity';

export interface UserWithoutPassword {
  id: number;
  email: string;
  nickname: string;
  role: string;
  elo: number;
  profilePicture: Buffer;
  wins: number;
  loses: number;
  draw: number;
  games: Game[];
}

export class UserDTO {
  user: UserWithoutPassword;

  constructor(user: UserWithoutPassword) {
    this.user = user;
  }
}
