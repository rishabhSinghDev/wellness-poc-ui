import { Component } from '@angular/core';

@Component({
  selector: 'app-breathing-session',
  templateUrl: './breathing-session.component.html',
  styleUrls: ['./breathing-session.component.scss']
})
export class BreathingSessionComponent {
  sessionStarted = false;
  countdown = 0;
  showSummaryCard = false;
  promptText = 'Box breathing helps calm the nervous system.';
  intervalId: any;
  breathingTimeLeft = 60;
  breathingTimerId: any;
  showSummary = false;


  breathingPhases = ['Inhale', 'Hold', 'Exhale', 'Hold'];
  currentPhaseIndex = 0;
  currentPhase = 'Inhale';

  isPhaseStart = true;
  previousPhase = 'Inhale';
  scaleState = 'small';



  startCountdown() {
    this.countdown = 3;
    this.promptText = 'Starting in 3...';
    const countdownInterval = setInterval(() => {
      this.countdown--;
      this.promptText = `Starting in ${this.countdown}...`;
      if (this.countdown === 0) {
        clearInterval(countdownInterval);
        this.startSession();
      }
    }, 1000);
  }

  // startSession() {
  //   this.sessionStarted = true;
  //   this.playBreathingCycle();

  //   this.intervalId = setTimeout(() => {
  //     this.sessionStarted = false;
  //     this.showSummaryCard = true;
  //   }, 60000); // 1 minute session

  //   this.breathingTimerId = setInterval(() => {
  //     if (this.breathingTimeLeft > 0) {
  //       this.breathingTimeLeft--;
  //     }
  //   }, 1000);

  // }

  // playBreathingCycle() {
  //   let index = 0;
  //   setInterval(() => {
  //     this.currentPhaseIndex = index % this.breathingPhases.length;
  //     this.currentPhase = this.breathingPhases[this.currentPhaseIndex];
  //     index++;
  //   }, 4000); // 4s per phase
  // }

  startSession() {
    this.sessionStarted = true;
    this.startBreathingPhases();

    const timerInterval = setInterval(() => {
      this.breathingTimeLeft--;
      if (this.breathingTimeLeft === 0) {
        clearInterval(timerInterval);
        this.sessionStarted = false;
        this.showSummaryCard = true;
      }
    }, 1000);
  }

  // startBreathingPhases() {
  //   const phases = ['Inhale', 'Hold', 'Exhale', 'Hold'];
  //   let index = 0;
  
  //   this.currentPhase = phases[index];
  //   this.previousPhase = 'Inhale';
  
  //   setInterval(() => {
  //     index++;
  //     this.previousPhase = this.currentPhase;
  //     this.currentPhase = phases[index % 4];
  //   }, 4000);
  // }

  startBreathingPhases() {
    const phases = ['Inhale', 'Hold', 'Exhale', 'Hold'];
    let index = 0;
  
    this.currentPhase = phases[index];
    this.previousPhase = 'Inhale';
  
    // Special handling for first inhale
    this.scaleState = 'small';
    setTimeout(() => {
      this.scaleState = 'normal';
    }, 100);
  
    setInterval(() => {
      index++;
      this.previousPhase = this.currentPhase;
      this.currentPhase = phases[index % 4];
  
      // Reset scaleState when returning to Inhale
      if (this.currentPhase === 'Inhale') {
        this.scaleState = 'small';
        setTimeout(() => {
          this.scaleState = 'normal';
        }, 100);
      }
    }, 4000);
  }
  
  

  closeSummary() {
    this.showSummary = false;
    this.showSummaryCard = false;
    this.sessionStarted = false;
    this.breathingTimeLeft = 60;
    this.currentPhase = 'Inhale';
    this.countdown = 0;
  }

  ngOnDestroy(): void {
    clearInterval(this.breathingTimerId);
  }
}
