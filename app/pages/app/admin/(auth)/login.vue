<script setup lang="ts">
import { navigateTo } from '#app';
import { useUserSession } from '#imports';
import { FetchError } from 'ofetch';
import { z } from 'zod';

/* ---------------------------------------------------------------------------------------------- */

const LoginFormSchema = z.object({
   email: z.string().email('Please enter a valid email'),
   password: z.string().min(6, 'Password must be at least 6 characters'),
});

const loginFormState = reactive({
   email: '',
   password: '',
});

/* ---------------------------------------------------------------------------------------------- */

const isSubmitting = ref(false);
const loginError = ref('');

async function handleLogin() {
   isSubmitting.value = true;

   try {
      await $fetch('/api/auth/login', {
         method: 'POST',
         body: loginFormState,
      });

      const { fetch, user } = useUserSession();
      await fetch();

      if (user.value && user.value.isAdmin) {
         return navigateTo('/admin/dashboard');
      }
      else {
         // Not an admin, redirect back to main login
         loginError.value = 'Access denied. Admin privileges required.';
      }
   }
   catch (e) {
      if (e instanceof FetchError) {
         if (e.data && e.data.message) {
            loginError.value = e.data.message;
         }
      }
   }
   finally {
      isSubmitting.value = false;
   }
}

/* ---------------------------------------------------------------------------------------------- */
/*
 * path: /admin/login
 * description: Admin login page
 */

useAppTitle('Admin login');
/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <UCard class="w-full max-w-md p-6 space-y-6">
         <div class="text-center">
            <h1 class="text-2xl font-bold text-gray-900">
               Admin Login
            </h1>
            <p class="text-gray-500 mt-2">
               Please sign in to access admin panel
            </p>
         </div>

         <UForm
            :state="loginFormState"
            :schema="LoginFormSchema"
            class="space-y-4"
            @submit="handleLogin"
         >
            <UFormGroup label="Email" name="email">
               <UInput
                  v-model="loginFormState.email"
                  type="email"
                  placeholder="admin@example.com"
                  autocomplete="email"
               />
            </UFormGroup>

            <UFormGroup label="Password" name="password">
               <UInput
                  v-model="loginFormState.password"
                  type="password"
                  placeholder="••••••••"
                  autocomplete="current-password"
               />
            </UFormGroup>

            <!-- Show error message if exists -->
            <AlertError v-if="loginError">
               {{ loginError }}
            </AlertError>

            <UButton
               type="submit"
               color="primary"
               block
               :loading="isSubmitting"
            >
               Sign in
            </UButton>
         </UForm>

         <div class="text-center text-sm text-gray-500">
            <p>
               Not an administrator?
               <UButton
                  variant="link"
                  color="primary"
                  to="/"
               >
                  Return to homepage
               </UButton>
            </p>
         </div>
      </UCard>
   </div>
</template>

<style scoped lang="postcss">

</style>
