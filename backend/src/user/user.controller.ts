import {
  Body,
  Controller,
  Delete,
  Get, Param, ParseIntPipe,
  Put, Session,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../auth/roles/enum.roles';
import { SessionData } from 'express-session';
import { ResponseDTO } from '../DTOs/responseDTO';
import { ResponseUserDTO } from './DTOs/responseUserDTO';
import { MultiUsersResponseDTO } from './DTOs/multipleUsersResponseDTO';
import { UpdateUserDTO } from './DTOs/updateUserDTO';
import { AuthService } from '../auth/auth.service';
import { UserService } from './user.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Delete('deleteUserProfile')
  @ApiResponse({ type: ResponseDTO })
  async deleteOwnProfile(
    @Session() session: SessionData,
  ): Promise<ResponseDTO> {
    const user = (await this.authService.getLoggedInUser(session)).user;
    return await this.userService.deleteUserProfile(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete('delete/:id')
  @ApiResponse({ type: ResponseDTO })
  async delete(@Param('id', ParseIntPipe) id: number): Promise<ResponseDTO> {
    return await this.userService.deleteUserProfile(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiResponse({ type: ResponseUserDTO })
  async getOneUser(@Param('id') id: string): Promise<ResponseUserDTO> {
    return await this.userService.getUser(Number(id));
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.Admin)
  @ApiResponse({ type: MultiUsersResponseDTO })
  async getAllUsers(): Promise<MultiUsersResponseDTO> {
    return await this.userService.getUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Put('update')
  @ApiResponse({ type: ResponseDTO })
  async updateUser(
    @Session() session: SessionData,
    @Body() updateUserDTO: UpdateUserDTO,
  ): Promise<ResponseDTO> {
    return await this.userService.updateUser(session, updateUserDTO);
  }
}
