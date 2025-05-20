<script setup lang="ts">
import type { PropertyVisitMessage } from '~~/__backend/course-visit-messages/types';

/* ---------------------------------------------------------------------------------------------- */

const { message } = defineProps<{
   message: PropertyVisitMessage;
}>();

const avatarUi = ref({
   placeholder: 'font-bold uppercase leading-none text-first-50 truncate',
   background: 'bg-first-400',
});

if (message.sender === 'TENANT') {
   avatarUi.value.background = 'bg-second-400';
}

const statusColors = new Map<string, string>([
   ['PENDING', 'bg-visit-pending/20'],
   ['APPROVED', 'bg-visit-approved/20'],
   ['COMPLETED', 'bg-visit-completed/20'],
   ['CANCELLED_BY_USER', 'bg-visit-cancelledByUser/20'],
   ['CANCELLED_BY_LANDLORD', 'bg-visit-cancelledByLandlord/20'],
   ['EXPIRED', 'bg-visit-expired/20'],
   ['ARCHIVED', 'bg-visit-archived/20'],
   ['REVISIT_REQUESTED', 'bg-visit-revisitRequested/20'],
]);

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <div class="flex w-full gap-3 p-3 rounded-xl" :class="[statusColors.get(message.tag)]">
      <!-- Avatar -->
      <div class="flex-shrink-0 hidden lg:block">
         <UAvatar
            :alt="message.user.profile.fullName"
            size="lg"
            :ui="avatarUi"
         />
      </div>

      <!-- Message Content -->
      <div class="flex max-w-[80%] flex-col">
         <!-- Sender Name and Time -->

         <!-- Message Text -->
         <div
            class="rounded-lg border px-2 py-1 shadow-sm"
            :class="[message.sender === 'LANDLORD' ? 'border-first-100 bg-first-50' : 'bg-second-50']"
         >
            <p class="text-sm text-gray-800">
               {{ message.message }}
            </p>
         </div>

         <div class="mb-1 flex flex-col gap-2 lg:flex-row lg:items-center mt-1">
            <span class="text-[10px] text-gray-400">
               {{ formatDateTimeString(message.createdAt) }}
            </span>
         </div>
      </div>
   </div>
</template>

<style scoped lang="postcss"></style>
