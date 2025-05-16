<script setup lang="ts">
import Logo from 'assets/logo.vue';
import { z } from 'zod';
import RoleSelector from '~/page-components/register/role-selector.vue';
import { getApiBaseURL } from '~/utils/api-utils';

/* ---------------------------------------------------------------------------------------------- */

const formSchema = z
   .object({
      email: z.string().email('Should be a valid email'),
      password: z.string().min(6, 'Password should be at least 6 characters long'),
      confirmPassword: z.string().min(6, 'Password should be at least 6 characters long'),
      role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
   })
   .refine(
      (data) => {
         return data.password === data.confirmPassword;
      },
      {
         message: 'Password does not match',
         path: ['confirmPassword'],
      },
   );

// Define the type for the form state based on the schema
interface FormState {
   email: string;
   password: string;
   confirmPassword: string;
   role: 'STUDENT' | 'TEACHER' | 'ADMIN';
}

const formState = reactive<FormState>({
   email: '',
   password: '',
   confirmPassword: '',
   role: 'STUDENT', // Default value must be one of the enum values
});

const submitError = ref('');

async function handleSubmit(event: any) {
   submitError.value = '';

   try {
      const apiBaseURL = getApiBaseURL();
      await $fetch(`${apiBaseURL}/register`, {
         method: 'POST',
         body: {
            email: formState.email,
            password: formState.password,
            password_confirmation: formState.confirmPassword,
            role: formState.role,
         },
      });

      // Use navigateTo without returning it
      navigateTo({
         path: '/login',
         query: {
            newUser: '1',
            email: formState.email,
         },
      });
   }
   catch (e) {
      console.error(e);
      submitError.value = 'Failed to create the user account';
   }
}

/* ---------------------------------------------------------------------------------------------- */
/*
 * Path: /register
 * Description: User registration page
 */

// useAppTitle('Register');
/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <div class="flex min-h-screen w-screen items-center justify-center p-3">
      <div
         class="flex flex-col gap-5 rounded-2xl border border-first-50 p-5 shadow-lg lg:w-[48rem] lg:flex-row"
      >
         <aside class="flex shrink-0 items-center justify-center lg:w-[18rem]">
            <Logo class="w-[12rem] text-first-700" />
         </aside>

         <UDivider
            orientation="vertical"
            :ui="{
               border: {
                  base: 'border-first-100',
               },
            }"
         />

         <!-- region: content -->
         <section class="flex-1">
            <h1 class="text-3xl font-bold text-primaryColor lg:text-4xl">
               New user registration
            </h1>
            <p class="text-sm text-second-500">
               Please choose an account type and register with your email.
            </p>

            <div class="h-5" />

            <!-- region: main form details -->
            <section>
               <UForm
                  class="flex flex-col gap-5"
                  :schema="formSchema"
                  :state="formState"
                  @submit="handleSubmit"
               >
                  <div>
                     <div class="mb-3 flex items-center gap-2">
                        <UPopover class="flex items-center justify-center">
                           <UButton
                              icon="i-fluent:info-12-regular"
                              square
                              color="gray"
                              variant="soft"
                           />

                           <template #panel>
                              <div class="max-w-72 p-4 text-sm">
                                 <div class="flex flex-col gap-5">
                                    <div>
                                       <header class="font-bold uppercase text-second-500">
                                          Tenant
                                       </header>
                                       <p class="text-second-400">
                                          If you are looking for properties to rent, you should sign
                                          up as a tenant.
                                       </p>
                                    </div>

                                    <div>
                                       <header class="font-bold uppercase text-second-500">
                                          Landlord
                                       </header>
                                       <p class="text-second-400">
                                          If you are looking to manage your properties and tenancy,
                                          you should sign up as a landlord.
                                       </p>
                                    </div>

                                    <div>
                                       <header class="font-bold uppercase text-second-500">
                                          Handyman
                                       </header>
                                       <p class="text-second-400">
                                          If you are looking to provide services such as plumbing or
                                          electrical, you should sign up as a handyman.
                                       </p>
                                    </div>
                                 </div>
                              </div>
                           </template>
                        </UPopover>

                        <div>Choose your account type</div>
                     </div>
                     <RoleSelector v-model="formState.role" />
                  </div>

                  <UFormField
                     label="Email"
                     required
                     name="email"
                  >
                     <UInput v-model="formState.email" />
                  </UFormField>

                  <div class="grid grid-cols-2 gap-5">
                     <UFormField
                        label="Password"
                        required
                        name="password"
                     >
                        <UInput
                           v-model="formState.password"
                           type="password"
                        />
                     </UFormField>

                     <UFormField
                        label="Confirm password"
                        required
                        name="confirmPassword"
                     >
                        <UInput
                           v-model="formState.confirmPassword"
                           type="password"
                        />
                     </UFormField>
                  </div>

                  <footer class="flex justify-end gap-3">
                     <UButton type="submit">
                        Register
                     </UButton>
                     <ButtonCancel to="/">
                        Cancel
                     </ButtonCancel>
                  </footer>

                  <footer v-if="submitError">
                     <AlertError>{{ submitError }}</AlertError>
                  </footer>
               </UForm>
            </section>
            <!-- endregion: main form details -->
         </section>
      <!-- endregion: content -->
      </div>
   </div>
</template>

<style scoped lang="postcss"></style>
