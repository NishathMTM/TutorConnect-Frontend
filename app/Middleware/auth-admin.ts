import { useUserSession } from '#imports';

export default defineNuxtRouteMiddleware((to, from) => {
   const { user } = useUserSession();

   if (user.value && user.value.role !== 'ADMIN') {
      return abortNavigation();
   }
});
