import { Injectable, signal, effect } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'colombian-holidays-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly mode = signal<ThemeMode>('system');
  readonly resolved = signal<'light' | 'dark'>('light');

  private mediaQuery: MediaQueryList;
  private mediaListener: (() => void) | null = null;

  constructor() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.loadPreference();

    effect(() => {
      const m = this.mode();
      this.updateTheme(m);
    });
  }

  private loadPreference(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        this.mode.set(saved);
        return;
      }
    } catch {
      // localStorage not available
    }
    this.mode.set('system');
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // localStorage not available
    }
  }

  toggle(): void {
    const current = this.resolved();
    if (current === 'light') {
      this.setMode('dark');
    } else {
      this.setMode('light');
    }
  }

  private updateTheme(mode: ThemeMode): void {
    this.cleanupMediaListener();

    if (mode === 'light') {
      this.resolved.set('light');
      document.documentElement.dataset['theme'] = 'colombian';
    } else if (mode === 'dark') {
      this.resolved.set('dark');
      document.documentElement.dataset['theme'] = 'colombian-dark';
    } else {
      const isDark = this.mediaQuery.matches;
      this.resolved.set(isDark ? 'dark' : 'light');
      document.documentElement.dataset['theme'] = isDark ? 'colombian-dark' : 'colombian';

      const handler = (e: MediaQueryListEvent) => {
        const resolved = e.matches ? 'dark' : 'light';
        this.resolved.set(resolved);
        document.documentElement.dataset['theme'] = resolved === 'dark' ? 'colombian-dark' : 'colombian';
      };
      this.mediaQuery.addEventListener('change', handler);
      this.mediaListener = () => this.mediaQuery.removeEventListener('change', handler);
    }
  }

  private cleanupMediaListener(): void {
    if (this.mediaListener) {
      this.mediaListener();
      this.mediaListener = null;
    }
  }
}
