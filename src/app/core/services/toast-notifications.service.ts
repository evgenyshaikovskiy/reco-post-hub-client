import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastNotificationType } from '../types/notification-type';

@Injectable({ providedIn: 'root' })
export class ToastNotificationsService {
  private readonly _toasts: {
    [key: string]: { severity: string; summary: string };
  } = {
    success: { severity: 'success', summary: 'Success' },
    info: { severity: 'info', summary: 'Information' },
    warning: { severity: 'warn', summary: 'Warning' },
    error: { severity: 'error', summary: 'Error' },
  };

  private readonly _messageLifespanMs: number = 5000;
  constructor(private readonly _messageService: MessageService) {}

  public showNotification(type: ToastNotificationType, message?: string): void {
    this._messageService.add({
      ...this._toasts[type],
      detail: message,
      life: this._messageLifespanMs,
    });
  }
}
