import { Component } from '@angular/core';
import { LoadingService } from './loading.service';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  loading$ = this.loadingService.isLoading;
  quote$ = this.loadingService.quote;

  constructor(private loadingService: LoadingService) {}
}
