import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BreathingSessionComponent } from './breathing-session.component';

describe('BreathingSessionComponent', () => {
  let component: BreathingSessionComponent;
  let fixture: ComponentFixture<BreathingSessionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BreathingSessionComponent]
    });
    fixture = TestBed.createComponent(BreathingSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
