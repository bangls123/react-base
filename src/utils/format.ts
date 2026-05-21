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

export const formatRelativeTime = (isoString: string) => {
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    if (diffMins < 60) {
      return `Cập nhật ${diffMins || 1} phút trước`;
    } else if (diffHours < 24) {
      return `Cập nhật ${diffHours} giờ trước`;
    } else if (diffDays === 1) {
      return 'Cập nhật Hôm qua';
    } else {
      return `Cập nhật ngày ${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    }
  } catch {
    return 'Cập nhật gần đây';
  }
};