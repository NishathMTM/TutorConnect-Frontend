<script setup lang="ts">
import type { BookingFull } from '~~/__backend/course-bookings/types';
import { CourseBookingMessageTagEnum } from '~~/__backend/course-booking-message/types';
import { CourseBookingStatus } from '~~/__backend/course-bookings/types';

import { useCourseBookingMessaging } from '~/composables/use-course-booking-messaging';

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

async function handleComplete() {
   isSubmitting.value = true;

   try {
      await useNuxtApp().$api('/course-booking/status', {
         method: 'PUT',
         body: {
            bookingId: booking.id,
            status: CourseBookingStatus.COMPLETED,
         },
      });

      await postBookingMessage(
         `Thank you for your request. We will do the class.`,
         CourseBookingMessageTagEnum.COMPLETED,
      );

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
      title="Complete this booking"
      :close="{
         icon: 'i-heroicons-x-mark',
      }"
   >
      <UButton
         v-if="booking.status === CourseBookingStatus.APPROVED"
         color="success"
         :icon="iconLibrary.actions.ok"
         @click="isOpen = true"
      >
         Set the class time
      </UButton>

      <template #body>
         <section>
            <p>Once you set the class time, you can start the class.</p>
         </section>
      </template>

      <template #footer>
         <div class="flex justify-center gap-3">
            <ButtonOk @click="handleComplete()">
               Completed
            </ButtonOk>
         </div>
      </template>
   </UModal>
</template>

<style scoped lang="postcss"></style>
