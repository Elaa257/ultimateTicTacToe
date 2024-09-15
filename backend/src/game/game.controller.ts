//controller for game endpoints

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GameService } from './game.service';
import { UpdateGameRequestDto } from './DTOs/updateGameRequestDto';
import { GameResponseDto } from './DTOs/gameResponseDto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { MultiGamesResponseDTO } from './DTOs/multiGamesResponseDTO';
import { ResponseDTO } from '../DTOs/responseDTO';
import { JwtAuthGuard } from '../auth/jwt/auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '../auth/roles/enum.roles';

@ApiTags('game')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  //get all games
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  @ApiResponse({ type: MultiGamesResponseDTO })
  async getGames(): Promise<MultiGamesResponseDTO> {
    return await this.gameService.getGames();
  }

  //get specific game
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  @ApiResponse({ type: GameResponseDto })
  async getGame(
    @Param('id', ParseIntPipe) id: number
  ): Promise<GameResponseDto> {
    return await this.gameService.getGame(id);
  }

  //get all games for a specific user
  @UseGuards(JwtAuthGuard)
  @Get('userGames')
  @ApiResponse({ type: MultiGamesResponseDTO })
  async getUserGames(@Req() req): Promise<MultiGamesResponseDTO> {
    const userId = req.user.id;
    return await this.gameService.getUserGames(userId);
  }

  //create new game
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiResponse({ type: ResponseDTO })
  async createGame(
    @Query('player1Id', ParseIntPipe) player1Id: number,
    @Query('player2Id', ParseIntPipe) player2Id: number
  ): Promise<ResponseDTO> {
    return await this.gameService.create(player1Id, player2Id);
  }

  //delete a specific game
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete('delete')
  @ApiResponse({ type: ResponseDTO })
  async deleteGame(
    @Param('id', ParseIntPipe) id: number
  ): Promise<ResponseDTO> {
    return await this.gameService.deleteGame(id);
  }

  //update a specific game
  @UseGuards(JwtAuthGuard)
  @Put('update')
  @ApiResponse({ type: GameResponseDto })
  async updateGame(
    @Param('id', ParseIntPipe) id: number,
    @Param('board index', ParseIntPipe) boardIndex: number,
  ): Promise<GameResponseDto> {
    return this.gameService.makeMove(id, boardIndex);
  }
}
