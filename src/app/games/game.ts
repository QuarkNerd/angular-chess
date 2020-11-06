import { type } from 'os';

type Board =  string[][];

export default interface Game {
    name: string;
    boards: Board[]
}