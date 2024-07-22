//controls general game operations

import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Game} from "./game.entity";
import {Repository} from "typeorm";
import {CreateGameDTO} from "./DTOs/createGameDTO";
import {UpdateGameDTO} from "./DTOs/updateGameDTO";
import {GameLogicService} from "./game-logic.service";

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(Game)
        private gameRepo: Repository<Game>,
        private gameLogicService: GameLogicService,
    ) {}

    //create new game
    async create(createGameDto: CreateGameDTO): Promise<Game> {
        try {
            const newGame = this.gameRepo.create(createGameDto);
            return await this.gameRepo.save(newGame);
        } catch(error) {
            console.log(error);
            throw new Error('Could not create new game');
        }
    }

    //get all games
    async getGames(): Promise<Game[]> {
        try {
            return await this.gameRepo.find();
        } catch(error) {
            console.log(error);
            return null;
        }
    }

    //get specific game
    async getGame(id: number): Promise<Game> {
        try {
            return await this.gameRepo.findOne({ where: { id: id }});
        } catch(error) {
            console.log(error);
            return null;
        }
    }

    //delete a specific game
    async deleteGame(id: number): Promise<void> {
        const game: Game = await this.gameRepo.findOne({
            where: {
                id: id
            }
        });
        if (game == null) { throw new NotFoundException(); }
        try {
            await this.gameRepo.delete(id);
        } catch(error) {
            console.log(error);
            throw new Error('Game could not be deleted');
        }
    }

    //make a move
    async makeMove(id: number, updateGameDTO: UpdateGameDTO): Promise<Game> {
        let game: Game = await this.gameRepo.findOne({
            where: {
                id: id
            }
        });

        if (game === null) { throw new NotFoundException(); }

        try {
            Object.assign(game, updateGameDTO);
            game = await this.gameRepo.save(game);

            const gameOutcome = await this.gameLogicService.calculateGameOutcome(game);
            if(gameOutcome !== null) {
                Object.assign(game, gameOutcome);
                game = await this.gameRepo.save(game);
            }
            return game;
        } catch(error) {
            console.log(error);
            throw new Error('An error occured while making the move');
        }
    }
}
