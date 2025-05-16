declare module '#auth-utils' {
   interface Profile {
      fullName: string;
      gender: string;
      dob: string;
      address: string;
      avatarUrl: string;
      nic: string;
      phone1: string;
      phone2: string;
   }

   interface User {
      id: number;
      email: string;
      role: 'STUDENT' | 'TEACHER' | 'ADMIN';
      profileCreated: boolean;
      profile: Profile | null;
      isAdmin: boolean;
   }

   interface UserSession {
      token: string;
      user: User;
   }
}

export {};
