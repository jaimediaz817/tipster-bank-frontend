import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastStore } from '../../../core/state/toast.store';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-container.html',
})
export class ToastContainer {
  private toastStore = inject(ToastStore);
  toasts = this.toastStore.toasts;

  onClose(id: number) {
    this.toastStore.dismiss(id);
  }

  styleFor(type: string): string {
    switch (type) {
      case 'success':
        return 'border-emerald-500 bg-emerald-50 text-emerald-900';
      case 'error':
        return 'border-rose-500 bg-rose-50 text-rose-900';
      case 'warning':
        return 'border-amber-500 bg-amber-50 text-amber-900';
      default:
        return 'border-slate-300 bg-white text-slate-900';
    }
  }
}
