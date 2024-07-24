import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {GameController} from "./game.controller";
import {GameService} from "./game.service";
import {GameLogicService} from "./game-logic.service";
import {Game} from "./game.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Game])],
    controllers: [GameController],
    providers: [GameService, GameLogicService],
})
export class GameModule {}