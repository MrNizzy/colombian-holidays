import { Component, ChangeDetectionStrategy, signal, computed, input, effect } from '@angular/core';
import { ColombianHolidays, isSameDate } from '../utils/holidaysRule';
import { NgxIcon } from 'ngx-icons-extra';
import { ListHolidays } from './list-holidays';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isHoliday: boolean;
  holidayName?: string;
}

@Component({
  selector: 'app-calendar',
  imports: [NgxIcon, ListHolidays],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block',
  },
})
export class Calendar {
  readonly initialMonth = input<Date | null>(null);

  readonly currentMonth = signal(this.initialMonth() || new Date());
  readonly today = signal(new Date());

  readonly monthYear = computed(() => {
    const date = this.currentMonth();
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  });

  readonly daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  readonly calendarDays = computed(() => {
    const month = this.currentMonth();
    const year = month.getFullYear();
    const monthIndex = month.getMonth();

    // Get the first day of the month
    const firstDay = new Date(year, monthIndex, 1);
    // Get the last day of the month
    const lastDay = new Date(year, monthIndex + 1, 0);

    // Adjust to start from Monday
    const startDate = new Date(firstDay);
    const dayOfWeek = startDate.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startDate.setDate(startDate.getDate() - daysToSubtract);

    // Generate all days to show (including previous and next month)
    const days: CalendarDay[] = [];
    const currentDate = new Date(startDate);
    const todayDate = this.today();

    while (days.length < 42) {
      const dateClone = new Date(currentDate);
      const isCurrentMonth = dateClone.getMonth() === monthIndex;
      const isToday = isSameDate(dateClone, todayDate);
      const holiday = ColombianHolidays.getHoliday(dateClone);

      days.push({
        date: dateClone,
        isCurrentMonth,
        isToday,
        isHoliday: holiday !== null,
        holidayName: holiday?.name,
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return days;
  });

  readonly weeks = computed(() => {
    const days = this.calendarDays();
    const weeks: CalendarDay[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  });

  readonly currentMonthHolidays = computed(() => {
    return this.calendarDays().filter((day) => day.isHoliday && day.isCurrentMonth);
  });

  readonly currentYear = computed(() => this.currentMonth().getFullYear());

  constructor() {
    effect(() => {
      if (this.initialMonth()) {
        this.currentMonth.set(this.initialMonth()!);
      }
    });
  }

  previousMonth(): void {
    const current = this.currentMonth();
    const previous = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    this.currentMonth.set(previous);
  }

  nextMonth(): void {
    const current = this.currentMonth();
    const next = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    this.currentMonth.set(next);
  }

  goToToday(): void {
    this.currentMonth.set(new Date());
  }

  getDayNumber(day: CalendarDay): number {
    return day.date.getDate();
  }

  getHolidayTooltip(day: CalendarDay): string {
    return day.holidayName || '';
  }

  getDayClasses(day: CalendarDay): string {
    const base = 'relative p-2 min-h-20 rounded-(--radius-field) border-2 transition-colors';

    if (day.isToday) {
      return `${base} bg-primary/50 text-primary-content font-semibold border-primary`;
    }

    if (day.isHoliday) {
      return `${base} bg-secondary/10 border-secondary/30 text-secondary font-semibold`;
    }

    if (!day.isCurrentMonth) {
      return `${base} opacity-20 bg-base-100`;
    }

    return `${base} bg-base-100 border-base-200 hover:border-primary hover:bg-primary/5`;
  }
}
