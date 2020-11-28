type Board =  string[][];

export interface Move {
    from: string,
    to: string
}

export interface Game {
    name: string;
    boards: Board[];
    text: string;
    giveNextMove(move: Move): void; 
}