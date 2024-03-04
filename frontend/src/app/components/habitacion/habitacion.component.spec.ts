import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitacionComponent } from './habitacion.component';

describe('HabitacionComponent', () => {
  let component: HabitacionComponent;
  let fixture: ComponentFixture<HabitacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HabitacionComponent]
    });
    fixture = TestBed.createComponent(HabitacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
