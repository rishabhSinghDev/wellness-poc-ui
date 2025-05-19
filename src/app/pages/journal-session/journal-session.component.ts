import { Component } from '@angular/core';
import { markSessionCompleted } from 'src/app/utils/session-storage.util';

@Component({
  selector: 'app-journal-session',
  templateUrl: './journal-session.component.html',
  styleUrls: ['./journal-session.component.scss']
})
export class JournalSessionComponent {
  prompts = [
    "What was the most meaningful moment in the last 24 hours?",
    "Is there something you're grateful for today?",
    "What challenge did you overcome recently?",
    "What's one thing you want to improve tomorrow?"
  ];

  currentPromptIndex = 0;
  currentAnswer = '';
  answers: string[] = [];
  completed = false;

  submitAnswer() {
    if (this.currentAnswer.trim()) {
      this.answers.push(this.currentAnswer.trim());
      this.currentAnswer = '';
      if (this.currentPromptIndex < this.prompts.length - 1) {
        this.currentPromptIndex++;
      } else {
        this.completed = true;
        // const completed = JSON.parse(sessionStorage.getItem('completedTasks') || '[]');
        // completed.push({ activity: 'Journal', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
        // sessionStorage.setItem('completedTasks', JSON.stringify(completed));
        markSessionCompleted('Journal');

        // Optional: You could send answers to backend here.
      }
    }
  }
}
