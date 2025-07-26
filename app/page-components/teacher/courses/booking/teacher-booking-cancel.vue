<script setup lang="ts">
import type { BookingFull } from '~~/__backend/course-bookings/types';
import { CourseBookingMessageTagEnum } from '~~/__backend/course-booking-message/types';
import { CourseBookingStatus } from '~~/__backend/course-bookings/types';
import ButtonDelete from '~/components/button/button-delete.vue';
import { useCourseBookingMessaging } from '~/composables/use-course-booking-messaging';
import { formatDateTimeString } from '~/utils/formatting-utils';

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

async function handleCancel() {
   isSubmitting.value = true;

   try {
      await useNuxtApp().$api('/course-booking/status', {
         method: 'PUT',
         body: {
            bookingId: booking.id,
            status: CourseBookingStatus.CANCELLED_BY_TEACHER,
         },
      });

      await postBookingMessage(
         'Sorry, I am unable to take this class.',
         CourseBookingMessageTagEnum.CANCELLED_BY_TEACHER,
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
      title="Cancel this booking"
      :close="{
         icon: 'i-heroicons-x-mark',
      }"
   >
      <UButton
         v-if="booking.status === CourseBookingStatus.PENDING"
         color="error"
         :icon="iconLibrary.actions.cancel"
         @click="isOpen = true"
      >
         Cancel
      </UButton>

      <template #body>
         <section class="mb-5">
            <div class="flex items-center gap-2">
               <aside>
                  <UIcon
                     class="size-16 text-red-300"
                     :name="iconLibrary.notifications.danger"
                  />
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

            <p class="mt-5 text-sm text-second-400">
               When you cancel, the student will be notified.
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

<style scoped lang="postcss"></style>
