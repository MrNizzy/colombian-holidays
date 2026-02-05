import { Component, ChangeDetectionStrategy, signal, computed, input, effect } from '@angular/core';
import { ColombianHolidays, isSameDate, Holiday } from '../utils/holidaysRule';
import { NgxIcon } from 'ngx-icons-extra';
import { ListHolidays } from './list-holidays';
import { HolidayDetailDialog } from './holiday-detail-dialog';
import { GoToDateDialog } from './go-to-date-dialog';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isHoliday: boolean;
  holiday?: Holiday;
}

@Component({
  selector: 'app-calendar',
  imports: [NgxIcon, ListHolidays, HolidayDetailDialog, GoToDateDialog],
  templateUrl: './calendar.html',
  styleUrls: ['./calendar.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-full',
  },
})
export class Calendar {
  readonly initialMonth = input<Date | null>(null);

  readonly currentMonth = signal(this.initialMonth() || new Date());
  readonly today = signal(new Date());
  readonly selectedHoliday = signal<Holiday | null>(null);
  readonly isGoToDateOpen = signal(false);

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
        holiday: holiday || undefined,
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

  openHolidayDetail(holiday?: Holiday): void {
    if (holiday) {
      this.selectedHoliday.set(holiday);
    }
  }

  closeHolidayDetail(): void {
    this.selectedHoliday.set(null);
  }

  onDateSelected(selection: { year: number; month: number }): void {
    this.currentMonth.set(new Date(selection.year, selection.month, 1));
    this.isGoToDateOpen.set(false);
  }

  getDayClasses(day: CalendarDay): string {
    const base =
      'relative p-1.5 sm:p-2 min-h-16 sm:min-h-20 rounded-(--radius-field) border-2 transition-all duration-200';

    if (day.isToday) {
      return `${base} bg-primary/20 text-primary font-bold border-primary shadow-sm`;
    }

    if (day.isHoliday) {
      return `${base} bg-secondary/10 border-secondary/30 text-secondary font-semibold hover:bg-secondary/20`;
    }

    if (!day.isCurrentMonth) {
      return `${base} opacity-20 bg-base-100 border-transparent`;
    }

    return `${base} bg-base-100 border-base-200 hover:border-primary/50 hover:bg-primary/5`;
  }
}
