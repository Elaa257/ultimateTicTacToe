import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { GameLogicService } from './game-logic.service';
import { Game } from './game.entity';
import { UserModule } from '../user/user.module';

import { User } from '../user/user.entity';
import { GameGateWay } from './game.gateway';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Game, User]), UserModule, AuthModule],
  controllers: [GameController],
  providers: [
    GameService,
    GameLogicService,
    GameModule,
    GameGateWay,
  ],
  exports: [GameService],
})
export class GameModule {}
