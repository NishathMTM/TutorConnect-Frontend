<script setup lang="ts">
import Logo from 'assets/logo.vue';
import { z } from 'zod';

const { $api } = useNuxtApp();
const { user, fetch: refreshUserSession } = useUserSession();

// Define form schema
const ProfileFormSchema = z.object({
   fullName: z.string().min(1, 'Full name is required'),
   address: z.string().min(1, 'Address is required'),
   dob: z.string().min(1, 'Date of birth is required'),
   gender: z.enum(['MALE', 'FEMALE', 'OTHER'], { required_error: 'Gender is required' }),
   nic: z.string()
      .min(10, 'NIC should be at least 10 digits long')
      .max(12, 'NIC should not exceed 12 digits'),
   phone1: z.string()
      .min(10, 'Phone number must be 10 digits long')
      .max(10, 'Phone number should not exceed 10 digits')
      .regex(/^\d+$/, 'Phone number should only contain digits'),
   phone2: z.string()
      .min(10, 'Phone number must be 10 digits long')
      .max(10, 'Phone number should not exceed 10 digits')
      .regex(/^\d+$/, 'Phone number should only contain digits')
      .nullish()
      .or(z.literal('')),
});

type ProfileFormType = z.infer<typeof ProfileFormSchema>;

// Initialize form with user profile data
const formState = reactive<ProfileFormType>({
   fullName: user.value?.profile?.fullName || '',
   address: user.value?.profile?.address || '',
   dob: user.value?.profile?.dob || '',
   gender: (user.value?.profile?.gender as 'MALE' || 'FEMALE') || 'MALE',
   nic: user.value?.profile?.nic || '',
   phone1: user.value?.profile?.phone1 || '',
   phone2: user.value?.profile?.phone2 || '',
});

// Form state
const isSubmitting = ref(false);
const updateSuccess = ref(false);
const errorMessage = ref('');

// Avatar upload state
const fileInput = ref<HTMLInputElement | null>(null);
const isUploadingAvatar = ref(false);
const avatarUploadSuccess = ref(false);
const avatarUploadError = ref('');

// Format avatar URL to include CDN if needed
function formatAvatarUrl(url: string | undefined): string {
   if (!url)
      return '';

   // If the URL is already an absolute URL (starts with http or https), use it directly
   if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
   }

   // If we have a relative path but it's not empty, prepend the CDN base URL
   if (url && !url.startsWith('http')) {
      return `https://pub-0ab268f36942444b95cd2694be430248.r2.dev${url.startsWith('/') ? '' : '/'}${url}`;
   }

   return '';
}

// Handle user's current avatar with CDN
const avatarPreview = ref(formatAvatarUrl(user.value?.profile?.avatarUrl));

// Handle file selection change
function onFileChange(event: Event) {
   const input = event.target as HTMLInputElement;
   if (!input.files || input.files.length === 0)
      return;

   const file = input.files[0]!;

   // Validate file type
   if (!file.type.startsWith('image/')) {
      avatarUploadError.value = 'Please select an image file';
      return;
   }

   // Validate file size (max 2MB)
   if (file.size > 2 * 1024 * 1024) {
      avatarUploadError.value = 'Image size should be less than 2MB';
      return;
   }

   // Show preview immediately
   avatarPreview.value = URL.createObjectURL(file);
   avatarUploadError.value = '';
}

// Upload avatar
async function uploadAvatar() {
   if (!fileInput.value || !fileInput.value.files || fileInput.value.files.length === 0) {
      avatarUploadError.value = 'Please select an image to upload';
      return;
   }

   // TypeScript now knows the file exists but still warns, so we use non-null assertion
   const file = fileInput.value.files[0]!;

   // Validate file type
   if (!file.type.startsWith('image/')) {
      avatarUploadError.value = 'Please select an image file';
      return;
   }

   // Validate file size (max 2MB)
   if (file.size > 2 * 1024 * 1024) {
      avatarUploadError.value = 'Image size should be less than 2MB';
      return;
   }

   isUploadingAvatar.value = true;
   avatarUploadSuccess.value = false;
   avatarUploadError.value = '';

   try {
      const formData = new FormData();
      formData.append('avatar', file);

      // Send the avatar to the server
      const response = await $api<{ avatarUrl?: string }>('/user/avatar', {
         method: 'POST',
         body: formData,
      });

      // API response might contain the new avatar URL
      let newAvatarUrl = '';
      if (response && response.avatarUrl) {
         newAvatarUrl = response.avatarUrl;
      }

      // Update session to reflect new avatar
      await $fetch('/api/auth/update-session', {
         method: 'GET',
      });

      // Refresh user session
      await refreshUserSession();

      // If the API returned a new avatar URL, use it; otherwise keep the current preview
      if (newAvatarUrl) {
         // Update user's profile in memory with the new avatar URL
         if (user.value && user.value.profile) {
            user.value.profile.avatarUrl = newAvatarUrl;
         }
         avatarPreview.value = formatAvatarUrl(newAvatarUrl);
      }

      avatarUploadSuccess.value = true;
   }
   catch (error) {
      console.error('Avatar upload error:', error);
      avatarUploadError.value = 'Failed to upload profile picture. Please try again.';
   }
   finally {
      isUploadingAvatar.value = false;
   }
}

// Handle form submission
async function handleSubmit() {
   try {
      isSubmitting.value = true;
      errorMessage.value = '';
      updateSuccess.value = false;

      // Validate form data
      const validatedData = ProfileFormSchema.parse(formState);

      // Send data to the API
      await $api('/user/profile', {
         method: 'PUT',
         body: validatedData,
      });

      // First update the session by calling the server API endpoint
      await $fetch('/api/auth/update-session', {
         method: 'GET',
      });

      // Then refresh the local user session data
      await refreshUserSession();

      // Also update the current user data in memory to show changes immediately
      if (user.value && user.value.profile) {
         user.value.profile.fullName = validatedData.fullName;
         user.value.profile.address = validatedData.address;
         user.value.profile.dob = validatedData.dob;
         user.value.profile.gender = validatedData.gender;
         user.value.profile.nic = validatedData.nic;
         user.value.profile.phone1 = validatedData.phone1;
         user.value.profile.phone2 = validatedData.phone2 || '';
      }

      // Show success message
      updateSuccess.value = true;
   }
   catch (error) {
      if (error instanceof z.ZodError) {
         // Handle validation errors
         const firstError = error.errors[0];
         errorMessage.value = firstError?.message || 'Invalid form data';
      }
      else {
         // Handle API errors
         errorMessage.value = 'Failed to update profile. Please try again.';
         console.error('Profile update error:', error);
      }
   }
   finally {
      isSubmitting.value = false;
   }
}
</script>

<template>
   <div class="flex flex-col">
      <!-- Header with logo -->
      <div class="bg-white border-b border-first-100 mb-6">
         <div class="container mx-auto py-6 px-4">
            <div class="flex items-center justify-between">
               <div class="flex items-center">
                  <Logo class="w-36 h-auto" />
                  <h1 class="text-2xl font-bold text-primaryColor ml-6 border-l border-first-200 pl-6">
                     Profile Management
                  </h1>
               </div>
               <div>
                  <UButton
                     variant="soft"
                     to="/app"
                     icon="i-heroicons-home"
                  >
                     Dashboard
                  </UButton>
               </div>
            </div>
         </div>
      </div>

      <!-- Main content -->
      <div class="max-w-4xl mx-auto p-4 pb-10 w-full">
         <!-- Profile Picture Section -->
         <div class="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 class="text-xl font-bold text-primaryColor mb-6">
               Profile Picture
            </h2>

            <div class="flex flex-col md:flex-row gap-6 items-center">
               <div class="w-32 h-32 rounded-full overflow-hidden bg-first-50 border border-first-200 flex items-center justify-center">
                  <img v-if="avatarPreview" :src="avatarPreview" alt="Profile Picture" class="w-full h-full object-cover">
                  <UIcon v-else name="i-heroicons-user" class="w-16 h-16 text-first-300" />
               </div>

               <div class="flex-1">
                  <!-- Alert messages for avatar upload -->
                  <UAlert
                     v-if="avatarUploadError"
                     color="error"
                     variant="soft"
                     icon="i-heroicons-exclamation-triangle"
                     :description="avatarUploadError"
                     class="mb-4"
                  />

                  <UAlert
                     v-if="avatarUploadSuccess"
                     color="success"
                     variant="soft"
                     icon="i-heroicons-check-circle"
                     description="Profile picture updated successfully"
                     class="mb-4"
                  />

                  <div class="mb-4">
                     <input
                        id="avatar-input"
                        ref="fileInput"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="onFileChange"
                     >
                     <UButton
                        as="label"
                        for="avatar-input"
                        color="secondary"
                        variant="soft"
                        icon="i-heroicons-arrow-up-tray"
                        class="mr-2"
                     >
                        Select Image
                     </UButton>

                     <UButton
                        color="primary"
                        icon="i-heroicons-cloud-arrow-up"
                        :loading="isUploadingAvatar"
                        :disabled="isUploadingAvatar || !fileInput?.files?.length"
                        @click="uploadAvatar"
                     >
                        Upload
                     </UButton>
                  </div>

                  <p class="text-sm text-second-500">
                     Supported formats: JPG, PNG, GIF. Maximum file size: 2MB.
                  </p>
               </div>
            </div>
         </div>

         <!-- Personal Information Form -->
         <div class="bg-white shadow-md rounded-lg p-6">
            <h2 class="text-xl font-bold text-primaryColor mb-6">
               Update Your Information
            </h2>

            <UForm :schema="ProfileFormSchema" :state="formState" class="space-y-6" @submit="handleSubmit">
               <!-- Alert messages -->
               <UAlert
                  v-if="errorMessage"
                  color="error"
                  variant="soft"
                  icon="i-heroicons-exclamation-triangle"
                  title="Error"
                  :description="errorMessage"
                  class="mb-4"
               />

               <UAlert
                  v-if="updateSuccess"
                  color="success"
                  variant="soft"
                  icon="i-heroicons-check-circle"
                  title="Success"
                  description="Your profile has been updated successfully"
                  class="mb-4"
               />

               <!-- Full Name -->
               <div>
                  <UFormField label="Full Name" name="fullName">
                     <UInput
                        v-model="formState.fullName"
                        placeholder="Enter your full name"
                        required
                     />
                  </UFormField>
               </div>

               <!-- Gender -->
               <div>
                  <UFormField label="Gender">
                     <div class="flex gap-5">
                        <URadio
                           v-model="formState.gender"
                           label="Male"
                           value="male"
                           name="MALE"
                        />
                        <URadio
                           v-model="formState.gender"
                           label="Female"
                           value="female"
                           name="FEMALE"
                        />
                     </div>
                  </UFormField>
               </div>

               <!-- Date of Birth -->
               <div>
                  <UFormField label="Date of Birth" name="dob">
                     <UInput
                        v-model="formState.dob"
                        type="date"
                        required
                     />
                  </UFormField>
               </div>

               <!-- Address -->
               <div>
                  <UFormField label="Address" name="address">
                     <UTextarea
                        v-model="formState.address"
                        placeholder="Enter your address"
                        required
                     />
                  </UFormField>
               </div>

               <!-- NIC -->
               <div>
                  <UFormField label="National ID (NIC)" name="nic">
                     <UInput
                        v-model="formState.nic"
                        placeholder="Enter your NIC number"
                        required
                     />
                  </UFormField>
               </div>

               <!-- Phone Numbers -->
               <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <UFormField label="Primary Phone" name="phone1">
                     <UInput
                        v-model="formState.phone1"
                        placeholder="Enter your primary phone number"
                        required
                     />
                  </UFormField>

                  <UFormField label="Secondary Phone (Optional)" name="phone2">
                     <UInput
                        v-model="formState.phone2"
                        placeholder="Enter your secondary phone number"
                     />
                  </UFormField>
               </div>

               <!-- Submit Button -->
               <div class="mt-6">
                  <UButton
                     type="submit"
                     color="primary"
                     :loading="isSubmitting"
                     :disabled="isSubmitting"
                     class="w-full md:w-auto"
                  >
                     Update Profile
                  </UButton>
               </div>
            </UForm>
         </div>
      </div>
   </div>
</template>
