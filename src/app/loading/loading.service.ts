import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
@Injectable({
 providedIn: 'root'
})
export class LoadingService {
 private _loadingState = new BehaviorSubject<boolean>(false);
 loadingState = this._loadingState.asObservable();
 show() {
   this._loadingState.next(true);
 }
 hide() {
   setTimeout(() => this._loadingState.next(false), 3000); // minimum 1.2s duration
 }
}