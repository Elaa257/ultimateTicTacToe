export interface UserDTO {
  id: number;
  email: string;
  nickname: string;
  role: string;
  elo: number;
}

export interface UsersDTO {
  message: string;
  users?: UserDTO[]; // Optional array of UserDTO
}
