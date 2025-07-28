import type { User } from '#auth-utils';
import { navigateTo } from '#app';
import { useUserSession } from '#imports';

export function redirectUser() {
   const { user } = useUserSession();
   if (!user.value) {
      return navigateTo('/login');
   }

   // Type assertion to help TypeScript understand the structure
   const userValue = user.value as User;

   switch (userValue.role) {
      case 'STUDENT':
         return navigateTo('/app/student');
      case 'TEACHER':
         return navigateTo('/app/teacher');

      case 'ADMIN':
         return navigateTo('/app/admin/dashboard');
   }
}
