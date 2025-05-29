import { z } from 'zod';
import { CourseFeatureSchema } from '~~/__backend/course-features/types';

import { CourseImageSchema, CourseTypeSchema } from '~~/__backend/courses/types';

/* ---------------------------------------------------------------------------------------------- */

export const PublicCourseInfoSchema = z.object({
   id: z.number(),
   ownerId: z.number(),
   courseTypeId: z.number(),
   description: z.string(),
   courseType: CourseTypeSchema,
   courseFeature: z.array(CourseFeatureSchema).default([]),
   courseImages: z.array(CourseImageSchema).default([]),
   primaryImage: CourseImageSchema.nullable(),
   user: z.object({
      id: z.number(),
      email: z.string().email(),
      profile: z.object({
         fullName: z.string(),
         avatarUrl: z.string(),
      }),
   }),
   courseCategory: z.object({
      id: z.number(),
      courseCategory: z.string(),
   }),
});

export const PublicCourseListingSchema = z.object({
   id: z.number(),
   courseId: z.number(),
   title: z.string(),
   description: z.string().nullable(),
   listingDate: z.string().date(),
   availableFrom: z.string().date(),
   hourlyRate: z.number(),
   course: PublicCourseInfoSchema,
});

export const PublicCourseListingListSchema = z.array(PublicCourseListingSchema);

export type PublicCourseListing = z.infer<typeof PublicCourseListingSchema>;
export type PublicCourseInfo = z.infer<typeof PublicCourseInfoSchema>;
