import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { markSessionCompleted } from 'src/app/utils/session-storage.util';

@Component({
  selector: 'app-stretch-session',
  templateUrl: './stretch-session.component.html',
  styleUrls: ['./stretch-session.component.scss']
})
export class StretchSessionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('webcamRef') webcamRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoRef') videoElement!: ElementRef<HTMLVideoElement>;
  private stream: MediaStream | null = null;

  sessionStarted = false;
  countdownStarted = false;
  showStartPrompt = true;

  showSummaryCard = false;
  repsCompleted = 0;

  timeLeft: number = 60;
  intervalId: any;
  countdown = 3;
  countdownInterval: any;
  promptText: string = 'Give a thumbs up to begin!';

  showSummary = false;

  ngAfterViewInit(): void {
    // this.startCamera();
    window.addEventListener('keydown', this.handleKeyPress); // simulate thumbs-up via spacebar
  }

  startCamera(): void {
    if (navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        this.stream = stream;
        this.webcamRef.nativeElement.srcObject = stream;
      }).catch((err) => {
        console.error('Camera error:', err);
      });
    }
  }

  handleKeyPress = (e: KeyboardEvent) => {
    if (e.code === 'Space' && !this.sessionStarted && !this.countdownStarted) {
      this.simulateThumbsUp();
    } else if (this.sessionStarted) {
      // this.repsCompleted++;
      this.simulateRep();
    }
  };

  simulateThumbsUp() {
    this.promptText = 'Thumbs up detected!';
    this.countdownStarted = true;

    this.countdownInterval = setInterval(() => {
      if (this.countdown > 1) {
        this.countdown--;
        this.promptText = `Starting in ${this.countdown}...`;
      } else {
        clearInterval(this.countdownInterval);
        this.startSession();
      }
    }, 1000);
  }

  simulateRep(): void {
    if (this.sessionStarted) {
      this.repsCompleted++;
    }
  }

  startSession(): void {
    this.sessionStarted = true;
    this.promptText = 'Session Started!';
    this.videoElement.nativeElement.play();
    this.intervalId = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;

        if (this.timeLeft === 30) {
          this.promptText = 'You’re halfway there!';
        } else if (this.timeLeft === 10) {
          this.promptText = 'Just 10 more seconds!';
        }
      } else {
        this.promptText = 'Well done! Session complete 🎉';
        clearInterval(this.intervalId);

        // Show summary card after short delay
        setTimeout(() => {
          this.showSummaryCard = true;
          // const completed = JSON.parse(sessionStorage.getItem('completedTasks') || '[]');
          // completed.push({ activity: 'Stretch', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
          // sessionStorage.setItem('completedTasks', JSON.stringify(completed));
          markSessionCompleted('Stretch');
          this.videoElement.nativeElement.pause();
          this.videoElement.nativeElement.currentTime = 0;

        }, 1000);
      }
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    window.removeEventListener('keydown', this.handleKeyPress);
  }

  // endSession() {
  //   this.showSummary = true;
  // }

  closeSummary() {
    this.showSummary = false;
  }
}
