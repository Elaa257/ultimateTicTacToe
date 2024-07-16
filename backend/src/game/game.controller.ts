import {Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Put} from '@nestjs/common';
import {Game} from "./game.entity";
import {DataSource, Repository} from "typeorm";
import {CreateGameDTO} from "./DTOs/createGameDTO";
import {UpdateGameDTO} from "./DTOs/updateGameDTO";

//TODO: add check whether user is logged in
//TODO: add check whether user is admin if required
@Controller('game')
export class GameController {

    private readonly gameRepo: Repository<Game>;

    constructor(private dataSource: DataSource) {
        this.gameRepo = dataSource.getRepository(Game);
    }

    //get all games
    @Get()
    async getGames(): Promise<Game[]> {
        return await this.gameRepo.find();
    }

    //get specific game
    @Get(":id")
    async getGame(@Param("id", ParseIntPipe) id: number): Promise<Game> {
        const game: Game = await this.gameRepo.findOne({ where: { id: id }});
        if (game == null) {
            throw new NotFoundException();
        }
        return game;
    }

    //create new game
    @Post()
    async createGame(@Body() createGameDTO: CreateGameDTO): Promise<Game> {
        const newGame = this.gameRepo.create(createGameDTO);

        return await this.gameRepo.save(newGame);
    }

    //delete a specific game
    @Delete(":id")
    async deleteGame(@Param("id", ParseIntPipe) id: number): Promise<void> {
        if (! await this.gameRepo.exist({ where: { id: id } })) {
            throw new NotFoundException();
        }
        await this.gameRepo.delete(id);
    }

    //update a specific game
    @Put(":id")
    async updateTodo(@Param("id", ParseIntPipe) id: number, @Body() updateGameDTO: UpdateGameDTO): Promise<Game> {
        const game: Game = await this.gameRepo.findOne({ where: { id: id }});

        if (game == null) { throw new NotFoundException(); }

        // Update game properties
        Object.assign(game, updateGameDTO);

        await this.gameRepo.save(game);
        return game;
    }
}
