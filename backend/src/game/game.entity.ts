import {Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn, CreateDateColumn} from "typeorm";
import {User} from "../user/user.entity";

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: false })
    finished: boolean;

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
}