import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { Component, HostListener } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { getCompletedSessions, CompletedSession } from 'src/app/utils/session-storage.util';

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

  greetingVisible = false;
  completedVisible = false;
  upcomingVisible = false;
  startVisible = false;
  firstVisit = true;

  userName: string = '';
  showNamePrompt: boolean = false;
  enteredName: string = '';

  // completedTasks: { activity: string; time: string }[] = [];
  // upcomingTasks: { activity: string; time: string }[] = [];

  // allCompletedTasks = [
  //   { activity: 'Stretch', time: '5 PM' },
  //   { activity: 'Breathing', time: '6 PM' },
  //   { activity: 'Journal', time: '7 PM' }
  // ]; // mock data that is already present by default

  allCompletedTasks: CompletedSession[] = [
    { activity: 'Stretch', time: '5 PM' },
    { activity: 'Breathing', time: '6 PM' },
    { activity: 'Journal', time: '7 PM' },
  ];

  completedTasks: CompletedSession[] = [];
  upcomingTasks = [
    { activity: 'Stretch', time: '8 PM' },
    { activity: 'Breathing', time: '9 PM' },
    { activity: 'Journal', time: '10 PM' }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    const newSessions = getCompletedSessions(); // from sessionStorage

    newSessions.forEach(session => {
        this.allCompletedTasks.push(session);
    });

    // Final completedTasks to show
    this.completedTasks = [...this.allCompletedTasks];


    const alreadySeen = sessionStorage.getItem('hasSeenHome');
    const storedName = sessionStorage.getItem('userName');

    this.userName = storedName || 'friend';
    this.firstVisit = !alreadySeen;

    if (this.firstVisit) {
      setTimeout(() => {
        sessionStorage.setItem('hasSeenHome', 'true');
      }, 4000);

      setTimeout(() => (this.greetingVisible = true), 500);
      setTimeout(() => (this.completedVisible = true), 1500);
      setTimeout(() => (this.upcomingVisible = true), 2500);
      setTimeout(() => (this.startVisible = true), 3500);
    } else {
      this.greetingVisible = true;
      this.completedVisible = true;
      this.upcomingVisible = true;
      this.startVisible = true;
    }
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