/**
 * Set app title
 */
export function useAppTitle(title: string | undefined = undefined) {
   if (title === undefined || title === '') {
      useHead({
         title: 'Tenantrix',
      });
   }
   else {
      useHead({
         title: `${title} - Tenantrix`,
      });
   }
}
