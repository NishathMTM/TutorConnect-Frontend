<script setup lang="ts">
import type { Visit } from '~~/__backend/property-visits/types';
import type { PublicPropertyListing } from '~~/__backend/public/types';
import { useApiGetListingVisitForUser } from '~~/__backend/property-visits/api';
import VisitStatus from '~/components/visit/visit-status.vue';
import { usePropertyVisitMessaging } from '~/composables/property/visits/use-property-visit-messaging';
import ListingCreateNewAppointment from '~/page-components/public/listing/listing-create-new-appointment.vue';

/* ---------------------------------------------------------------------------------------------- */

const { listing } = defineProps<{
   listing: PublicPropertyListing;
}>();

/* ---------------------------------------------------------------------------------------------- */

const { user, loggedIn } = useUserSession();

const isTenantUser = computed(() => {
   if (user.value) {
      return user.value.role === 'TENANT';
   }
   return false;
});

/* ---------------------------------------------------------------------------------------------- */
/*
 * Fetch existing visit details
 */

const apiVisit = reactive(useApiGetListingVisitForUser(ref(listing.id)));

if (loggedIn.value) {
   await apiVisit.execute();
}

const visitRef = ref<Visit | null>(null);

watch(() => apiVisit.visit, visit => visitRef.value = visit, { immediate: true });

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <div v-if="!apiVisit.visit">
      <header class="section-header">
         Book an appointment for property visit
      </header>
      <p class="mb-3 text-second-400">
         If you are interested in this property, you can book an appointment with the owner to visit
         and inspect the property.
      </p>

      <div v-if="!loggedIn">
         <UButton :to="`/login?redirectTo=/public/listings/${listing.id}`">
            Login as tenant to continue
         </UButton>
      </div>

      <div v-else>
         <template v-if="isTenantUser">
            <ListingCreateNewAppointment
               :listing
               @create="apiVisit.execute()"
            />
         </template>
         <template v-else>
            <p class="mb-3 text-red-500">
               You need to be logged in with a tenant account.
            </p>
            <UButton to="/login">
               Sign in again
            </UButton>
         </template>
      </div>
   </div>
   <div v-else>
      <!-- When an appointment is already set -->
      <div v-if="!isExpired">
         <h3 class="text-xl font-bold">
            Appointment already booked!
         </h3>

         <div class="mb-5 flex gap-3">
            <div>
               <VisitStatus :status="apiVisit.visit.status" />
            </div>

            <div class="flex items-center gap-1">
               <UIcon name="i-fluent:clock-24-regular" />
               <p class="text-sm">
                  {{ formatDateTimeString(apiVisit.visit.visitDateTime) }}
               </p>
            </div>
         </div>

         <footer>
            <UButton :to="`/app/tenant/visits/${apiVisit.visit.id}`">
               Check visit details
            </UButton>
         </footer>
      </div>

      <!-- When an appointment is expired -->
      <div v-else>
         <div class="mb-5">
            <p class="text-red-500">
               You already have an expired appointment. You can either check existing visit for any messages
               from the landlord or you can create a new visit.
            </p>
         </div>

         <div class="flex gap-3 items-center">
            <UButton
               variant="soft"
               :to="`/app/tenant/visits/${apiVisit.visit.id}`"
               :icon="iconLibrary.visit.visit"
            >
               Check visit details
            </UButton>

            <ListingCreateNewAppointment
               v-if="isTenantUser"
               :listing
               @create="apiVisit.execute()"
            />
         </div>
      </div>
   </div>
</template>

<style scoped lang="postcss">
.section-header {
   @apply mb-2 text-xl font-bold text-second-600;
}
</style>
