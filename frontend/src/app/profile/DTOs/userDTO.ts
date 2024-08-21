export interface UserDTO {
  user: {
    id: number;
    email: string;
    nickname: string;
    role: string;
    elo: number;
  };
}
