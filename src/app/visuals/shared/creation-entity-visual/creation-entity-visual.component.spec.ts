import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationEntityVisualComponent } from './creation-entity-visual.component';

describe('CreationEntityVisualComponent', () => {
  let component: CreationEntityVisualComponent;
  let fixture: ComponentFixture<CreationEntityVisualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreationEntityVisualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreationEntityVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
