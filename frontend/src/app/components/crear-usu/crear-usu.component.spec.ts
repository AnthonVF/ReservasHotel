import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearUsuComponent } from './crear-usu.component';

describe('CrearUsuComponent', () => {
  let component: CrearUsuComponent;
  let fixture: ComponentFixture<CrearUsuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearUsuComponent]
    });
    fixture = TestBed.createComponent(CrearUsuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
