/**
 * Set app title
 */
export function useAppTitle(title: string | undefined = undefined) {
   if (title === undefined || title === '') {
      useHead({
         title: 'Tutor Connect',
      });
   }
   else {
      useHead({
         title: `${title} - Tutor Connect`,
      });
   }
}
