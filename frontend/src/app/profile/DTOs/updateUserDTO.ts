export interface UpdateUserDTO {
  id: number;
  email: string;
  nickname?: string;
  role?: string;
  elo?: number;
}
