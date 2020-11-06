import Game from './game';

export default class Chess implements Game {
    name: string = "chess";
    board: string[][];

    constructor() {
        // ordered in this fashion to align 0,0 with a1
        this.board = [
            ["w-r" ,"w-kn" ,"w-b" ,"w-q" ,"w-ki" ,"w-b" ,"w-kn" ,"w-r"],
            ["w-p" ,"w-p" ,"w-p" ,"w-p" ,"w-p" ,"w-p" ,"w-p" ,"w-p" ],
            ["" ,"" ,"" ,"" ,"" ,"" ,"" ,"" ],
            ["" ,"" ,"" ,"" ,"" ,"" ,"" ,"" ],
            ["" ,"" ,"" ,"" ,"" ,"" ,"" ,"" ],
            ["" ,"" ,"" ,"" ,"" ,"" ,"" ,"" ],
            ["b-p" ,"b-p" ,"b-p" ,"b-p" ,"b-p" ,"b-p" ,"b-p" ,"b-p" ],
            ["b-r" ,"b-kn" ,"b-b" ,"b-q" ,"b-ki" ,"b-b" ,"b-kn" ,"b-r"],
        ];
    }
}