//controls general game operations

import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Game} from "./game.entity";
import {Repository} from "typeorm";
import {CreateGameDTO} from "./DTOs/createGameDTO";
import {UpdateGameDTO} from "./DTOs/updateGameDTO";
import {GameLogicService} from "./game-logic.service";
import {User} from "../user/user.entity";

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(Game)
        private gameRepo: Repository<Game>,
        private userRepo: Repository<User>,
        private gameLogicService: GameLogicService,
    ) {}

    //create new game
    async create(createGameDto: CreateGameDTO): Promise<Game> {
        const newGame = this.gameRepo.create(createGameDto);
        return await this.gameRepo.save(newGame);
    }

    //get all games
    async getGames(): Promise<Game[]> {
        return await this.gameRepo.find();
    }

    //get specific game
    async getGame(id: number): Promise<Game> {
        const game: Game = await this.gameRepo.findOne({ where: { id: id }});
        if (game == null) {
            throw new NotFoundException();
        }
        return game;
    }

    //delete a specific game
    async deleteGame(id: number): Promise<void> {
        if (! await this.gameRepo.exist({
            where: {
                id:
                id
            } })) {
            throw new NotFoundException();
        }
        await this.gameRepo.delete(id);
    }

    //make a move
    async makeMove(id: number, updateGameDTO: UpdateGameDTO): Promise<Game> {
        const game: Game = await this.gameRepo.findOne({
            where: {
                id: id
            }
        });

        if (game == null) { throw new NotFoundException(); }

        Object.assign(game, updateGameDTO);
        await this.gameRepo.save(game);

        const gameOutcome = this.gameLogicService.calculateGameOutcome(game);
        if(gameOutcome !== null) {
            Object.assign(game, gameOutcome);
            await this.gameRepo.save(game);
        }
        return game;
    }
}
