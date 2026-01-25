import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  timeout?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastStore {
  private _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  private nextId = 1;

  show(message: string, type: ToastType = 'info', timeout = 4000) {
    const toast: Toast = {
      id: this.nextId++,
      message,
      type,
      timeout,
    };

    this._toasts.update((list) => [...list, toast]);

    if (timeout && timeout > 0) {
      setTimeout(() => this.dismiss(toast.id), timeout);
    }
  }

  success(message: string, timeout = 4000) {
    this.show(message, 'success', timeout);
  }

  error(message: string, timeout = 5000) {
    this.show(message, 'error', timeout);
  }

  info(message: string, timeout = 4000) {
    this.show(message, 'info', timeout);
  }

  warning(message: string, timeout = 4000) {
    this.show(message, 'warning', timeout);
  }

  dismiss(id: number) {
    this._toasts.update((list) => list.filter((t) => t.id !== id));
  }

  clearAll() {
    this._toasts.set([]);
  }
}
