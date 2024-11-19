export interface UserProfileData {
    firstName: string
    lastName: string
    email: string
    phoneNumber: string
    address: string
    username: string
    isValid: boolean
    profilePictureUrl: string
    referralCode: string
    totalPoint: number
    role: string
  }
  
  export interface InputWithIconProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon: React.ReactNode
  }