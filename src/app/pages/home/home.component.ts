import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { Component, HostListener } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('700ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class HomeComponent {
  showSelector = false;

  // Animation state flags
  greetingVisible = false;
  completedVisible = false;
  upcomingVisible = false;
  startVisible = false;


  constructor(private router: Router) { }

  ngOnInit(): void {
    // Staggered fade-ins
    setTimeout(() => {
      this.greetingVisible = true;
    }, 100);

    setTimeout(() => {
      this.completedVisible = true;
    }, 1400);

    setTimeout(() => {
      this.upcomingVisible = true;
    }, 2800);

    setTimeout(() => {
      this.startVisible = true;
    }, 4000);
  }

  lottieOptions: AnimationOptions = {
    path: '/assets/animations/homePageAnimation.json',
    renderer: 'svg',
    autoplay: true,
    loop: true,
  };

  openSessionSelector() {
    this.showSelector = true;
  }

  closeSelector() {
    this.showSelector = false;
  }

  navigateToSession(type: string) {
    const routeMap: any = {
      stretch: '/stretch-session',
      breathing: '/breathing-session',
      journal: '/journal-session'
    };

    this.router.navigate([routeMap[type] || '/']);
  }



}