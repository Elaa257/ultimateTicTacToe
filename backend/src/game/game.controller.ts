//controller for game endpoints

import {Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put} from '@nestjs/common';
import {Game} from "./game.entity";
import {CreateGameDTO} from "./DTOs/createGameDTO";
import {GameService} from "./game.service";
import {UpdateGameDTO} from "./DTOs/updateGameDTO";

//TODO: add check whether user is logged in
//TODO: add check whether user is admin if required
@Controller('game')
export class GameController {

    constructor(private readonly gameService: GameService) {}

    //get all games
    @Get()
    async getGames(): Promise<Game[]> {
        return await this.gameService.getGames();
    }

    //get specific game
    @Get(":id")
    async getGame(@Param("id", ParseIntPipe) id: number): Promise<Game> {
        return await this.gameService.getGame(id);
    }

    //create new game
    @Post()
    async createGame(@Body() createGameDTO: CreateGameDTO): Promise<Game> {
        return await this.gameService.create(createGameDTO);
    }

    //delete a specific game
    @Delete(":id")
    async deleteGame(@Param("id", ParseIntPipe) id: number): Promise<void> {
        await this.gameService.deleteGame(id);
    }

    //update a specific game
    @Put(":id")
    async updateGame(@Param("id", ParseIntPipe) id: number, @Body() updateGameDTO: UpdateGameDTO): Promise<Game> {
        return this.gameService.makeMove(id, updateGameDTO);
    }
}
