// src/utils/utils.ts
import { I18N } from 'astrowind:config';

export const formatter: Intl.DateTimeFormat = new Intl.DateTimeFormat(I18N?.language, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

// Безопасное форматирование даты: принимает string | number | Date
export const getFormattedDate = (date?: string | number | Date): string => {
  if (!date) return '';
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';
  return formatter.format(d);
};

// Утилита trim (используется в разных местах темы)
export const trim = (str = '', ch?: string) => {
  let start = 0,
    end = str.length || 0;
  while (start < end && str[start] === ch) ++start;
  while (end > start && str[end - 1] === ch) --end;
  return start > 0 || end < str.length ? str.substring(start, end) : str;
};

// Форматирование чисел (K/M/B)
export const toUiAmount = (amount: number) => {
  if (!amount) return 0 as unknown as string;

  let value: string;

  if (amount >= 1_000_000_000) {
    const n = (amount / 1_000_000_000).toFixed(1);
    value = Number(n) === parseInt(n) ? parseInt(n) + 'B' : n + 'B';
  } else if (amount >= 1_000_000) {
    const n = (amount / 1_000_000).toFixed(1);
    value = Number(n) === parseInt(n) ? parseInt(n) + 'M' : n + 'M';
  } else if (amount >= 1_000) {
    const n = (amount / 1_000).toFixed(1);
    value = Number(n) === parseInt(n) ? parseInt(n) + 'K' : n + 'K';
  } else {
    value = Number(amount).toFixed(0);
  }

  return value;
};
