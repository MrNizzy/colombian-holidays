import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  computed,
  effect,
} from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgxIcon } from 'ngx-icons-extra';
import { ColombianHolidays, Holiday } from '../utils/holidaysRule';

@Component({
  selector: 'app-holidays-explorer-dialog',
  imports: [CommonModule, NgOptimizedImage, NgxIcon],
  template: `
    <div
      class="modal modal-open modal-bottom sm:modal-middle transition-all duration-300 backdrop-blur-sm bg-base-300/40"
    >
      <div
        class="modal-box p-0 border border-white/10 shadow-2xl w-full sm:max-w-2xl bg-base-100/95 backdrop-blur-md animate-in fade-in zoom-in duration-300"
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between p-6 border-b border-base-content/5">
          <div class="flex items-center gap-3">
            @if (view() === 'detail') {
              <button
                (click)="view.set('list')"
                class="btn btn-circle btn-sm btn-ghost hover:bg-primary/10 text-primary"
              >
                <ngx-icon collection="solar" icon="alt-arrow-left-linear" width="20" height="20" />
              </button>
            }
            <h3 class="text-xl font-black text-base-content flex items-center gap-2">
              <ngx-icon collection="solar" icon="globus-bold" class="text-primary" />
              Festivos {{ activeYear() }}
            </h3>
          </div>
          <button
            (click)="close.emit()"
            class="btn btn-circle btn-sm btn-ghost"
            aria-label="Cerrar"
          >
            <ngx-icon collection="solar" icon="close-circle-linear" width="22" height="22" />
          </button>
        </div>

        <!-- Scrollable Content -->
        <div class="max-h-[70vh] overflow-y-auto">
          @if (view() === 'list') {
            <!-- List View -->
            <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              @for (holiday of allHolidays(); track holiday.name) {
                <div
                  (click)="showDetail(holiday)"
                  class="group flex items-center gap-4 p-4 bg-base-200/50 hover:bg-primary/10 rounded-2xl border border-base-content/5 transition-all duration-300 cursor-pointer"
                >
                  <div
                    class="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary font-black group-hover:bg-primary group-hover:text-primary-content transition-colors"
                  >
                    <span class="text-[10px] uppercase opacity-70">{{
                      holiday.observedDate | date: 'MMM' : '' : 'es-ES'
                    }}</span>
                    <span class="text-lg leading-none">{{
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
                  <ngx-icon
                    collection="solar"
                    icon="alt-arrow-right-linear"
                    class="opacity-0 group-hover:opacity-100 text-primary transition-opacity"
                    width="18"
                    height="18"
                  />
                </div>
              }
            </div>
          } @else {
            <!-- Detail View -->
            @if (selectedHoliday()) {
              <div class="animate-in slide-in-from-right duration-300">
                <!-- Hero Banner -->
                <div class="relative h-48 sm:h-56 w-full overflow-hidden">
                  @if (selectedHoliday()?.metadata?.image) {
                    <img
                      [ngSrc]="selectedHoliday()?.metadata?.image!"
                      [alt]="selectedHoliday()?.name"
                      fill
                      class="object-cover"
                    />
                  } @else {
                    <div
                      class="w-full h-full bg-linear-to-br from-primary/20 to-secondary/20 flex items-center justify-center"
                    >
                      <ngx-icon
                        collection="solar"
                        icon="calendar-minimalistic-linear"
                        class="text-primary/40 w-16 h-16"
                      />
                    </div>
                  }
                  <div
                    class="absolute inset-0 bg-linear-to-t from-base-100 via-transparent to-transparent"
                  ></div>
                </div>

                <div class="p-6 -mt-10 relative z-10">
                  <div class="dropdown dropdown-bottom dropdown-start group/cat">
                    <div
                      tabindex="0"
                      role="button"
                      class="badge badge-primary badge-outline font-bold mb-2 uppercase tracking-wider text-[10px] cursor-help hover:bg-primary hover:text-primary-content transition-all"
                    >
                      {{ getTranslatedCategory(selectedHoliday()?.category) }}
                      <ngx-icon collection="solar" icon="info-circle-linear" class="ml-1 w-3 h-3" />
                    </div>
                    <div
                      tabindex="0"
                      class="dropdown-content z-20 card card-compact w-64 p-2 shadow-2xl bg-base-200 border border-primary/20 mt-2"
                    >
                      <div class="card-body p-3">
                        <p
                          class="text-xs font-semibold text-primary uppercase tracking-widest mb-1"
                        >
                          {{ getTranslatedCategory(selectedHoliday()?.category) }}
                        </p>
                        <p class="text-[11px] leading-relaxed text-base-content/80">
                          {{ getCategoryDescription(selectedHoliday()?.category) }}
                        </p>
                      </div>
                    </div>
                  </div>
                  <h2 class="text-3xl font-extrabold text-base-content tracking-tight mb-1">
                    {{ selectedHoliday()?.name }}
                  </h2>
                  <p class="text-lg font-medium text-primary mb-6">
                    {{ selectedHoliday()?.observedDate | date: "EEEE, d 'de' MMMM" : '' : 'es-ES' }}
                  </p>

                  <div class="prose prose-sm max-w-none text-base-content/80 leading-relaxed mb-8">
                    <p
                      class="first-letter:text-5xl first-letter:font-black first-letter:text-primary first-letter:mr-3 first-letter:float-left first-letter:leading-none first-letter:mt-1"
                    >
                      {{ selectedHoliday()?.metadata?.description }}
                    </p>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6">
                    <div>
                      <div
                        class="flex items-center gap-2 text-secondary font-bold uppercase text-xs tracking-widest mb-3"
                      >
                        <ngx-icon collection="solar" icon="star-bold" width="16" height="16" />
                        ¿Sabías que?
                      </div>
                      <ul class="space-y-2">
                        @for (fact of selectedHoliday()?.metadata?.facts; track $index) {
                          <li class="flex items-start gap-2 text-sm text-base-content/70">
                            <div class="mt-1.5 w-1 h-1 rounded-full bg-secondary shrink-0"></div>
                            {{ fact }}
                          </li>
                        }
                      </ul>
                    </div>
                    <div>
                      <div
                        class="flex items-center gap-2 text-accent font-bold uppercase text-xs tracking-widest mb-3"
                      >
                        <ngx-icon collection="solar" icon="fire-bold" width="16" height="16" />
                        ¿Qué se hace?
                      </div>
                      <div class="flex flex-wrap gap-2">
                        @for (activity of selectedHoliday()?.metadata?.activities; track $index) {
                          <div class="badge badge-accent badge-ghost text-xs py-3">
                            {{ activity }}
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            }
          }
        </div>

        <!-- Sticky Footer -->
        <div class="p-4 bg-base-200/50 border-t border-base-content/5 flex items-center gap-2">
          <button (click)="adjustYear(-1)" class="btn btn-square btn-ghost hover:bg-primary/10">
            <ngx-icon collection="solar" icon="alt-arrow-left-linear" width="22" height="22" />
          </button>

          <button (click)="close.emit()" class="btn btn-ghost flex-1">Cerrar Explorador</button>

          <button (click)="adjustYear(1)" class="btn btn-square btn-ghost hover:bg-primary/10">
            <ngx-icon collection="solar" icon="alt-arrow-right-linear" width="22" height="22" />
          </button>
        </div>
      </div>
      <div class="modal-backdrop" (click)="close.emit()"></div>
    </div>
  `,
  styles: [
    `
      :host {
        display: contents;
      }
      .animate-in {
        animation-duration: 0.3s;
        animation-fill-mode: both;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HolidaysExplorerDialog {
  readonly year = input.required<number>();
  readonly close = output<void>();

  readonly activeYear = signal(new Date().getFullYear());

  readonly view = signal<'list' | 'detail'>('list');
  readonly selectedHoliday = signal<Holiday | null>(null);

  readonly allHolidays = computed(() => {
    return ColombianHolidays.holidaysForYear(this.activeYear());
  });

  constructor() {
    effect(
      () => {
        this.activeYear.set(this.year());
      },
      { allowSignalWrites: true },
    );
  }

  adjustYear(delta: number): void {
    this.activeYear.update((y) => y + delta);
    if (this.view() === 'detail') {
      this.view.set('list');
    }
  }

  showDetail(holiday: Holiday): void {
    this.selectedHoliday.set(holiday);
    this.view.set('detail');
  }

  getTranslatedCategory(category?: string): string {
    switch (category) {
      case 'FIXED':
        return 'Fecha Fija';
      case 'TRANSFERABLE':
        return 'Lunes Festivo (Trasladable)';
      case 'EASTER_BASED':
        return 'Basado en Pascua';
      default:
        return category || '';
    }
  }

  getCategoryDescription(category?: string): string {
    switch (category) {
      case 'FIXED':
        return 'Se celebra siempre en la misma fecha calendario cada año.';
      case 'TRANSFERABLE':
        return 'Si el festivo no cae en lunes, se traslada al lunes siguiente por la Ley Emiliani.';
      case 'EASTER_BASED':
        return 'Su fecha se calcula a partir del Domingo de Resurrección (Semana Santa).';
      default:
        return '';
    }
  }
}
