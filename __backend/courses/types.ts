import { z } from 'zod';
import { CourseFeatureSchema } from '~~/__backend/course-features/types';
import { UserSchema } from '~~/__backend/users/types';

/* ---------------------------------------------------------------------------------------------- */

export const CourseTypeSchema = z.object({
   id: z.number(),
   courseType: z.string(),

});

export const CourseCategorySchema = z.object({
   id: z.number(),
   courseCategory: z.string(),
});

export const CourseTypeListSchema = z.array(CourseTypeSchema);

export const CourseImageSchema = z.object({
   id: z.number(),
   courseId: z.number(),
   isPrimary: z.coerce.boolean(),
   imageUrlKey: z.string(),
   imageUrl: z.string(),
});

export const CourseSchema = z.object({
   id: z.number(),
   ownerId: z.number(),
   courseTypeId: z.number(),
   courseCategoryId: z.number(),
   description: z.string().nullable(),
   courseType: CourseTypeSchema,
   courseFeatures: z.array(CourseFeatureSchema),
   courseImages: z.array(CourseImageSchema),
   primaryImage: CourseImageSchema.nullable(),
   user: UserSchema.optional(),
   courseCategory: CourseCategorySchema,
});

export const CourseListSchema = z.array(CourseSchema);

export type Course = z.infer<typeof CourseSchema>;
export type CourseType = z.infer<typeof CourseTypeSchema>;

export type CourseImage = z.infer<typeof CourseImageSchema>;

export type CourseCategory = z.infer<typeof CourseCategorySchema>;
