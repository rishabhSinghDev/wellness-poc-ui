import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  isLoading = new BehaviorSubject<boolean>(false);
  quote = new BehaviorSubject<string>('');

  private quotes = [
    "You do not rise to the level of your goals. You fall to the level of your systems.",
    "Habits are the compound interest of self-improvement.",
    "Every action you take is a vote for the type of person you wish to become.",
    "Success is the product of daily habits—not once-in-a-lifetime transformations.",
    "Be the designer of your world and not merely the consumer of it.",
    "The task of building a good habit is like cultivating a delicate flower one day at a time."
  ];

  showLoader() {
    this.quote.next(this.getRandomQuote());
    this.isLoading.next(true);
  }

  hideLoader() {
    this.isLoading.next(false);
  }

  private getRandomQuote() {
    const index = Math.floor(Math.random() * this.quotes.length);
    return this.quotes[index];
  }
}
