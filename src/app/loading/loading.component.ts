import { Component, OnInit } from '@angular/core';
import { LoadingService } from './loading.service';
@Component({
 selector: 'app-loading-screen',
 templateUrl: './loading.component.html',
 styleUrls: ['./loading.component.scss']
})
export class LoadingScreenComponent implements OnInit {
 show = false;
 quote = '';
 quotes = [
   "You do not rise to the level of your goals. You fall to the level of your systems.",
   "Habits are the compound interest of self-improvement.",
   "Every action you take is a vote for the type of person you wish to become.",
   "You should be far more concerned with your current trajectory than with your current results.",
   "Success is the product of daily habits—not once-in-a-lifetime transformations.",
   "Be the designer of your world and not merely the consumer of it.",
   "Goals are good for setting direction, but systems are best for making progress."
 ];
 constructor(private loadingService: LoadingService) {}
 ngOnInit() {
   this.loadingService.loadingState.subscribe(state => {
     this.show = state;
     if (state) {
       this.quote = this.quotes[Math.floor(Math.random() * this.quotes.length)];
     }
   });
 }
}