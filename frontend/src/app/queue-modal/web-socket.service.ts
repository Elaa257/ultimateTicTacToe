import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
  }


  emit(event: string, data?: any): void {
    this.socket.emit(event, data);
  }

  listen<T>(event: string): Observable<T> {
    return new Observable<T>((subscriber) => {
      console.log(`Listening for event: ${event}`);
      this.socket.on(event, (data: T) => {
        console.log(`Received event: ${event}`, data);
        subscriber.next(data);
      });
    });
  }
}
