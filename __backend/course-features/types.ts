import { z } from 'zod';

/* ---------------------------------------------------------------------------------------------- */

export const CourseFeatureSchema = z.object({
   id: z.number(),
   feature: z.string(),
   icon: z.string().nullable(),
});

export const CourseFeatureListSchema = z.array(CourseFeatureSchema);

export type CourseFeature = z.infer<typeof CourseFeatureSchema>;
