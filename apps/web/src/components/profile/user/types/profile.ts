export interface IUserProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  profilePictureUrl: string;
  username: string;
  isValid: boolean;
  referralCode: string;
  role: string;
  totalPoint: number;
}

export interface InputWithIconProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  id: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly: boolean;
}
