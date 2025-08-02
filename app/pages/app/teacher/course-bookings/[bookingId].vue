<script setup lang="ts">
import type CourseBookingMessages from '~/components/booking/message/course-booking-messages.vue';
import { useApiGetSingleBookingInfo } from '~~/__backend/course-bookings/api';
import { CourseBookingStatus } from '~~/__backend/course-bookings/types';
import TeacherBookingApprove from '~/page-components/teacher/courses/booking/teacher-booking-approve.vue';
import TeacherBookingArchived from '~/page-components/teacher/courses/booking/teacher-booking-archive.vue';
import TeacherBookingCancel from '~/page-components/teacher/courses/booking/teacher-booking-cancel.vue';
import TeacherBookingComplete from '~/page-components/teacher/courses/booking/teacher-booking-complete.vue';
import TeacherBookingUpdateDateTime from '~/page-components/teacher/courses/booking/teacher-booking-update-datetime.vue';
/* ---------------------------------------------------------------------------------------------- */

const { bookingId } = useRoute().params;
const bookingIdRef = ref(Number(bookingId));

const apiBooking = reactive(useApiGetSingleBookingInfo(bookingIdRef));
apiBooking.execute();

// watchDeep(
//    () => apiBooking.errorCode,
//    (code) => {
//       if (code === 404) {
//          return navigateTo('/app/teacher/course-booking');
//       }
//    },
// );

/* ---------------------------------------------------------------------------------------------- */

const bookingRef = ref(apiBooking.booking);

watch(
   () => apiBooking.booking,
   booking => (bookingRef.value = booking),
   { immediate: true, deep: true },
);

/* ---------------------------------------------------------------------------------------------- */

const bookingMessagesRef = ref<InstanceType<typeof CourseBookingMessages>>();

async function updateBooking() {
   apiBooking.execute();
   bookingMessagesRef.value?.fetchMessages();
}

/* ---------------------------------------------------------------------------------------------- */

const dateTimeUpdatableStatuses: string[] = [
   CourseBookingStatus.EXPIRED,
   CourseBookingStatus.PENDING,
   CourseBookingStatus.RESCHEDULE,
   CourseBookingStatus.APPROVED,
];

/* ---------------------------------------------------------------------------------------------- */

// function toCreateTenancy() {
//    return `/app/teacher/registered-classes/create?bookingId=${bookingId}`;
// }

/* ---------------------------------------------------------------------------------------------- */
/*
 * Path: /app/teacher/booking/[bookingId]
 * Description: View single visit details
 */

useAppTitle('Booking details');

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <TeacherLayout>
      <FullContainer v-if="apiBooking.booking">
         <!-- region: Class details -->
         <section class="mb-10">
            <!-- region: header -->
            <header class="mb-5">
               <div class="flex flex-col items-center justify-between lg:flex-row">
                  <Heading2>Class details</Heading2>

                  <UButton
                     variant="soft"
                     icon="i-fluent:share-24-regular"
                     :to="`/app/teacher/courses/${apiBooking.booking.courseListing.courseId}`"
                  >
                     View Class
                  </UButton>
               </div>
            </header>
            <!-- endregion: header -->

            <!-- region: property card -->
            <div>
               <CourseInfoCard :course="apiBooking.booking.courseListing.course" />
            </div>
            <!-- endregion: property card -->
         </section>
         <!-- endregion: property details -->

         <!-- region: visit details -->
         <section>
            <header class="mb-5 flex flex-col items-center justify-between lg:flex-row">
               <div class="flex items-center justify-between">
                  <Heading2>Class booking details</Heading2>
               </div>

               <div class="flex items-center gap-3">
                  <template v-if="!apiBooking.booking.archived">
                     <TeacherBookingApprove
                        :booking="apiBooking.booking"
                        @update="updateBooking()"
                     />

                     <TeacherBookingCancel
                        :booking="apiBooking.booking"
                        @update="updateBooking()"
                     />

                     <TeacherBookingComplete
                        :booking="apiBooking.booking"
                        @update="updateBooking()"
                     />
                  </template>

                  <TeacherBookingArchived
                     :booking="apiBooking.booking"
                     @update="updateBooking()"
                  />
               </div>
            </header>

            <!-- region: student details -->
            <SingleBookingHeader :booking="apiBooking.booking" />
            <!-- endregion: student details -->

            <!-- region: tenancy process -->
            <section
               v-if="
                  apiBooking.booking.status === CourseBookingStatus.COMPLETED
                     && !apiBooking.booking.archived
               "
               class="mt-5 flex justify-center"
            >
               <UButton :icon="iconLibrary.tenancy.tenancy">
                  Register Class
               </UButton>
            </section>
            <!-- endregion: tenancy process -->

            <!-- region: update visit date-time details -->
            <section
               v-if=" dateTimeUpdatableStatuses.includes(String(apiBooking.booking.status)) "
               class="mt-5 flex w-full justify-center"
            >
               <div class="text-center">
                  <p class="mb-1 text-xs text-second-400">
                     You can update the date and time
                  </p>

                  <TeacherBookingUpdateDateTime
                     :booking="apiBooking.booking"
                     @update="apiBooking.execute()"
                  />
               </div>
            </section>
            <!-- region: update booking date-time details -->

            <!-- region: booking messages -->
            <div class="mt-10">
               <CourseBookingMessages
                  ref="bookingMessagesRef"
                  sender-type="STUDENT"
                  :booking="apiBooking.booking"
               />
            </div>
            <!-- endregion: visit messages -->
         </section>
      <!-- endregion: visit details -->
      </FullContainer>
   </TeacherLayout>
</template>

<style scoped lang="postcss"></style>
