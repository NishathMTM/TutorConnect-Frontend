import { z } from 'zod';

/* ---------------------------------------------------------------------------------------------- */

export enum CourseBookingMessageTagEnum {
   PENDING = 'PENDING',
   APPROVED = 'APPROVED',
   COMPLETED = 'COMPLETED',
   CANCELLED_BY_USER = 'CANCELLED_BY_USER',
   CANCELLED_BY_TEACHER = 'CANCELLED_BY_TEACHER',
   RESCHEDULE_REQUESTED = 'RESCHEDULE_REQUESTED',
   ARCHIVED = 'ARCHIVED',
   EMPTY = '',
}

export const CourseBookingMessageSchema = z.object({
   id: z.number(),
   bookingId: z.number(),
   senderId: z.number(),
   sender: z.enum(['TEACHER', 'STUDENT']),
   message: z.string(),
   createdAt: z.string(),
   tag: z.union([z.enum([
      'PENDING',
      'APPROVED',
      'COMPLETED',
      'EXPIRED',
      'CANCELLED_BY_USER',
      'CANCELLED_BY_TEACHER',
      'RESCHEDULE_REQUESTED',
      'ARCHIVED',
   ]), z.literal('')]),
   user: z.object({
      id: z.number(),
      email: z.string(),
      profile: z.object({
         id: z.number(),
         userId: z.number(),
         fullName: z.string(),
         gender: z.string(),
         dob: z.string(),
         avatarUrl: z.string(),
      }),
   }),
});

export const CourseBookingMessageListSchema = z.array(CourseBookingMessageSchema);

export type CourseBookingMessage = z.infer<typeof CourseBookingMessageSchema>;
