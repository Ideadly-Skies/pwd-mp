'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button, IconButton } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { BadgeCheck, Mail, MapPin, Phone, User, Gift, Edit, X, Check, Upload, Camera } from "lucide-react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import instance from "@/utils/axiosinstance"
import { useState } from "react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null)
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const queryClient = useQueryClient();

  const { data: userProfileData, isLoading, isError } = useQuery({
    queryKey: ['getUserProfile'],
    queryFn: async () => {
      const res = await instance.get('/profile');
      return res.data.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (updatedProfile) => {
      const res = await instance.put('/profile', updatedProfile);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['getUserProfile']);
      setIsEditing(false);
    },
  });

  if (isLoading) return <Progress value={33} />;
  if (isError) return <h1>Error</h1>;

  const InputWithIcon = ({ icon, ...props }) => {
    return (
      <div className="relative">
        <Input {...props} className="pl-10" />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
          {icon}
        </div>
      </div>
    );
  };

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

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleSaveProfile = () => {
    const updatedProfile = {
      firstName: userProfileData.firstName,
      lastName: userProfileData.lastName,
      email: userProfileData.email,
      phoneNumber: userProfileData.phoneNumber,
      address: userProfileData.address,
    };
    mutation.mutate(updatedProfile);
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center mb-6">
            <Avatar className="w-24 h-24 mb-4">
              <AvatarImage src={`http://localhost:4700/images/${userProfileData.profilePictureUrl}`} alt={`${userProfileData.firstName} ${userProfileData.lastName}`} />
              <AvatarFallback>{userProfileData.firstName}{userProfileData.lastName}</AvatarFallback>
            </Avatar>
            <div className="flex items-center space-x-2">
              <p className="text-muted-foreground flex items-center">
                <User className="mr-2 h-4 w-4" />
                {userProfileData.username}
              </p>
            </div>
            {userProfileData.isValid && (
              <div className="flex items-center text-green-600 mt-2">
                <BadgeCheck className="mr-2 h-5 w-5" />
                Verified User
              </div>
            )}
            {isEditing ? (
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
            ): (
                <></>
            )}
          </div>

          {isEditing ? (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={userProfileData.firstName}
                  onChange={(e) => (userProfileData.firstName = e.target.value)}
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={userProfileData.lastName}
                  onChange={(e) => (userProfileData.lastName = e.target.value)}
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <InputWithIcon
                  id="email"
                  value={userProfileData.email}
                  onChange={(e) => (userProfileData.email = e.target.value)}
                  className="bg-muted"
                  icon={<Mail className="h-4 w-4" />}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <InputWithIcon
                  id="phone"
                  value={userProfileData.phoneNumber}
                  onChange={(e) => (userProfileData.phoneNumber = e.target.value)}
                  className="bg-muted"
                  icon={<Phone className="h-4 w-4" />}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <InputWithIcon
                  id="address"
                  value={userProfileData.address}
                  onChange={(e) => (userProfileData.address = e.target.value)}
                  className="bg-muted"
                  icon={<MapPin className="h-4 w-4" />}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="referral">Referral Code</Label>
                <InputWithIcon
                  id="referral"
                  value={userProfileData.referralCode}
                  readOnly
                  className="bg-muted"
                  icon={<Gift className="h-4 w-4" />}
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <InputWithIcon id="email" value={userProfileData.email} readOnly className="bg-muted" icon={<Mail className="h-4 w-4" />} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <InputWithIcon id="phone" value={userProfileData.phoneNumber} readOnly className="bg-muted" icon={<Phone className="h-4 w-4" />} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <InputWithIcon id="address" value={userProfileData.address} readOnly className="bg-muted" icon={<MapPin className="h-4 w-4" />} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="referral">Referral Code</Label>
                <InputWithIcon id="referral" value={userProfileData.referralCode} readOnly className="bg-muted" icon={<Gift className="h-4 w-4" />} />
              </div>
            </div>
          )}

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
                <Button variant="secondary" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 mr-2" /> Cancel
                </Button>
                <Button onClick={handleSaveProfile}>
                  <Check className="h-4 w-4 mr-2" /> Save
                </Button>
              </div>
            ) : (
              <Button onClick={handleEditProfile}>
                <Edit className="h-4 w-4 mr-2" /> Edit Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}