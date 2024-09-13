export interface UserDTO {
  id: number;
  email: string;
  nickname: string;
  role: string;
  elo: number;
  profilePicture: string;
  wins:number;
  draw:number;
  loses:number
}

export interface UsersDTO {
  message: string;
  users?: UserDTO[];
}
