import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BadgeCheck, Edit } from 'lucide-react'
import { UserProfileData } from '@/types/profile'

interface ProfileViewProps {
  userProfileData: UserProfileData | undefined
  isEditing: boolean
  setIsEditing: (isEditing: boolean) => void
  handleAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  avatar: string | null
  mutateRequestVerifyAccount: () => void
  mutateEditUserProfile: (data: FormData) => void
  profileImage: File | null
}

export default function ProfileView({
  userProfileData,
  isEditing,
  setIsEditing,
  handleAvatarChange,
  avatar,
  mutateRequestVerifyAccount,
  mutateEditUserProfile,
  profileImage
}: ProfileViewProps) {
  const ProfileSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
  })

  return (
    <div className="space-y-6">
      {/* Verification Status */}
      {userProfileData?.isValid ? (
        <div className="flex items-center gap-2 text-green-600 mb-4">
          <BadgeCheck className="h-5 w-5" />
          <span>Verified User</span>
        </div>
      ) : (
        <Button onClick={mutateRequestVerifyAccount} variant="outline" className="mb-4">
          Verify Account
        </Button>
      )}

      <Formik
        initialValues={{
          firstName: userProfileData?.firstName || '',
          lastName: userProfileData?.lastName || '',
          email: userProfileData?.email || '',
          phoneNumber: userProfileData?.phoneNumber || '',
          address: userProfileData?.address || '',
        }}
        validationSchema={ProfileSchema}
        onSubmit={(values) => {
          const fd = new FormData()
          fd.append('firstName', values.firstName)
          fd.append('lastName', values.lastName)
          fd.append('email', values.email)
          fd.append('phoneNumber', values.phoneNumber)
          fd.append('address', values.address)
          if (profileImage) {
            fd.append('images', profileImage)
          }
          mutateEditUserProfile(fd)
        }}
      >
        {({ errors, touched, values, handleChange }) => (
          <Form className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={values.firstName}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className="w-full"
                  />
                  {errors.firstName && touched.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={values.lastName}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className="w-full"
                  />
                  {errors.lastName && touched.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className="w-full"
                  />
                  {errors.email && touched.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={values.phoneNumber}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className="w-full"
                  />
                  {errors.phoneNumber && touched.phoneNumber && (
                    <p className="text-sm text-red-500">{errors.phoneNumber}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  readOnly={!isEditing}
                  className="w-full"
                />
                {errors.address && touched.address && (
                  <p className="text-sm text-red-500">{errors.address}</p>
                )}
              </div>
            </div>

            <div className="flex justify-center">
              {isEditing ? (
                <Button type="submit" className="min-w-[200px]">
                  Save Changes
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="min-w-[200px]"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}