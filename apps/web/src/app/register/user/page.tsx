'use client';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import instance from '@/utils/axiosinstance';
import { toast } from 'react-toastify';

const RegisterSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  confirmEmail: Yup.string()
    .oneOf([Yup.ref('email'), ''], 'Emails must match')
    .required('Required'),
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  username: Yup.string().required('Required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Required')
});

export default function RegisterUserPage() {
    const router = useRouter()

   const{mutate: mutateRegisterUser } = useMutation({
        mutationFn: async({email, username, firstName, lastName, password}:any) => {
            return await instance.post('/auth/register', {
                email,
                username,
                firstName,
                lastName,
                password
            })
        },
        onSuccess: (res) => {
            console.log(res.data.data)
            toast.success(res.data.message)
            setTimeout(() => {
                router.push('/login/user')
            },1000)
        },
        onError: (err) => {
            console.log(err)
            toast.error('Something went wrong')
        } 
    })

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-center text-black mb-4">Create an account</h1>
      
      <Formik
        initialValues={{
          email: '',
          firstName: '',
          lastName: '',
          username: '',
          password: '',
        }}
        validationSchema={RegisterSchema}
        onSubmit={(values) => {
        //   console.log(values);
          // Submit form data to your API
          mutateRegisterUser({
            email: values.email,
            username: values.username,
            firstName: values.firstName,
            lastName: values.lastName,
            password: values.password
          })
        }}
      >
        {({ isSubmitting }) => (
          <Form className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <Field
                name="email"
                type="email"
                placeholder="Email address"
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-500 hover:border-orange-500"
              />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>
            <div className="mb-4">
              <label htmlFor="confirmEmail" className="block text-sm font-medium text-gray-700">
                Confirm email
              </label>
              <Field
                name="confirmEmail"
                type="email"
                placeholder="Confirm email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-500 hover:border-orange-500"
              />
              <ErrorMessage name="confirmEmail" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <Field
                name="username"
                type="text"
                placeholder="Username"
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-500 hover:border-orange-500"
              />
              <ErrorMessage name="username" component="div" className="text-red-500 text-sm" />
            </div>

            <div className='flex flex-auto'>
                    {/* First Name Field */}
                <div className="mb-4 pr-3 w-1/2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name
                </label>
                <Field
                    name="firstName"
                    type="text"
                    placeholder="First Name"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-500 hover:border-orange-500"
                />
                <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Last Name Field */}
                <div className="mb-4 pl-3 w-1/2">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                </label>
                <Field
                    name="lastName"
                    type="text"
                    placeholder="Last Name"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-500 hover:border-orange-500"
                />
                <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm" />
                </div>
            </div>

            

            {/* Password Field */}
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <Field
                name="password"
                type="password"
                placeholder="Password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-500 hover:border-orange-500"
              />
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg focus:outline-none focus:ring-4 focus:ring-orange-300"
            >
              Create account
            </button>
          </Form>
        )}
      </Formik>

      {/* Link to Log In */}
      <p className="mt-4 text-sm font-semibold text-gray-600">
        Already have an account?{' '}
        <Link href="/login/user" className="text-orange-500 hover:underline">Log in</Link>
      </p>
    </div>
  );
}