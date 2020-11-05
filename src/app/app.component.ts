import { Component } from '@angular/core';
import  Game from './games/game';
import  Chess from './games/chess';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'angular-chess';
  game: Game;
  
  constructor() {
    this.game = new Chess();
  }
}
