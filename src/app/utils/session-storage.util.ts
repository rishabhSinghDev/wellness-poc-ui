export function markSessionCompleted(session: string): void {
  const completedSessions = JSON.parse(sessionStorage.getItem('completedSessions') || '[]');

  const time = new Date().toLocaleTimeString([], {
    hour: 'numeric',           // No leading zero
    minute: '2-digit',
    hour12: true               // Use AM/PM format
  });

  completedSessions.push({ activity: session, time });
  sessionStorage.setItem('completedSessions', JSON.stringify(completedSessions));
}

  
  export function getCompletedSessions() : CompletedSession[] {
    return JSON.parse(sessionStorage.getItem('completedSessions') || '[]');
  }
  
  export interface CompletedSession {
    activity: string;
    time: string;
  }