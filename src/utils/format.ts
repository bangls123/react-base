/**
 * Format a number as currency (default VND).
 */
export const formatCurrency = (
  value: number,
  locale = 'vi-VN',
  currency = 'VND',
): string =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);

/**
 * Format a date string/Date to locale string.
 */
export const formatDate = (
  date: string | Date,
  locale = 'vi-VN',
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  },
): string => new Intl.DateTimeFormat(locale, options).format(new Date(date));
