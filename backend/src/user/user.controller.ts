import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put, Res,
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
import { FastifyReply } from 'fastify';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  /*
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User)
  @Delete('deleteUserProfile')
  @ApiResponse({ type: ResponseDTO })
  async deleteOwnProfile(
    @Session() session: SessionData
  ): Promise<ResponseDTO> {
    //kam vorher ausm authService
    const user = (await this.getLoggedInUser(session)).user;
    return await this.userService.deleteUserProfile(user.id);
  }
*/
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
  /*
    @UseGuards(JwtAuthGuard)
    @Put('update')
    @ApiResponse({ type: ResponseDTO })
    async updateUser(
      @Session() session: SessionData,
      @Body() updateUserDTO: UpdateUserDTO
    ): Promise<ResponseDTO> {
      return await this.userService.updateUser(session, updateUserDTO);
    }
  
    
    @UseGuards(JwtAuthGuard)
    @Get('current-user')
    @ApiResponse({ type: ResponseUserDTO })
    async getLoggedInUser(@Req() req): Promise<ResponseUserDTO> {
      const user = req.user;
      console.log('Backend current-user: ', user);
      return ;
    }
  
     */
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
  async changeImg(
    @Body() updateUserDTO: UpdateUserDTO,
    @Res() reply: FastifyReply
  ): Promise<void> {
    console.log('payload im Backend: ', updateUserDTO.profilePicture);
    const { access_token, response } = await this.userService.changeImage( updateUserDTO.email, updateUserDTO.profilePicture);
    reply.clearCookie('access_token', { path: '/' });
    console.log('Cookie cleared');
    reply
      .setCookie('access_token', access_token, {
        httpOnly: true, // Makes the cookie accessible only by the web server
        path: '/', //Makes the cookie accessible by all routes
      })
      .send(response);
  }
}
