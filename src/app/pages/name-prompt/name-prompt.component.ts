import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/loading/loading.service';

@Component({
  selector: 'app-name-prompt',
  templateUrl: './name-prompt.component.html',
  styleUrls: ['./name-prompt.component.scss']
})
export class NamePromptComponent implements OnInit {
  enteredName: string = '';

  constructor(private router: Router, private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.loadingService.show();
    this.loadingService.hide();
  }

  submitName() {
    if (this.enteredName.trim()) {
      sessionStorage.setItem('userName', this.enteredName.trim());
      this.router.navigate(['/home']);
    }
  }
}
