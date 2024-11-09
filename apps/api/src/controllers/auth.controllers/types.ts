export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
    referralCode?: string; // Make this optional
    phoneNumber: string | null;
    role: string;
    address: string | null;
    profilePictureUrl?: string | null; // Make this optional
    totalPoint: number;
    resetPasswordToken?: string | null; // Make this optional
    isValid: boolean;
  }