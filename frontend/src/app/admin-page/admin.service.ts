import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor() { }

  getCurrentQueue(): Observable<string[]>{
    return of(['Not yet implemetented']);
  }
}
