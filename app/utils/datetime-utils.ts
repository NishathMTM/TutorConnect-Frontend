import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

/* ---------------------------------------------------------------------------------------------- */

dayjs.extend(utc);
dayjs.extend(timezone);

/* ---------------------------------------------------------------------------------------------- */

/**
 * Returns today as a string value
 * e.g.: 2024-03-16
 */
export function todayAsString() {
   return toDateString(dayjs());
}

/* ---------------------------------------------------------------------------------------------- */

/**
 * Get the current time as ISO standard string
 * Eg: 12:34:00
 */
export function timeAsString() {
   return dayjs().format('HH:mm:ss');
}

/* ---------------------------------------------------------------------------------------------- */

/**
 * Convert the date object into ISO string format (YYYY-MM-DD)
 * @param dateObj
 * @param format
 */
export function toDateString(dateObj: Date | Dayjs, format: string = 'YYYY-MM-DD') {
   if (dateObj instanceof Date) {
      return dayjs(dateObj).format(format);
   }
   else {
      return dateObj.format(format);
   }
}

/* ---------------------------------------------------------------------------------------------- */

/**
 * Convert the date object into ISO string format (YYYY-MM-DD)
 */
export function toDateTimeString(dateObj: Date | Dayjs, format: string = 'YYYY-MM-DD, hh:mm:ss A') {
   if (dateObj instanceof Date) {
      return dayjs(dateObj).format(format);
   }
   else {
      return dateObj.format(format);
   }
}

/* ---------------------------------------------------------------------------------------------- */

/**
 * Creates a dayjs object from value string
 */
export function parseDateTimeString(value: string, tz: string = 'America/Chicago') {
   return dayjs(value).tz(tz);
}

/* ---------------------------------------------------------------------------------------------- */

/*
 * Some helper notes
 */

// const dtFormat = new Intl.DateTimeFormat('en-US', {
//    timeZone: 'America/Chicago',
// });

// const dateObj3 = new Date(dateString);
// console.log(dtFormat.format(dateObj3));
// console.log(dateObj3.toLocaleString('en-us', { timeZone: 'America/Chicago' }));
