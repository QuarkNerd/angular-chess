import { Component, OnInit, Input } from '@angular/core';
import  { Game } from '../types';

@Component({
  selector: 'app-play-space',
  templateUrl: './play-space.component.html',
  styleUrls: ['./play-space.component.css']
})
export class PlaySpaceComponent implements OnInit {
  @Input() game: Game;
  currentFrom: string = null;

  constructor() { }

  ngOnInit(): void {
  }

  getFileName(piece: string) {
    return piece ? this.game.name + '/' + piece + '.png' : '' ;
  }

  onMoveStart(squareId: string) {
    this.currentFrom = squareId;
  }

  onMoveEnd(squareId: string) {
    if (squareId !== this.currentFrom) {
      this.game.giveNextMove({
        from: this.currentFrom,
        to: squareId
      })
    }
  }
}
