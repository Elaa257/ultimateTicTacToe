import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {AuthModule} from "./auth/auth.module";
import {User} from "./user/user.entity";
import {Game} from "./game/game.entity";
import { GameService } from './game/game.service';
import {GameController} from "./game/game.controller";
import { GameLogicService } from './game/game-logic.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './tmp.sqlite',
      entities: [User, Game],
      synchronize: true,
    }),
      AuthModule
  ],
  controllers: [AppController, GameController],
  providers: [AppService, GameService, GameLogicService],
})
export class AppModule {}
