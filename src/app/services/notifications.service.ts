import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Notification } from '../models';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  notificationAdded = new Subject<Notification>();

  constructor() { }

  push(notification: Notification) {
    this.notificationAdded.next(notification);
  }
}
