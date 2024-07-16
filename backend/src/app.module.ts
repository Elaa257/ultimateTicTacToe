import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from "./user/user.entity";
import {Game} from "./game/game.entity";
import {Matchfield} from "./matchfield/matchfield.entity";
import { GameService } from './game/game.service';
import { MatchfieldController } from './matchfield/matchfield.controller';
import { MatchfieldService } from './matchfield/matchfield.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './tmp.sqlite',
      entities: [User, Game, Matchfield],
      synchronize: true,
    }),
  ],
  controllers: [AppController, MatchfieldController],
  providers: [AppService, GameService, MatchfieldService],
})
export class AppModule {}
