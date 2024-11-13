import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

// Custom interface to define the shape of the error response
interface CustomAxiosError {
  response?: {
    data: {
      message: string;
    };
    status?: number; // Optional, if needed for other logic
  };
}

// Centralized error handler function
export const errorHandler = (err: unknown) => {
  // Type assertion to the custom error interface
  const axiosErr = err as CustomAxiosError;

  if (axiosErr.response) {
    // Accessing the message in the response
    toast.error(axiosErr.response?.data?.message || 'An error occurred.');
  } else {
    // Generic error message for non-Axios errors
    toast.error('An unknown error occurred.');
  }
};