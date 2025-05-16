import type { LoginResponse } from '~~/__backend/users/types';
import { z } from 'zod';
import { getApiBaseURL } from '~/utils/api-utils';

/* ---------------------------------------------------------------------------------------------- */

const bodySchema = z.object({
   email: z.string().email('Email is not valid'),
   password: z.string().min(1, 'Password is required'),
});

/* ---------------------------------------------------------------------------------------------- */

export default defineEventHandler(async (event) => {
   // 1. get the body from login form submit

   const body = await readValidatedBody(event, bodySchema.parse);

   // 2. send request to adonis backend to validate user login

   const apiBaseURL = getApiBaseURL();

   try {
      const response = await $fetch<LoginResponse>(`${apiBaseURL}/login`, {
         method: 'POST',
         body,
      });

      // 3. create user session from the response

      await setUserSession(event, {
         user: {
            id: response.user.id,
            email: response.user.email,
            role: response.user.role,
            profileCreated: response.user.profileCreated,
            profile: response.user.profile,
            isAdmin: response.user.role === 'ADMIN',
         },
         token: response.token.token,
      });
   }
   catch (e) {
      return createError({
         status: 401,
         message: 'Authentication failed. Check email and password',
      });
   }

   return {
      message: 'login successful',
   };
});
