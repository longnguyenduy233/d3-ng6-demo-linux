import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegendsNodeVisualComponent } from './legends-node-visual.component';

describe('LegendsNodeVisualComponent', () => {
  let component: LegendsNodeVisualComponent;
  let fixture: ComponentFixture<LegendsNodeVisualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegendsNodeVisualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegendsNodeVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
