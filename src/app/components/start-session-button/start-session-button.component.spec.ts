import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartSessionButtonComponent } from './start-session-button.component';

describe('StartSessionButtonComponent', () => {
  let component: StartSessionButtonComponent;
  let fixture: ComponentFixture<StartSessionButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StartSessionButtonComponent]
    });
    fixture = TestBed.createComponent(StartSessionButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
