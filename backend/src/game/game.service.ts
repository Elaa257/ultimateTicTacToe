import { Injectable } from '@nestjs/common';
import {Matchfield} from "../matchfield/matchfield.entity";

@Injectable()
export class GameService {

    const matchfields: Matchfield[] = new Array(9).fill(null).map((_, index) => new Matchfield());


// oder so:

    int[] board = new int[]{0, 0, 0, 0, 0, 0, 0, 0, 0}

// Von einem if zum simplen return

boolean isValid(int[] board) {
    return board.length == 9;
}

// Von einem if/else zu einem if mit return; ein else ist überflüssig, wenn es ein return gibt
// Von drei if-Abfragen zum Spielbrett zu einer if-Anweisung mit Oder-Verknüpfung (||)
// Von einer Negativ-Logik (board[i] != 0 etc.) zu einer Positiv-Logik samt continue
// Fortgeschrittene: for(int token : board) {...} ist sehr elegant // Token = Spielstein

boolean isValid(int[] board) {
    if (board.length != 9) return false;
    for (int i = 0; i < 9; i++) {
        if (board[i] == 0 || board[i] == -1 || board[i] == 1) continue;
        return false;
    }
    return true;
}

// Von if-Unterscheidungen mit jeweiligen Prints zum "Trick" mit dem char[] symbol
// Von zwei, verschachtelten for-Schleifen zu einer for-Schleife
// Von komplizierter Logik für println zur Modulo-Arithmetik
// Die assert-Anweisung kennengelernt; Zweck: Als Zusicherung im Code und zum Testen von Code

void printBoard(int[] board) {
    assert isValid(board);
    char[] symbol = {'O', '.', 'X'}; // -1, 0, +1
    for(int i = 0; i < 9; i++) { // besser noch: i <= board.length - 1
        System.out.print(symbol[board[i] + 1]);
        if (i % 3 == 2) System.out.println();
    }
}



}
