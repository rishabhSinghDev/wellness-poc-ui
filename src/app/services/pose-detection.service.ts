import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';
import { IFrameResponse } from '../models/frame-response.interface';


export type ExerciseType = 'squats' | 'neck_rotation' | 'hand_raise';

@Injectable({
  providedIn: 'root'
})
export class PoseDetectionService {

  private socket$: WebSocketSubject<any>;
  private wsUrl: string = environment.websocketURL;

  constructor() {
    this.socket$ = webSocket(this.wsUrl);
  }

  getPoseData(): Observable<IFrameResponse> {
    return this.socket$.asObservable();
  }

  closeConnection() {
    this.socket$.complete();
  }

  selectExercise(exercise: ExerciseType) {
    this.socket$.next({ exercise });
  }
}
