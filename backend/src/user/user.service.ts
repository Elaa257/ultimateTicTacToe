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

  async changeImage(
    email: string,
    img: string
  ): Promise<{ access_token?: string; response: ResponseDTO }> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      return { response: new ResponseDTO(false, 'User not found') };
    }

    try {
      const mimeMatch = img.match(/^data:image\/(jpeg|png|gif|bmp);base64,/);
      if (!mimeMatch) {
        return { response: new ResponseDTO(false, 'Invalid image format') };
      }

      const base64Data = img.replace(/^data:image\/[a-z]+;base64,/, '');

      if (base64Data === img) {
        return {
          response: new ResponseDTO(
            false,
            'MIME type was not removed correctly'
          ),
        };
      }

     const update = await this.userRepository.update(user.id, { profilePicture: base64Data });

      console.log("update: " + update);

      // Reload the user to get the updated profile picture
      const updatedUser = await this.userRepository.findOne({
        where: { email },
      });

      const payload = {
        id: updatedUser.id,
        email: updatedUser.email,
        nickname: updatedUser.nickname,
        role: updatedUser.role,
        elo: updatedUser.elo,
        profilePicture: updatedUser.profilePicture,
        wins: updatedUser.wins,
        loses: updatedUser.loses,
        draw: updatedUser.draw,
      };

      const newToken = await this.jwtService.signAsync(payload);

      return {
        access_token: newToken,
        response: new ResponseDTO(
          true,
          `User: ${updatedUser.nickname}, has successfully updated`,
          updatedUser
        ),
      };
    } catch (error) {
      return {
        response: new ResponseDTO(
          false,
          `Image could not be updated: ${error}`
        ),
      };
    }
  }
}
