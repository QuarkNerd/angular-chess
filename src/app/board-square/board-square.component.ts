import { Component, OnInit, Input, Output, EventEmitter  } from '@angular/core';

@Component({
  selector: 'app-board-square',
  templateUrl: './board-square.component.html',
  styleUrls: ['./board-square.component.css']
})
export class BoardSquareComponent implements OnInit {
  @Input() isDark: Boolean;
  @Input() piece: string;
  @Input() squareId: string;

  @Output() moveStartEvent = new EventEmitter<string>();
  @Output() moveEndEvent = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onDragStart() {
    this.moveStartEvent.emit(this.squareId);
  }

  allowDrop(event: Event) {
    event.preventDefault();
  }


  onDrop() {
    this.moveEndEvent.emit(this.squareId);
  }
}


