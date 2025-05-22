import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { Component } from '@angular/core';
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

  hoveredEmojiIndexByPeriod: { [period: string]: number | null } = {
    morning: null,
    afternoon: null,
    evening: null
  };

  hoveredRingIndex: number | null = null;
  showConnections = false;

  userName: string = '';
  showNamePrompt: boolean = false;
  enteredName: string = '';

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

  greetingMessage: string = '';

  // Demo Data
  today: Date = new Date();
  upcomingActivity = {
    activity: 'Journal',
    time: '11:00 AM',
    icon: '📔',
    date: this.today.toDateString()
  };

  streakData = [
    {
      date: this.getPastDate(0),
      activities: [
        { type: 'Stretch', count: 2 },
        { type: 'Breathing', count: 3 },
        { type: 'Journal', count: 4 }
      ]
    },
    {
      date: this.getPastDate(1),
      activities: [
        { type: 'Stretch', count: 5 },
        { type: 'Journal', count: 3 }
      ]
    },
    {
      date: this.getPastDate(2),
      activities: []
    },
    {
      date: this.getPastDate(3),
      activities: [
        { type: 'Breathing', count: 2 },
      ]
    },
    {
      date: this.getPastDate(4),
      activities: [
        { type: 'Breathing', count: 6 },
        { type: 'Journal', count: 6 }
      ]
    },
    {
      date: this.getPastDate(5),
      activities: []
    },
    {
      date: this.getPastDate(6),
      activities: [
        { type: 'Stretch', count: 4 },
        { type: 'Breathing', count: 1 },
        { type: 'Journal', count: 2 }
      ]
    },
    {
      date: this.getPastDate(7),
      activities: [
        { type: 'Journal', count: 5 }
      ]
    },
    {
      date: this.getPastDate(8),
      activities: [
        { type: 'Stretch', count: 3 },
      ]
    },
    {
      date: this.getPastDate(9),
      activities: []
    },

  ];

  // Journal summary (per time block)
  journalSummary: { [key: string]: { mood: string, time: string, sentiment: string, summary: string }[] } = {
    morning: [
      { mood: '😊', time: '7:15 AM', sentiment: 'Happy', summary: 'Feeling energetic and fresh!' },
      { mood: '😢', time: '8:30 AM', sentiment: 'Sad', summary: 'Felt anxious about the meeting.' },
    ],
    afternoon: [
      { mood: '😊', time: '1:15 PM', sentiment: 'Happy', summary: 'Lunch with a friend!' },
      { mood: '😐', time: '2:45 PM', sentiment: 'Neutral', summary: 'Regular workday.' },
      { mood: '😐', time: '3:20 PM', sentiment: 'Neutral', summary: 'Reviewed some code.' },
    ],
    evening: [
      { mood: '😊', time: '7:30 PM', sentiment: 'Happy', summary: 'Nice walk outside!' },
      { mood: '😢', time: '8:15 PM', sentiment: 'Sad', summary: 'Missed a workout session.' },
      { mood: '😊', time: '9:00 PM', sentiment: 'Happy', summary: 'Watched a movie.' },
      { mood: '😐', time: '10:10 PM', sentiment: 'Neutral', summary: 'Ready for sleep.' },
    ]
  };

  leaderboardData = [
    { rank: 1, name: 'Rishabh', sessionScore: 45, stretch: 15, breathing: 15, journal: 15 },
    { rank: 2, name: 'Alex', sessionScore: 40, stretch: 10, breathing: 15, journal: 15 },
    { rank: 3, name: 'Jordan', sessionScore: 35, stretch: 10, breathing: 10, journal: 15 },
    { rank: 4, name: 'Taylor', sessionScore: 25, stretch: 5, breathing: 10, journal: 10 },
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.showConnections = true;
    }, 1200); 
    const newSessions = getCompletedSessions();

    newSessions.forEach(session => {
      this.allCompletedTasks.push(session);
    });

    this.completedTasks = [...this.allCompletedTasks];

    const storedName = sessionStorage.getItem('userName');

    this.userName = storedName || 'friend';
    this.greetingMessage = this.getGreeting() + ', ' + this.userName;
    this.greetingVisible = true;
    this.startVisible = true;
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

  getPastDate(daysAgo: number): string {
    const date = new Date();
    date.setDate(this.today.getDate() - daysAgo);
    return date.toDateString();
  }

  getGreeting(): string {
    const hour = this.today.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  closeSelector() {
    this.showSelector = false;
  }


  // getPieSegments(activities: { type: string; count: number }[]) {
  //   const colorMap: { [key: string]: string } = {
  //     Stretch: '#8dd3c7',
  //     Breathing: '#80b1d3',
  //     Journal: '#fdb462'
  //   };

  //   const total = activities.reduce((sum, a) => sum + a.count, 0);

  //   if (total === 0) return [];

  //   let startAngle = 0;
  //   return activities.map((a) => {
  //     const rawAngle = (a.count / total) * 360;
  //     const angle = rawAngle === 360 ? 359.99 : rawAngle;
  //     const midAngle = startAngle + angle / 2;
  //     const labelRadius = 35;

  //     let labelX = 60;
  //     let labelY = 60;

  //     if (activities.length > 1) {
  //       const labelCoords = this.polarToCartesian(60, 60, 30, midAngle);
  //       labelX = labelCoords.x;
  //       labelY = labelCoords.y;
  //     }


  //     const segment = {
  //       startAngle,
  //       endAngle: startAngle + angle,
  //       color: colorMap[a.type] || '#ccc',
  //       count: a.count,
  //       labelX,
  //       labelY
  //     };
  //     startAngle += angle;
  //     return segment;
  //   });
  // }

  // polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  //   const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
  //   return {
  //     x: cx + r * Math.cos(angleRad),
  //     y: cy + r * Math.sin(angleRad)
  //   };
  // }

  // describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  //   const start = this.polarToCartesian(cx, cy, r, endAngle);
  //   const end = this.polarToCartesian(cx, cy, r, startAngle);
  //   const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

  //   return [
  //     'M', start.x, start.y,
  //     'A', r, r, 0, largeArcFlag, 0, end.x, end.y,
  //     'L', cx, cy,
  //     'Z'
  //   ].join(' ');
  // }

  // getColor(activity: string): string {
  //   const colorMap: { [key: string]: string } = {
  //     Stretch: '#8dd3c7',
  //     Breathing: '#80b1d3',
  //     Journal: '#fdb462'
  //   };
  //   return colorMap[activity] || '#ccc';
  // }

  // getActivityCount(day: any, type: string): number {
  //   const found = day.activities.find((a: any) => a.type === type);
  //   return found ? found.count : 0;
  // }

  // getDasharray(day: any, activity: string, level: number): string {
  //   const freq = this.getActivityCount(day, activity);
  //   const maxFreq = 10;
  //   const circumference = 2 * Math.PI * (20 + level * 8); // match r values from SVG
  //   const percent = Math.min(freq / maxFreq, 1);
  //   return `${circumference} ${circumference}`;
  // }

  // getDashoffset(day: any, activity: string, level: number): string {
  //   const freq = this.getActivityCount(day, activity);
  //   const maxFreq = 10;
  //   const circumference = 2 * Math.PI * (20 + level * 8);
  //   const fill = Math.min(freq / maxFreq, 1);
  //   return `${circumference * (1 - fill)}`;
  // }

  // getTooltipData(day: any): { type: string; count: number }[] {
  //   return [
  //     { type: 'Stretch', count: this.getActivityCount(day, 'Stretch') },
  //     { type: 'Breathing', count: this.getActivityCount(day, 'Breathing') },
  //     { type: 'Journal', count: this.getActivityCount(day, 'Journal') }
  //   ].filter(entry => entry.count > 0);
  // }

  // getConnections(): { x1: number, y1: number, x2: number, y2: number }[] {
  //   const connections = [];
  //   const activeIndices = this.streakData
  //     .map((day, i) => ({ i, hasActivity: day.activities.length > 0 }))
  //     .filter(day => day.hasActivity)
  //     .map(day => day.i);

  //   for (let j = 0; j < activeIndices.length - 1; j++) {
  //     const i1 = activeIndices[j];
  //     const i2 = activeIndices[j + 1];
  //     connections.push({
  //       x1: i1 * 110 + 60,
  //       y1: 80,
  //       x2: i2 * 110 + 60,
  //       y2: 80
  //     });
  //   }

  //   return connections;
  // }

  getColor(activity: string): string {
    const colorMap: { [key: string]: string } = {
      Stretch: '#8dd3c7',
      Breathing: '#80b1d3',
      Journal: '#fdb462'
    };
    return colorMap[activity] || '#ccc';
  }
  
  getActivityCount(day: any, type: string): number {
    const found = day.activities.find((a: any) => a.type === type);
    return found ? found.count : 0;
  }
  
  getDasharray(day: any, activity: string, level: number): string {
    const r = 20 + level * 8;
    const circumference = 2 * Math.PI * r;
    return `${circumference}`;
  }
  
  getDashoffset(day: any, activity: string, level: number): string {
    const r = 20 + level * 8;
    const circumference = 2 * Math.PI * r;
    const count = this.getActivityCount(day, activity);
    const fill = Math.min(count / 10, 1);
    return `${circumference * (1 - fill)}`;
  }
  
  getTooltipData(day: any): { type: string; count: number }[] {
    return ['Stretch', 'Breathing', 'Journal']
      .map(type => ({
        type,
        count: this.getActivityCount(day, type)
      }))
      .filter(entry => entry.count > 0);
  }
  
  getConnections(): { x1: number, y1: number, x2: number, y2: number }[] {
    const connections = [];
    const activeIndices = this.streakData
      .map((day, i) => ({ i, hasActivity: day.activities.length > 0 }))
      .filter(day => day.hasActivity)
      .map(day => day.i);
  
    for (let j = 0; j < activeIndices.length - 1; j++) {
      const i1 = activeIndices[j];
      const i2 = activeIndices[j + 1];
      connections.push({
        x1: i1 * 110 + 60,
        y1: 80,
        x2: i2 * 110 + 60,
        y2: 80
      });
    }
  
    return connections;
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