"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQueries, useMutation } from "@tanstack/react-query";
import instance from "@/utils/axiosinstance"; // Axios instance
import { toast } from "react-toastify";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Validation schema for Formik
const ReviewSchema = Yup.object().shape({
  rating: Yup.number()
    .min(1, "Rating must be at least 1")
    .max(5, "Rating cannot exceed 5")
    .required("Rating is required"),
  feedback: Yup.string().required("Feedback is required"),
  comments: Yup.string().required("Comments are required"),
});

const ReviewForm: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const eventId = Number(pathname.split("/")[2]); // Extract eventId from the URL
  
  // Use `useQueries` to fetch event details and user reviews simultaneously
  const [eventDetailsQuery, userReviewsQuery] = useQueries({
    queries: [
      {
        queryKey: ["eventDetails", eventId],
        queryFn: async () => {
          const res = await instance.get(`/event/${eventId}`);
          return res.data.data;
        },
        enabled: !!eventId,
      },
      {
        queryKey: ["userReviews"],
        queryFn: async () => {
          const res = await instance.get("/review/"); // Endpoint to fetch user reviews
          return res.data.data;
        },
      },
    ],
  });

  const eventDetails = eventDetailsQuery.data;
  const userReviews = userReviewsQuery.data;

  const isEventLoading = eventDetailsQuery.isLoading;
  const isReviewLoading = userReviewsQuery.isLoading;

  const eventError = eventDetailsQuery.error;
  const reviewError = userReviewsQuery.error;

  // Check if the user has already reviewed the event
  const existingReview = userReviews?.find((review: any) => review.eventId === eventId);

  // Mutation for updating or creating a review
  const { mutate: mutateCreateReview } = useMutation({
    mutationFn: async (fd: any) => {
      return await instance.post("/review/create-review", fd);
    },
    onSuccess: () => {
      toast.success("Review submitted successfully!", {
        position: "top-center",
      });
      router.push(`/event/${eventId}`);
    },
    onError: (err) => {
      toast.error("Failed to submit review. Please try again.", {
        position: "top-center",
      });
      console.error(err);
      router.push("/user/dashboard/event");
    },
  });

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      {isEventLoading || isReviewLoading ? (
        <div>Loading...</div>
      ) : eventError || reviewError ? (
        <div>Error loading data. Please try again.</div>
      ) : (
        <>
          {/* Event Details */}
          {eventDetails && (
            <div className="mb-6">
              <img
                src={`http://localhost:4700/api/${eventDetails?.url}`}
                alt={eventDetails.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
              <h1 className="text-2xl font-bold mb-2">{eventDetails.name}</h1>
              <p className="text-gray-700 mb-2">{eventDetails.description}</p>
              <p className="text-gray-500 mb-1">
                <strong>Date:</strong>{" "}
                {new Date(eventDetails.startDate).toLocaleString()} -{" "}
                {new Date(eventDetails.endDate).toLocaleString()}
              </p>
              <p className="text-gray-500">
                <strong>Location:</strong> {eventDetails.location}
              </p>
            </div>
          )}

          {/* Review Form */}
          <h2 className="text-xl font-bold mb-4">{existingReview ? "Edit Your Review" : "Leave a Review"}</h2>
          <Formik
            initialValues={{
              rating: existingReview?.rating || 0,
              feedback: existingReview?.feedback || "",
              comments: existingReview?.comments || "",
            }}
            validationSchema={ReviewSchema}
            onSubmit={(values) => {
              mutateCreateReview({
                eventId,
                ...values,
              });
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                {/* Rating Input */}
                <div className="mb-4">
                  <label htmlFor="rating" className="block font-medium mb-2">
                    Rating (1 to 5)
                  </label>
                  <Field
                    type="number"
                    id="rating"
                    name="rating"
                    min="1"
                    max="5"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="rating"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Feedback Dropdown */}
                <div className="mb-4">
                  <label htmlFor="feedback" className="block font-medium mb-2">
                    Feedback
                  </label>
                  <Field
                    as="select"
                    id="feedback"
                    name="feedback"
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled>
                      Select feedback
                    </option>
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="average">Average</option>
                    <option value="poor">Poor</option>
                    <option value="unsatisfactory">Unsatisfactory</option>
                  </Field>
                  <ErrorMessage
                    name="feedback"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Comments Input */}
                <div className="mb-4">
                  <label htmlFor="comments" className="block font-medium mb-2">
                    Comments
                  </label>
                  <Field
                    as="textarea"
                    id="comments"
                    name="comments"
                    rows={4}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <ErrorMessage
                    name="comments"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-4 py-2 text-white font-bold rounded-md ${
                    isSubmitting
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </Form>
            )}
          </Formik>
        </>
      )}
    </div>
  );
};

export default ReviewForm;