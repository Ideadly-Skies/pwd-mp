'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Mail,
  MapPin,
  Phone,
  User,
  Building,
  UserCheck,
  Edit,
  X,
  Check,
  Camera,
  Lock,
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import instance from '@/utils/axiosinstance';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { errorHandler } from '@/utils/errorHandler';

interface InputWithIconProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: React.ReactNode;
  id: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly: boolean;
}

const OrganizerProfileSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  address: Yup.string().required('Address is required'),
  companyName: Yup.string().required('Company name is required'),
  pic: Yup.string().required('Person in Charge is required'),
});

const PasswordChangeSchema = Yup.object().shape({
  currentPassword: Yup.string().required('Current password is required'),
  newPassword: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('New password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword'), undefined], 'Passwords must match')
    .required('Confirm password is required'),
});

export const OrganizerProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const {
    data: OrganizerProfileData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['getOrganizerProfile'],
    queryFn: async () => {
      const res = await instance.get('/profile/organizer');
      return res.data.data;
    },
  });

  const { mutate: mutateEditOrganizerProfile } = useMutation({
    mutationFn: async (fd: FormData) => {
      return await instance.patch('/profile/organizer', fd);
    },
    onSuccess: (res) => {
      toast.success(res.data.message);
      queryClient.invalidateQueries({
        queryKey: ['getOrganizerProfile'],
      });
      setIsEditing(false);
    },
    onError: (err: any) => {
      errorHandler(err);
    },
  });

  const { mutate: mutateChangeOrganizerPassword } = useMutation({
    mutationFn: async (data: { oldPassword: string; password: string }) => {
      return await instance.patch('/auth/change-password-organizer', data);
    },
    onSuccess: (res) => {
      toast.success(res.data.message);
    },
    onError: (err: any) => {
      errorHandler(err);
    },
  });

  if (isLoading) {
    return <Progress value={33} />;
  }

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
        setProfileImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const InputWithIcon: React.FC<InputWithIconProps> = ({ icon, ...props }) => (
    <div className="relative">
      <Input {...props} className="pl-10" />
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
        {icon}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Organizer Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center mb-6">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage
                src={
                  avatar ||
                  `http://localhost:4700/images/${OrganizerProfileData?.profilePictureUrl}`
                }
                alt="Profile Picture"
              />
              <AvatarFallback className="font-semibold">
                {OrganizerProfileData?.firstName[0]}
                {OrganizerProfileData?.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center space-x-2">
              <p className="text-muted-foreground flex items-center">
                <User className="mr-2 h-4 w-4" />
                {OrganizerProfileData?.username}
              </p>
            </div>
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

          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <Formik
                initialValues={{
                  firstName: OrganizerProfileData?.firstName || '',
                  lastName: OrganizerProfileData?.lastName || '',
                  email: OrganizerProfileData?.email || '',
                  phoneNumber: OrganizerProfileData?.phoneNumber || '',
                  address: OrganizerProfileData?.address || '',
                  companyName: OrganizerProfileData?.companyName || '',
                  pic: OrganizerProfileData?.pic || '',
                }}
                validationSchema={OrganizerProfileSchema}
                onSubmit={(values) => {
                  const fd = new FormData();
                  fd.append('firstName', values.firstName);
                  fd.append('lastName', values.lastName);
                  fd.append('email', values.email);
                  fd.append('phoneNumber', values.phoneNumber);
                  fd.append('address', values.address);
                  fd.append('companyName', values.companyName);
                  fd.append('pic', values.pic);
                  if (profileImage) {
                    fd.append('mainImage', profileImage);
                  } else {
                    fd.append('mainImage', OrganizerProfileData?.profilePictureUrl);
                  }
                  mutateEditOrganizerProfile(fd);
                }}
              >
                {({ setFieldValue, values }) => (
                  <Form>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <InputWithIcon
                          id="firstName"
                          value={values.firstName}
                          onChange={(e) => setFieldValue('firstName', e.target.value)}
                          icon={<User className="h-4 w-4" />}
                          readOnly={!isEditing}
                        />
                        <ErrorMessage name="firstName">
                          {(msg) => <div className="text-red-600">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <InputWithIcon
                          id="lastName"
                          value={values.lastName}
                          onChange={(e) => setFieldValue('lastName', e.target.value)}
                          icon={<User className="h-4 w-4" />}
                          readOnly={!isEditing}
                        />
                        <ErrorMessage name="lastName">
                          {(msg) => <div className="text-red-600">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <InputWithIcon
                          id="email"
                          value={values.email}
                          onChange={(e) => setFieldValue('email', e.target.value)}
                          icon={<Mail className="h-4 w-4" />}
                          readOnly={!isEditing}
                        />
                        <ErrorMessage name="email">
                          {(msg) => <div className="text-red-600">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone Number</Label>
                        <InputWithIcon
                          id="phoneNumber"
                          value={values.phoneNumber}
                          onChange={(e) => setFieldValue('phoneNumber', e.target.value)}
                          icon={<Phone className="h-4 w-4" />}
                          readOnly={!isEditing}
                        />
                        <ErrorMessage name="phoneNumber">
                          {(msg) => <div className="text-red-600">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="address">Address</Label>
                        <InputWithIcon
                          id="address"
                          value={values.address}
                          onChange={(e) => setFieldValue('address', e.target.value)}
                          icon={<MapPin className="h-4 w-4" />}
                          readOnly={!isEditing}
                        />
                        <ErrorMessage name="address">
                          {(msg) => <div className="text-red-600">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name</Label>
                        <InputWithIcon
                          id="companyName"
                          value={values.companyName}
                          onChange={(e) => setFieldValue('companyName', e.target.value)}
                          icon={<Building className="h-4 w-4" />}
                          readOnly={!isEditing}
                        />
                        <ErrorMessage name="companyName">
                          {(msg) => <div className="text-red-600">{msg}</div>}
                        </ErrorMessage>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pic">Person in Charge</Label>
                        <InputWithIcon
                          id="pic"
                          value={values.pic}
                          onChange={(e) => setFieldValue('pic', e.target.value)}
                          icon={<UserCheck className="h-4 w-4" />}
                          readOnly={!isEditing}
                        />
                        <ErrorMessage name="pic">
                          {(msg) => <div className="text-red-600">{msg}</div>}
                        </ErrorMessage>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-center space-x-2">
                      {isEditing ? (
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="secondary"
                            onClick={() => {
                              setIsEditing(false);
                              setAvatar(null);
                              setProfileImage(null);
                            }}
                          >
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
            </TabsContent>
            <TabsContent value="password">
              <Formik
                initialValues={{
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: '',
                }}
                validationSchema={PasswordChangeSchema}
                onSubmit={(values, { resetForm }) => {
                  mutateChangeOrganizerPassword({
                    oldPassword: values.currentPassword,
                    password: values.newPassword,
                  });
                  resetForm();
                }}
              >
                {({ errors, touched }) => (
                  <Form className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Field
                        as={Input}
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        placeholder="Enter your current password"
                      />
                      <ErrorMessage name="currentPassword" component="div" className="text-red-600 text-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Field
                        as={Input}
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        placeholder="Enter your new password"
                      />
                      <ErrorMessage name="newPassword" component="div" className="text-red-600 text-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Field
                        as={Input}
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your new password"
                      />
                      <ErrorMessage name="confirmPassword" component="div" className="text-red-600 text-sm" />
                    </div>
                    <Button type="submit" className="w-full">
                      <Lock className="h-4 w-4 mr-2" /> Change Password
                    </Button>
                  </Form>
                )}
              </Formik>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
export default OrganizerProfilePage;
