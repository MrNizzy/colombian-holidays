import { ChangeDetectionStrategy, Component, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxIcon } from 'ngx-icons-extra';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-go-to-date-dialog',
  imports: [CommonModule, NgxIcon, FormsModule],
  template: `
    <div
      class="modal modal-open modal-bottom sm:modal-middle transition-all duration-300 backdrop-blur-sm bg-base-300/40"
    >
      <div
        class="modal-box p-6 overflow-hidden border border-white/10 shadow-2xl w-full sm:max-w-sm bg-base-100/95 backdrop-blur-md animate-in fade-in zoom-in duration-300"
      >
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-black text-base-content flex items-center gap-2">
            <ngx-icon collection="solar" icon="calendar-mark-bold" class="text-primary" />
            Ir a fecha
          </h3>
          <button
            (click)="close.emit()"
            class="btn btn-circle btn-sm btn-ghost"
            aria-label="Cerrar"
          >
            <ngx-icon collection="tabler" icon="x" class="w-5 h-5" />
          </button>
        </div>

        <div class="space-y-6">
          <!-- Year Selector -->
          <div class="form-control">
            <label class="label pt-0">
              <span
                class="label-text font-bold text-base-content/60 uppercase text-[10px] tracking-widest"
                >Año</span
              >
            </label>
            <div class="flex items-center gap-2">
              <button
                (click)="adjustYear(-1)"
                class="btn btn-square btn-ghost btn-sm border border-base-content/10"
              >
                <ngx-icon collection="solar" icon="minus-circle-linear" width="20" height="20" />
              </button>
              <input
                type="number"
                [(ngModel)]="selectedYear"
                class="input input-bordered w-full text-center font-bold text-lg focus:input-primary transition-all"
                min="1900"
                max="2100"
              />
              <button
                (click)="adjustYear(1)"
                class="btn btn-square btn-ghost btn-sm border border-base-content/10"
              >
                <ngx-icon collection="solar" icon="add-circle-linear" width="20" height="20" />
              </button>
            </div>
          </div>

          <!-- Month Selector -->
          <div class="form-control">
            <label class="label pt-0">
              <span
                class="label-text font-bold text-base-content/60 uppercase text-[10px] tracking-widest"
                >Mes</span
              >
            </label>
            <div class="grid grid-cols-3 gap-2">
              @for (month of months; track $index) {
                <button
                  (click)="selectedMonth.set($index)"
                  [class.btn-primary]="selectedMonth() === $index"
                  [class.btn-ghost]="selectedMonth() !== $index"
                  [class.bg-base-200]="selectedMonth() !== $index"
                  class="btn btn-sm sm:btn-md font-bold transition-all duration-200"
                >
                  {{ month }}
                </button>
              }
            </div>
          </div>
        </div>

        <div class="modal-action mt-8">
          <button
            (click)="onConfirm()"
            class="btn btn-primary btn-block shadow-lg shadow-primary/20"
          >
            Navegar
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
      input::-webkit-outer-spin-button,
      input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoToDateDialog {
  readonly initialYear = input<number>(new Date().getFullYear());
  readonly initialMonth = input<number>(new Date().getMonth());

  readonly select = output<{ year: number; month: number }>();
  readonly close = output<void>();

  selectedYear = new Date().getFullYear();
  readonly selectedMonth = signal(new Date().getMonth());

  readonly months = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ];

  constructor() {
    effect(
      () => {
        this.selectedYear = this.initialYear();
        this.selectedMonth.set(this.initialMonth());
      },
      { allowSignalWrites: true },
    );
  }

  adjustYear(delta: number): void {
    this.selectedYear += delta;
  }

  onConfirm(): void {
    this.select.emit({
      year: this.selectedYear,
      month: this.selectedMonth(),
    });
  }
}
