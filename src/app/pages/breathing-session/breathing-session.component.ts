import { Component } from '@angular/core';
import { markSessionCompleted } from 'src/app/utils/session-storage.util';

@Component({
  selector: 'app-breathing-session',
  templateUrl: './breathing-session.component.html',
  styleUrls: ['./breathing-session.component.scss']
})
export class BreathingSessionComponent {
  sessionStarted = false;
  showSummaryCard = false;
  countdown = 0;
  breathingTimeLeft = 15;

  currentPhase = 'Inhale';
  scale = 'scale(1)';
  currentColor = '#81e6d9'; // soft blue-green

  circleSize = 100; // start small
  startSize = 100;
  endSize = 150;

  audio = new Audio('assets/audio/breathing.mp3');

  timeTimer: any;
  phaseTimer: any;
  colorInterval: any;

  startCountdown() {
    this.countdown = 3;
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(interval);
        this.startSession();
      }
    }, 1000);
  }

  startSession() {
    this.sessionStarted = true;
    this.audio.loop = true;
    this.audio.play();
    this.breathingTimeLeft = 15;
    this.currentPhase = 'Inhale';
    this.runPhase(this.currentPhase);

    this.timeTimer = setInterval(() => {
      this.breathingTimeLeft--;
      if (this.breathingTimeLeft <= 0) this.endSession();
    }, 1000);

    this.phaseTimer = setInterval(() => {
      this.currentPhase = this.getNextPhase(this.currentPhase);
      this.runPhase(this.currentPhase);
    }, 4000);
  }

  getNextPhase(phase: string): string {
    switch (phase) {
      case 'Inhale': return 'Hold1';
      case 'Hold1': return 'Exhale';
      case 'Exhale': return 'Hold2';
      case 'Hold2': return 'Inhale';
      default: return 'Inhale';
    }
  }

  runPhase(phase: string) {
    if (this.colorInterval) clearInterval(this.colorInterval);

    if (phase === 'Inhale') {
      this.animateColorTransition('#81e6d9', '#234e52', 100, 150); // expand & darken
    }
    else if (phase === 'Exhale') {
      this.animateColorTransition('#234e52', '#81e6d9', 150, 100); // contract & lighten
    }
    else {
      // Hold: freeze both size and color
    }
  }

  animateColorTransition(fromColor: string, toColor: string, fromSize: number, toSize: number) {
    const from = this.hexToRgb(fromColor);
    const to = this.hexToRgb(toColor);

    const steps = 40;
    const stepDuration = 100;
    let step = 0;

    const sizeDelta = (toSize - fromSize) / steps;

    this.colorInterval = setInterval(() => {
      // Color interpolation
      const r = Math.round(from.r + (to.r - from.r) * (step / steps));
      const g = Math.round(from.g + (to.g - from.g) * (step / steps));
      const b = Math.round(from.b + (to.b - from.b) * (step / steps));
      this.currentColor = `rgb(${r}, ${g}, ${b})`;

      // Size interpolation
      this.circleSize = fromSize + sizeDelta * step;

      step++;
      if (step > steps) clearInterval(this.colorInterval);
    }, stepDuration);
  }


  hexToRgb(hex: string): { r: number, g: number, b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : { r: 0, g: 0, b: 0 };
  }

  stopBreathingAudio() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0; // reset to start
    }
  }

  endSession() {
    clearInterval(this.phaseTimer);
    clearInterval(this.timeTimer);
    clearInterval(this.colorInterval);
    this.audio.pause();
    this.audio.currentTime = 0;
    this.showSummaryCard = true;
    this.sessionStarted = false;
    markSessionCompleted('Breathing');

  }

  closeSummary() {
    this.showSummaryCard = false;
    this.sessionStarted = false;
    this.breathingTimeLeft = 60;
    this.currentPhase = 'Inhale';
    this.scale = 'scale(1)';
    this.currentColor = '#81e6d9';
    this.countdown = 0;
    this.stopBreathingAudio();
  }

  ngOnDestroy(): void {
    clearInterval(this.phaseTimer);
    clearInterval(this.timeTimer);
    clearInterval(this.colorInterval);
    this.stopBreathingAudio();
  }
}
