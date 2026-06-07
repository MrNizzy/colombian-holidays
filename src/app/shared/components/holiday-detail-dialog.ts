import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Holiday } from '../utils/holidaysRule';
import { NgxIcon } from 'ngx-icons-extra';

@Component({
  selector: 'app-holiday-detail-dialog',
  imports: [CommonModule, NgOptimizedImage, NgxIcon],
  template: `
    @if (holiday()) {
      <div
        class="modal modal-open modal-bottom sm:modal-middle transition-all duration-300 backdrop-blur-sm bg-base-300/40"
      >
        <div
          class="modal-box p-0 border border-base-content/10 shadow-2xl max-w-2xl bg-base-100 animate-in fade-in zoom-in duration-300"
        >
          <!-- Hero Banner -->
          <div class="relative h-48 sm:h-64 w-full overflow-hidden rounded-t-2xl">
            @if (holiday()?.metadata?.image) {
              <img
                [ngSrc]="holiday()?.metadata?.image || 'assets/banners/default.webp'"
                [alt]="holiday()?.name"
                fill
                class="object-cover transition-transform duration-700 hover:scale-105"
                priority
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
              class="absolute inset-0 bg-linear-to-t from-base-100 via-base-100/20 to-transparent"
            ></div>

            <button
              (click)="close.emit()"
              class="btn btn-circle btn-sm absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white border-none backdrop-blur-md"
              aria-label="Cerrar"
            >
              <ngx-icon collection="solar" icon="close-circle-linear" width="20" height="20" />
            </button>
          </div>

          <div class="p-6 sm:p-8 -mt-14 relative z-10">
            <!-- Header Section -->
            <div class="flex flex-col gap-2 mb-6">
              <div class="flex items-center gap-2 mb-1">
                <div class="dropdown dropdown-bottom dropdown-start">
                  <div
                    tabindex="0"
                    role="button"
                    class="badge badge-secondary badge-outline font-bold uppercase tracking-wider text-[10px] cursor-help hover:bg-secondary hover:text-secondary-content transition-all"
                  >
                    {{ getTranslatedCategory(holiday()?.category) }}
                  </div>
                  <div
                    tabindex="0"
                    class="dropdown-content z-20 card card-compact w-64 p-2 shadow-2xl bg-base-200 border border-secondary/20 mt-2"
                  >
                    <div class="card-body p-3">
                      <p class="text-xs font-semibold text-secondary uppercase tracking-widest mb-1">
                        {{ getTranslatedCategory(holiday()?.category) }}
                      </p>
                      <p class="text-[11px] leading-relaxed text-base-content/80">
                        {{ getCategoryDescription(holiday()?.category) }}
                      </p>
                    </div>
                  </div>
                </div>
                <span class="text-xs text-base-content/30 font-medium">&bull;</span>
                <span class="text-xs font-semibold text-base-content/30 uppercase tracking-wider">
                  {{ holiday()?.observedDate | date: 'y' : '' : 'es-ES' }}
                </span>
              </div>
              <h2 class="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight leading-tight">
                {{ holiday()?.name }}
              </h2>
              <p class="text-lg font-semibold text-primary flex items-center gap-2">
                <ngx-icon collection="solar" icon="calendar-minimalistic-linear" width="18" height="18" />
                {{ holiday()?.observedDate | date: "EEEE, d 'de' MMMM" : '' : 'es-ES' }}
              </p>
            </div>

            <!-- Description -->
            <div class="text-base sm:text-lg text-base-content/70 leading-relaxed mb-8 font-medium">
              <p
                class="first-letter:text-5xl first-letter:font-black first-letter:text-primary first-letter:mr-3 first-letter:float-left first-letter:leading-none first-letter:mt-1"
              >
                {{ holiday()?.metadata?.description }}
              </p>
            </div>

            <!-- Detailed Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <!-- Interesting Facts -->
              <div class="flex flex-col gap-4">
                <div
                  class="flex items-center gap-2 text-secondary font-bold uppercase text-xs tracking-widest"
                >
                  <ngx-icon collection="solar" icon="star-bold" class="w-4 h-4" />
                  ¿Sabías que?
                </div>
                <ul class="space-y-3">
                  @for (fact of holiday()?.metadata?.facts; track $index) {
                    <li class="flex items-start gap-3 text-sm text-base-content/70">
                      <div class="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></div>
                      {{ fact }}
                    </li>
                  }
                </ul>
              </div>

              <!-- Activities -->
              <div class="flex flex-col gap-4">
                <div
                  class="flex items-center gap-2 text-accent font-bold uppercase text-xs tracking-widest"
                >
                  <ngx-icon collection="solar" icon="fire-bold" class="w-4 h-4" />
                  ¿Qué se hace?
                </div>
                <div class="flex flex-wrap gap-2">
                  @for (activity of holiday()?.metadata?.activities; track $index) {
                    <div class="badge badge-accent badge-ghost text-xs py-3 px-3">
                      {{ activity }}
                    </div>
                  }
                </div>
              </div>
            </div>

            <div class="modal-action mt-8">
              <button
                (click)="close.emit()"
                class="btn btn-primary btn-block sm:btn-wide shadow-lg shadow-primary/20"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
        <div class="modal-backdrop" (click)="close.emit()"></div>
      </div>
    }
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
export class HolidayDetailDialog {
  readonly holiday = input<Holiday | null>(null);
  readonly close = output<void>();

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
