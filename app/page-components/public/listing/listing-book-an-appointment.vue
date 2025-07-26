<script setup lang="ts">
import type { Booking } from '~~/__backend/course-bookings/types';
import type { PublicCourseListing } from '~~/__backend/public/types';
import { useApiGetListingBookingForUser } from '~~/__backend/course-bookings/api';
import BookingStatus from '~/components/booking/booking-status.vue';
import ListingCreateNewAppointment from '~/page-components/public/listing/listing-create-new-appointment.vue';

/* ---------------------------------------------------------------------------------------------- */

const { listing } = defineProps<{
   listing: PublicCourseListing;
}>();

/* ---------------------------------------------------------------------------------------------- */

const { user, loggedIn } = useUserSession();

const isStudentUser = computed(() => {
   if (user.value) {
      return user.value.role === 'STUDENT';
   }
   return false;
});

/* ---------------------------------------------------------------------------------------------- */
/*
 * Fetch existing booking details
 */

const apiBooking = reactive(useApiGetListingBookingForUser(ref(listing.id)));

if (loggedIn.value) {
   await apiBooking.execute();
}

const bookingRef = ref<Booking | null>(null);

watch(() => apiBooking.booking, booking => bookingRef.value = booking, { immediate: true });

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <div v-if="!apiBooking.booking">
      <header class="section-header">
         Make a request for Class
      </header>
      <p class="mb-3 text-second-400">
         If you are interested in this class, you can request a class time
      </p>

      <div v-if="!loggedIn">
         <UButton :to="`/login?redirectTo=/public/listings/${listing.id}`">
            Login as student to continue
         </UButton>
      </div>

      <div v-else>
         <template v-if="isStudentUser">
            <ListingCreateNewAppointment
               :listing
               @create="apiBooking.execute()"
            />
         </template>
         <template v-else>
            <p class="mb-3 text-red-500">
               You need to be logged in with a student account.
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
            You already made a request for this class!
         </h3>

         <div class="mb-5 flex gap-3">
            <div>
               <BookingStatus :status="apiBooking.booking.status" />
            </div>

            <div class="flex items-center gap-1">
               <UIcon name="i-fluent:clock-24-regular" />
               <p class="text-sm">
                  {{ formatDateTimeString(apiBooking.booking.bookingDateTime) }}
               </p>
            </div>
         </div>

         <footer>
            <UButton :to="`/app/student/bookings/${apiBooking.booking.id}`">
               Check Request Status
            </UButton>
         </footer>
      </div>

      <!-- When an appointment is expired -->
      <div v-else>
         <div class="mb-5">
            <p class="text-red-500">
               You already have an expired appointment. You can either check existing booking for any messages
               from the landlord or you can create a new booking.
            </p>
         </div>

         <div class="flex gap-3 items-center">
            <UButton
               variant="soft"
               :to="`/app/student/booking/${apiBooking.booking.id}`"
               :icon="iconLibrary.map"
            >
               Check booking details
            </UButton>

            <ListingCreateNewAppointment
               v-if="isStudentUser"
               :listing
               @create="apiBooking.execute()"
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
