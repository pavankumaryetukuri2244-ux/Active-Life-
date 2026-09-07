import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserinfoService {
  public userdetails = new BehaviorSubject<any>(null);

  constructor() { }

  setUser(value: any) {
    this.userdetails.next(value);
  }
}
