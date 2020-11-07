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

  isBeingDragged: Boolean = false;
  hoveredOverRefCounter: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  onDragStart() {
    this.moveStartEvent.emit(this.squareId);
    this.isBeingDragged = true;
  }

  onDragEnd() {
    this.isBeingDragged = false;
  }

  allowDrop(event: Event) {
    event.preventDefault();
  }

  onDrop() {
    this.hoveredOverRefCounter = 0;
    this.moveEndEvent.emit(this.squareId);
  }

  onDragEnter() {
    this.hoveredOverRefCounter += 1;
  }

  onDragLeave() {
    this.hoveredOverRefCounter -= 1;
  }

}


