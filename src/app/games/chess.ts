import { Game, Move }  from '../types';
import cloneDeep from 'lodash/cloneDeep';

const BLACK = "b";
const WHITE = "w";

export default class Chess implements Game {
    name: string = "chess";
    boards: string[][][];
    nextPlayer: string;
    isTimeToPromote: boolean;
    doublePawnMoveLastMove: number;
    castlingPossibility: CastlingPossibility
    
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
        this.castlingPossibility = {
            [WHITE]: {
                hasRookZeroBeenMoved: false,
                hasRookSevenBeenMoved: false,
                hasKingBeenMoved: false,
            },
            [BLACK]: {
                hasRookZeroBeenMoved: false,
                hasRookSevenBeenMoved: false,
                hasKingBeenMoved: false,
            }
    }

        this.nextPlayer = WHITE;
        this.isTimeToPromote = false;
        this.doublePawnMoveLastMove = null;
    }

    giveNextMove(move: Move) {
        const [FROM_BOARD, FROM_Y, FROM_X] = this.stringPositionToArray(move.from);
        const [TO_BOARD, TO_Y, TO_X]  = this.stringPositionToArray(move.to);
        const MOVING_PIECE = this.getPieceAt(FROM_BOARD, FROM_Y, FROM_X);
        const [ MOVING_PLAYER, MOVING_PIECE_TYPE ] = MOVING_PIECE.split("-");
        const [ TARGET_PLAYER, TARGET_PIECE_TYPE ] = this.getPieceAt(TO_BOARD, TO_Y, TO_X).split("-");

        // basic validation here
        if ( MOVING_PLAYER !== this.nextPlayer || TO_BOARD === 1) return;

        if (this.isTimeToPromote) {
            if (FROM_BOARD !== 1 || TARGET_PIECE_TYPE !== "p" || TARGET_PLAYER !== this.nextPlayer) return;

            this.setPieceAtMainBoard(TO_Y, TO_X, MOVING_PIECE);
            this.nextPlayer = this.nextPlayer === BLACK ? WHITE : BLACK;
            this.isTimeToPromote = false;
            return;
        }

        if ( TARGET_PLAYER === this.nextPlayer || FROM_BOARD === 1) return;
        
        const DIFF_X = TO_X - FROM_X;
        const DIFF_Y = TO_Y - FROM_Y;
        const ABS_DIFF_X = Math.abs(DIFF_X);
        const ABS_DIFF_Y = Math.abs(DIFF_Y);

        if (MOVING_PIECE_TYPE === "ki" && ABS_DIFF_Y === 0 && ABS_DIFF_X === 2 
                                 && !this.castlingPossibility[MOVING_PLAYER].hasKingBeenMoved) {
            const direction = Math.sign(DIFF_X);
            const [hasRelevantRookMoved, rookX] = 
                  direction === 1 ? [this.castlingPossibility[MOVING_PLAYER].hasRookSevenBeenMoved, 7] :
                                    [this.castlingPossibility[MOVING_PLAYER].hasRookZeroBeenMoved, 0];
            if (!hasRelevantRookMoved) {
                if(this.areSpacesBetweenEmpty(FROM_X, FROM_Y, rookX, FROM_Y)) {
                    this.setPieceAtMainBoard(TO_Y, TO_X, MOVING_PIECE);
                    this.setPieceAtMainBoard(FROM_Y, FROM_X, "");
                    const rook = this.getPieceAt(0, FROM_Y,rookX);
                    this.setPieceAtMainBoard(FROM_Y, TO_X - direction, rook);
                    this.setPieceAtMainBoard(FROM_Y, rookX, "");
                    this.nextPlayer = this.nextPlayer === BLACK ? WHITE : BLACK;
                } 
                return; // need to set castling possibility bools
            }
        }
        
        const move2D = { 
            from: { 
                x: FROM_X, 
                y: FROM_Y
            },
            to: {
                x: FROM_X, 
                y: FROM_Y
            }
}  
        const result = checkMove(cloneDeep(this.boards[0]), move2D, this.doublePawnMoveLastMove)
        console.log(result)
        if (!result.isValid) return;

        this.boards[0] = result.board;
        this.doublePawnMoveLastMove = result.doublePawnMoveLastMove;

        this.doublePawnMoveLastMove = null; // Only happens on valid moves
        if (MOVING_PIECE_TYPE === "ki" && !this.castlingPossibility[MOVING_PLAYER].hasKingBeenMoved) {
            this.castlingPossibility[MOVING_PLAYER].hasKingBeenMoved = true;
        } else if (MOVING_PIECE_TYPE === "r") {
            // ignoring colour of piece moved because the only way for the wrong colour's piece
            // to match the condition
            const coor = `${FROM_X}-${FROM_Y}`
            switch (coor) {
                case '0-0':
                    this.castlingPossibility[WHITE].hasRookZeroBeenMoved = true;
                case '7-0':
                    this.castlingPossibility[WHITE].hasRookSevenBeenMoved = true;
                case '0-7':
                    this.castlingPossibility[BLACK].hasRookZeroBeenMoved = true;
                case '0-7':
                    this.castlingPossibility[BLACK].hasRookSevenBeenMoved = true;
                }
        } 
        if (MOVING_PIECE_TYPE === "p" && (TO_Y === 0 || TO_Y === 7)) {
            this.isTimeToPromote = true;
            return;
        }

        this.nextPlayer = this.nextPlayer === BLACK ? WHITE : BLACK;
    }

    private areSpacesBetweenEmpty(fromX: number, fromY: number, toX: number, toY: number): boolean {
        return areSpacesBetweenEmpty(this.boards[0], fromX, fromY, toX, toY);
    }

    private stringPositionToArray(pos: string): number[] {
        return pos.split('-').map(a => parseInt(a));
    }

    private getPieceAt(board: number, y: number, x: number): string {
        return this.boards[board][y][x]
    }

    private setPieceAtMainBoard(y: number, x: number, piece: string) {
        this.setPieceAt(0, y, x, piece);
    }

    private setPieceAt(board: number, y: number, x: number, piece: string) {
        this.boards[board][y][x] = piece;
    }
}

function checkMove(board : string[][], move: Move2D, doublePawnMoveLastMove: number ) : { isValid: boolean, board?: string[][], doublePawnMoveLastMove?: number } {
    const { x : FROM_X, y : FROM_Y} = move.from;
    const { x : TO_X, y : TO_Y} = move.to;
    const MOVING_PIECE = board[FROM_Y][FROM_X]
    const [ MOVING_PLAYER, MOVING_PIECE_TYPE ] = MOVING_PIECE.split("-");
    const TARGET_PIECE = board[TO_Y][TO_X];
    
    const DIFF_X = TO_X - FROM_X;
    const DIFF_Y = TO_Y - FROM_Y;
    const ABS_DIFF_X = Math.abs(DIFF_X);
    const ABS_DIFF_Y = Math.abs(DIFF_Y);

    let newDoublePawnMoveLastMove: number = null;

    switch (MOVING_PIECE_TYPE) {
            case "p":
                const [allowedDirection, startingPos] = MOVING_PLAYER === WHITE ? [1, 1] : [-1, 6];
                if (Math.sign(DIFF_Y) !== allowedDirection || ABS_DIFF_X > 1) return { isValid : false };
                if (ABS_DIFF_X === 0 && TARGET_PIECE) return { isValid : false };
                if (ABS_DIFF_Y > 2) return { isValid : false };

                if (doublePawnMoveLastMove === TO_X && 
                    !TARGET_PIECE                        &&
                    TO_Y === (MOVING_PLAYER === WHITE ? 5 : 2)
                    ) {
                    board[TO_Y + (MOVING_PLAYER === WHITE ? -1 : 1)][TO_X] = "";
                    break;
                }

                if (ABS_DIFF_Y === 2) {
                    if (FROM_Y !== startingPos  ||
                        ABS_DIFF_X              ||
                        board[FROM_Y + allowedDirection][FROM_X]) return { isValid : false }; //switch to is space in between empty

                        newDoublePawnMoveLastMove = TO_X;
                        break;
                }

                if (ABS_DIFF_X === 1 && !TARGET_PIECE) return { isValid : false };
                break;
            case "kn":
                if ((ABS_DIFF_X === 2 && ABS_DIFF_Y === 1) || (ABS_DIFF_X === 1 && ABS_DIFF_Y === 2)) {
                    break;
                } else {
                    return { isValid : false };
                }
            case "ki":
                if (ABS_DIFF_X > 1 || ABS_DIFF_Y > 1) return { isValid : false };
                break;
            case "r":
                if (ABS_DIFF_X !== 0 && ABS_DIFF_Y !== 0) return { isValid : false };
                if (!areSpacesBetweenEmpty(board, FROM_X, FROM_Y, TO_X, TO_Y)) return { isValid : false };
                break;
            case "b":
                if (ABS_DIFF_X !== ABS_DIFF_Y) return { isValid : false };
                if (!areSpacesBetweenEmpty(board, FROM_X, FROM_Y, TO_X, TO_Y)) return { isValid : false };
                break;
            case "q":
                if (ABS_DIFF_X !== 0 && ABS_DIFF_Y !== 0 && ABS_DIFF_X !== ABS_DIFF_Y) return { isValid : false };
                if (!areSpacesBetweenEmpty(board, FROM_X, FROM_Y, TO_X, TO_Y)) return { isValid : false };
                break;

        }

        board[FROM_Y][FROM_X] = "";
        board[TO_Y][TO_X] = MOVING_PIECE;

        return {
            isValid: true,
            board,
            doublePawnMoveLastMove: newDoublePawnMoveLastMove,
        }
            
}

function areSpacesBetweenEmpty(board: string[][], fromX: number, fromY: number, toX: number,  toY: number) : boolean {
        
    const directionX = Math.sign(toX - fromX);
        const directionY = Math.sign(toY - fromY);
        let currentX = fromX + directionX;
        let currentY = fromY + directionY;

        while (currentX !== toX || currentY !== toY) {
            if (board[currentY][currentX]) {
                return false;
            }

            currentX += directionX;
            currentY += directionY;
        }

        return true;
}

interface Move2D {
    from: { 
        x: number, 
        y:number
    }
    to: {
         x: number, 
         y:number
    }
}

interface CastlingPossibility {
     [BLACK]: {
            hasRookZeroBeenMoved: boolean,
            hasRookSevenBeenMoved: boolean,
            hasKingBeenMoved: boolean,
        },
        [WHITE]: {
            hasRookZeroBeenMoved: boolean,
            hasRookSevenBeenMoved: boolean,
            hasKingBeenMoved: boolean,
        }
}