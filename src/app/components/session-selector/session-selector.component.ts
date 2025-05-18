import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-session-selector',
  templateUrl: './session-selector.component.html',
  styleUrls: ['./session-selector.component.scss']
})
export class SessionSelectorComponent {
  @Output() close = new EventEmitter<void>();
  @Output() selectSession = new EventEmitter<string>();

  handleSelection(type: string) {
    this.selectSession.emit(type);
    this.close.emit();
  }
}
