import {
  Body,
  Controller,
  Get,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt/auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../auth/roles/enum.roles';
import { ResponseDTO } from '../DTOs/responseDTO';
import { ResponseUserDTO } from './DTOs/responseUserDTO';
import { MultiUsersResponseDTO } from './DTOs/multipleUsersResponseDTO';
import { UserService } from './user.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDTO } from './DTOs/updateUserDTO';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @Roles(Role.Admin)
  @ApiResponse({ type: MultiUsersResponseDTO })
  async getAllUsers(): Promise<MultiUsersResponseDTO> {
    return await this.userService.getUsers();
  }
  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  @ApiResponse({ type: ResponseUserDTO })
  async changePassword(
    @Body() updateUserDTO: UpdateUserDTO
  ): Promise<ResponseDTO> {
    if (!updateUserDTO.email || !updateUserDTO.currentPassword) {
      return new ResponseDTO(false, 'Email and password are required');
    }
    return await this.userService.updatePassword(
      updateUserDTO.email,
      updateUserDTO.currentPassword,
      updateUserDTO.newPassword
    );
  }
  @UseGuards(JwtAuthGuard)
  @Put('change-img')
  @ApiResponse({ type: ResponseUserDTO })
  async changeImg(@Body() updateUserDTO: UpdateUserDTO): Promise<ResponseDTO> {
    return await this.userService.changeImage(
      updateUserDTO.email,
      updateUserDTO.profilePicture
    );
  }
}
