import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToOne,
} from 'typeorm';
import { User } from '../user/user.entity';
import {
  validateOrReject,
  IsArray,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  finished: boolean;

  @Column({ nullable: true})
  draw: boolean;

  @Column('simple-array')
  @IsArray()
  @ArrayMaxSize(9)
  @ArrayMinSize(9)
  // 0 = Circle Player1 or 1 = Cross Player2
  board: number[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'turnId' })
  turn: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'player1Id' })
  player1: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'player2Id' })
  player2: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'winnerId' })
  winner: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'loserId' })
  loser: User;

  @CreateDateColumn({ type: 'date' })
  time: Date;

  @Column()
  player1EloBefore: number;

  @Column()
  player2EloBefore: number;

  @Column({ nullable: true})
  player1EloAfter: number;

  @Column({ nullable: true})
  player2EloAfter: number;

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    await validateOrReject(this);
  }
}
