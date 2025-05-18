import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalSessionComponent } from './journal-session.component';

describe('JournalSessionComponent', () => {
  let component: JournalSessionComponent;
  let fixture: ComponentFixture<JournalSessionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [JournalSessionComponent]
    });
    fixture = TestBed.createComponent(JournalSessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
