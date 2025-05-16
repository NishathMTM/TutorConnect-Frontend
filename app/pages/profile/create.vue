<script setup lang="ts">
import type { RadioGroupItem } from '@nuxt/ui';
import { navigateTo } from '#app';
import { useUserSession } from '#imports';
import Logo from 'assets/logo.vue';
import { FetchError } from 'ofetch';
import { z } from 'zod';
import AlertError from '~/components/ui/alert-error.vue';
import { useAppTitle } from '~/composables/use-app-title';
import { todayAsString } from '~/utils/datetime-utils';

/* ---------------------------------------------------------------------------------------------- */

const { user, fetch } = useUserSession();

if (user.value?.profileCreated) {
   navigateTo('/');
}

/* ---------------------------------------------------------------------------------------------- */

const ProfileFormSchema = z.object({
   fullName: z.string().min(3, 'Name should be at least 3 characters long'),
   address: z.string().min(3, 'Address is required'),
   gender: z.enum(['MALE', 'FEMALE']),
   dob: z.string(),
   nic: z.string().min(10, 'NIC between 10 and 12 digits').max(12, 'NIC between 10 and 12 digits'),
   phone1: z.string().min(1, 'Primary phone number is required'),
   phone2: z.string(),
});

const formState = reactive({
   fullName: '',
   address: '',
   gender: 'MALE',
   dob: todayAsString(),
   nic: '',
   phone1: '',
   phone2: '',
});

const genderOptions = ref<RadioGroupItem[]>([
   { label: 'Male', value: 'MALE' },
   { label: 'Female', value: 'FEMALE' },
]);

/* ---------------------------------------------------------------------------------------------- */

const checkAgreement = ref(false);
const isFormLoading = ref(false);

const submitError = ref('');

async function handleSubmit() {
   isFormLoading.value = true;

   try {
      await useNuxtApp().$api('user/profile', {
         method: 'POST',
         body: {
            ...formState,
         },
      });

      await $fetch('/api/auth/update-session');

      await fetch();

      return redirectUser();
   }
   catch (e) {
      console.error(e);

      if (e instanceof FetchError) {
         submitError.value = e.data.message;
      }
      else {
         submitError.value = 'Failed to create the profile';
      }
   }

   isFormLoading.value = false;
}

/* ---------------------------------------------------------------------------------------------- */

function redirectUser() {
   const { user } = useUserSession();

   switch (user.value?.role) {
      case 'STUDENT':
         return navigateTo('/app/student');
      // case 'HANDYMAN':
      //    return navigateTo('/app/handyman?newUser=1');
      case 'TEACHER':
         return navigateTo('/app/teacher');
      case 'ADMIN':
         return navigateTo('/admin/dashboard');
   }
}

/* ---------------------------------------------------------------------------------------------- */

/*
 * Path: /profile/create
 * Description: Create user profile when user signs in for the first time
 */

useAppTitle('Create Profile');

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <div class="flex min-h-screen w-screen items-center justify-center p-5">
      <div
         class="flex flex-col gap-5 rounded-2xl border border-first-50 p-5 shadow-xl lg:w-[48rem] lg:flex-row"
      >
         <aside class="flex shrink-0 items-center justify-center lg:w-[18rem]">
            <Logo class="w-[12rem] text-first-700" />
         </aside>

         <!-- region: content -->
         <section>
            <h1 class="text-4xl font-bold text-primaryColor">
               Complete your profile
            </h1>

            <p class="text-sm text-second-500">
               Login to manage your learning and teaching process.
            </p>

            <div class="h-5" />

            <!-- region: main form details -->
            <section>
               <UForm
                  class="flex flex-col gap-5"
                  :schema="ProfileFormSchema"
                  :state="formState"
                  @submit="handleSubmit"
               >
                  <UFormField
                     label="Full name"
                     required
                     name="fullName"
                     size="lg"
                  >
                     <UInput v-model="formState.fullName" />
                  </UFormField>

                  <UFormField
                     label="Address"
                     required
                     name="address"
                  >
                     <UTextarea v-model="formState.address" />
                  </UFormField>

                  <div class="grid grid-cols-1 gap-2">
                     <UFormField label="Gender" name="gender">
                        <URadioGroup
                           v-model="formState.gender"
                           :items="genderOptions"
                           orientation="horizontal"
                           class="gap-4"
                        />
                     </UFormField>
                  </div>

                  <div class="grid grid-cols-2 gap-2">
                     <UFormField
                        label="Date of birth"
                        required
                     >
                        <InputDatepicker v-model="formState.dob" />
                     </UFormField>
                  </div>

                  <UFormField
                     label="NIC"
                     required
                     name="nic"
                  >
                     <UInput v-model="formState.nic" />
                  </UFormField>

                  <div class="grid grid-cols-2 gap-2">
                     <UFormField
                        label="Phone 1 (Primary)"
                        required
                        name="phone1"
                     >
                        <UInput v-model="formState.phone1" />
                     </UFormField>

                     <UFormField label="Phone 2">
                        <UInput v-model="formState.phone2" />
                     </UFormField>
                  </div>

                  <!--                  region: footer -->

                  <!--                  <div> -->
                  <!--                     <TermsAndConditionModal /> -->
                  <!--                  </div> -->

                  <footer class="">
                     <UCheckbox
                        v-model="checkAgreement"
                        label="Agree to terms and conditions."
                     />
                  </footer>

                  <footer class="flex justify-end gap-2">
                     <UButton
                        :disabled="!checkAgreement"
                        :loading="isFormLoading"
                        type="submit"
                     >
                        Save & Continue
                     </UButton>
                  </footer>

                  <AlertError v-if="submitError">
                     {{ submitError }}
                  </AlertError>

                  <!-- endregion: footer -->
               </UForm>
            </section>

            <!-- endregion: main form details -->
         </section>
      <!-- endregion: content -->
      </div>
   </div>
</template>

<style scoped lang="postcss"></style>
