<script setup lang="ts">
import type { BookingFull } from '~~/__backend/course-bookings/types';
import { CourseBookingMessageTagEnum } from '~~/__backend/course-booking-message/types';
import { useCourseBookingMessaging } from '~/composables/use-course-booking-messaging';
/* ---------------------------------------------------------------------------------------------- */

const { booking } = defineProps<{
   booking: BookingFull;
}>();

const emit = defineEmits(['update']);
/* ---------------------------------------------------------------------------------------------- */

const { postBookingMessage } = useCourseBookingMessaging(ref(booking));

/* ---------------------------------------------------------------------------------------------- */

const isOpen = ref(false);

/* ---------------------------------------------------------------------------------------------- */

const isSubmitting = ref(false);

async function handleArchive() {
   isSubmitting.value = true;

   try {
      await useNuxtApp().$api('/course-booking/archived', {
         method: 'PUT',
         body: {
            bookingId: booking.id,
            archived: true,
         },
      });

      await postBookingMessage(
         'This booking request has been archived',
         CourseBookingMessageTagEnum.ARCHIVED,
      );

      isOpen.value = false;

      emit('update');
   }
   catch (error) {
      console.error(error);
   }

   isSubmitting.value = false;
}

/* ---------------------------------------------------------------------------------------------- */

const isVisible = computed(() => {
   return !booking.archived;
});

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <UModal
      v-model="isOpen"
      prevent-close
      title="Archive this booking"
      :close="{
         icon: 'i-heroicons-x-mark',
      }"
   >
      <ButtonArchive
         v-if="isVisible"
         @click="isOpen = true"
      >
         Archive
      </ButtonArchive>

      <template #body>
         <section class="mb-5">
            <div class="flex items-center gap-2">
               <aside>
                  <UIcon
                     class="size-16 text-gray-300"
                     :name="iconLibrary.notifications.info"
                  />
               </aside>

               <div class="">
                  <p>You are about to archive this visit</p>

                  <p class="text-gray-400">
                     Archived visits do not show up in the dashboard.
                  </p>
               </div>
            </div>
         </section>
      </template>

      <template #footer>
         <div class="flex justify-center gap-3">
            <ButtonArchive
               :loading="isSubmitting"
               @click="handleArchive()"
            >
               Archive
            </ButtonArchive>
         </div>
      </template>
   </UModal>
</template>
