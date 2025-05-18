import { Component } from '@angular/core';

@Component({
  selector: 'app-journal-session',
  templateUrl: './journal-session.component.html',
  styleUrls: ['./journal-session.component.scss']
})
export class JournalSessionComponent {
  journalText: string = '';
  submitted = false;
}
