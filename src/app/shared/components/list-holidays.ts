import { ChangeDetectionStrategy, Component, input, computed } from '@angular/core';
import { ColombianHolidays } from '../utils/holidaysRule';

@Component({
  selector: 'app-list-holidays',
  standalone: true,
  template: `<!-- Holiday list for current month -->
    <div class="mt-8">
      <h3 class="text-lg font-bold mb-3 text-base-content">Días festivos del mes</h3>
      <div class="space-y-2">
        @for (holiday of currentMonthHolidays(); track holiday.observedDate.getTime()) {
        <div class="flex items-start gap-3 p-3 bg-accent/5 rounded-lg border border-accent/20">
          <div class="badge badge-accent">
            {{
              holiday.observedDate.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })
            }}
          </div>
          <div class="flex-1">
            <p class="font-semibold text-base-content">{{ holiday.name }}</p>
            <p class="text-sm text-base-content/70">
              {{ holiday.observedDate.toLocaleDateString('es-ES', { weekday: 'long' }) }}
            </p>
          </div>
        </div>
        } @if (currentMonthHolidays().length === 0) {
        <p class="text-base-content/50">No hay días festivos en este mes</p>
        }
      </div>
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListHolidays {
  readonly month = input.required<Date>();

  readonly currentMonthHolidays = computed(() => {
    const monthDate = this.month();
    return ColombianHolidays.holidaysForYear(monthDate.getFullYear()).filter(
      (holiday) => holiday.observedDate.getMonth() === monthDate.getMonth()
    );
  });
}
