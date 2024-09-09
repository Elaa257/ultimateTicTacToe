import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { ResponseUserDTO } from './DTOs/responseUserDTO';
import { MultiUsersResponseDTO } from './DTOs/multipleUsersResponseDTO';
import { UpdateUserDTO } from './DTOs/updateUserDTO';
import { ResponseDTO } from '../DTOs/responseDTO';
import { AuthService } from '../auth/auth.service';
import { UserDTO } from './DTOs/UserDTO';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private authService: AuthService
  ) {}

  async getUser(id: number): Promise<ResponseUserDTO> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });
      return new ResponseUserDTO(`User ${user.id} found successfully`, user);
    } catch (error) {
      return new ResponseUserDTO(`User with id ${id} could not be found`);
    }
  }

  async getUsers(): Promise<MultiUsersResponseDTO> {
    try {
      const users = await this.userRepository.find();
      return new MultiUsersResponseDTO(
        'Successfully retrieved all avaible users',
        users
      );
    } catch (error) {
      return new MultiUsersResponseDTO(`Database error`);
    }
  }

  async updateUser(
    user: UserDTO,
    updateUser: UpdateUserDTO
  ): Promise<ResponseDTO> {
    try {
      await this.userRepository.update(user.user.id, {
        ...updateUser,
        password: this.authService.hashPassword(updateUser.password),
      });
      return new ResponseDTO(true, 'updated Account successfully');
    } catch (error) {
      console.log(error);
      return new ResponseDTO(false, 'User could not be updated ' + error);
    }
  }

  async deleteUserProfile(id: number): Promise<ResponseDTO> {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      return new ResponseDTO(false, 'User not found');
    }
    try {
      await this.userRepository.delete(user.id);
      return new ResponseDTO(true, 'Account successfully deleted');
    } catch (error) {
      return new ResponseDTO(false, `User couldn't be deleted ${error}`);
    }
  }
}
