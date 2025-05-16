import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Format number to include a thousand separator
 */
export function formatNumber(number: number) {
   return number.toLocaleString('en-US');
}

/**
 * Format number to be in Sri Lankan currency
 */
export function formatLKR(amount: number) {
   return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
   }).format(amount);
}

/**
 * Format number to be in SI weight standard
 */
export function formatWeight(value: number) {
   if (value > 1000) {
      return `${(value / 1000).toFixed(3)} kg`;
   }
   else {
      return `${value.toFixed(3)} g`;
   }
}

/**
 * Format the date string
 * Eg: 2025-01-28
 */
export function formatDateString(value: string) {
   return toDateString(dayjs(value));
}

/**
 * Format the date-time string
 * Eg: 2025-01-28T08:23:03.000+00:00
 */
export function formatDateTimeString(value: string) {
   return toDateTimeString(dayjs.utc(value));
}

/**
 * Format time value to 12H
 */
export function formatTimeAs12hString(value: string) {
   return dayjs(`2024-01-01 ${value}`).format('hh:mm A');
}
