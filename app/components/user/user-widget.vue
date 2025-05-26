<script setup lang="ts">
import { computed } from 'vue';
import { iconLibrary } from '~/utils/icons-utils';

const { user, clear } = useUserSession();

async function signOut() {
   await clear();
   navigateTo('/');
}

function navigateToProfile() {
   navigateTo('/profile/manage');
}

// Computed course for user avatar
const userAvatar = computed(() => {
   const avatarUrl = user.value?.profile?.avatarUrl || '';

   // If the URL is already an absolute URL (starts with http or https), use it directly
   if (avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://')) {
      return avatarUrl;
   }

   // If we have a relative path but it's not empty, prepend the CDN base URL
   if (avatarUrl && !avatarUrl.startsWith('http')) {
      return `https://pub-5b123a679c0d43508a105e9e58e1ca39.r2.dev${avatarUrl.startsWith('/') ? '' : '/'}${avatarUrl}`;
   }

   return '';
});
</script>

<template>
   <!-- Debug message -->
   <div v-if="!user" class="text-red-500 text-sm">
      No user data
   </div>

   <div
      v-if="user"
      class="flex items-center justify-center gap-3"
   >
      <UPopover :popper="{ placement: 'bottom-end' }" class="flex items-center justify-center">
         <UAvatar
            class="user-widget-avatar"
            size="md"
            :src="userAvatar"
            :alt="user.profile?.fullName || 'User'"
            :ui="{ background: 'bg-first-100' }"
         >
            <template #default>
               <UIcon v-if="!userAvatar" name="i-heroicons-user" class="h-5 w-5 text-first-500" />
            </template>
         </UAvatar>

         <template #panel>
            <div class="min-w-52">
               <!-- region: user info -->
               <div class="border-b border-b-second-100 bg-second-50 p-4">
                  <p class="text-primaryColor">
                     {{ user.profile?.fullName || 'User Name' }}
                  </p>
                  <p class="text-sm text-second-500">
                     {{ user.email || 'user@example.com' }}
                  </p>
               </div>
               <!-- endregion: user info -->

               <div class="py-4">
                  <div class="grid grid-cols-1 gap-2">
                     <UButton
                        variant="link"
                        :icon="iconLibrary.auth.signOut"
                        @click="signOut()"
                     >
                        Sign out
                     </UButton>
                     <UButton
                        variant="link"
                        :icon="iconLibrary.user.user"
                        @click="navigateToProfile()"
                     >
                        Manage profile
                     </UButton>
                  </div>
               </div>
            </div>
         </template>
      </UPopover>
   </div>
</template>

<style lang="postcss">
.user-widget-avatar > img {
   @apply border-2 border-first-300;
}
</style>
