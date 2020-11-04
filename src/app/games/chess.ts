import Game from './game';

export default class Chess implements Game {
    name: string = "chess";
    board: string[][];

    constructor() {
        this.board = [
            ["b-r" ,"b-kn" ,"b-b" ,"b-q" ,"b-ki" ,"b-b" ,"b-kn" ,"b-r"],
            ["b-p" ,"b-p" ,"b-p" ,"b-p" ,"b-p" ,"b-p" ,"b-p" ,"b-p" ],
            ["" ,"" ,"" ,"" ,"" ,"" ,"" ,"" ],
            ["" ,"" ,"" ,"" ,"" ,"" ,"" ,"" ],
            ["" ,"" ,"" ,"" ,"" ,"" ,"" ,"" ],
            ["" ,"" ,"" ,"" ,"" ,"" ,"" ,"" ],
            ["w-p" ,"w-p" ,"w-p" ,"w-p" ,"w-p" ,"w-p" ,"w-p" ,"w-p" ],
            ["w-r" ,"w-kn" ,"w-b" ,"w-q" ,"w-ki" ,"w-b" ,"w-kn" ,"w-r"],
        ];
    }
}