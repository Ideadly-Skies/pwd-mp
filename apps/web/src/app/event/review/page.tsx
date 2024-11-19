import React from 'react';

export default function ReviewCarousel({ reviews }: any) {
  return (
    <section className="bg-white rounded-lg shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">User Reviews</h2>

      {/* Horizontal Scrollable Container */}
      <div className="flex space-x-4 overflow-x-auto">
        {reviews?.slice(0, 5).map((review: any, index: number) => (
          <div
            key={index}
            className="min-w-[300px] bg-gray-100 p-4 rounded-lg shadow-inner flex-shrink-0 transition-transform duration-300 transform hover:scale-105"
          >
            {/* Review Content */}
            <div className="flex flex-col">
              <p className="text-gray-800 font-medium mb-1">{review.user.firstName}</p>
              {/* <p className="text-gray-500 text-sm mb-2">{review.user.email}</p> */}
              <p className="text-gray-700">{review.comments}</p>

              <div className="flex justify-between items-center mt-4">
                <span className="text-yellow-500 font-semibold">
                  Rating: {review.rating} / 5
                </span>
                <span className="text-blue-500 font-medium">{review.feedback}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Display message if no reviews are available */}
      {!reviews?.length && (
        <div className="text-gray-500 text-center mt-4">No reviews available.</div>
      )}
    </section>
  );
}