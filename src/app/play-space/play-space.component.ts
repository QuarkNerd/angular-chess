import { Component, OnInit, Input } from '@angular/core';
import Game from '../games/chess';

@Component({
  selector: 'app-play-space',
  templateUrl: './play-space.component.html',
  styleUrls: ['./play-space.component.css']
})
export class PlaySpaceComponent implements OnInit {
  @Input() game: Game;
  
  constructor() {}

  ngOnInit(): void {
  }

  getFileName(piece: string) {
    return piece ? this.game.name + '/' + piece + '.png' : '' ;
  }
}
