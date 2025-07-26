<script setup lang="ts">
import type { Booking } from '~~/__backend/course-bookings/types';
import { watchOnce } from '@vueuse/shared';
import { useApiGetBookingMessages } from '~~/__backend/course-booking-message/api';
import { CourseBookingStatus } from '~~/__backend/course-bookings/types';
import CourseBookingMessageItem from '~/components/booking/message/course-booking-message-item.vue';
import { iconLibrary } from '~/utils/icons-utils';

const { booking, senderType } = defineProps<{
   booking: Booking;
   senderType: 'TEACHER' | 'STUDENT';
}>();

/* ---------------------------------------------------------------------------------------------- */
/*
 * Messages
 */

const apiMessages = reactive(useApiGetBookingMessages(ref(booking.id)));

apiMessages.execute();

async function fetchMessages() {
   await apiMessages.execute();
}

defineExpose({
   fetchMessages,
});

/* ---------------------------------------------------------------------------------------------- */
/*
 * Post a new message
 */

const { user } = useUserSession();

const messageInput = ref('');

const messageBody = reactive({
   bookingId: booking.id,
   senderId: user.value?.id,
   senderType,
   message: '',
});

const isPosting = ref(false);

async function handlePostMessage() {
   if (!messageInput.value.trim())
      return;

   isPosting.value = true;

   try {
      messageBody.message = messageInput.value;

      await useNuxtApp().$api('/course-booking-message', {
         method: 'POST',
         body: messageBody,
      });

      messageInput.value = '';

      // Fetch new messages again
      await fetchMessages();
   }
   catch (error) {
      console.error(error);
   }

   isPosting.value = false;
}

/* ---------------------------------------------------------------------------------------------- */
/*
 * Subscribe to real-time messages
 */

const { createSubscription, messages: chatMessages } = useBookingMessagesChatTransmit(
   ref(booking.id),
);

await createSubscription();

watchOnce(() => apiMessages.messages, (messages) => {
   chatMessages.value.push(...messages);
}, { deep: true });

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <LoadingPlaceholder v-if="apiMessages.status === 'pending'" />

   <section
      v-else
      class="flex flex-col gap-5 rounded-xl border border-first-100 p-2 lg:p-3"
   >
      <!-- region: messages -->
      <div class="flex flex-col gap-5">
         <CourseBookingMessageItem
            v-for="message in chatMessages"
            :key="message.id"
            :message="message"
         />
      </div>
      <!-- endregion: messages -->

      <div v-if="apiMessages.messages.length === 0">
         <p class="text-second-400">
            No messages yet.
         </p>
      </div>

      <!-- region: post new message -->

      <template v-if="!booking.archived">
         <div
            v-if="
               booking.status === CourseBookingStatus.APPROVED
                  || booking.status === CourseBookingStatus.PENDING
                  || booking.status === CourseBookingStatus.RESCHEDULE
            "
            class="mt-5 flex w-full gap-1"
         >
            <UInput
               v-model="messageInput"
               class="flex-1"
               size="lg"
               placeholder="Type a message..."
               @keyup.enter="handlePostMessage()"
            />
            <UButton
               size="lg"
               square
               :icon="iconLibrary.messaging.send"
               variant="soft"
               @click="handlePostMessage()"
            />
         </div>
      </template>

      <!-- endregion: post new message -->
   </section>
</template>

<style scoped lang="postcss"></style>
