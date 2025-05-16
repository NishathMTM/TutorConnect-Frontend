/**
 * These paths can be accessed without auth
 */
const SAFE_PATHS: string[] = ['/', '/login', '/register', '/profile/create'];

export default defineNuxtRouteMiddleware((to, from) => {
   const { loggedIn, user } = useUserSession();

   if (!loggedIn.value) {
      /*
         * Ignore safe path from auth validation
         */
      if (SAFE_PATHS.includes(to.path)) {
         return true;
      }

      /*
         * Ignore all routes that starts with /public from auth validation
         */
      // if (to.path.startsWith('/public/')) {
      //    return true;
      // }

      return navigateTo({
         path: '/login',
         query: {
            redirect: from.fullPath,
         },
      });
   }

   if (!user.value?.profileCreated) {
      if (to.path !== '/profile/create') {
         return navigateTo('/profile/create');
      }
   }
});
