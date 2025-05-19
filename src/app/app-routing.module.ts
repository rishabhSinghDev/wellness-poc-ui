import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { StretchSessionComponent } from './pages/stretch-session/stretch-session.component';
import { BreathingSessionComponent } from './pages/breathing-session/breathing-session.component';
import { JournalSessionComponent } from './pages/journal-session/journal-session.component';
import { NamePromptComponent } from './pages/name-prompt/name-prompt.component';

const routes: Routes = [
  { path: '', component: NamePromptComponent },
  { path: 'home', component: HomeComponent },
  { path: 'stretch-session', component: StretchSessionComponent },
  { path: 'breathing-session', component: BreathingSessionComponent },
  { path: 'journal-session', component: JournalSessionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
