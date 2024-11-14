import { useState } from 'react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InputWithIcon } from '@/components/ui/input-with-icon'
import { Mail, Lock } from 'lucide-react'

interface SecurityViewProps {
  email: string
  mutateChangeEmail: (data: { email: string; currentPassword: string }) => void
  mutateChangePassword: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) => void
}

const SecurityView: React.FC<SecurityViewProps> = ({
  email,
  mutateChangeEmail,
  mutateChangePassword,
}) => {
  const [activeTab, setActiveTab] = useState('email')

  const EmailSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    currentPassword: Yup.string()
      .required('Current password is required'),
  })

  const PasswordSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .required('Current password is required'),
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'Passwords must match')
      .required('Password confirmation is required'),
  })

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Security Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Change Email</TabsTrigger>
            <TabsTrigger value="password">Change Password</TabsTrigger>
          </TabsList>
          <TabsContent value="email" className="space-y-4 mt-4">
            <Formik
              initialValues={{
                email: email,
                currentPassword: '',
              }}
              validationSchema={EmailSchema}
              onSubmit={(values) => {
                mutateChangeEmail(values)
              }}
            >
              {({ errors, touched, values, handleChange }) => (
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">New Email Address</Label>
                    <InputWithIcon
                      id="email"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      icon={<Mail className="h-4 w-4" />}
                    />
                    {errors.email && touched.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <InputWithIcon
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={values.currentPassword}
                      onChange={handleChange}
                      icon={<Lock className="h-4 w-4" />}
                    />
                    {errors.currentPassword && touched.currentPassword && (
                      <p className="text-sm text-red-500">{errors.currentPassword}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full">
                    Update Email
                  </Button>
                </Form>
              )}
            </Formik>
          </TabsContent>
          <TabsContent value="password" className="space-y-4 mt-4">
            <Formik
              initialValues={{
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
              }}
              validationSchema={PasswordSchema}
              onSubmit={(values) => {
                mutateChangePassword(values)
              }}
            >
              {({ errors, touched, values, handleChange }) => (
                <Form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <InputWithIcon
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={values.currentPassword}
                      onChange={handleChange}
                      icon={<Lock className="h-4 w-4" />}
                    />
                    {errors.currentPassword && touched.currentPassword && (
                      <p className="text-sm text-red-500">{errors.currentPassword}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <InputWithIcon
                      id="newPassword"
                      name="newPassword"
                      type="password"
                      value={values.newPassword}
                      onChange={handleChange}
                      icon={<Lock className="h-4 w-4" />}
                    />
                    {errors.newPassword && touched.newPassword && (
                      <p className="text-sm text-red-500">{errors.newPassword}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <InputWithIcon
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      icon={<Lock className="h-4 w-4" />}
                    />
                    {errors.confirmPassword && touched.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>
                  <Button type="submit" className="w-full">
                    Update Password
                  </Button>
                </Form>
              )}
            </Formik>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default SecurityView