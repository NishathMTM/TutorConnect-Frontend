import { z } from 'zod';
import { CourseSchema } from '~~/__backend/courses/types';
import { UserProfileSchema } from '~~/__backend/users/types';

/* ---------------------------------------------------------------------------------------------- */

export enum CourseBookingStatus {
   PENDING = 'PENDING',
   APPROVED = 'APPROVED',
   COMPLETED = 'COMPLETED',
   CANCELLED_BY_USER = 'CANCELLED_BY_USER',
   CANCELLED_BY_TEACHER = 'CANCELLED_BY_TEACHER',
   EXPIRED = 'EXPIRED',
   ALL = 'ALL',
   ARCHIVED = 'ARCHIVED',
   RESCHEDULE = 'RESCHEDULE_REQUESTED',
}

export type CourseStatus =
   | 'PENDING'
   | 'APPROVED'
   | 'COMPLETED'
   | 'EXPIRED'
   | 'CANCELLED_BY_USER'
   | 'CANCELLED_BY_TEACHER'
   | 'RESCHEDULE_REQUESTED'
   | 'ARCHIVED'
   | 'CLASS_CREATED';

/* ---------------------------------------------------------------------------------------------- */

export const BookingSchema = z.object({
   id: z.number(),
   listingId: z.number(),
   studentId: z.number(),
   bookingDateTime: z.string(),
   bookingRemarks: z.string(),
   archived: z.coerce.boolean(),
   status: z.enum([
      'PENDING',
      'APPROVED',
      'COMPLETED',
      'EXPIRED',
      'CANCELLED_BY_USER',
      'CANCELLED_BY_TEACHER',
      'RESCHEDULE_REQUESTED',
      'ARCHIVED',
      'CLASS_CREATED',
   ]),
});

export const BookingListSchema = z.array(BookingSchema);

export type Booking = z.infer<typeof BookingSchema>;

/* ---------------------------------------------------------------------------------------------- */

export const BookingFullSchema = z.object({
   id: z.number(),
   listingId: z.number(),
   studentId: z.number(),
   bookingDateTime: z.string(),
   bookingRemarks: z.string(),
   archived: z.coerce.boolean(),
   status: z.enum([
      'PENDING',
      'APPROVED',
      'COMPLETED',
      'EXPIRED',
      'CANCELLED_BY_USER',
      'CANCELLED_BY_TEACHER',
      'RESCHEDULE_REQUESTED',
      'ARCHIVED',
      'CLASS_CREATED',
   ]),
   student: z.object({
      id: z.number(),
      email: z.string().email(),
      profile: UserProfileSchema,
   }),
   courseListing: z.object({
      id: z.number(),
      courseId: z.number(),
      teacherId: z.number(),
      title: z.string(),
      description: z.string(),
      listingDate: z.string().date(),
      availableFrom: z.string().date(),
      hourlyRate: z.coerce.number(),
      status: z.enum(['ACTIVE', 'INACTIVE']),
      contactPhone: z.string(),
      contactAddress: z.string(),
      contactEmail: z.string().email(),
      course: CourseSchema,
   }),
});

export const BookingFullListSchema = z.array(BookingFullSchema);

export type BookingFull = z.infer<typeof BookingFullSchema>;
