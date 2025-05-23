import { Router } from '@angular/router';
import { AnimationOptions } from 'ngx-lottie';
import { Component } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { getCompletedSessions, CompletedSession } from 'src/app/utils/session-storage.util';
import { HttpClient } from '@angular/common/http';

enum Emotion {
  Happy = 0,
  Sad = 1,
  Angry = 2,
  Neutral = 3,
  Unknown = 4,
}

function emotionToEmoji(emotion: Emotion): string {
  switch (emotion) {
    case Emotion.Happy: return '😊';
    case Emotion.Sad: return '😢';
    case Emotion.Angry: return '😡';
    case Emotion.Neutral:
    case Emotion.Unknown: // 🔁 change this line
      return '😐';
    default: return '😐'; // fallback as well
  }
}

interface JournalEntry {
  id: number;
  timestamp: string;
  text: string;
  emotion: Emotion;
  summary: string;
}

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

  // hoveredEmojiIndexByPeriod: { [period: string]: number | null } = {
  //   morning: null,
  //   afternoon: null,
  //   evening: null
  // };

  journalSummary: {
    [key: string]: {
      mood: string;
      time: string;
      sentiment: string;
      summary: string;
    }[];
  } = {
    morning: [],
    afternoon: [],
    evening: [],
    night: [],
  };
  
  hoveredEmojiIndexByPeriod: { [key: string]: number | null } = {
    morning: null,
    afternoon: null,
    evening: null,
    night: null,
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
  // journalSummary: { [key: string]: { mood: string, time: string, sentiment: string, summary: string }[] } = {
  //   morning: [
  //     { mood: '😊', time: '7:15 AM', sentiment: 'Happy', summary: 'Feeling energetic and fresh!' },
  //     { mood: '😢', time: '8:30 AM', sentiment: 'Sad', summary: 'Felt anxious about the meeting.' },
  //   ],
  //   afternoon: [
  //     { mood: '😊', time: '1:15 PM', sentiment: 'Happy', summary: 'Lunch with a friend!' },
  //     { mood: '😐', time: '2:45 PM', sentiment: 'Neutral', summary: 'Regular workday.' },
  //     { mood: '😐', time: '3:20 PM', sentiment: 'Neutral', summary: 'Reviewed some code.' },
  //   ],
  //   evening: [
  //     { mood: '😊', time: '7:30 PM', sentiment: 'Happy', summary: 'Nice walk outside!' },
  //     { mood: '😢', time: '8:15 PM', sentiment: 'Sad', summary: 'Missed a workout session.' },
  //     { mood: '😊', time: '9:00 PM', sentiment: 'Happy', summary: 'Watched a movie.' },
  //     { mood: '😐', time: '10:10 PM', sentiment: 'Neutral', summary: 'Ready for sleep.' },
  //   ]
  // };

  leaderboardData = [
    { rank: 1, name: 'Rishabh', streakScore: 5 },
    { rank: 2, name: 'Alex', streakScore: 4 },
    { rank: 3, name: 'Jordan', streakScore: 3 },
    { rank: 4, name: 'Taylor', streakScore: 2 },
  ];

  constructor(private router: Router, private httpClient : HttpClient) { }

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
    this.fetchJournalSummary();
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

  fetchJournalSummary() {
    this.httpClient.get<JournalEntry[]>('http://localhost:5275/api/Ai').subscribe((entries: any) => {
      const grouped: {
        [key: string]: {
          mood: string;
          time: string;
          sentiment: string;
          summary: string;
        }[];
      } = {
        morning: [],
        afternoon: [],
        evening: [],
        night: [],
      };
  
      for (const entry of entries) {
        const date = new Date(entry.timestamp);
        const hour = date.getHours();
        const period = this.getPeriod(hour);
  
        grouped[period].push({
          mood: emotionToEmoji(entry.emotion),
          time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sentiment: Emotion[entry.emotion],
          summary: entry.summary,
        });
      }
  
      this.journalSummary = grouped;
    });
  }
  
  getPeriod(hour: number): 'morning' | 'afternoon' | 'evening' | 'night' {
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 21) return 'evening';
    return 'night';
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

  getHoveredEntry(period: string) {
    const index = this.hoveredEmojiIndexByPeriod[period];
    return index !== null ? this.journalSummary[period][index] : null;
  }

  getHoveredIndex(period: string): number | null {
    return this.hoveredEmojiIndexByPeriod[period];
  }
}