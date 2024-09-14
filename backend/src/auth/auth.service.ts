// auth.service.ts
import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResponseDTO } from '../DTOs/responseDTO';
import { RegisterDTO } from './DTOs/registerDTO';
import * as crypto from 'crypto';
import { LoginDTO } from './DTOs/loginDTO';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { ResponseUserDTO } from '../user/DTOs/responseUserDTO';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) {}

  async register(
    registerDTO: RegisterDTO
  ): Promise<{ access_token?: string; response: ResponseDTO }> {
    try {
      const user = this.userRepository.create({
        ...registerDTO,
        password: this.hashPassword(registerDTO.password),
        role: registerDTO.role,
      });
      await this.userRepository.save(user);
      const { password, ...userWithoutPassword } = user;
      const payload = {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
      };
      const access_token = await this.jwtService.signAsync(payload);

      return {
        access_token,
        response: new ResponseDTO(
          true,
          `User: ${user.nickname}, has successfully registered`,
          userWithoutPassword
        ),
      };
    } catch (error) {
      return {
        response: new ResponseDTO(
          false,
          `User couldn't be registered ${error}`
        ),
      };
    }
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (!this.comparePassword(password, user.password)) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async login(
    loginDTO: LoginDTO
  ): Promise<{ access_token?: string; response: ResponseDTO }> {
    try {
      const user = await this.validateUser(loginDTO.email, loginDTO.password);
      const { password, ...userWithoutPassword } = user;
      const payload = {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        role: user.role,
      };

      const access_token = await this.jwtService.signAsync(payload);

      return {
        access_token,
        response: new ResponseDTO(
          true,
          `User: ${user.nickname}, has successfully logged in`,
          userWithoutPassword
        ),
      };
    } catch (error) {
      return { response: new ResponseDTO(false, `Login failed ${error}`) };
    }
  }

  hashPassword(password: string): string {
    return crypto.createHmac('sha256', password).digest('hex');
  }

  private comparePassword(
    password: string,
    storedPasswordHash: string
  ): boolean {
    const hashedPassword = this.hashPassword(password);
    return hashedPassword === storedPasswordHash;
  }
  async getCurrentUser(userID: string): Promise<ResponseUserDTO> {
    const user = await this.userRepository.findOne({
      where: { id: Number(userID) },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    console.log('user in getCurrentUser service: ', user);
    return new ResponseUserDTO('Current User is: ', user);
  }
}
