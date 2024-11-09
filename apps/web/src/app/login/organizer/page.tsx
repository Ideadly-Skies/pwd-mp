'use client';
import { FC } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation'
import authStore from '@/zustand/authStore';
import instance from '@/utils/axiosinstance';
import { toast } from 'react-toastify';

const LoginOrganizerSchema = Yup.object({
  emailOrUsername: Yup.string().required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});
const OrganizerLoginForm: FC = () => {
  const router = useRouter()
  const setAuth = authStore((state: any) => state.setAuth)

      const{mutate: mutateLoginOrganizer} = useMutation({
        mutationFn: async({emailOrUsername, password}: any) => {
          return await instance.post('/auth/login-organizer',{
            emailOrUsername,
            password
          })
        },
        onSuccess: (res) => {
      
          setAuth({
            token: res?.data?.data?.token, 
            firstName: res?.data?.data?.firstName,
            lastName: res?.data?.data?.lastName,
            role: res?.data?.data?.role,
            email: res?.data?.data?.email
          })
          toast.success(res.data.message)
          router.push('/')
        },
        onError: (err) => {
          console.log(err)
          toast.error('something went wrong')
        }
      })
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-md">
        {/* Logo */}
        <div className="flex justify-center">
          {/* Organizer-specific logo */}
          <svg className="p-10 mt-4" viewBox="0 0 200 36">
            <g fill-rule="evenodd">
              <g>
                <g transform="translate(.347)">
                  <path d="M185.945 17.513c2.693-.61 5.381.495 6.878 2.584l-11.905 2.693c.411-2.52 2.333-4.668 5.027-5.277zm6.944 9.91a6.57 6.57 0 01-3.979 2.679c-2.711.614-5.417-.51-6.908-2.626l11.942-2.702 1.945-.44 3.719-.841a11.782 11.782 0 00-.31-2.372c-1.513-6.426-8.055-10.432-14.611-8.949-6.556 1.484-10.644 7.896-9.13 14.321 1.513 6.426 8.055 10.433 14.61 8.95 3.864-.875 6.869-3.46 8.377-6.751l-5.655-1.269z"></path>
                  <path
                    id="logo-wordmark-brand_svg__Fill-10"
                    d="M164.788 35.118V18.082h-3.677v-5.804h3.677V4.289h6.244v7.989h4.69v5.804h-4.69v17.036z"
                  ></path>
                  <path d="M152.86 35.118h6.03v-22.84h-6.03v22.84zm-.785-30.853c0-2.114 1.667-3.7 3.825-3.7 2.157 0 3.775 1.586 3.775 3.7 0 2.115-1.618 3.748-3.775 3.748-2.158 0-3.825-1.633-3.825-3.748zM150.76 12.342c-3.082.16-4.9.633-6.75 1.973v-2.037h-6.026v22.84h6.026v-11.2c0-3.524.86-5.529 6.75-5.726v-5.85zM117.16 24.057c.15 3.333 3.051 6.128 6.602 6.128 3.601 0 6.552-2.942 6.552-6.422 0-3.432-2.95-6.373-6.552-6.373-3.551 0-6.452 2.843-6.602 6.128v.539zm-5.88 11.061V1.38l6.03-1.364v13.962c1.863-1.49 4.07-2.115 6.472-2.115 6.864 0 12.355 5.286 12.355 11.918 0 6.583-5.491 11.965-12.355 11.965-2.403 0-4.609-.624-6.472-2.114v1.487h-6.03z"></path>
                  <path
                    id="logo-wordmark-brand_svg__Fill-1"
                    d="M98.445 35.118V17.965h-3.677v-5.687h3.677V4.283l6.244-1.413v9.408h4.69v5.687h-4.69v17.153z"
                  ></path>
                  <path d="M87.394 35.118V22.915c0-4.421-2.402-5.382-4.805-5.382-2.402 0-4.805.913-4.805 5.286v12.299h-6.03v-22.84h6.03v1.699c1.324-.961 2.942-2.115 6.13-2.115 5.098 0 9.51 2.932 9.51 10.092v13.164h-6.03zM56.484 17.513c2.694-.61 5.382.495 6.878 2.584L51.458 22.79c.41-2.52 2.332-4.668 5.026-5.277zm6.945 9.91a6.57 6.57 0 01-3.98 2.679c-2.711.614-5.416-.51-6.907-2.626l11.942-2.702 1.944-.44 3.72-.841a11.782 11.782 0 00-.31-2.372c-1.514-6.426-8.056-10.432-14.612-8.949-6.556 1.484-10.644 7.896-9.13 14.321 1.513 6.426 8.055 10.433 14.611 8.95 3.863-.875 6.868-3.46 8.376-6.751l-5.654-1.269z"></path>
                  <path
                    id="logo-wordmark-brand_svg__Fill-2"
                    d="M31.89 35.118l-9.364-22.84h6.57l5.932 15.49 5.982-15.49h6.57l-9.365 22.84z"
                  ></path>
                  <path d="M10.703 17.507c2.694-.61 5.382.495 6.878 2.584L5.677 22.785c.41-2.52 2.332-4.668 5.026-5.278zm6.945 9.91a6.57 6.57 0 01-3.98 2.68c-2.71.613-5.416-.51-6.907-2.626l11.942-2.702 1.945-.44 3.718-.842a11.782 11.782 0 00-.31-2.371c-1.513-6.426-8.055-10.433-14.61-8.95C2.888 13.65-1.2 20.063.314 26.489c1.514 6.426 8.055 10.432 14.611 8.949 3.864-.874 6.869-3.46 8.376-6.75l-5.654-1.27z"></path>
                </g>
              </g>
            </g>
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Organizer Login
        </h2>
        <p className="text-center text-sm text-gray-600">
          Access your dashboard and manage events
        </p>

        {/* Formik Form */}
        <Formik
          initialValues={{ emailOrUsername: '', password: '' }}
          validationSchema = {LoginOrganizerSchema}
          onSubmit={(values) => {

            mutateLoginOrganizer({emailOrUsername: values.emailOrUsername, password: values.password})
          }}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <Field
                  type="text"
                  name="emailOrUsername"
                  placeholder="Organizer email address or username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <ErrorMessage
                  name="emailOrUsername"
                  component="div"
                  className="text-sm pt-2 px-2 text-red-500"
                />
              </div>

              <div>
                <Field
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-sm pt-2 px-2 text-red-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 font-bold text-white bg-orange-600 rounded-md hover:bg-orange-700"
                // disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Logging in...'
                  : 'Log in to Organizer Dashboard'}
              </button>
            </Form>
          )}
        </Formik>

        {/* Divider */}
        <div className="flex items-center justify-center my-4">
          <span className="w-full border-b border-gray-300 pr-5"></span>
          <div className="rounded-2xl px-3 border border-grey">
            <span className="px-2 text-lg text-gray-500">or</span>
          </div>
          <span className="w-full border-b border-gray-300"></span>
        </div>

        {/* Alternative Login Options */}
        <div className="space-y-2">
          <button className="w-full py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100">
            Send a login link to your email
          </button>
          <button className="flex items-center justify-center w-full py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-100 gap-x-2">
            <svg width="24" height="24" fill="none">
              <g clip-path="url(#logo-google_svg__clip0)">
                <path
                  d="M21.99 12.108c0-.84-.069-1.452-.216-2.088H12.2v3.79h5.62c-.113.943-.725 2.362-2.084 3.315l-.02.127 3.028 2.349.21.021c1.926-1.782 3.037-4.404 3.037-7.514"
                  fill="#4285F4"
                ></path>
                <path
                  d="M12.2 22.096c2.753 0 5.064-.908 6.753-2.474l-3.218-2.497c-.862.602-2.017 1.021-3.536 1.021-2.697 0-4.985-1.781-5.801-4.244l-.12.01-3.148 2.44-.041.115c1.677 3.337 5.122 5.63 9.11 5.63z"
                  fill="#34A853"
                ></path>
                <path
                  d="M6.397 13.902a6.298 6.298 0 01-.34-2.02c0-.704.125-1.385.33-2.02l-.007-.136-3.187-2.48-.104.05A10.238 10.238 0 002 11.881c0 1.646.397 3.201 1.088 4.586l3.308-2.565"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12.2 5.616c1.914 0 3.206.829 3.942 1.521l2.879-2.814c-1.768-1.646-4.068-2.656-6.822-2.656-3.988 0-7.433 2.292-9.11 5.63L6.386 9.86c.828-2.463 3.116-4.245 5.813-4.245"
                  fill="#EB4335"
                ></path>
              </g>
              <defs>
                <clipPath id="logo-google_svg__clip0">
                  <path
                    fill="#fff"
                    transform="translate(2 1.667)"
                    d="M0 0h20v20.5H0z"
                  />
                </clipPath>
              </defs>
            </svg>
            Sign in with Google
          </button>
        </div>

        {/* Extra Organizer Login Options */}
        <div className="text-center">
          <button className="text-sm text-gray-600 hover:underline">
            Need access to the organizer dashboard? Contact support
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrganizerLoginForm;
