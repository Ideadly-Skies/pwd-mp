"use client"
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import authStore from '@/zustand/authStore';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from "next/navigation";

interface Event {
  id: number;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
}

// const events: Event[] = [
//   { eventId: '8bffa23a', eventName: 'Event 1', startDate: '2024-10-21T07:22:24.000Z', endDate: '2024-10-24T07:22:24.000Z' },
//   { eventId: 'a5e65350', eventName: 'Event 2', startDate: '2024-11-14T07:24:25.000Z', endDate: '2024-11-17T07:24:25.000Z' },
//   { eventId: '72a644ce', eventName: 'Event 3', startDate: '2024-11-10T08:30:51.000Z', endDate: '2024-11-13T08:30:51.000Z' },
// ];

const Events: React.FC = () => {
  // initialize hooks 
  const router = useRouter();
  const currentDate = new Date();

  // access token from auth store
  const token = authStore((state) => state.token); // Access token from authStore
  const decodedToken = jwtDecode(token); // .data.id 
  
  const {data: events, error} = useQuery({
    queryKey: [''],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:4700/api/event/user/${decodedToken.data.id}`)
      return res.data.data.events
    }
  })

  console.log("events invoked from review page",events)

  const currentEvents = (events || []).filter((event: any) => new Date(event.endDate) >= currentDate);
  const pastEvents = (events || []).filter((event: any) => new Date(event.endDate) < currentDate);

  const renderTableRows = (eventList: Event[], isPast: boolean) => {
    return eventList.map((event, index) => (
      <tr key={index} className="border-b hover:bg-gray-100">
        <td className="px-4 py-2 text-center">{event.name}</td>
        <td className="px-4 py-2 text-center">{event.location}</td> {/* Changed from userId to eventId */}
        <td className="px-4 py-2 text-center">{new Date(event.startDate).toLocaleString()}</td>
        <td className="px-4 py-2 text-center">{new Date(event.endDate).toLocaleString()}</td>
        <td className="px-4 py-2 text-center">
          <button
            onClick={() => handleReview(event.id)}
            disabled={!isPast} // Disable button for current events
            className={`px-4 py-2 rounded transition ${
              isPast
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            Review
          </button>
        </td>
      </tr>
    ));
  };

  const handleReview = (eventId: number) => {
    router.push(`/event/${eventId}/review`);
  };

  return (
    <div className="p-8">
      {/* Current Events */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Current Events</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border text-center">Event Name</th>
              <th className="px-4 py-2 border text-center">Location</th>
              <th className="px-4 py-2 border text-center">Start Date</th>
              <th className="px-4 py-2 border text-center">End Date</th>
              <th className="px-4 py-2 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>{renderTableRows(currentEvents, false)}</tbody>
        </table>
      </div>

      {/* Past Events */}
      <div>
        <h2 className="text-xl font-bold mb-4">Past Events</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border text-center">Event Name</th>
              <th className="px-4 py-2 border text-center">Location</th>
              <th className="px-4 py-2 border text-center">Start Date</th>
              <th className="px-4 py-2 border text-center">End Date</th>
              <th className="px-4 py-2 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>{renderTableRows(pastEvents, true)}</tbody>
        </table>
      </div>
    </div>
  );
};

export default Events;