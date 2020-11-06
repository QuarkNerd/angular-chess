import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaySpaceComponent } from './play-space.component';

describe('PlaySpaceComponent', () => {
  let component: PlaySpaceComponent;
  let fixture: ComponentFixture<PlaySpaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlaySpaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaySpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
