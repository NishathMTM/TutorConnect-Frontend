<script setup lang="ts">
import type { PublicPropertyListing } from '~~/__backend/public/types';
import { z } from 'zod';

/* ---------------------------------------------------------------------------------------------- */

const { listing } = defineProps<{
   listing: PublicPropertyListing;
}>();

const emit = defineEmits(['create']);

/* ---------------------------------------------------------------------------------------------- */

const isOpen = ref(false);

const visitDate = ref(todayAsString());
const visitTime = ref('10:30:00');

const visitDateTime = computed(() => {
   return `${visitDate.value} ${visitTime.value}`;
});

/* ---------------------------------------------------------------------------------------------- */

const formSchema = z.object({
   listingId: z.number(),
   visitRemarks: z.string().min(1),
});

const formState = reactive({
   listingId: listing.id,
   visitDateTime: visitDateTime.value,
   visitRemarks: 'I would like to visit this property',
});

const isSubmitting = ref(false);

/**
 * Creates a new appointment
 */
async function handleCreate() {
   isSubmitting.value = true;

   formState.visitDateTime = visitDateTime.value;

   try {
      await useNuxtApp().$api('/property-visit', {
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
   <UButton
      :icon="iconLibrary.actions.create"
      @click="isOpen = true"
   >
      Set an appointment
   </UButton>

   <UModal
      v-model="isOpen"
      prevent-close
   >
      <UCard>
         <template #header>
            <Heading2>Create an appointment</Heading2>
         </template>

         <UForm
            class="flex flex-col gap-5"
            :state="formState"
            :schema="formSchema"
            @submit="handleCreate()"
         >
            <div class="grid grid-cols-2 gap-3">
               <UFormGroup
                  label="Date"
                  name="visitDate"
               >
                  <InputDatepicker
                     v-model="visitDate"
                     :deny-past="false"
                     :allow-future="true"
                  />
               </UFormGroup>

               <UFormGroup label="Time">
                  <InputTime
                     v-model="visitTime"
                  />
               </UFormGroup>
            </div>

            <div class="grid grid-cols-1">
               <UFormGroup
                  label="Remarks"
                  name="visitRemarks"
               >
                  <UTextarea v-model="formState.visitRemarks" />
               </UFormGroup>
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
      </UCard>
   </UModal>
</template>

<style scoped lang="postcss"></style>
