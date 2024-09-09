import { UserDTO } from '../../profile/DTOs/userDTO';

export interface UserResponseDTO {
  ok: boolean;
  message: string;
  user?:UserDTO;
}
