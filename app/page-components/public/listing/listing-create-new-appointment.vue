<script setup lang="ts">
import type { PublicCourseListing } from '~~/__backend/public/types';
import { z } from 'zod';

/* ---------------------------------------------------------------------------------------------- */

const { listing } = defineProps<{
   listing: PublicCourseListing;
}>();

const emit = defineEmits(['create']);

/* ---------------------------------------------------------------------------------------------- */

const isOpen = ref(false);

const bookingDate = ref(todayAsString());
const bookingTime = ref('10:30:00');

const bookingDateTime = computed(() => {
   return `${bookingDate.value} ${bookingTime.value}`;
});

/* ---------------------------------------------------------------------------------------------- */

const formSchema = z.object({
   listingId: z.number(),
   bookingRemarks: z.string().min(1),
});

const formState = reactive({
   listingId: listing.id,
   bookingDateTime: bookingDateTime.value,
   bookingRemarks: 'I would like to do this class',
});

const isSubmitting = ref(false);

/**
 * Creates a new appointment
 */
async function handleCreate() {
   isSubmitting.value = true;

   formState.bookingDateTime = bookingDateTime.value;

   try {
      await useNuxtApp().$api('/course-booking', {
         method: 'POST',
         body: formState,
      });

      isOpen.value = false;

      emit('create');
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
      title="Create an appointment"
   >
      <UButton
         :icon="iconLibrary.actions.create"
         label="Add New Class"
         color="primary"
         size="md"
         class="mb-4"
         @click="isOpen = true"
      />

      <template #header>
         <Heading2>Request for the class</Heading2>
      </template>
      <template #body>
         <UForm
            class="flex flex-col gap-5"
            :state="formState"
            :schema="formSchema"
            @submit="handleCreate()"
         >
            <div class="grid grid-cols-2 gap-3">
               <UFormField
                  label="Date"
                  name="visitDate"
               >
                  <InputDatepicker
                     v-model="bookingDate"
                     :deny-past="false"
                     :allow-future="true"
                  />
               </UFormField>

               <UFormField label="Time">
                  <InputTime
                     v-model="bookingTime"
                  />
               </UFormField>
            </div>

            <div class="grid grid-cols-1">
               <UFormField
                  label="Remarks"
                  name="visitRemarks"
               >
                  <UTextarea v-model="formState.bookingRemarks" />
               </UFormField>
            </div>

            <footer class="flex w-full justify-end gap-3">
               <ButtonCreate
                  type="submit"
                  :loading="isSubmitting"
               >
                  Create
               </ButtonCreate>
               <ButtonCancel @click="isOpen = false">
                  Cancel
               </ButtonCancel>
            </footer>
         </UForm>
      </template>
   </UModal>
</template>

<style scoped lang="postcss"></style>
