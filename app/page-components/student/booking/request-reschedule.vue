<script setup lang="ts">
import type { BookingFull } from '~~/__backend/course-bookings/types';
import { CourseBookingMessageTagEnum } from '~~/__backend/course-booking-message/types';
import { CourseBookingStatus } from '~~/__backend/course-bookings/types';
import { useCourseBookingMessaging } from '~/composables/use-course-booking-messaging';

/* ---------------------------------------------------------------------------------------------- */

const { booking } = defineProps<{
   booking: BookingFull;
}>();

const emit = defineEmits(['update']);

/* ---------------------------------------------------------------------------------------------- */

const isOpen = ref(false);
const isSubmitting = ref(false);

const bookingDate = ref(todayAsString());
const bookingTime = ref('10:30:00');

const bookingDateTime = computed(() => {
   return `${bookingDate.value} ${bookingTime.value}`;
});

const requestMessage = ref('I would like to reschedule this Class.');

const { postBookingMessage } = useCourseBookingMessaging(ref(booking));

async function handleRequest() {
   isSubmitting.value = true;

   try {
      await useNuxtApp().$api('/course-booking/status', {
         method: 'PUT',
         body: {
            bookingId: booking.id,
            status: CourseBookingStatus.RESCHEDULE,
            bookingDateTime: bookingDateTime.value,
         },
      });

      await postBookingMessage(
         `${requestMessage.value} Requested for ${bookingDate.value} at ${bookingTime.value}`,
         CourseBookingMessageTagEnum.RESCHEDULE_REQUESTED,
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
      title="Reschedule Class"
   >
      <UButton
         color="warning"
         :icon="iconLibrary.visit.visit"
         @click="isOpen = true"
      >
         Reschedule Class
      </UButton>

      <template #body>
         <div class="flex items-center justify-between">
            <heading2>Request for reschedule</heading2>

            <UButton
               :icon="iconLibrary.actions.cancel"
               square
               variant="soft"
               color="secondary"
               @click="isOpen = false"
            />
         </div>

         <section class="mb-5">
            <div class="flex flex-col gap-4">
               <div class="grid grid-cols-2 gap-3">
                  <UFormField label="Date">
                     <InputDatepicker
                        v-model="bookingDate"
                        allow-future
                        deny-past
                     />
                  </UFormField>

                  <UFormField label="Time">
                     <InputTime v-model="bookingTime" />
                  </UFormField>
               </div>

               <UFormField label="Message">
                  <UTextarea v-model="requestMessage" />
               </UFormField>
            </div>
         </section>
      </template>

      <template #footer>
         <div class="flex justify-center gap-3">
            <ButtonOk
               :loading="isSubmitting"
               @click="handleRequest()"
            >
               Send request
            </ButtonOk>
         </div>
      </template>
   </UModal>
</template>

<style scoped lang="postcss">
</style>
