import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StopAdderComponent } from './stop-adder.component';

describe('StopAdderComponent', () => {
  let component: StopAdderComponent;
  let fixture: ComponentFixture<StopAdderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StopAdderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StopAdderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
