import { HOLIDAY_METADATA, HolidayMetadata } from './holiday-metadata';

// --- Modelos ---
export interface Holiday {
  name: string;
  baseDate: Date;
  observedDate: Date;
  category: Category;
  metadata?: HolidayMetadata;
}

export enum Category {
  FIXED = 'FIXED',
  EASTER_BASED = 'EASTER_BASED',
  TRANSFERABLE = 'TRANSFERABLE',
}

// --- Reglas (Strategy) ---

export abstract class HolidayRule {
  abstract baseDate(year: number, easter?: Date): Date;

  observedDate(year: number, easter?: Date): Date {
    return this.baseDate(year, easter);
  }
}

export class Fixed extends HolidayRule {
  constructor(
    private month: number,
    private day: number,
  ) {
    super();
  }

  baseDate(year: number): Date {
    return new Date(year, this.month - 1, this.day); // month is 0-indexed in JS
  }
}

export class TransferableToMonday extends HolidayRule {
  constructor(
    private month: number,
    private day: number,
  ) {
    super();
  }

  baseDate(year: number): Date {
    return new Date(year, this.month - 1, this.day);
  }

  override observedDate(year: number): Date {
    return nextMonday(this.baseDate(year));
  }
}

export class RelativeToEaster extends HolidayRule {
  constructor(private offsetDays: number) {
    super();
  }

  baseDate(year: number, easter?: Date): Date {
    if (!easter) {
      throw new Error('Easter required for relative rule');
    }
    const result = new Date(easter);
    result.setDate(result.getDate() + this.offsetDays);
    return result;
  }

  override observedDate(year: number, easter?: Date): Date {
    return this.baseDate(year, easter);
  }
}

// --- Helper functions ---
function nextMonday(date: Date): Date {
  const dow = date.getDay(); // Sunday=0, Monday=1, ..., Saturday=6
  const daysToAdd = dow === 1 ? 0 : (8 - dow) % 7;
  const result = new Date(date);
  result.setDate(result.getDate() + daysToAdd);
  return result;
}

/** Compute Easter Sunday (Gregorian) using Meeus/Jones algorithm */
export function computeEasterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31); // 3=March, 4=April
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day); // month is 0-indexed
}

// --- Holiday definitions according to image rules ---
interface HolidayDefinition {
  name: string;
  category: Category;
  rule: HolidayRule;
}

const HOLIDAY_DEFINITIONS: HolidayDefinition[] = [
  // #1 Fecha fija (no traslado)
  { name: 'Año Nuevo', category: Category.FIXED, rule: new Fixed(1, 1) },
  { name: 'Día del trabajo', category: Category.FIXED, rule: new Fixed(5, 1) },
  { name: 'Día de la independencia', category: Category.FIXED, rule: new Fixed(7, 20) },
  { name: 'Batalla de Boyacá', category: Category.FIXED, rule: new Fixed(8, 7) },
  { name: 'Inmaculada concepción', category: Category.FIXED, rule: new Fixed(12, 8) },
  { name: 'Navidad', category: Category.FIXED, rule: new Fixed(12, 25) },

  // #2 Según Pascua (relativos)
  { name: 'Jueves Santo', category: Category.EASTER_BASED, rule: new RelativeToEaster(-3) },
  { name: 'Viernes Santo', category: Category.EASTER_BASED, rule: new RelativeToEaster(-2) },
  { name: 'Ascención de Jesús', category: Category.EASTER_BASED, rule: new RelativeToEaster(43) },
  { name: 'Corpus Christi', category: Category.EASTER_BASED, rule: new RelativeToEaster(64) },
  {
    name: 'Sagrado corazón de Jesús',
    category: Category.EASTER_BASED,
    rule: new RelativeToEaster(71),
  },

  // #3 Fecha trasladable (si no es lunes, trasladar al siguiente lunes)
  {
    name: 'Epifanía (Reyes Magos)',
    category: Category.TRANSFERABLE,
    rule: new TransferableToMonday(1, 6),
  },
  {
    name: 'Día de San José',
    category: Category.TRANSFERABLE,
    rule: new TransferableToMonday(3, 19),
  },
  {
    name: 'San Pedro y San Pablo',
    category: Category.TRANSFERABLE,
    rule: new TransferableToMonday(6, 29),
  },
  {
    name: 'Asunción de la Virgen',
    category: Category.TRANSFERABLE,
    rule: new TransferableToMonday(8, 15),
  },
  {
    name: 'Día de la raza',
    category: Category.TRANSFERABLE,
    rule: new TransferableToMonday(10, 12),
  },
  {
    name: 'Todos los santos',
    category: Category.TRANSFERABLE,
    rule: new TransferableToMonday(11, 1),
  },
  {
    name: 'Independencia de Cartagena',
    category: Category.TRANSFERABLE,
    rule: new TransferableToMonday(11, 11),
  },
];

// --- API principal ---
export const ColombianHolidays = {
  holidaysForYear(year: number): Holiday[] {
    const easter = computeEasterSunday(year);
    return HOLIDAY_DEFINITIONS.map(({ name, category, rule }) => {
      const base = rule.baseDate(year, easter);
      const observed = rule.observedDate(year, easter);
      return {
        name,
        baseDate: base,
        observedDate: observed,
        category,
        metadata: HOLIDAY_METADATA[name],
      };
    }).sort((a, b) => a.observedDate.getTime() - b.observedDate.getTime());
  },

  /** Retorna la Holiday si la fecha es festiva (según fecha observada). */
  getHoliday(date: Date): Holiday | null {
    const yearHolidays = this.holidaysForYear(date.getFullYear());
    return (
      yearHolidays.find(
        (holiday) =>
          holiday.observedDate.getFullYear() === date.getFullYear() &&
          holiday.observedDate.getMonth() === date.getMonth() &&
          holiday.observedDate.getDate() === date.getDate(),
      ) || null
    );
  },

  isHoliday(date: Date): boolean {
    return this.getHoliday(date) !== null;
  },
};

// --- Utilidades adicionales ---
export function formatDate(date: Date): string {
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
}

export function isSameDate(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
