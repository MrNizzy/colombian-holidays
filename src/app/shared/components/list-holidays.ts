import { ChangeDetectionStrategy, Component, input, computed, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ColombianHolidays, Holiday } from '../utils/holidaysRule';
import { NgxIcon } from 'ngx-icons-extra';

@Component({
  selector: 'app-list-holidays',
  imports: [NgxIcon, DatePipe],
  template: `<!-- Holiday list for current month -->
    <div class="mt-8">
      <h3 class="text-xl font-black mb-4 text-base-content tracking-tight">
        Días festivos del mes
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        @for (holiday of currentMonthHolidays(); track holiday.observedDate.getTime()) {
          <div
            (click)="holidayClick.emit(holiday)"
            class="group flex items-center gap-4 p-4 bg-base-200/50 hover:bg-primary/10 rounded-2xl border border-base-content/5 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
          >
            <div
              class="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary font-black shadow-inner group-hover:bg-primary group-hover:text-primary-content transition-colors"
            >
              <span class="text-xs uppercase opacity-70">{{
                holiday.observedDate | date: 'MMM' : '' : 'es-ES'
              }}</span>
              <span class="text-xl leading-none text-red-500 group-hover:text-white">{{
                holiday.observedDate | date: 'dd'
              }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p
                class="font-bold text-base-content group-hover:text-primary transition-colors truncate"
              >
                {{ holiday.name }}
              </p>
              <p class="text-xs font-semibold text-base-content/40 uppercase tracking-widest">
                {{ holiday.observedDate | date: 'EEEE' : '' : 'es-ES' }}
              </p>
            </div>
            <div class="opacity-0 group-hover:opacity-100 transition-opacity">
              <ngx-icon
                collection="solar"
                icon="alt-arrow-right-linear"
                class="text-primary w-5 h-5"
              />
            </div>
          </div>
        }
        @if (currentMonthHolidays().length === 0) {
          <div
            class="col-span-full p-8 text-center bg-base-200/30 rounded-2xl border border-dashed border-base-content/10"
          >
            <p class="text-base-content/40 font-medium">No hay días festivos en este mes</p>
          </div>
        }
      </div>
    </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListHolidays {
  readonly month = input.required<Date>();
  readonly holidayClick = output<Holiday>();

  readonly currentMonthHolidays = computed(() => {
    const monthDate = this.month();
    return ColombianHolidays.holidaysForYear(monthDate.getFullYear()).filter(
      (holiday) => holiday.observedDate.getMonth() === monthDate.getMonth(),
    );
  });
}
