import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

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

    @Column({ default: 1 })
        // 0 = Admin | 1 = Client
    roleID: number;

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