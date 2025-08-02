import { z } from 'zod';

/* ---------------------------------------------------------------------------------------------- */

export const UserStatsSchema = z.object({
   total: z.number().int().nonnegative(),
   teachers: z.number().int().nonnegative(),
   students: z.number().int().nonnegative(),
   admins: z.number().int().nonnegative(),
});
export type UserStats = z.infer<typeof UserStatsSchema>;

/* ---------------------------------------------------------------------------------------------- */

export const CourseListingsStatsSchema = z.object({
   total: z.number().int().nonnegative(),
   active: z.number().int().nonnegative(),
   inactive: z.number().int().nonnegative(),
});
export type CourseListingsStats = z.infer<typeof CourseListingsStatsSchema>;

/* ---------------------------------------------------------------------------------------------- */

/* ---------------------------------------------------------------------------------- */
export const AdminTeacherSchema = z.object({
   id: z.number().int(),
   email: z.string().email(),
   profile: z.object({
      userId: z.number().int(),
      fullName: z.string(),
      phone1: z.string(),
      address: z.string(),
      createdAt: z.string().datetime(),
      gender: z.string(),
      dob: z.string(),

   }),
   profileCreated: z.boolean(),
   isAdmin: z.boolean(),
});

export type AdminTeacher = z.infer<typeof AdminTeacherSchema>;

/* ---------------------------------------------------------------------------------------------- */

export const AdminStudentSchema = z.object({
   id: z.number().int(),
   email: z.string().email(),
   profile: z.object({
      userId: z.number().int(),
      fullName: z.string(),
      phone1: z.string(),
      address: z.string(),
      createdAt: z.string().datetime(),
   }),
   profileCreated: z.boolean(),
   isAdmin: z.boolean(),
});
export type AdminStudent = z.infer<typeof AdminStudentSchema>;

/* ---------------------------------------------------------------------------------------------- */
export const PaginationMetaSchema = z.object({
   total: z.number(),
   perPage: z.number(),
   currentPage: z.number(),
   lastPage: z.number(),
   firstPage: z.number(),
   firstPageUrl: z.string(),
   lastPageUrl: z.string(),
   nextPageUrl: z.string().nullable(),
   previousPageUrl: z.string().nullable(),
});

export const CitySchema = z.object({
   id: z.number(),
   city: z.string(),
});

export const UserProfileSchema = z.object({
   id: z.number(),
   userId: z.number(),
   fullName: z.string(),
   gender: z.string(),
   dob: z.string(),
   address: z.string(),
   avatarUrl: z.string(),
   nic: z.string(),
   phone1: z.string(),
   phone2: z.string().nullable(),
   createdAt: z.string(),
   updatedAt: z.string(),
});

export const UserSchema = z.object({
   id: z.number(),
   email: z.string(),
   role: z.string(),
   createdAt: z.string(),
   updatedAt: z.string(),
   profile: UserProfileSchema,
   profileCreated: z.boolean(),
   isAdmin: z.boolean(),
});

export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;

export type City = z.infer<typeof CitySchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;
export type User = z.infer<typeof UserSchema>;

/* ---------------------------------------------------------------------------------- */
export const MonthlyUserRegistrationSchema = z.object({
   month: z.string(),
   teachers: z.number().int().nonnegative(),
   students: z.number().int().nonnegative(),
   total: z.number().int().nonnegative(),
});

export type MonthlyUserRegistration = z.infer<typeof MonthlyUserRegistrationSchema>;
