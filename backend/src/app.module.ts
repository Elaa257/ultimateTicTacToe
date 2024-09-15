import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './user/user.entity';
import { Game } from './game/game.entity';
import { RolesGuard } from './auth/roles/roles.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GameModule } from './game/game.module';
import { UserModule } from './user/user.module';
import { QueueModule } from './queue/queue.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: './tmp.sqlite',
      entities: [User, Game],
      synchronize: true,
    }),
    EventEmitterModule.forRoot(),
    AuthModule,
    GameModule,
    UserModule,
    QueueModule,
    ServeStaticModule.forRoot({
      rootPath: join(
        __dirname,
        '..',
        '..',
        '..',
        'frontend',
        'dist',
        'frontend',
        'browser'
      ),
      exclude: ['/backend*'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, RolesGuard],
})
export class AppModule {}
