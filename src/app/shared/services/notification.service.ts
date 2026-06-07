import { Injectable, signal } from '@angular/core';
import { ColombianHolidays } from '../utils/holidaysRule';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  readonly enabled = signal(false);
  readonly supported = 'Notification' in window && 'localStorage' in window;
  readonly permission = signal<NotificationPermission>('default');

  constructor() {
    this.loadPreference();
  }

  private loadPreference(): void {
    if (!this.supported) return;
    try {
      const saved = localStorage.getItem('colombian-holidays-notif');
      if (saved === 'granted' && Notification.permission === 'granted') {
        this.enabled.set(true);
        this.permission.set('granted');
      }
    } catch {
      // localStorage not available
    }
  }

  async toggle(): Promise<void> {
    if (this.enabled()) {
      this.disable();
      return;
    }

    if (Notification.permission === 'denied') return;

    if (Notification.permission === 'granted') {
      this.enable();
      return;
    }

    const result = await Notification.requestPermission();
    this.permission.set(result);
    if (result === 'granted') {
      this.enable();
    }
  }

  private enable(): void {
    this.enabled.set(true);
    this.permission.set('granted');
    try {
      localStorage.setItem('colombian-holidays-notif', 'granted');
    } catch {
      // localStorage not available
    }
    this.checkAndNotify();
  }

  private disable(): void {
    this.enabled.set(false);
    try {
      localStorage.removeItem('colombian-holidays-notif');
    } catch {
      // localStorage not available
    }
  }

  checkAndNotify(): void {
    if (!this.enabled() || !this.supported || Notification.permission !== 'granted') return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayHoliday = ColombianHolidays.getHoliday(today);
    if (todayHoliday && !this.wasShown(today, 'today')) {
      this.show(todayHoliday.name, 'Hoy es festivo 🎉', 'today');
    }

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowHoliday = ColombianHolidays.getHoliday(tomorrow);
    if (tomorrowHoliday && !this.wasShown(today, 'tomorrow')) {
      this.show(tomorrowHoliday.name + '. ¡Prepárate!', 'Mañana es festivo', 'tomorrow');
    }

    if (!this.wasShown(today, 'upcoming')) {
      const upcoming: string[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const h = ColombianHolidays.getHoliday(date);
        if (h) {
          upcoming.push(
            `${h.name} (${date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })})`,
          );
        }
      }

      if (upcoming.length > 0) {
        this.show(upcoming.join('\n'), 'Festivos próximos 📅', 'upcoming');
      }
    }
  }

  private show(body: string, title: string, type: 'today' | 'tomorrow' | 'upcoming'): void {
    try {
      new Notification(title, { body, icon: 'icons/icon-192x192.png' });
    } catch {
      // Notification failed
    }
    this.markShown(new Date(), type);
  }

  private wasShown(date: Date, type: string): boolean {
    try {
      return localStorage.getItem(this.key(date, type)) === '1';
    } catch {
      return false;
    }
  }

  private markShown(date: Date, type: string): void {
    try {
      localStorage.setItem(this.key(date, type), '1');
    } catch {
      // localStorage not available
    }
  }

  private key(date: Date, type: string): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `colombian-holidays-notif-${type}-${y}-${m}-${d}`;
  }
}
