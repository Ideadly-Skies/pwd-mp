"use client";
import React from 'react';
import axios from 'axios';
import { useQueries } from '@tanstack/react-query';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';

// Function to format date
function formatDate(dateString: any) {
  return format(new Date(dateString), 'MMMM dd, yyyy');
}

// Card component for displaying each event
function EventCard({ id, url, name, startDate, endDate, location, isPaid, type }: any) {
  return (
    <Link href={`/event/${id}`} passHref>
      <div className="relative w-64 h-96 bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:border-4 hover:border-[#f05537] cursor-pointer">
        {/* Large Number Indicator */}
        <div className="absolute top-2 left-2 text-blue-600 text-4xl font-bold z-10">
          {id}
        </div>
        {/* Image Section */}
        <Image
          src={`http://localhost:4700/api${url}`}
          alt={name}
          width={256}
          height={150}
          className="w-full h-40 object-cover"
        />
        {/* Content Section */}
        <div className="p-4 h-48 flex flex-col justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <p className="text-sm text-gray-600">
            {formatDate(startDate)} - {formatDate(endDate)}
          </p>
          <p className="text-sm text-gray-600">{location}</p>
          <p className="text-sm font-medium mt-2">{isPaid ? "Paid" : "Free"}</p>
          <p className="text-xs text-gray-500 mt-1">{type} event!</p>
        </div>
      </div>
    </Link>
  );
}

function AllEventPage() {
  const [allEventsQuery] = useQueries({
    queries: [
      {
        queryKey: ['events'],
        queryFn: async () => {
          const res = await axios.get("http://localhost:4700/api/event");
          return res.data.data;
        },
      },
    ],
  });

  const allEvents = allEventsQuery.data;

  if (allEventsQuery.isLoading) return <div>Loading...</div>;
  if (allEventsQuery.isError) return <div>Error fetching events</div>;

  // Group events by category
  const eventsByCategory = allEvents?.reduce((acc: any, event: any) => {
    const category = event.category.name || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(event);
    return acc;
  }, {});

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex justify-center">All Events</h2>

      {/* Events grouped by category */}
      {eventsByCategory &&
        Object.keys(eventsByCategory).map((category) => (
          <div key={category} className="mb-10">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {eventsByCategory[category].map((event: any) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}

export default AllEventPage;