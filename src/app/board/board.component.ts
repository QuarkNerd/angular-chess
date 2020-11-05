import { Component, OnInit, Input } from '@angular/core';
import Game from '../games/chess';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  @Input() game: Game;
  
  constructor() {}

  ngOnInit(): void {
  }

  getFileName(piece: string) {
    return piece ? this.game.name + '/' + piece + '.png' : '' ;
  }
}
