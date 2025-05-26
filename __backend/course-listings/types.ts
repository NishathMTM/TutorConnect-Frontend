import { z } from 'zod';

/* ---------------------------------------------------------------------------------------------- */

export const CourseListingSchema = z.object({
   id: z.number(),
   courseId: z.number(),
   teacherId: z.number(),
   title: z.string(),
   description: z.string().nullable(),
   listingDate: z.string().date(),
   availableFrom: z.string().date(),
   hourlyRate: z.coerce.number(),
   status: z.enum(['ACTIVE', 'INACTIVE']),
   contactPhone: z.string(),
   contactAddress: z.string(),
   contactEmail: z.string(),

});

export const CourseListingListSchema = z.array(CourseListingSchema);

export type CourseListing = z.infer<typeof CourseListingSchema>;
