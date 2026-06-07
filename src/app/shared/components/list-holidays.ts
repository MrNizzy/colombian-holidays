import { ChangeDetectionStrategy, Component, input, computed, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ColombianHolidays, Holiday } from '../utils/holidaysRule';
import { NgxIcon } from 'ngx-icons-extra';

@Component({
  selector: 'app-list-holidays',
  imports: [NgxIcon, DatePipe],
  template: `
    <div class="mt-8 sm:mt-10">
      <div class="flex items-center gap-3 mb-5">
        <div class="flex items-center gap-2">
          <ngx-icon collection="solar" icon="confetti-minimalistic-linear" class="text-secondary w-5 h-5" />
          <h3 class="text-lg sm:text-xl font-black text-base-content tracking-tight">
            Festivos del mes
          </h3>
        </div>
        @if (currentMonthHolidays().length > 0) {
          <span
            class="badge badge-secondary badge-sm font-bold px-2"
          >
            {{ currentMonthHolidays().length }}
          </span>
        }
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        @for (holiday of currentMonthHolidays(); track holiday.observedDate.getTime()) {
          <div
            (click)="holidayClick.emit(holiday)"
            class="group relative flex items-center gap-4 p-4 bg-base-100 rounded-2xl border border-base-content/10 shadow-sm transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-base-content/5 hover:-translate-y-0.5 hover:border-primary/30 overflow-hidden"
          >
            <!-- Accent bar -->
            <div
              class="absolute left-0 top-0 bottom-0 w-1 bg-primary/40 rounded-r-full group-hover:bg-primary transition-colors"
            ></div>

            <div
              class="flex flex-col items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary font-black shrink-0 group-hover:bg-primary group-hover:text-primary-content transition-all duration-300"
            >
              <span class="text-xs uppercase opacity-70 leading-none">{{
                holiday.observedDate | date: 'MMM' : '' : 'es-ES'
              }}</span>
              <span class="text-xl leading-none mt-0.5">{{
                holiday.observedDate | date: 'dd'
              }}</span>
            </div>

            <div class="flex-1 min-w-0">
              <p
                class="font-bold text-sm sm:text-base text-base-content group-hover:text-primary transition-colors truncate"
              >
                {{ holiday.name }}
              </p>
              <p class="text-xs font-semibold text-base-content/35 uppercase tracking-widest mt-0.5">
                {{ holiday.observedDate | date: 'EEEE' : '' : 'es-ES' }}
              </p>
            </div>

            <div class="shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 -mr-1">
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
            class="col-span-full flex flex-col items-center justify-center p-10 sm:p-12 bg-base-100 rounded-2xl border border-dashed border-base-content/10 text-center gap-3"
          >
            <ngx-icon collection="solar" icon="sleep-linear" class="text-base-content/20 w-10 h-10" />
            <div>
              <p class="text-base-content/40 font-bold text-sm">No hay festivos este mes</p>
              <p class="text-base-content/20 text-xs mt-1">Prueba navegando a otro mes</p>
            </div>
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
