<script setup lang="ts">
import type { VisitFull } from '~~/__backend/course-visits/types';
import { PropertyVisitStatus } from '~~/__backend/course-visits/types';
import { usePropertyVisitMessaging } from '~/composables/property/visits/use-property-visit-messaging';
import { formatDateTimeString } from '~/utils/formatting-utils';

/* ---------------------------------------------------------------------------------------------- */

const { visit } = defineProps<{
   visit: VisitFull;
}>();

/* ---------------------------------------------------------------------------------------------- */

const { isExpired } = usePropertyVisitMessaging(ref(visit));

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <div class="flex flex-col gap-5 lg:flex-row lg:gap-10">
      <div class="shrink-0">
         <header class="mb-3 border-b border-b-first-100 font-bold text-second-400">
            Requested by
         </header>

         <div class="flex gap-2">
            <div>
               <div class="font-bold">
                  {{ visit.tenant.profile.fullName }}
               </div>
               <div class="text-sm">
                  <div class="flex items-center gap-2 text-second-400">
                     <UIcon
                        class="size-5"
                        :name="iconLibrary.map"
                     />
                     {{ visit.tenant.profile.address }}
                  </div>
                  <div class="flex items-center gap-2 text-second-400">
                     <UIcon
                        class="size-5"
                        :name="iconLibrary.phone"
                     />
                     {{ visit.tenant.profile.phone1 }}
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div class="flex shrink-0 flex-col">
         <header class="mb-3 border-b border-b-first-100 font-bold text-second-400">
            Date & Time
         </header>

         <div>
            <div class="flex items-center gap-1">
               <UIcon :name="iconLibrary.date" />
               <p>{{ formatDateTimeString(visit.visitDateTime) }}</p>
            </div>
         </div>
      </div>

      <div class="flex flex-col">
         <header class="mb-3 border-b border-b-first-100 font-bold text-second-400">
            Status
         </header>

         <div class="flex gap-1">
            <VisitStatus
               v-if="visit.archived"
               size="lg"
               :status="PropertyVisitStatus.ARCHIVED"
            />

            <VisitStatus
               size="lg"
               :status="visit.status"
            />
         </div>
      </div>

      <div class="flex flex-1 flex-col">
         <header class="mb-3 border-b border-b-first-100 font-bold text-second-400">
            Remarks
         </header>
         <p>{{ visit.visitRemarks }}</p>
      </div>
   </div>
</template>

<style scoped lang="postcss"></style>
