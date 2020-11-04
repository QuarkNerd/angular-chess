import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  numColumns: number;
  numRows: number;
  
  constructor() {
    this.numColumns = 8;
    this.numRows = 8;
   }

  ngOnInit(): void {
  }

  counter(i: number) {
    return new Array(i);
}
}
