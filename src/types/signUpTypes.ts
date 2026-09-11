import { Session } from 'next-auth';

export type MobileRegistrationValues = {
  phone: string;
  otp: string;
  password: string;
};

export type EmailRegistrationValues = {
  email: string;
  password: string;
};

export type GeneralInfoValues = {
  firstName: string;
  middleName?:string;
  lastName: string;
  gender: string; //Add gender
  password: string;
  confirmPassword?: string;
  isAgreed?: boolean;
};

export type SignupValues = GeneralInfoValues & {
  email: string | undefined;
  userId: string | undefined;
};
export interface CustomUser extends Session {
  user: {
    userId?: string | null;
    accessToken?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}
