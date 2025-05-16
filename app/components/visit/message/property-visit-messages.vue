<script setup lang="ts">
import { useApiGetVisitMessages } from '~~/__backend/property-visit-messages/api';
import { PropertyVisitStatus, type Visit } from '~~/__backend/property-visits/types';
import PropertyVisitMessageItem from '~/components/visit/message/property-visit-message-item.vue';

/* ---------------------------------------------------------------------------------------------- */

const { visit, senderType } = defineProps<{
   visit: Visit;
   senderType: 'LANDLORD' | 'TENANT';
}>();

/* ---------------------------------------------------------------------------------------------- */
/*
 * Messages
 */

const apiMessages = reactive(useApiGetVisitMessages(ref(visit.id)));

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
   visitId: visit.id,
   senderId: user.value?.id,
   senderType,
   message: '',
});

const isPosting = ref(false);

async function handlePostMessage() {
   isPosting.value = true;

   try {
      messageBody.message = messageInput.value;

      await useNuxtApp().$api('/property-visit-message', {
         method: 'POST',
         body: messageBody,
      });

      messageInput.value = '';

      /*
       * fetch new messages again
       */
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

const { createSubscription, messages: chatMessages } = useVisitMessagesChatTransmit(
   ref(visit.id),
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
         <PropertyVisitMessageItem
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

      <template v-if="!visit.archived">
         <div
            v-if="
               visit.status === PropertyVisitStatus.APPROVED
                  || visit.status === PropertyVisitStatus.PENDING
                  || visit.status === PropertyVisitStatus.REVISIT_REQUESTED
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
            ></UButton>
         </div>
      </template>

      <!-- endregion: post new message -->
   </section>
</template>

<style scoped lang="postcss"></style>
