import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { ResponseUserDTO } from './DTOs/responseUserDTO';
import { MultiUsersResponseDTO } from './DTOs/multipleUsersResponseDTO';
import { UpdateUserDTO } from './DTOs/updateUserDTO';
import { ResponseDTO } from '../DTOs/responseDTO';
import { AuthService } from '../auth/auth.service';
import { UserDTO } from './DTOs/UserDTO';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private authService: AuthService,
    private jwtService: JwtService
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
      await this.userRepository.update(user.id, {
        ...updateUser,
        password: this.authService.hashPassword(updateUser.currentPassword),
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

  //check the validation for the new Password!
  async updatePassword(
    email: string,
    password: string,
    newPassword: string
  ): Promise<ResponseDTO> {
    const user = await this.userRepository.findOne({ where: { email } });
    const hashedPassword = this.authService.hashPassword(password);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user.password !== hashedPassword) {
      return new ResponseDTO(false, 'Password not match');
    }
    const newHashedPassword = this.authService.hashPassword(newPassword);
    try {
      await this.userRepository.update(user.id, {
        password: newHashedPassword,
      });
      return new ResponseDTO(true, 'Password updated');
    } catch (error) {
      return new ResponseDTO(false, `User couldn't be updated ${error}`);
    }
  }

  async changeImage(email: string, img: string): Promise<ResponseDTO> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      return new ResponseDTO(false, 'User not found') ;
    }

    try {
      user.profilePicture = img;

      await this.userRepository.save(user);

      return new ResponseDTO(true, 'Profile picture updated successfully');
    } catch (error) {
      return new ResponseDTO(false, 'An error occurred');
    }
  }
}
