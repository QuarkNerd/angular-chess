import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-board-square',
  templateUrl: './board-square.component.html',
  styleUrls: ['./board-square.component.css']
})
export class BoardSquareComponent implements OnInit {
  @Input() isDark: Boolean;

  constructor() { }

  ngOnInit(): void {
  }

}


