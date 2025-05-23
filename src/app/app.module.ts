import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { StretchSessionComponent } from './pages/stretch-session/stretch-session.component';
import { BreathingSessionComponent } from './pages/breathing-session/breathing-session.component';
import { JournalSessionComponent } from './pages/journal-session/journal-session.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { DashboardCardsComponent } from './components/dashboard-cards/dashboard-cards.component';
import { StartSessionButtonComponent } from './components/start-session-button/start-session-button.component';
import { SessionSummaryComponent } from './components/session-summary/session-summary.component';
import { ModeToggleComponent } from './components/mode-toggle/mode-toggle.component';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';
import { SessionSelectorComponent } from './components/session-selector/session-selector.component';
import { FormsModule } from '@angular/forms';
import { NamePromptComponent } from './pages/name-prompt/name-prompt.component';
import { LoadingScreenComponent } from './loading/loading.component';
import { PoseDetectionComponent } from './components/pose-detection/pose-detection.component';

export function playerFactory() {
  return player;
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    StretchSessionComponent,
    BreathingSessionComponent,
    JournalSessionComponent,
    AvatarComponent,
    DashboardCardsComponent,
    StartSessionButtonComponent,
    SessionSummaryComponent,
    ModeToggleComponent,
    SessionSelectorComponent,
    NamePromptComponent,
    LoadingScreenComponent,
    PoseDetectionComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    LottieModule.forRoot({ player: playerFactory }),
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
