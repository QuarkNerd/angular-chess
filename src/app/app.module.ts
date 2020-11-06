import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { PlaySpaceComponent } from './play-space/play-space.component';
import { BoardSquareComponent } from './board-square/board-square.component';

@NgModule({
  declarations: [
    AppComponent,
    PlaySpaceComponent,
    BoardSquareComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
