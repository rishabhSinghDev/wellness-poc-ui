import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-session-summary',
  templateUrl: './session-summary.component.html',
  styleUrls: ['./session-summary.component.scss']
})
export class SessionSummaryComponent {
  @Input() duration: number = 60;
  @Input() reps: number = 0;
}
