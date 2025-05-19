import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PoseDetectionService } from 'src/app/services/pose-detection.service';

@Component({
  selector: 'app-pose-detection',
  templateUrl: './pose-detection.component.html',
  styleUrls: ['./pose-detection.component.scss']
})
export class PoseDetectionComponent implements OnInit, OnDestroy {

  currentFrame: string | undefined;
  landmarks!: any[];
  private subscription!: Subscription;

  constructor(private poseService: PoseDetectionService) {}

  ngOnInit() {
    this.subscription = this.poseService.getPoseData().subscribe(data => {
      debugger;
      this.currentFrame = data.image;
      this.landmarks = data.landmarks;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.poseService.closeConnection();
  }
}
