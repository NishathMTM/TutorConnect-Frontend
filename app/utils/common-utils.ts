/**
 * Check if the value is empty as if
 * null, undefined or empty string
 */
export function isNullOrEmpty(value: any): boolean {
   return value === null || value === undefined || value === '';
}
