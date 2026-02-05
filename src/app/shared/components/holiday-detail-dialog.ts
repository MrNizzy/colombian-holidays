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
          class="modal-box p-0 overflow-hidden border border-white/10 shadow-2xl max-w-2xl bg-base-100/90 backdrop-blur-md animate-in fade-in zoom-in duration-300"
        >
          <!-- Hero Banner -->
          <div class="relative h-48 sm:h-64 w-full overflow-hidden">
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
              class="absolute inset-0 bg-linear-to-t from-base-100 via-transparent to-transparent"
            ></div>

            <button
              (click)="close.emit()"
              class="btn btn-circle btn-sm btn-ghost absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white border-none backdrop-blur-md"
              aria-label="Cerrar"
            >
              <ngx-icon collection="solar" icon="close-circle-linear" width="20" height="20" />
            </button>
          </div>

          <div class="p-6 sm:p-8 -mt-12 relative z-10">
            <!-- Header Section -->
            <div class="flex flex-col gap-2 mb-6">
              <div
                class="badge badge-secondary badge-outline font-bold mb-1 uppercase tracking-wider text-[10px]"
              >
                {{ getTranslatedCategory(holiday()?.category) }}
              </div>
              <h2 class="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight">
                {{ holiday()?.name }}
              </h2>
              <p class="text-lg font-medium text-primary">
                {{ holiday()?.observedDate | date: "EEEE, d 'de' MMMM" : '' : 'es-ES' }}
              </p>
            </div>

            <!-- Description -->
            <div
              class="prose prose-sm sm:prose-base max-w-none text-base-content/80 leading-relaxed mb-8"
            >
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
                      <div class="mt-1 w-1.5 h-1.5 rounded-full bg-secondary shrink-0"></div>
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
                    <div class="badge badge-accent badge-ghost text-xs p-3">
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
        <!-- Click outside to close -->
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
}
