import { Component, NgZone, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingService } from 'src/app/loading/loading.service';

declare var webkitSpeechRecognition: any;
declare var SpeechRecognition: any;

enum Emotion {
  Happy = 0,
  Sad = 1,
  Angry = 2,
  Neutral = 3,
  Unknown = 4,
}
interface JournalApiResponse {
  id: number;
  timestamp: string;
  text: string;
  emotion: number;
  summary: string;
}

function emotionToEmoji(emotion: Emotion): string {
  switch (emotion) {
    case Emotion.Happy: return '😊';
    case Emotion.Sad: return '😢';
    case Emotion.Angry: return '😡';
    case Emotion.Neutral:
    case Emotion.Unknown:
      return '😐';
    default: return '😐';
  }
}

@Component({
  selector: 'app-journal-session',
  templateUrl: './journal-session.component.html',
  styleUrls: ['./journal-session.component.scss']
})
export class JournalSessionComponent implements OnDestroy {
  storedName = sessionStorage.getItem('userName');
  prompt = `Hey ${this.storedName}, how's it going?`;
  currentAnswer = '';
  isRecording = false;
  completed = false;
  isSubmit = false;

  recognition: any;
  interimTranscript = '';
  silenceTimer: any;

  emotionValue: Emotion = Emotion.Unknown;
  summaryText = '';

  constructor(private zone: NgZone, private httpClient: HttpClient, private loadingService: LoadingService) {
    const SpeechRecognitionConstructor = window.hasOwnProperty('webkitSpeechRecognition')
      ? webkitSpeechRecognition
      : SpeechRecognition;

    this.recognition = new SpeechRecognitionConstructor();
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = true;
    this.recognition.continuous = false; // We will handle continuity manually

    this.recognition.onresult = (event: any) => {
      let finalTranscript = '';
      this.interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript.trim() + ' ';
        } else {
          this.interimTranscript += transcript;
        }
      }

      this.zone.run(() => {
        this.currentAnswer += finalTranscript;
      });

      this.resetSilenceTimer();
    };

    this.recognition.onend = () => {
      if (this.isRecording) {
        this.recognition.start(); // Restart automatically to simulate continuous recording
      }
    };
  }

  toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  startRecording() {
    if (this.isRecording) return;
    this.isRecording = true;
    // this.recognition.start();
    // this.resetSilenceTimer();
    try {
      this.recognition.start();
      this.resetSilenceTimer();
    } catch (err) {
      console.warn('Error starting recognition:', err);
    }
  }

  stopRecording() {
    this.isRecording = false;
    clearTimeout(this.silenceTimer);
    this.recognition.stop();
  }

  cancelRecording() {
    if (this.isRecording) {
      this.stopRecording();
    }
    // this.currentAnswer = '';
    this.interimTranscript = '';
  }

  resetSilenceTimer() {
    clearTimeout(this.silenceTimer);
    this.silenceTimer = setTimeout(() => {
      this.zone.run(() => {
        if (!this.currentAnswer.trim().endsWith('.') && this.currentAnswer.length > 0) {
          this.currentAnswer += '. ';
        }
      });
    }, 1500); // 1.5 seconds of silence inserts punctuation
  }

  submitAnswer() {
    this.isSubmit = true;
    this.stopRecording();
    if (this.currentAnswer.trim()) {
      this.loadingService.show();
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
      const payload = { userText: this.currentAnswer.trim() };

      // this.httpClient.post('http://localhost:5270/api/Ai', payload, { headers }).subscribe({
      //   next: (response : JournalApiResponse) => {
      //     // this.apiResponseMessage = response.text || '';
      //     this.summaryText = response.summary || '';
      //     this.emotionValue = response.emotion;
      //     this.completed = true;
      //     this.loadingService.hide();
      //   },
      //   error: (err) => {
      //     console.error("Failed to submit journal", err);
      //     this.loadingService.hide();
      //   }
      // });

      this.httpClient.post<JournalApiResponse>('http://localhost:5275/api/Ai', payload, { headers }).subscribe({
        next: (response) => {
          // this.apiResponseMessage = response.text || '';
          this.summaryText = response.summary || '';
          this.emotionValue = response.emotion;
          this.completed = true;
          this.loadingService.hide();
        },
        error: (err) => {
          console.error("Failed to submit journal", err);
          this.loadingService.hide();
        }
      });
    }
  }
  emotionToEmoji(emotion: Emotion): string {
    switch (emotion) {
      case Emotion.Happy: return '😊';
      case Emotion.Sad: return '😢';
      case Emotion.Angry: return '😡';
      case Emotion.Neutral:
      case Emotion.Unknown:
        return '😐';
      default: return '😐';
    }
  }

  ngOnDestroy(): void {
    if (this.recognition) {
      try {
        this.recognition.onresult = null;
        this.recognition.onend = null;
        this.recognition.onerror = null;
        this.recognition.stop(); // stop the mic
        this.recognition = null;
      } catch (err) {
        console.warn('Error cleaning up recognition:', err);
      }
    }

    clearTimeout(this.silenceTimer);
  }
}
