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

const isOpen = ref(false);

const requestMessage = ref('I would like to reschedule this class.');

const { postBookingMessage } = useCourseBookingMessaging(ref(booking));

const isSubmitting = ref(false);

async function handleApprove() {
   isSubmitting.value = true;

   try {
      await useNuxtApp().$api('/course-booking/status', {
         method: 'PUT',
         body: {
            bookingId: booking.id,
            status: CourseBookingStatus.RESCHEDULE,
         },
      });

      await postBookingMessage(requestMessage.value, CourseBookingMessageTagEnum.RESCHEDULE_REQUESTED,
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
   <UButton
      color="warning"
      :icon="iconLibrary.visit.visit"
      @click="isOpen = true"
   >
      Request Reschedule
   </UButton>

   <UModal
      v-model="isOpen"
      prevent-close
   >
      <UCard>
         <template #header>
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
         </template>

         <section class="mb-5">
            <div class="flex items-center gap-2">
               <div class="flex w-full flex-col">
                  <p class="mb-5">
                     You are about to request for a reschedule.
                  </p>

                  <UFormField label="Message">
                     <UTextarea v-model="requestMessage" />
                  </UFormField>
               </div>
            </div>
         </section>

         <footer class="flex justify-center gap-3">
            <ButtonOk
               :loading="isSubmitting"
               @click="handleApprove()"
            >
               Send request
            </ButtonOk>
         </footer>
      </UCard>
   </UModal>
</template>

<style scoped lang="postcss"></style>
