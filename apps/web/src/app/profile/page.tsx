'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { BadgeCheck, Mail, MapPin, Phone, User, Gift, Edit, X, Check, Camera, ShieldCheck } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import instance from "@/utils/axiosinstance";
import { useState } from "react";
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from "react-toastify";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const { data: userProfileData, isLoading, isError } = useQuery({
    queryKey: ['getUserProfile'],
    queryFn: async () => {
      const res = await instance.get('/profile');
      return res.data.data;
    },
  });

  const { mutate: mutateEditUserProfile } = useMutation({
    mutationFn: async (fd) => {
    return await instance.put('/profile', fd);
    },
    onSuccess: (res) => {
      console.log("Success response:", res.data.data);
      toast.success(res.data.message);
      queryClient.invalidateQueries(['getUserProfile']);
      setIsEditing(false);
    },
    onError: (err) => {
      console.error("onError handler:", err); // Detailed error for further insights
      toast.error(err.message);
    },
  });

  const ProfileSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
  });

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
      setProfileImage(file); // Set the file to be sent in FormData
    }
  };

  const InputWithIcon = ({ icon, ...props }) => (
    <div className="relative">
      <Input {...props} className="pl-10" />
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
        {icon}
      </div>
    </div>
  );

  if (isLoading) return <Progress value={33} />;
  if (isError) return <h1>Error</h1>;

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center mb-6">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={avatar || `http://localhost:4700/images/${userProfileData.profilePictureUrl}`} alt="Profile Picture" />
              <AvatarFallback>{userProfileData.firstName}{userProfileData.lastName}</AvatarFallback>
            </Avatar>
            <div className="flex items-center space-x-2">
              <p className="text-muted-foreground flex items-center">
                <User className="mr-2 h-4 w-4" />
                {userProfileData.username}
              </p>
            </div>
            {userProfileData.isValid ? (
              <div className="flex items-center text-green-600 mt-2">
                <BadgeCheck className="mr-2 h-5 w-5" />
                Verified User
              </div>
            ) : (
              <Button variant="outline" onClick={() => mutateVerifyAccount()} className="mt-4">
                <ShieldCheck className="h-4 w-4 mr-2" /> Verify Account
              </Button>
            )}
            {isEditing && (
              <div className="relative pt-5">
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
            )}
          </div>

          <Formik
            initialValues={{
              firstName: userProfileData.firstName,
              lastName: userProfileData.lastName,
              email: userProfileData.email,
              phoneNumber: userProfileData.phoneNumber,
              address: userProfileData.address,
            }}
            validationSchema={ProfileSchema}
            onSubmit={(values) => {
              const fd = new FormData();
              fd.append('firstName', values.firstName);
              fd.append('lastName', values.lastName);
              fd.append('email', values.email);
              fd.append('phoneNumber', values.phoneNumber);
              fd.append('address', values.address);
              if (profileImage) {
                fd.append('images', profileImage);
              }
              mutateEditUserProfile(fd);
              console.log(values)
            }}
          >
            {({ errors, touched, handleChange, values, setFieldValue }) => (
              <Form>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <InputWithIcon
                      id="firstName"
                      value={values.firstName}
                      onChange={(e) => setFieldValue("firstName", e.target.value)}
                      icon={<User className="h-4 w-4" />}
                    />
                    {errors.firstName && touched.firstName && <div className="text-red-600">{errors.firstName}</div>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <InputWithIcon
                      id="lastName"
                      value={values.lastName}
                      onChange={(e) => setFieldValue("lastName", e.target.value)}
                      icon={<User className="h-4 w-4" />}
                    />
                    {errors.lastName && touched.lastName && <div className="text-red-600">{errors.lastName}</div>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <InputWithIcon
                      id="email"
                      value={values.email}
                      onChange={(e) => setFieldValue("email", e.target.value)}
                      icon={<Mail className="h-4 w-4" />}
                    />
                    {errors.email && touched.email && <div className="text-red-600">{errors.email}</div>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <InputWithIcon
                      id="phoneNumber"
                      value={values.phoneNumber}
                      onChange={(e) => setFieldValue("phoneNumber", e.target.value)}
                      icon={<Phone className="h-4 w-4" />}
                    />
                    {errors.phoneNumber && touched.phoneNumber && <div className="text-red-600">{errors.phoneNumber}</div>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <InputWithIcon
                      id="address"
                      value={values.address}
                      onChange={(e) => setFieldValue("address", e.target.value)}
                      icon={<MapPin className="h-4 w-4" />}
                    />
                    {errors.address && touched.address && <div className="text-red-600">{errors.address}</div>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referral">Referral Code</Label>
                    <InputWithIcon id="referral" value={userProfileData.referralCode} readOnly icon={<Gift className="h-4 w-4" />} />
                  </div>
                </div>

                <div className="mt-6 space-y-2">
                  <Label>Role</Label>
                  <p className="text-sm font-medium">{userProfileData.role}</p>
                </div>

                <div className="mt-6 space-y-2">
                  <Label>Total Points</Label>
                  <p className="text-sm font-medium">{userProfileData.totalPoint}</p>
                </div>

                <div className="mt-8 flex justify-center space-x-2">
                  {isEditing ? (
                    <div className="flex justify-end space-x-2">
                      <Button variant="secondary" onClick={() => setIsEditing(false)}>
                        <X className="h-4 w-4 mr-2" /> Cancel
                      </Button>
                      <Button type="submit">
                        <Check className="h-4 w-4 mr-2" /> Save
                      </Button>
                    </div>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4 mr-2" /> Edit Profile
                    </Button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
}