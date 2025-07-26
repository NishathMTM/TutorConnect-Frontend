<script setup lang="ts">
import type { BookingFull } from '~~/__backend/course-bookings/types';
import { CourseBookingStatus } from '~~/__backend/course-bookings/types';
import { useCourseBookingMessaging } from '~/composables/use-course-booking-messaging';

const { booking } = defineProps<{
   booking: BookingFull;
}>();

const emit = defineEmits(['update']);

const { postMessageAsStudent } = useCourseBookingMessaging(ref(booking));

/* ---------------------------------------------------------------------------------------------- */

const isOpen = ref(false);

/* ---------------------------------------------------------------------------------------------- */

const isSubmitting = ref(false);

async function handleCancel() {
   isSubmitting.value = true;

   try {
      await useNuxtApp().$api('/course-booking/status', {
         method: 'PUT',
         body: {
            bookingId: booking.id,
            status: CourseBookingStatus.CANCELLED_BY_USER,
         },
      });

      await postMessageAsStudent('Sorry, I am cancelling the class booking.');

      isOpen.value = false;

      emit('update');
   }
   catch (error) {
      console.error(error);
   }

   isSubmitting.value = false;
}
</script>

<template>
   <UModal
      v-model="isOpen"
      prevent-close
      title="Cancel this booking"
      :close="{

         icon: 'i-heroicons-x-mark',
      }"
   >
      <UButton
         v-if="booking.status === CourseBookingStatus.PENDING"
         color="warning"
         @click="isOpen = true"
      >
         Cancel
      </UButton>

      <template #body>
         <section class="mb-5">
            <div class="flex gap-2 items-center">
               <aside>
                  <UIcon :name="iconLibrary.notifications.danger" class="text-red-500 size-28" />
               </aside>

               <div class="">
                  <p>You are about to cancel this visit</p>

                  <div class="flex items-center gap-2">
                     <div class="flex items-center gap-1">
                        <UIcon :name="iconLibrary.time" />
                        <p>{{ formatDateTimeString(booking.bookingDateTime) }}</p>
                     </div>
                  </div>
               </div>
            </div>

            <p class="mt-5 text-second-400 text-sm">
               When you cancel, the Teacher will be notified.
            </p>
         </section>
      </template>
      <template #footer>
         <div class="flex justify-center gap-3">
            <ButtonDelete
               :loading="isSubmitting"
               @click="handleCancel()"
            >
               Cancel
            </ButtonDelete>
         </div>
      </template>
   </UModal>
</template>

<style scoped>

</style>
