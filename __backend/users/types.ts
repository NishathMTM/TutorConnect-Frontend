import { z } from 'zod';

export const UserProfileSchema = z.object({
   fullName: z.string(),
   gender: z.enum(['MALE', 'FEMALE']),
   dob: z.string(),
   address: z.string(),
   avatarUrl: z.string(),
   nic: z.string(),
   phone1: z.string(),
   phone2: z.string().nullable(),
});

export const UserSchema = z.object({
   id: z.number(),
   email: z.string().email(),
   role: z.enum(['STUDENT', 'TEACHER', 'ADMIN']),
   profileCreated: z.coerce.boolean(),
   profile: UserProfileSchema.nullable(),
});

/* ---------------------------------------------------------------------------------------------- */

export interface Profile {
   fullName: string;
   gender: string;
   dob: string;
   address: string;
   avatarUrl: string;
   nic: string;
   phone1: string;
   phone2: string;
}

export interface UserX {
   id: number;
   email: string;
   role: 'STUDENT' | 'TEACHER' | 'ADMIN';
   profileCreated: boolean;
   profile: Profile | null;
}

export interface UserSession {
   token: string;
   user: UserX;
}

/* ---------------------------------------------------------------------------------------------- */

export interface LoginResponse {
   token: {
      token: string;
   };
   user: UserX;
}
