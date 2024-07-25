//controls general game operations

import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Game} from "./game.entity";
import {Repository} from "typeorm";
import {CreateGameRequestDto} from "./DTOs/createGameRequestDto";
import {UpdateGameRequestDto} from "./DTOs/updateGameRequestDto";
import {GameLogicService} from "./game-logic.service";
import {GameResponseDto} from "./DTOs/gameResponseDto";
import {ResponseDTO} from "../DTOs/responseDTO";
import {MultiGamesResponseDTO} from "./DTOs/multiGamesResponseDTO";

@Injectable()
export class GameService {
    constructor(
        @InjectRepository(Game)
        private gameRepo: Repository<Game>,
        private gameLogicService: GameLogicService,
    ) {}

    //create new game
    async create(createGameRequestDto: CreateGameRequestDto): Promise<ResponseDTO> {
        try {
            const newGame = this.gameRepo.create(createGameRequestDto);
            await this.gameRepo.save(newGame);
            return new ResponseDTO(true, "Game successfully created");
        } catch(error) {
            return new ResponseDTO(false, `Could not create new game. Error: ${error}`)
        }
    }

    //get all games
    async getGames(): Promise<MultiGamesResponseDTO> {
        try {
            const games = await this.gameRepo.find();
            return new MultiGamesResponseDTO(`Successfully retrieved all available games.`, games)
        } catch(error) {
            return new MultiGamesResponseDTO(`There was an error queueing games: ${error}`);
        }
    }

    //get specific game
    async getGame(id: number): Promise<GameResponseDto> {
        try {
            const game = await this.gameRepo.findOne({ where: { id: id }});
            if(game === null) { return new GameResponseDto(`Game with id ${id} could not be found.`, null); }
            return new GameResponseDto(`Successfully retrieved game with id ${id}.`, game);
        } catch(error) {
            return new GameResponseDto(`There was an error queueing game with id ${id}: ${error}`);
        }
    }

    //delete a specific game
    async deleteGame(id: number): Promise<ResponseDTO> {
        const game: Game = await this.gameRepo.findOne({
            where: {
                id: id
            }
        });
        if (game == null) { return new ResponseDTO(false, `Game with id ${id} could not be found`); }
        try {
            await this.gameRepo.delete(id);
            return new ResponseDTO(true, `Game with id ${id} successfully deleted`);
        } catch(error) {
            return new ResponseDTO(false, `Game with id ${id} could not be deleted. Error: ${error}`);
        }
    }

    //make a move
    async makeMove(id: number, updateGameRequestDTO: UpdateGameRequestDto): Promise<GameResponseDto> {
        let game: Game = await this.gameRepo.findOne({
            where: {
                id: id
            }
        });

        if (game === null) { throw new NotFoundException(); }

        try {
            Object.assign(game, updateGameRequestDTO);
            game = await this.gameRepo.save(game);

            const gameOutcome = await this.gameLogicService.calculateGameOutcome(game);
            if(gameOutcome !== null) {
                Object.assign(game, gameOutcome);
                game = await this.gameRepo.save(game);
            }
            return new GameResponseDto(`Successfully made move`, game);
        } catch(error) {
            return new GameResponseDto(`An error occured while making the move: ${error}`);
        }
    }
}
