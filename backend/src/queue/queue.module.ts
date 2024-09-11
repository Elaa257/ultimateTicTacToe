import { Module } from '@nestjs/common';
import { QueueGateway } from './queue.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { AuthModule } from '../auth/auth.module';
import { GameModule } from 'src/game/game.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule, GameModule],

  providers: [QueueGateway],
})
export class QueueModule {}
