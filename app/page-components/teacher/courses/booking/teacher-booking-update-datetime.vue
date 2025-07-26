<script setup lang="ts">
import type { BookingFull } from '~~/__backend/course-bookings/types';
import { CourseBookingMessageTagEnum } from '~~/__backend/course-booking-message/types';
import { useCourseBookingMessaging } from '~/composables/use-course-booking-messaging';

const { booking } = defineProps<{
   booking: BookingFull;
}>();

const emit = defineEmits(['update']);
/* ---------------------------------------------------------------------------------------------- */
const { postBookingMessage } = useCourseBookingMessaging(ref(booking));

/* ---------------------------------------------------------------------------------------------- */

const isOpen = ref(false);

const bookingDate = ref(todayAsString());
const bookingTime = ref('10:30:00');

const bookingDateTime = computed(() => {
   return `${bookingDate.value} ${bookingTime.value}`;
});

/* ---------------------------------------------------------------------------------------------- */

const isSubmitting = ref(false);

async function handleUpdateDateTime() {
   isSubmitting.value = true;

   try {
      await useNuxtApp().$api('/course-booking/date-time', {
         method: 'PUT',
         body: {
            bookingId: booking.id,
            bookingDateTime: bookingDateTime.value,
         },
      });

      await postBookingMessage(
         `I have updated the class time on ${bookingDate.value} at ${bookingTime.value}`,
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
</script>

<template>
   <UModal
      v-model="isOpen"
      prevent-close
   >
      <UButton
         color="success"
         @click="isOpen = true"
      >
         Update date and time
      </UButton>

      <template #body>
         <section class="mb-5">
            <div class="grid grid-cols-2 gap-3">
               <UFormField label="Date">
                  <InputDatepicker
                     v-model="bookingDate"
                     allow-future
                  />
               </UFormField>

               <UFormField label="Time">
                  <InputTime v-model="bookingTime" />
               </UFormField>
            </div>
         </section>
      </template>

      <template #footer>
         <div class="flex justify-center gap-3">
            <ButtonUpdate @click="handleUpdateDateTime()">
               Update
            </ButtonUpdate>
         </div>
      </template>
   </UModal>
</template>

<style scoped lang="postcss"></style>
