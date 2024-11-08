'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useMutation } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera } from "lucide-react"
import authStore from '@/zustand/authStore'
import instance from '@/utils/axiosinstance'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'

const ProfileSchema = Yup.object().shape({
  address: Yup.string().required('Address is required').min(5, 'Address is too short'),
  phoneNumber: Yup.string().required('Phone number is required')
    
});


export default function UserProfilePage() {
  const [avatar, setAvatar] = useState<string | null>(null)
  const [profileImage, setProfileImage] = useState<File | null>(null)

  const firstName = authStore((state) => state.firstName)
  const lastName = authStore((state) => state.lastName)
  const email = authStore((state) => state.email)

  const {mutate: mutateCompleteForm} = useMutation({
        mutationFn: async(fd) => {
          return await instance.post('/profile',fd)
        },
        onSuccess: (res) => {
          console.log(res.data.data)
          toast.success(res.data.message)
        },
        onError: (err) => {
          console.log(err)
          toast.error(err.message)
        } 
      })

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(file)
        setAvatar(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Complete your Profile</CardTitle>
        </CardHeader>
        <CardContent>
        <Formik
            initialValues={{
              address: '',
              phoneNumber: ''
            }}

            validationSchema={ProfileSchema}

            onSubmit={(values) => {
              // mutateCompleteForm({phoneNumber: values.phoneNumber,address: values.address})
              const fd = new FormData()
              fd.append('phoneNumber', values.phoneNumber)
              fd.append('address', values.address)
              fd.append('images', profileImage!)
              console.log(avatar)
              mutateCompleteForm(fd)
              console.log(values)
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={avatar || '/placeholder.svg'} alt="Profile picture" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="relative">
                    <Input
                      type="file"
                      id="avatar-upload"
                      className="sr-only"
                      accept="image/*"
                      onChange={handleAvatarChange}
                    />
                    <Label
                      htmlFor="avatar-upload"
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-primary-foreground rounded-md cursor-pointer hover:bg-orange-500/90"
                    >
                      <Camera className="w-4 h-4" />
                      Upload Profile Photo
                    </Label>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" placeholder={firstName} value={firstName} disabled/>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" placeholder={lastName} value={lastName} disabled/>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder={email} value={email} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Field
                      name="address"
                      as={Input}
                      id="address"
                      type="text"
                      placeholder="Enter your address"
                      
                    />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Field
                      name="phoneNumber"
                      as={Input}
                      id="phoneNumber"
                      type="text"
                      placeholder="Enter your phone number"
                      
                    />
                    <ErrorMessage
                      name="phoneNumber"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-orange-500 hover:bg-orange-500/90"
                >
                  Submit
                </Button>

              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  )
}