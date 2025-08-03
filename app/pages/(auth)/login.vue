<script setup lang="ts">
import { navigateTo } from '#app';
import { useUserSession } from '#imports';
import Logo from 'assets/logo.vue';
import { FetchError } from 'ofetch';
import { z } from 'zod';
import AlertError from '~/components/ui/alert-error.vue';
import { redirectUser } from '~/utils/user-utils';

/* ---------------------------------------------------------------------------------------------- */

const LoginFormSchema = z.object({
   email: z.string().email('We need your email to login'),
   password: z.string().min(6, 'Password is required'),
});

const loginFormState = reactive({
   email: 'teacher2@hello.com',
   password: 'teacher2',
});

/* ---------------------------------------------------------------------------------------------- */

const { redirectTo } = useRoute().query;

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
         return navigateTo('/app/admin/dashboard');
      }

      if (!user.value?.profileCreated) {
         return navigateTo('/profile/create');
      }

      /*
     * if there is a redirectTo path, then go to that path, otherwise redirect to
     * respective dashboards
     */

      if (redirectTo) {
         return navigateTo(String(redirectTo));
      }
      else {
         redirectUser();
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
 * path: /login
 * description: User login page
 */

// useAppTitle('Login');
/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <main>
      <div class=" mx-auto flex min-h-screen w-screen items-center justify-center p-3">
         <div
            class="flex flex-col gap-5 rounded-2xl border border-first-50 p-5 shadow-xl lg:w-[48rem] lg:flex-row"
         >
            <aside class="flex shrink-0 flex-col items-center justify-center lg:w-[18rem]">
               <Logo class="w-[12rem] flex-1 text-first-700" />

               <footer class="">
                  <UButton
                     variant="link"
                     :padded="false"
                     to="/"
                  >
                     Back to homepage
                  </UButton>
               </footer>
            </aside>

            <USeparator orientation="vertical" class="h-80" />

            <!-- region: content -->
            <section class="flex-1">
               <h1 class="text-4xl font-bold text-primaryColor">
                  Welcome back!
               </h1>
               <p class="text-lg text-second-500">
                  Login to manage your Account.
               </p>

               <div class="h-5" />

               <!-- region: main form details -->
               <section>
                  <!-- region: Login form -->
                  <UForm
                     class="flex flex-col gap-5"
                     size="xl"
                     :schema="LoginFormSchema"
                     :state="loginFormState"
                     @submit="(event) => void handleLogin()"
                  >
                     <UFormField
                        label="Email"
                        name="email"
                     >
                        <UInput
                           v-model="loginFormState.email"
                           size="lg"
                        />
                     </UFormField>

                     <UFormField
                        label="Password"
                        name="password"
                     >
                        <UInput
                           v-model="loginFormState.password"
                           type="password"
                           size="lg"
                        />
                     </UFormField>

                     <footer>
                        <UButton
                           class="mt-5"
                           size="lg"
                           block
                           type="submit"
                           :loading="isSubmitting"
                        >
                           Login
                        </UButton>
                     </footer>

                     <!-- region: error messages -->
                     <div v-if="loginError">
                        <AlertError>
                           {{ loginError }}
                        </AlertError>
                     </div>
                     <!-- endregion: error messages -->

                     <footer class="flex justify-between">
                        <UButton
                           variant="link"
                           :padded="false"
                           to="/register"
                        >
                           Register new user
                        </UButton>

                        <UButton
                           variant="link"
                           to="/"
                           :padded="false"
                        >
                           Forgot password?
                        </UButton>
                     </footer>
                  </UForm>
               <!-- endregion: Login form -->
               </section>
               <!-- endregion: main form details -->
            </section>
         <!-- endregion: content -->
         </div>
      </div>
   </main>
</template>

<style scoped lang="postcss"></style>
