import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {AuthModule} from "./auth/auth.module";
import {User} from "./user/user.entity";
import {Game} from "./game/game.entity";
import {RolesGuard} from "./auth/roles/roles.guard";
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import {GameModule} from "./game/game.module";
import {UserModule} from "./user/user.module";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './tmp.sqlite',
      entities: [User, Game],
      synchronize: true,
    }),
      AuthModule,
      GameModule,
      UserModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', '..', 'frontend', 'dist', 'frontend', 'browser'),
      exclude: ['/api*'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, RolesGuard],
})
export class AppModule {}
