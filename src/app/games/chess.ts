import { Game, Move }  from '../types';

export default class Chess implements Game {
    name: string = "chess";
    boards: string[][][];

    constructor() {
        // ordered in this fashion to align 0,0 with a1
        this.boards = [
            [
                ["w-r" ,"w-kn" ,"w-b" ,"w-q" ,"w-ki" ,"w-b" ,"w-kn" ,"w-r"],
                ["w-p" ,"w-p" ,"w-p" ,"w-p" ,"w-p" ,"w-p" ,"w-p" ,"w-p" ],
                ["" ,"" ,"" ,"" ,"" ,"" ,"" ,"" ],
                ["" ,"" ,"" ,"" ,"" ,"" ,"" ,"" ],
                ["" ,"" ,"" ,"" ,"" ,"" ,"" ,"" ],
                ["" ,"" ,"" ,"" ,"" ,"" ,"" ,"" ],
                ["b-p" ,"b-p" ,"b-p" ,"b-p" ,"b-p" ,"b-p" ,"b-p" ,"b-p" ],
                ["b-r" ,"b-kn" ,"b-b" ,"b-q" ,"b-ki" ,"b-b" ,"b-kn" ,"b-r"],
            ],
            [
                ["w-r" ,"w-kn" ,"w-b" ,"w-q" ],
                ["b-r" ,"b-kn" ,"b-b" ,"b-q" ],
            ]
        ];
    }

    giveNextMove(move: Move) {
        const FROM_POS = this.stringPositionToArray(move.from);
        const TO_POS = this.stringPositionToArray(move.to);
        const PIECE = this.getPieceAt(FROM_POS);
        
        if (FROM_POS[0] === 0) {
            this.setPieceAt(FROM_POS, "");
        }

        if (TO_POS[0] === 0) {
            this.setPieceAt(TO_POS, PIECE);
        }

    }

    private stringPositionToArray(pos: string): number[] {
        return pos.split('-').map(a => parseInt(a));
    }

    private getPieceAt(pos: number[]): string {
        return this.boards[pos[0]][pos[1]][pos[2]]
    }

    private setPieceAt(pos: number[], piece: string) {
        this.boards[pos[0]][pos[1]][pos[2]] = piece;
    }
}