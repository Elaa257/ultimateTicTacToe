//controller for game endpoints

import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards} from '@nestjs/common';
import {CreateGameRequestDto} from "./DTOs/createGameRequestDto";
import {GameService} from "./game.service";
import {UpdateGameRequestDto} from "./DTOs/updateGameRequestDto";
import {GameResponseDto} from "./DTOs/gameResponseDto";
import {ApiResponse, ApiTags} from "@nestjs/swagger";
import {MultiGamesResponseDTO} from "./DTOs/multiGamesResponseDTO";
import {ResponseDTO} from "../DTOs/responseDTO";
import {JwtAuthGuard} from "../auth/jwt/auth.guard";
import {RolesGuard} from "../auth/roles/roles.guard";
import {Roles} from "../auth/roles/roles.decorator";
import {Role} from "../auth/roles/enum.roles";

//TODO: add check whether user is logged in
//TODO: add check whether user is admin if required
@ApiTags('game')
@Controller('game')
export class GameController {

    constructor(private readonly gameService: GameService) {}

    //get all games
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get()
    @ApiResponse({ type: MultiGamesResponseDTO })
    async getGames(): Promise<MultiGamesResponseDTO> {
        return await this.gameService.getGames();
    }

    //get specific game
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Get(":id")
    @ApiResponse({ type: GameResponseDto })
    async getGame(@Param("id", ParseIntPipe) id: number): Promise<GameResponseDto> {
        return await this.gameService.getGame(id);
    }

    //create new game
    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiResponse({ type: ResponseDTO })
    async createGame(@Body() createGameRequestDto: CreateGameRequestDto): Promise<ResponseDTO> {
        return await this.gameService.create(createGameRequestDto);
    }

    //delete a specific game
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.Admin)
    @Delete("delete")
    @ApiResponse({ type: ResponseDTO })
    async deleteGame(@Param("id", ParseIntPipe) id: number): Promise<ResponseDTO> {
        return await this.gameService.deleteGame(id);
    }

    //update a specific game
    @UseGuards(JwtAuthGuard)
    @Put("update")
    @ApiResponse({ type: GameResponseDto })
    async updateGame(@Param("id", ParseIntPipe) id: number, @Body() updateGameRequestDTO: UpdateGameRequestDto): Promise<GameResponseDto> {
        return this.gameService.makeMove(id, updateGameRequestDTO);
    }
}
