import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { ResponseUserDTO } from './DTOs/responseUserDTO';
import { MultiUsersResponseDTO } from './DTOs/multipleUsersResponseDTO';
import { SessionData } from 'express-session';
import { UpdateUserDTO } from './DTOs/updateUserDTO';
import { ResponseDTO } from '../DTOs/responseDTO';
import { AuthService } from '../auth/auth.service';
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
    session: SessionData,
    updateUser: UpdateUserDTO
  ): Promise<ResponseDTO> {
    try {
      //kam vorher ausm authservice
      const userResponse = await this.getLoggedInUser(session);
      await this.userRepository.update(userResponse.user.id, {
        ...updateUser,
        password: this.authService.hashPassword(updateUser.password),
      });
      return new ResponseDTO(true, 'updated Account successfully');
    } catch (error) {
      console.log(error);
      return new ResponseDTO(false, 'User could not be updated ' + error);
    }
  }

  async deleteUserProfile(id: number) {
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

  async getLoggedInUser(user: any): Promise<ResponseUserDTO> {
    try {
      const foundUser = await this.userRepository.findOne({
        where: { email: user.email },
      });
      if (!foundUser) {
        return new ResponseUserDTO(`User with email ${user.email} not found`);
      }
      return new ResponseUserDTO('User fetched successfully', foundUser);
    } catch (error) {
      return new ResponseUserDTO(`Error fetching user: ${error.message}`);
    }
  }
}
