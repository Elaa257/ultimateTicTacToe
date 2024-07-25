import {Role} from "../auth/roles/enum.roles";
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Game} from "../game/game.entity";
import {IsNotEmpty, MinLength} from "class-validator";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    @IsNotEmpty()
    @MinLength(8)
    password: string;

    @Column({ unique: true })
    nickname: string;

    @Column({
        type: 'text',
        default: Role.User
    })
    role: string

    @Column({ default: 1000 })
    elo: number;

    @Column({ type: 'blob', nullable: true })
    profilePicture: Buffer;

    @Column({ default: 0 })
    wins: number;

    @Column({ default: 0 })
    loses: number;

    @Column({ default: 0 })
    draw: number;

    @OneToMany(() => Game, (game) => game.users)
    games: Game[];
}