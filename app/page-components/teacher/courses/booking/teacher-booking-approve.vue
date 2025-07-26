<script setup lang="ts">
import type { BookingFull } from '~~/__backend/course-bookings/types';
import { CourseBookingMessageTagEnum } from '~~/__backend/course-booking-message/types';
import { CourseBookingStatus } from '~~/__backend/course-bookings/types';

import { useCourseBookingMessaging } from '~/composables/use-course-booking-messaging';
import { formatDateTimeString } from '~/utils/formatting-utils';

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

async function handleApprove() {
   isSubmitting.value = true;

   try {
      await useNuxtApp().$api('/course-booking/status', {
         method: 'PUT',
         body: {
            bookingId: booking.id,
            status: CourseBookingStatus.APPROVED,
         },
      });

      await postBookingMessage(
         `Thanks for the request. I am available for this class on ${formatDateTimeString(booking.bookingDateTime)}. Looking forward to seeing you.`,
         CourseBookingMessageTagEnum.APPROVED,
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
</script>

<template>
   <UModal
      v-model="isOpen"
      prevent-close
      title="Approve this booking"
      :close="{
         icon: 'i-heroicons-x-mark',
      }"
   >
      <UButton
         v-if="booking.status === CourseBookingStatus.PENDING"
         :icon="iconLibrary.actions.approve"
         @click="isOpen = true"
      >
         Approve
      </UButton>

      <template #body>
         <section class="mb-5">
            <div class="flex items-center gap-2">
               <aside>
                  <UIcon
                     class="size-16 text-blue-300"
                     :name="iconLibrary.notifications.info"
                  />
               </aside>

               <div class="">
                  <p>You are about to approve this class</p>

                  <div class="flex items-center gap-2">
                     <div class="flex items-center gap-1">
                        <UIcon :name="iconLibrary.time" />
                        <p>{{ formatDateTimeString(booking.bookingDateTime) }}</p>
                     </div>
                  </div>
               </div>
            </div>

            <p class="mt-5 text-sm text-second-400">
               When you approve, the student will be notified.
            </p>
         </section>
      </template>

      <template #footer>
         <div class="flex justify-center gap-3">
            <ButtonOk
               :loading="isSubmitting"
               @click="handleApprove()"
            >
               Approve
            </ButtonOk>
         </div>
      </template>
   </UModal>
</template>

<style scoped lang="postcss"></style>
