import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuVisualComponent } from './menu-visual.component';

describe('MenuVisualComponent', () => {
  let component: MenuVisualComponent;
  let fixture: ComponentFixture<MenuVisualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuVisualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
