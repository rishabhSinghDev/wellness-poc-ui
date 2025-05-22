import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { PoseDetectionService } from 'src/app/services/pose-detection.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ExerciseType } from 'src/app/services/pose-detection.service';

@Component({
  selector: 'app-pose-detection',
  templateUrl: './pose-detection.component.html',
  styleUrls: ['./pose-detection.component.scss'],
  animations: [
    trigger('repCountAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translate(-50%, -50%) scale(0.5)'
        }),
        animate('500ms ease-out', style({
          opacity: 1,
          transform: 'translate(-50%, -50%) scale(1)'
        })),
        animate('300ms', style({ opacity: 1 })),
        animate('200ms', style({ opacity: 0 }))
      ])
    ]),
    trigger('sessionStartAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'scale(1.2)'
        }),
        animate('600ms ease-out', style({
          opacity: 1,
          transform: 'scale(1)'
        })),
        animate('1000ms', style({ opacity: 1 })),
        animate('400ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class PoseDetectionComponent implements OnInit, OnDestroy {
  currentFrame: string | undefined;
  currentExercise: string | undefined;
  repCount: number = 0;
  showRepAnimation: boolean = false;
  showSessionStarted: boolean = false;
  private hasShownStartOverlay: boolean = false;
  private subscription!: Subscription;

  @Input() isSessionCompleted = false;
  @Output() repCountChange = new EventEmitter<number>();
  @Output() workoutStarted = new EventEmitter<boolean>();
  @Output() exerciseTypeChange = new EventEmitter<ExerciseType>();

  constructor(private poseService: PoseDetectionService) {}

  ngOnInit() {
    this.subscription = this.poseService.getPoseData().subscribe(data => {
      this.currentFrame = data.image;

      if (this.currentExercise !== data.current_exercise) {
        this.currentExercise = data.current_exercise;
        this.exerciseTypeChange.emit(data.current_exercise as ExerciseType);
      }

      // Only update rep count if session is not completed
      if(data.rep_count != this.repCount && !this.isSessionCompleted) {
        this.repCount = data.rep_count;
        this.repCountChange.emit(this.repCount);
        this.triggerRepAnimation();
      }

      if(data.is_workout_started && !this.hasShownStartOverlay) {
        this.workoutStarted.emit(true);
        this.showSessionStartOverlay();
        this.hasShownStartOverlay = true;
      }
    });
  }

  triggerRepAnimation() {
    this.showRepAnimation = true;
    setTimeout(() => {
      this.showRepAnimation = false;
    }, 1000); // Animation duration
  }

  showSessionStartOverlay() {
    this.showSessionStarted = true;
    setTimeout(() => {
      this.showSessionStarted = false;
    }, 2000); // Total animation duration
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
