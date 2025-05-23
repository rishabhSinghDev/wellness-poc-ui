import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { PoseDetectionComponent } from 'src/app/components/pose-detection/pose-detection.component';
import { markSessionCompleted } from 'src/app/utils/session-storage.util';
import { PoseDetectionService, ExerciseType } from 'src/app/services/pose-detection.service';

@Component({
  selector: 'app-stretch-session',
  templateUrl: './stretch-session.component.html',
  styleUrls: ['./stretch-session.component.scss']
})
export class StretchSessionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('webcamRef') webcamRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('videoRef') videoElement!: ElementRef<HTMLVideoElement>;
  @Output('repCount') repCount!: number;
  private stream: MediaStream | null = null;

  sessionStarted = false;
  countdownStarted = false;
  showStartPrompt = true;
  isSessionCompleted = false;

  showSummaryCard = false;
  repsCompleted = 0;

  timeLeft: number = 30; //set workout session to 30 secs
  intervalId: any;
  countdown = 3;
  countdownInterval: any;
  promptText: string = 'Give a thumbs up to begin!';

  showSummary = false;

  exercises: { id: ExerciseType; name: string }[] = [
    { id: 'squats', name: 'Squats' },
    { id: 'neck_rotation', name: 'Neck Rotation' },
    { id: 'hand_raise', name: 'Hand Raises' }
  ];

  selectedExercise: ExerciseType = 'squats';

  // Add video sources for each exercise
  private videoSources: { [key in ExerciseType]: string } = {
    squats: 'assets/videos/squats.mp4',
    neck_rotation: 'assets/videos/neck-rotation.mp4',
    hand_raise: 'assets/videos/hand-raise.mp4'
  };

  private audioPlayer: HTMLAudioElement = new Audio();
  private audioCache: { [key: string]: HTMLAudioElement } = {};
  private audioTimestamps = [0, 10, 15, 20, 25, 26, 27, 28, 29, 30];

  constructor(private poseDetectionService: PoseDetectionService) {
    // Pre-load all audio files
    this.audioTimestamps.forEach(timestamp => {
      const audio = new Audio();
      audio.src = `assets/audio/streching/${timestamp.toFixed(2)}.mp3`;
      audio.load(); // Pre-load the audio
      this.audioCache[timestamp] = audio;
    });
  }

  onRepsCompleted(repCount: number) {
    this.repsCompleted = repCount;
  }

  private async playAudioForTimestamp(timestamp: number) {
    try {
      const audio = this.audioCache[timestamp];
      if (!audio) {
        console.warn(`Audio not found for timestamp: ${timestamp}`);
        return;
      }

      // Reset the audio to start
      audio.currentTime = 0;

      // Create and resolve a promise when audio plays
      await audio.play().catch(error => {
        console.warn(`Error playing audio at ${timestamp}:`, error);
      });
    } catch (error) {
      console.warn(`General error with audio at ${timestamp}:`, error);
    }
  }

  startSession(): void {
    // Prevent multiple starts
    if (this.sessionStarted) return;

    this.sessionStarted = true;
    this.isSessionCompleted = false;
    this.promptText = 'Session Started!';

    // Set the video source based on selected exercise
    this.videoElement.nativeElement.src = this.videoSources[this.selectedExercise];
    this.videoElement.nativeElement.load();
    this.videoElement.nativeElement.play();

    // Play start audio
    this.playAudioForTimestamp(0);

    // Start the timer after 2 seconds delay
    setTimeout(() => {
      this.intervalId = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;

          // Check if we need to play audio at this timestamp
          if (this.audioTimestamps.includes(30 - this.timeLeft) && this.timeLeft > 0) {
            this.playAudioForTimestamp(30 - this.timeLeft);
          }

          if (this.timeLeft === 15) {
            this.promptText = 'You\'re almost there!';
          } else if (this.timeLeft === 10) {
            this.promptText = 'Just 10 more seconds!';
          }
        } else {
          this.promptText = 'Well done! Session complete 🎉';
          this.isSessionCompleted = true;
          clearInterval(this.intervalId);

          // Play completion audio after 1 second delay
          setTimeout(() => {
            this.playAudioForTimestamp(30);
          }, 2000);

          // Show summary card after completion audio
          setTimeout(() => {
            this.showSummaryCard = true;
            markSessionCompleted('Stretch');
            this.videoElement.nativeElement.pause();
            this.videoElement.nativeElement.currentTime = 0;
          }, 2000); // Show summary 1 second after completion audio
        }
      }, 1000);
    }, 2000); // 2 second delay before starting the timer
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
    this.audioPlayer.pause();
    this.audioPlayer.src = '';

    // Clean up all audio players
    Object.values(this.audioCache).forEach(audio => {
      audio.pause();
      audio.src = '';
    });
    this.audioCache = {};
  }

  closeSummary() {
    this.showSummary = false;
  }

  onExerciseChange(exercise: ExerciseType) {
    // Only allow changes if session hasn't started or has completed
    if (!this.sessionStarted || this.showSummaryCard) {
      this.selectedExercise = exercise;
      this.poseDetectionService.selectExercise(exercise);
      // Update video source when exercise changes
      if (this.videoElement) {
        this.videoElement.nativeElement.src = this.videoSources[exercise];
        this.videoElement.nativeElement.load();
      }
    }
  }

  onExerciseTypeChange(exercise: ExerciseType) {
    if (!this.sessionStarted) {  // Only update if session hasn't started
      this.selectedExercise = exercise;
      this.poseDetectionService.selectExercise(exercise);
      // Update video source when exercise changes
      if (this.videoElement) {
        this.videoElement.nativeElement.src = this.videoSources[exercise];
        this.videoElement.nativeElement.load();
      }
    }
  }

  getSliderPosition(): string {
    const index = this.exercises.findIndex(e => e.id === this.selectedExercise);
    return `translateX(${index * 100}%)`;
  }

  simulateThumbsUp() {
    if (!this.sessionStarted && !this.countdownStarted) {
      this.promptText = 'Thumbs up detected!';
      this.countdownStarted = true;
      this.startSession();
    }
  }

  simulateRep(): void {
    if (this.sessionStarted && !this.isSessionCompleted) {
      this.repsCompleted++;
    }
  }

  handleKeyPress = (e: KeyboardEvent) => {
    if (e.code === 'Space' && !this.sessionStarted && !this.countdownStarted) {
      this.simulateThumbsUp();
    } else if (this.sessionStarted && !this.isSessionCompleted) {
      this.simulateRep();
    }
  };

  ngAfterViewInit(): void {
    window.addEventListener('keydown', this.handleKeyPress);
    // Set initial video source
    if (this.videoElement) {
      this.videoElement.nativeElement.src = this.videoSources[this.selectedExercise];
      this.videoElement.nativeElement.load();
    }
  }
}
