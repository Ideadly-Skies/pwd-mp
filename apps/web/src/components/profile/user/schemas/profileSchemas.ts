import * as Yup from 'yup';

export const InitialProfileSchema = Yup.object().shape({
  address: Yup.string()
    .required('Address is required')
    .min(5, 'Address is too short'),
  phoneNumber: Yup.string().required('Phone number is required'),
});

export const ProfileSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  address: Yup.string().required('Address is required'),
});
