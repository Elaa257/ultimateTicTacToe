import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameLogicService } from './game-logic.service';
import { Game } from './game.entity';
import { UserModule } from '../user/user.module';

import { User } from '../user/user.entity';
import { GameGateWay } from './game.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Game, User]), UserModule],
  controllers: [GameController],
  providers: [GameService, GameLogicService, GameModule, GameGateWay],
  exports: [GameService],
})
export class GameModule {}
