import { UserDTO } from './userDTO';

export interface ResponseDTO {
  ok?:boolean;
  message?:string;
  payload?:Payload;
  user?:UserDTO;
}
export interface Payload{
  currentPassword:string;
  newPassword:string;
  email:string;
}
