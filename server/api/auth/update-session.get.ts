import { UserProfileSchema } from '~~/__backend/users/types';

/* ---------------------------------------------------------------------------------------------- */

export default defineEventHandler(async (event) => {
   const session = await getUserSession(event);

   if (session.user) {
      // get the user profile from the backend
      try {
         const profileData = await getUserProfile(session.token);

         // update the current session - inject the profile data
         await setUserSession(event, {
            user: {
               ...session.user,
               profileCreated: true,
               profile: profileData,
            },
            token: session.token,
         });
      }
      catch (e) {
         console.error(e);
         return createError({
            status: 400,
            message: 'Failed to fetch profile data',
         });
      }
   }
});

/**
 * Fetch the user profile data for the logged-in user
 */
async function getUserProfile(token: string) {
   const response = await $fetch<{ profile: object }>('/user/me', {
      baseURL: useRuntimeConfig().public.apiBaseUrl,
      headers: {
         Authorization: `Bearer ${token}`,
      },
   });

   const parsedProfile = UserProfileSchema.parse(response.profile);

   // Ensure phone2 is a string (never null)
   return {
      ...parsedProfile,
      phone2: parsedProfile.phone2 || '',
   };
}
