import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { markSessionCompleted } from 'src/app/utils/session-storage.util';

@Component({
  selector: 'app-journal-session',
  templateUrl: './journal-session.component.html',
  styleUrls: ['./journal-session.component.scss']
})
export class JournalSessionComponent {
  constructor(private httpClient : HttpClient) {}
  storedName = sessionStorage.getItem('userName');
  prompt = `Hey ${this.storedName}, How's it going?`;
  currentAnswer = '';
  completed = false;

  submitAnswer() {
    if (this.currentAnswer.trim()) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
      });

      const payload = {
        userText: this.currentAnswer.trim()
      };

      this.httpClient.post('http://localhost:5270/api/Ai',payload, {headers}).subscribe((response) => {
        if(response)
        {
          console.log("Journal entry successful", response);
        }
      });
        this.completed = true;
        // backend logic here
    }
  }
}
