import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from "../database/User";
import {Game} from "../database/Game";
import {Matchfield} from "../database/Matchfield";
import {AuthModule} from "./auth/auth.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './tmp.sqlite',
      entities: [User, Game, Matchfield],
      synchronize: true,
    }),
      AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
