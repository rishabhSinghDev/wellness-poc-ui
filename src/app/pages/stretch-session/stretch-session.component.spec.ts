import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StretchSessionComponent } from './stretch-session.component';

describe('StretchSessionComponent', () => {
  let component: StretchSessionComponent;
  let fixture: ComponentFixture<StretchSessionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StretchSessionComponent]
    });
    fixture = TestBed.createComponent(StretchSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
