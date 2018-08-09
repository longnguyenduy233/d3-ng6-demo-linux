import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendsVisualComponent } from './legends-visual.component';

describe('LegendsVisualComponent', () => {
  let component: LegendsVisualComponent;
  let fixture: ComponentFixture<LegendsVisualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegendsVisualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegendsVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
