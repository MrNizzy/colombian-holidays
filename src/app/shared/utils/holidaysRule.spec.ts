import { describe, it, expect } from 'vitest';
import {
  ColombianHolidays,
  computeEasterSunday,
  Holiday,
  Category,
} from './holidaysRule';

describe('computeEasterSunday', () => {
  it('should return correct Easter for 2024', () => {
    const easter = computeEasterSunday(2024);
    expect(easter.getFullYear()).toBe(2024);
    expect(easter.getMonth()).toBe(2); // March (0-indexed)
    expect(easter.getDate()).toBe(31);
  });

  it('should return correct Easter for 2025', () => {
    const easter = computeEasterSunday(2025);
    expect(easter.getFullYear()).toBe(2025);
    expect(easter.getMonth()).toBe(3); // April
    expect(easter.getDate()).toBe(20);
  });

  it('should return correct Easter for 2026', () => {
    const easter = computeEasterSunday(2026);
    expect(easter.getFullYear()).toBe(2026);
    expect(easter.getMonth()).toBe(3); // April
    expect(easter.getDate()).toBe(5);
  });

  it('should return correct Easter for 2027', () => {
    const easter = computeEasterSunday(2027);
    expect(easter.getFullYear()).toBe(2027);
    expect(easter.getMonth()).toBe(2); // March
    expect(easter.getDate()).toBe(28);
  });
});

describe('ColombianHolidays.holidaysForYear', () => {
  it('should return 19 holidays for 2026 (18 + new Virgen de Chiquinquirá)', () => {
    const holidays = ColombianHolidays.holidaysForYear(2026);
    expect(holidays.length).toBe(19);
  });

  it('should return 19 holidays for 2025', () => {
    const holidays = ColombianHolidays.holidaysForYear(2025);
    expect(holidays.length).toBe(19);
  });

  it('should return holidays sorted by observedDate', () => {
    const holidays = ColombianHolidays.holidaysForYear(2026);
    for (let i = 1; i < holidays.length; i++) {
      const prev = holidays[i - 1].observedDate.getTime();
      const curr = holidays[i].observedDate.getTime();
      expect(prev).toBeLessThanOrEqual(curr);
    }
  });
});

describe('Fixed holidays (no transfer)', () => {
  const holidays = ColombianHolidays.holidaysForYear(2026);

  it('Año Nuevo should be on Jan 1', () => {
    const h = holidays.find((h) => h.name === 'Año Nuevo')!;
    expect(h.baseDate.getMonth()).toBe(0);
    expect(h.baseDate.getDate()).toBe(1);
    expect(h.category).toBe(Category.FIXED);
  });

  it('Día del trabajo should be on May 1', () => {
    const h = holidays.find((h) => h.name === 'Día del trabajo')!;
    expect(h.baseDate.getMonth()).toBe(4);
    expect(h.baseDate.getDate()).toBe(1);
    expect(h.category).toBe(Category.FIXED);
  });

  it('Día de la independencia should be on Jul 20', () => {
    const h = holidays.find((h) => h.name === 'Día de la independencia')!;
    expect(h.baseDate.getMonth()).toBe(6);
    expect(h.baseDate.getDate()).toBe(20);
    expect(h.category).toBe(Category.FIXED);
  });

  it('Navidad should be on Dec 25', () => {
    const h = holidays.find((h) => h.name === 'Navidad')!;
    expect(h.baseDate.getMonth()).toBe(11);
    expect(h.baseDate.getDate()).toBe(25);
    expect(h.category).toBe(Category.FIXED);
  });
});

describe('TransferableToMonday holidays (Ley Emiliani)', () => {
  const holidays = ColombianHolidays.holidaysForYear(2026);

  it('Epifanía (Jan 6, 2026 = Tuesday) should be observed on Monday Jan 12', () => {
    const h = holidays.find((h) => h.name === 'Epifanía (Reyes Magos)')!;
    expect(h.baseDate.getMonth()).toBe(0);
    expect(h.baseDate.getDate()).toBe(6);
    expect(h.observedDate.getDay()).toBe(1); // Monday
    expect(h.observedDate.getDate()).toBe(12);
    expect(h.category).toBe(Category.TRANSFERABLE);
  });

  it('San José (Mar 19, 2026 = Thursday) should be observed on Monday Mar 23', () => {
    const h = holidays.find((h) => h.name === 'Día de San José')!;
    expect(h.baseDate.getMonth()).toBe(2);
    expect(h.baseDate.getDate()).toBe(19);
    expect(h.observedDate.getDay()).toBe(1);
    expect(h.observedDate.getDate()).toBe(23);
  });

  it('San Pedro y San Pablo (Jun 29, 2026 = Monday) should stay on Jun 29', () => {
    const h = holidays.find((h) => h.name === 'San Pedro y San Pablo')!;
    expect(h.baseDate.getMonth()).toBe(5);
    expect(h.baseDate.getDate()).toBe(29);
    // Monday = same day
    expect(h.observedDate.getTime()).toBe(h.baseDate.getTime());
  });
});

describe('Día de la Virgen de Chiquinquirá (new holiday)', () => {
  const holidays = ColombianHolidays.holidaysForYear(2026);

  it('should be present in the holidays list', () => {
    const h = holidays.find((h) => h.name === 'Día de la Virgen de Chiquinquirá');
    expect(h).toBeDefined();
  });

  it('should have base date on July 9', () => {
    const h = holidays.find((h) => h.name === 'Día de la Virgen de Chiquinquirá')!;
    expect(h.baseDate.getMonth()).toBe(6); // July (0-indexed)
    expect(h.baseDate.getDate()).toBe(9);
  });

  it('should be TRANSFERABLE category (Ley Emiliani)', () => {
    const h = holidays.find((h) => h.name === 'Día de la Virgen de Chiquinquirá')!;
    expect(h.category).toBe(Category.TRANSFERABLE);
  });

  it('Jul 9, 2026 (Thursday) should be observed on Monday Jul 13', () => {
    const h = holidays.find((h) => h.name === 'Día de la Virgen de Chiquinquirá')!;
    expect(h.observedDate.getDay()).toBe(1); // Monday
    expect(h.observedDate.getDate()).toBe(13);
    expect(h.observedDate.getMonth()).toBe(6); // July
  });

  it('should have metadata with description, image, facts and activities', () => {
    const h = holidays.find((h) => h.name === 'Día de la Virgen de Chiquinquirá')!;
    expect(h.metadata).toBeDefined();
    expect(h.metadata!.description).toBeTruthy();
    expect(h.metadata!.image).toBe('assets/banners/chiquinquira.avif');
    expect(h.metadata!.facts.length).toBeGreaterThanOrEqual(2);
    expect(h.metadata!.activities.length).toBeGreaterThanOrEqual(2);
  });

  it('should be observed on Monday in 2027 (Jul 9, 2027 = Friday → Jul 12)', () => {
    const h2027 = ColombianHolidays.holidaysForYear(2027)
      .find((h) => h.name === 'Día de la Virgen de Chiquinquirá')!;
    expect(h2027.observedDate.getDay()).toBe(1);
    expect(h2027.observedDate.getDate()).toBe(12);
  });
});

describe('Easter-based holidays (2026)', () => {
  const holidays = ColombianHolidays.holidaysForYear(2026);
  // Easter 2026 = April 5

  it('Jueves Santo should be Easter - 3 days = April 2', () => {
    const h = holidays.find((h) => h.name === 'Jueves Santo')!;
    expect(h.baseDate.getMonth()).toBe(3); // April
    expect(h.baseDate.getDate()).toBe(2);
    expect(h.category).toBe(Category.EASTER_BASED);
  });

  it('Viernes Santo should be Easter - 2 days = April 3', () => {
    const h = holidays.find((h) => h.name === 'Viernes Santo')!;
    expect(h.baseDate.getMonth()).toBe(3);
    expect(h.baseDate.getDate()).toBe(3);
  });

  it('Ascención should be Easter + 43 days = May 18 (Monday → stays)', () => {
    const h = holidays.find((h) => h.name === 'Ascención de Jesús')!;
    expect(h.baseDate.getMonth()).toBe(4); // May
    expect(h.baseDate.getDate()).toBe(18);
    expect(h.observedDate.getTime()).toBe(h.baseDate.getTime());
  });

  it('Corpus Christi should be Easter + 64 days = June 8 (Monday → stays)', () => {
    const h = holidays.find((h) => h.name === 'Corpus Christi')!;
    expect(h.baseDate.getMonth()).toBe(5); // June
    expect(h.baseDate.getDate()).toBe(8);
  });

  it('Sagrado corazón should be Easter + 71 days = June 15 (Monday → stays)', () => {
    const h = holidays.find((h) => h.name === 'Sagrado corazón de Jesús')!;
    expect(h.baseDate.getMonth()).toBe(5); // June
    expect(h.baseDate.getDate()).toBe(15);
  });
});

describe('ColombianHolidays.getHoliday', () => {
  it('should return null for a non-holiday date', () => {
    const result = ColombianHolidays.getHoliday(new Date(2026, 5, 10)); // June 10
    expect(result).toBeNull();
  });

  it('should return Holiday for a known holiday (Jul 20)', () => {
    const result = ColombianHolidays.getHoliday(new Date(2026, 6, 20));
    expect(result).not.toBeNull();
    expect(result!.name).toBe('Día de la independencia');
  });

  it('should return Holiday for observed date (Jul 13, new holiday)', () => {
    const result = ColombianHolidays.getHoliday(new Date(2026, 6, 13));
    expect(result).not.toBeNull();
    expect(result!.name).toBe('Día de la Virgen de Chiquinquirá');
  });

  it('should return null for base date if it was moved (Jul 9)', () => {
    const result = ColombianHolidays.getHoliday(new Date(2026, 6, 9));
    expect(result).toBeNull();
  });
});

describe('ColombianHolidays.isHoliday', () => {
  it('should return false for regular day', () => {
    expect(ColombianHolidays.isHoliday(new Date(2026, 2, 10))).toBe(false);
  });

  it('should return true for a holiday', () => {
    expect(ColombianHolidays.isHoliday(new Date(2026, 11, 25))).toBe(true); // Christmas
  });
});
