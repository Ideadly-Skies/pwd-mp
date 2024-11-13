'use client';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import instance from '@/utils/axiosinstance';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { errorHandler } from '@/utils/errorHandler';

const RegisterSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  username: Yup.string().required('Username is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  companyName: Yup.string().required('Company name is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  pic: Yup.string().required('Person in Charge is required'),
});

export default function RegisterOrganizerPage() {
    const router = useRouter()

    const{mutate: mutateRegisterOrganizer} = useMutation({
            mutationFn: async({firstName, lastName,email,username,password,companyName,phoneNumber,pic}: any) => {
                return await instance.post('/auth/register-organizer',{
                    firstName,
                    lastName,
                    email,
                    username,
                    password,
                    companyName,
                    phoneNumber,
                    pic
                })
            },
            onSuccess: (res) => {
                console.log(res.data.data)
                toast.success(res.data.message)
                setTimeout(() => {
                    router.push('/login/organizer')
                },1000)
                
            },
            onError: (err) => {
                console.log(err)
                errorHandler(err)
            }
        })

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-center text-black mb-4">Create an account</h1>    
      <Formik
        initialValues={{
          firstName: '',
          lastName: '',
          email: '',
          username: '',
          password: '',
          companyName: '',
          phoneNumber: '',
          pic: '',
        }}
        validationSchema={RegisterSchema}
        onSubmit={(values) => {
          console.log(values);
          // Submit form data to your API
          mutateRegisterOrganizer({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            username: values.username,
            password: values.password,
            companyName: values.companyName,
            phoneNumber: values.phoneNumber,
            pic: values.pic
          })
        }}
      >
        {({ isSubmitting, setFieldValue }) => (
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

            <div className='flex'>
                {/* First Name Field */}
            <div className="mb-4 pr-3">
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
            <div className="mb-4 pl-3">
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

            {/* Username Field */}
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
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

            {/* Company Name Field */}
            <div className="mb-4">
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <Field
                name="companyName"
                type="text"
                placeholder="Company Name"
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-500 hover:border-orange-500"
              />
              <ErrorMessage name="companyName" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Phone Number Field */}
            <div className="mb-4">
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <Field
                name="phoneNumber"
                type="text"
                placeholder="Phone Number"
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-500 hover:border-orange-500"
              />
              <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm" />
            </div>

            {/* Profile Picture Field */}
            <div className="mb-4">
              <label htmlFor="pic" className="block text-sm font-medium text-gray-700">
                Person In Charge
              </label>
              <Field
                name="pic"
                type="text"
                placeholder='Person in Charge'
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-orange-500 hover:border-orange-500"
              />
              <ErrorMessage name="pic" component="div" className="text-red-500 text-sm" />
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
      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{' '}
        <Link href="/login/organizer" className="text-orange-500 hover:underline">Log in</Link>
      </p>
    </div>
  );
}