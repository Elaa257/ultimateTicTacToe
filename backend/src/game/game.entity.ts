import {
    Column,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    JoinColumn,
    CreateDateColumn,
    BeforeInsert,
    BeforeUpdate, ManyToMany, JoinTable
} from "typeorm";
import {User} from "../user/user.entity";
import { validateOrReject, IsArray, ArrayMaxSize, ArrayMinSize } from 'class-validator';

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: false })
    finished: boolean;

    @Column()
    draw: boolean;

    @Column("simple-array")
    @IsArray()
    @ArrayMaxSize(9)
    @ArrayMinSize(9)
        // 0 = Circle Player1 or 1 = Cross Player2
    board: number[];

    @OneToOne(() => User)
    @JoinColumn()
    turn: User;

    @OneToOne(() => User)
    @JoinColumn()
    player1: User;

    @OneToOne(() => User)
    @JoinColumn()
    player2: User;

    @OneToOne(() => User)
    @JoinColumn()
    winner: User;

    @OneToOne(() => User)
    @JoinColumn()
    loser: User;

    @CreateDateColumn({ type: 'timestamp' })
    time: Date;

    @Column()
    player1EloBefore: number;

    @Column()
    player2EloBefore: number;

    @Column()
    player1EloAfter: number;

    @Column()
    player2EloAfter: number;

    @ManyToMany(() => User, (user) => user.games)
    @JoinTable()
    users: User[];

    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        await validateOrReject(this);
    }
}