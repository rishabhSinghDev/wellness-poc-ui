import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PoseDetectionService {

  private socket$: WebSocketSubject<any>;
  private wsUrl: string = environment.websocketURL;

  constructor() {
    this.socket$ = webSocket(this.wsUrl);
  }

  getPoseData(): Observable<any> {
    return this.socket$.asObservable();
  }

  closeConnection() {
    this.socket$.complete();
  }
}
