import { Game, Move }  from '../types';
import cloneDeep from 'lodash/cloneDeep';

const BLACK = "b";
const WHITE = "w";

export default class Chess implements Game {
    name: string = "chess";
    boards: string[][][];
    currentPlayer: string;
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
                canRookZeroCastle: true,
                canRookSevenCastle: true,
                canKingCastle: true,
            },
            [BLACK]: {
                canRookZeroCastle: true,
                canRookSevenCastle: true,
                canKingCastle: true,
            }
    }
        this.currentPlayer = WHITE;
        this.isTimeToPromote = false;
        this.doublePawnMoveLastMove = null;
    }

    giveNextMove(move: Move) {
        const [FROM_BOARD_NUM, FROM_Y, FROM_X] = this.stringPositionToArray(move.from);
        const [TO_BOARD_NUM, TO_Y, TO_X]  = this.stringPositionToArray(move.to);
        const MOVING_PIECE = this.getPieceAt(FROM_BOARD_NUM, FROM_Y, FROM_X);
        const [ MOVING_PLAYER, MOVING_PIECE_TYPE ] = MOVING_PIECE.split("-");
        const [ TARGET_PLAYER, TARGET_PIECE_TYPE ] = this.getPieceAt(TO_BOARD_NUM, TO_Y, TO_X).split("-");

        // basic validation here
        if ( MOVING_PLAYER !== this.currentPlayer || TO_BOARD_NUM === 1) return;
        const BOARD = this.boards[0];

        if (this.isTimeToPromote) {
            if (FROM_BOARD_NUM !== 1 || TARGET_PIECE_TYPE !== "p" || TARGET_PLAYER !== this.currentPlayer) return;

            BOARD[TO_Y][TO_X] = MOVING_PIECE;
            this.currentPlayer = this.currentPlayer === BLACK ? WHITE : BLACK;
            this.isTimeToPromote = false;
            return;
        }

        if ( TARGET_PLAYER === this.currentPlayer || FROM_BOARD_NUM === 1) return;
        
        const move2D = { 
             FROM_X, 
             FROM_Y,
             TO_X, 
             TO_Y
        }  

        const extraGameState = {
            doublePawnMoveLastMove: this.doublePawnMoveLastMove,
            castlingPossibility: this.castlingPossibility
        }

        const result = validateMove(BOARD, move2D, extraGameState);
        if (!result.isValid) return;

        this.boards[0] = result.board;
        this.doublePawnMoveLastMove = result.extraGameState.doublePawnMoveLastMove;
        this.castlingPossibility = result.extraGameState.castlingPossibility;

        if (MOVING_PIECE_TYPE === "p" && (TO_Y === 0 || TO_Y === 7)) {
            this.isTimeToPromote = true;
            return;
        }

        this.currentPlayer = this.currentPlayer === BLACK ? WHITE : BLACK;
    }

    private stringPositionToArray(pos: string): number[] {
        return pos.split('-').map(a => parseInt(a));
    }

    private getPieceAt(board: number, y: number, x: number): string {
        return this.boards[board][y][x]
    }
}


function checkForCheck(board : string[][], targetPlayer: string) : boolean {
     const ATTACKING_PLAYER = targetPlayer === BLACK ? WHITE : BLACK;
     const POSSIBLE_ATTACKERS: { x: number, y: number }[] = [];
     let king: { x: number, y: number } = null;

     board.forEach((row , y) => {
        row.forEach( (piece, x) => {
            let [ player, piece_type ] = piece.split("-");

            if (player === ATTACKING_PLAYER) {
                POSSIBLE_ATTACKERS.push({x,y});
                return;
            }
            if (piece_type === "ki") {
                king = {x,y};
            }
        })
     })

     const TO_X = king.x;
     const TO_Y = king.y;

     for (let i = 0; i < POSSIBLE_ATTACKERS.length; i++) {
        const attacker = POSSIBLE_ATTACKERS[i];
        const move = { FROM_X: attacker.x, FROM_Y: attacker.y, TO_X, TO_Y }
        const result = validateMove(board, move, null, 2);
        if (result.isValid) return true;
    }

     return false;

}

function validateMove(board : string[][], move: Move2D, extraGameState: ExtraGameState, mode: number = 0) : { isValid: boolean, board?: string[][], extraGameState?: ExtraGameState } {
    const { FROM_X, FROM_Y, TO_X, TO_Y} = move;
    const MOVING_PIECE = board[FROM_Y][FROM_X];
    const [ MOVING_PLAYER, MOVING_PIECE_TYPE ] = MOVING_PIECE.split("-");
    const TARGET_PIECE = board[TO_Y][TO_X];
    const [ _, TARGET_PIECE_TYPE ] = TARGET_PIECE.split("-");

    const DIFF_X = TO_X - FROM_X;
    const DIFF_Y = TO_Y - FROM_Y;
    const ABS_DIFF_X = Math.abs(DIFF_X);
    const ABS_DIFF_Y = Math.abs(DIFF_Y);

    let newDoublePawnMoveLastMove: number = null;

    if (mode === 0) {
        board = cloneDeep(board);
        extraGameState = cloneDeep(extraGameState);
    } else if (mode === 2) {
        extraGameState = null;
    }

    switch (MOVING_PIECE_TYPE) {
            case "p":
                const [allowedDirection, startingPos] = MOVING_PLAYER === WHITE ? [1, 1] : [-1, 6];
                if (Math.sign(DIFF_Y) !== allowedDirection || ABS_DIFF_X > 1) return { isValid : false };
                if (ABS_DIFF_X === 0 && TARGET_PIECE) return { isValid : false };
                if (ABS_DIFF_Y > 2) return { isValid : false };

                if (extraGameState?.doublePawnMoveLastMove === TO_X && 
                    !TARGET_PIECE                        &&
                    TO_Y === (MOVING_PLAYER === WHITE ? 5 : 2)
                    ) {
                    board[TO_Y + (MOVING_PLAYER === WHITE ? -1 : 1)][TO_X] = "";
                    break;
                }

                if (ABS_DIFF_Y === 2 && mode !== 2) {
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
                }
                return { isValid : false };
            case "ki":
                if (DIFF_Y === 0 && ABS_DIFF_X === 2 && extraGameState?.castlingPossibility[MOVING_PLAYER].canKingCastle) {
                    const direction = Math.sign(DIFF_X);
                    const [canRelevantRookCastle, rookX] = 
                    direction === 1 ? [extraGameState.castlingPossibility[MOVING_PLAYER].canRookSevenCastle, 7] :
                                    [extraGameState.castlingPossibility[MOVING_PLAYER].canRookZeroCastle, 0];
                    if (canRelevantRookCastle) {
                        const rook = board[FROM_Y][rookX];
                        if (areSpacesBetweenEmpty(board, FROM_X, FROM_Y, rookX, FROM_Y) && 
                            rook === `${MOVING_PLAYER}-r`
                        ) {
                            if (mode === 1) {
                                board = cloneDeep(board);
                            }
                            if (checkForCheck(board, MOVING_PLAYER)) return { isValid: false };
                            board[FROM_Y][FROM_X] = "";
                            board[FROM_Y][FROM_X + direction] = MOVING_PIECE;
                            if (checkForCheck(board, MOVING_PLAYER)) return { isValid: false };
                            board[FROM_Y][FROM_X + direction] = "";
                            board[FROM_Y][TO_X - direction] = rook;
                            board[FROM_Y][rookX] = "";
                            if (mode === 0)  extraGameState.castlingPossibility[MOVING_PLAYER].canKingCastle = false;
                            break;
                        }
                    }
                    return { isValid : false };
                }
                if (ABS_DIFF_X > 1 || ABS_DIFF_Y > 1) return { isValid : false };
                if (mode === 0) extraGameState.castlingPossibility[MOVING_PLAYER].canKingCastle = false;
                break;
            case "r":
                if (ABS_DIFF_X !== 0 && ABS_DIFF_Y !== 0) return { isValid : false };
                if (!areSpacesBetweenEmpty(board, FROM_X, FROM_Y, TO_X, TO_Y)) return { isValid : false };
                if (mode === 0) {
                    updateRookCastlingPossibility(FROM_X, FROM_Y, extraGameState.castlingPossibility);
                    // needed in case the one rook moves to the position of the other, without the first moving
                    updateRookCastlingPossibility(TO_X, TO_Y, extraGameState.castlingPossibility);
                }
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

        if (mode === 2) return { isValid: true };

        if (checkForCheck(board, MOVING_PLAYER)) return { isValid: false };
        if (mode === 1) return { isValid: true };

        extraGameState.doublePawnMoveLastMove = newDoublePawnMoveLastMove;
        board[FROM_Y][FROM_X] = "";
        board[TO_Y][TO_X] = MOVING_PIECE;

        return {
            isValid: true,
            board,
            extraGameState,
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

function updateRookCastlingPossibility(x: number, y: number, castlingPossibility: CastlingPossibility) {
    const coor = `${x}-${y}`;

    switch (coor) {
        case '0-0':
            castlingPossibility[WHITE].canRookZeroCastle = false;
            break;
        case '7-0':
            castlingPossibility[WHITE].canRookSevenCastle = false;
            break;
        case '0-7':
            castlingPossibility[BLACK].canRookZeroCastle = false;
            break;      
        case '7-7':
            castlingPossibility[BLACK].canRookSevenCastle = false;
            break;
        }
}

interface ExtraGameState {
    doublePawnMoveLastMove: number,
    castlingPossibility: CastlingPossibility
}

interface Move2D {
    FROM_X: number, 
    FROM_Y: number,
    TO_X: number, 
    TO_Y: number
}

interface CastlingPossibility {
     [BLACK]: {
            canRookZeroCastle: boolean,
            canRookSevenCastle: boolean,
            canKingCastle: boolean,
        },
        [WHITE]: {
            canRookZeroCastle: boolean,
            canRookSevenCastle: boolean,
            canKingCastle: boolean,
        }
}