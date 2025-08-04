<script setup lang="ts">
import type CourseBookingMessages from '~/components/booking/message/course-booking-messages.vue';
import type SingleBookingHeader from '~/components/booking/single-booking-header.vue';
import { useApiGetSingleBookingInfo } from '~~/__backend/course-bookings/api';
import { CourseBookingStatus } from '~~/__backend/course-bookings/types';
import RequestReschedule from '~/page-components/student/booking/request-reschedule.vue';
import StudentBookingCancel from '~/page-components/student/booking/student-booking-cancel.vue';
import StudentBookingRequestReschedule from '~/page-components/student/booking/student-booking-request-reschedule.vue';

/* ---------------------------------------------------------------------------------------------- */

definePageMeta({
   middleware: ['auth-student'],
});

/* ---------------------------------------------------------------------------------------------- */

const { bookingId } = useRoute().params;
const bookingIdRef = ref(Number(bookingId));

const apiBooking = reactive(useApiGetSingleBookingInfo(bookingIdRef));
apiBooking.execute();

const bookingMessagesRef = ref<InstanceType<typeof CourseBookingMessages>>();

async function updateBooking() {
   apiBooking.execute();
   bookingMessagesRef.value?.fetchMessages();
}

/* ---------------------------------------------------------------------------------------------- */
/*
 * Path: /app/student/booking/[bookingId]
 * Description: Single booking details
 */

useAppTitle('Booking details');

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <StudentLayout>
      <FullContainer v-if="apiBooking.booking">
         <!-- region: class details -->
         <section class="mb-10">
            <!-- region: header -->
            <header class="mb-5">
               <div class="flex flex-col items-center justify-between lg:flex-row">
                  <Heading2>Class details</Heading2>

                  <div />
               </div>
            </header>
            <!-- endregion: header -->

            <!-- region: course card -->
            <div>
               <CourseInfoCard :course="apiBooking.booking.courseListing.course" />
            </div>
            <!-- endregion: course card -->
         </section>
         <!-- endregion: course details -->

         <!-- region: booking details -->
         <section>
            <header class="mb-5 flex flex-col items-center justify-between lg:flex-row">
               <div class="flex items-center justify-between">
                  <Heading2>Booking details</Heading2>
               </div>

               <div

                  class="flex gap-3"
               >
                  <StudentBookingCancel
                     v-if="!apiBooking.booking.archived"
                     :booking="apiBooking.booking"
                     @update="updateBooking()"
                  />

                  <!-- region: request revisit -->
                  <RequestReschedule
                     v-if="apiBooking.booking.status !== CourseBookingStatus.RESCHEDULE"
                     :booking="apiBooking.booking"
                     @update="apiBooking.execute()"
                  />
                  <!-- endregion: request revisit -->
               </div>
            </header>

            <!-- region: single booking details -->
            <SingleBookingHeader :booking="apiBooking.booking" />
            <!-- endregion: student details -->

            <!-- region: callout area -->
            <section class="mt-5 flex w-full justify-center">
               <div
                  v-if="apiBooking.booking.status === CourseBookingStatus.EXPIRED"
                  class="text-center"
               >
                  <p class="mb-1 text-xs text-second-400">
                     Your booking has expired. You can request a reschedule from the teacher. The teacher
                     has to approve it.
                  </p>

                  <StudentBookingRequestReschedule :booking="apiBooking.booking" @update="apiBooking.execute()" />
               </div>
            </section>
            <!-- region: callout area -->

            <!-- region: booking messages -->
            <div class="mt-10">
               <CourseBookingMessages
                  ref="bookingMessagesRef"
                  sender-type="STUDENT"
                  :booking="apiBooking.booking"
               />
            </div>
            <!-- endregion: booking messages -->
         </section>
      <!-- endregion: booking details -->
      </FullContainer>
   </StudentLayout>
</template>

<style scoped lang="postcss"></style>
