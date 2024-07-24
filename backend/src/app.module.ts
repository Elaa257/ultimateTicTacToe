import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from "../database/User";
import {Game} from "../database/Game";
import {Matchfield} from "../database/Matchfield";
import {AuthModule} from "./auth/auth.module";
import {RolesGuard} from "./auth/roles/roles.guard";
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './tmp.sqlite',
      entities: [User, Game, Matchfield],
      synchronize: true,
    }),
      AuthModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'frontend', 'dist', 'frontend', 'browser'),
      exclude: ['/api*'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, RolesGuard],
})
export class AppModule {}
