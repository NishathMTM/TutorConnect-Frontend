<script setup lang="ts">
import type { CalendarOptions } from '@fullcalendar/core';
import type { BookingFull } from '~~/__backend/course-bookings/types';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/vue3';
import tippy from 'tippy.js';
import { colorsUtils } from '~/utils/colors-utils';
import { formatDateTimeString } from '~/utils/formatting-utils';
import 'tippy.js/dist/tippy.css';

/* ---------------------------------------------------------------------------------------------- */

const { bookings } = defineProps<{
   bookings: BookingFull[];
}>();

/* ---------------------------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------------------------- */

interface CalendarEvent {
   title: string;
   date: string;
   color: string;
   extendedProps: {
      bookingId: number;
   };
}

const calendarOptions: CalendarOptions = reactive({
   plugins: [dayGridPlugin, interactionPlugin],
   initialView: 'dayGridMonth',
   initialDate: todayAsString(),
   headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'today',
   },
   height: 'auto',
   contentHeight: 500, // Reduced height for dashboard
   dayMaxEvents: 5, // Show fewer events before showing "+more"
   eventDisplay: 'block',
   dateClick: (args) => {
      console.log(args);
   },
   eventClick: (args) => {
      const bookingId = args.event.extendedProps.bookingId;
      return navigateTo(`/app/teacher/course-bookings/${bookingId}`);
   },
   events: [],
   eventDidMount: (info) => {
      const booking = bookings.find(v => v.id === info.event.extendedProps.bookingId);

      if (booking) {
         const tooltipContent = `
         <div class="event-tooltip">
            <p><strong>Title:</strong> ${booking.courseListing.title}</p>
            <p><strong>Date:</strong> ${formatDateTimeString(booking.bookingDateTime)}</p>
            <p><strong>Status:</strong> ${booking.status}</p>
         </div>
         `;

         tippy(info.el, {
            content: tooltipContent,
            allowHTML: true,
            placement: 'top',
            interactive: true,
            theme: 'light',
         });
      }
   },
});

watch(
   () => bookings,
   (bookings: BookingFull[]) => {
      const events: CalendarEvent[] = [];

      bookings.forEach((booking) => {
         events.push({
            title: booking.courseListing.title,
            date: booking.bookingDateTime,
            color: getBookingEventColor(booking.status),
            extendedProps: {
               bookingId: booking.id,
            },
         });
      });

      calendarOptions.events = events;
   },
   { deep: true, immediate: true },
);

function getBookingEventColor(status: string) {
   switch (status) {
      case 'PENDING':
         return colorsUtils.booking.pending;
      case 'APPROVED':
         return colorsUtils.booking.approved;
      case 'CANCELLED_BY_USER':
         return colorsUtils.booking.cancelledByUser;
      case 'EXPIRED':
         return colorsUtils.booking.expired;
      case 'CANCELLED_BY_LANDLORD':
         return colorsUtils.booking.cancelledByTeacher;
      case 'ARCHIVED':
         return colorsUtils.booking.archived;
      default: // completed
         return colorsUtils.booking.completed;
   }
}

/* ---------------------------------------------------------------------------------------------- */
</script>

<template>
   <div class="calendar-container">
      <FullCalendar :options="calendarOptions" />
   </div>
</template>

<style scoped lang="postcss">
.calendar-container {
   @apply p-3; /* Reduced padding */
}

:deep(.fc) {
   --fc-small-font-size: 0.8em; /* Smaller font size */
   --fc-page-bg-color: #fff;
   --fc-border-color: #e5e7eb;
   --fc-today-bg-color: #f3f4f6;
   --fc-event-border-radius: 3px;
   --fc-event-padding-y: 1px; /* Reduced padding */
   --fc-event-padding-x: 3px; /* Reduced padding */
}

:deep(.fc-header-toolbar) {
   @apply mb-2; /* Reduced margin */
   padding: 0.5rem; /* Added padding */
}

:deep(.fc-toolbar-title) {
   @apply text-base font-semibold; /* Smaller title */
}

:deep(.fc-button) {
   @apply text-xs; /* Smaller buttons */
}

:deep(.fc-day-header) {
   @apply py-1 text-xs; /* Smaller headers */
}

:deep(.fc-daygrid-day) {
   @apply text-xs; /* Smaller day numbers */
}

:deep(.fc-daygrid-event) {
   @apply text-xs; /* Smaller event text */
}
</style>
