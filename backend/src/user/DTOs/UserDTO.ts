export class UserDTO {
  id: number;
  email: string;
  nickname: string;
  role: string;
  elo: number;
  profilePicture: Buffer;
  wins: number;
  loses: number;
  draw: number;
}
