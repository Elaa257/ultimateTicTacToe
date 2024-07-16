import {Column, Entity, OneToOne, PrimaryGeneratedColumn, JoinColumn} from "typeorm";
import {Game} from "../game/game.entity";

@Entity()
export class Matchfield {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    position: number;

    @OneToOne(() => Game)
    @JoinColumn()
    game: Game;

    @Column()
        // 0 = Circle or 1 = Cross
    value: number;
}