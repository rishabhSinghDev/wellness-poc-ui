import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-name-prompt',
  templateUrl: './name-prompt.component.html',
  styleUrls: ['./name-prompt.component.scss']
})
export class NamePromptComponent {
  enteredName: string = '';

  constructor(private router: Router) {}

  submitName() {
    if (this.enteredName.trim()) {
      sessionStorage.setItem('userName', this.enteredName.trim());
      this.router.navigate(['/home']);
    }
  }
}
