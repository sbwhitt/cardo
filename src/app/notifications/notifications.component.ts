import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationsService } from '../services/notifications.service';
import { Notification } from '../models';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {
  notifications: Notification[] = [];
  timeout = 1500; // milliseconds

  constructor(
    private notificationsService: NotificationsService
  ) {}

  ngOnInit() {
    this.notificationsService.notificationAdded.subscribe((n) => this.handleNotification(n));
  }

  handleNotification(notification: Notification) {
    this.notifications.push(notification);
    this.clearNext();
  }

  clearNext() {
    setTimeout(() => this.notifications.splice(0, 1), this.timeout);
  }

}
