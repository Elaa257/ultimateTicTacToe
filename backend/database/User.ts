import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Role} from "../src/auth/roles/enum.roles";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
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
}