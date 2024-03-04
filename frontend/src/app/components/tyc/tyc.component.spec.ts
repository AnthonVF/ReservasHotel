import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TycComponent } from './tyc.component';

describe('TycComponent', () => {
  let component: TycComponent;
  let fixture: ComponentFixture<TycComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TycComponent]
    });
    fixture = TestBed.createComponent(TycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
