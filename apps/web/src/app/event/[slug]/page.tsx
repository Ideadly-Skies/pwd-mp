"use client"
import React, {useRef, useState, useEffect} from 'react';
import OtherEventsSection from '../section/page';
import axios from 'axios';
import { useQuery, useQueries } from '@tanstack/react-query';
import { useRouter, usePathname } from 'next/navigation';
import { format } from 'date-fns';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import instance from '@/utils/axiosinstance';

// Function to format date
function formatDate(dateString: string) {
  // Convert the ISO date string directly into a Date object
  const date = new Date(dateString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  // Format the date
  return format(date, 'MMMM dd, yyyy');
}

export default function EventPage() {
  // define router, id, and useState for storing fetched event 
  const router = useRouter()
  const pathname = usePathname()
  const id = pathname.split('/')[2]
  
  // console.log("from event page",pathname.split('/'))
  // Using `useQueries` to fetch both the specific event by `id` and all events
  const [eventQuery, allEventsQuery] = useQueries({
    queries: [
      {
        queryKey: ['event', id], // Unique key for the single event query
        queryFn: async () => {
          const res = await axios.get(`http://localhost:4700/api/event/${id}`);
          // console.log("Fetched single event:", res.data.data);
          return res.data.data;
        },
        enabled: !!id, // Only run this query if `id` is defined
      },
      {
        queryKey: ['events'], // Unique key for all events
        queryFn: async () => {
          const res = await axios.get("http://localhost:4700/api/event");
          // console.log("Fetched all events:", res.data.data);
          return res.data.data;
        },
      },
    ],
  });
  
  let event = eventQuery.data
  
  let allEvents = allEventsQuery.data
  // console.log("all events", allEvents)
  
  // Filter out the current event from all events
  const otherEvents = allEvents?.filter((e: any) => e.id !== Number(id));
  
  // Create a ref for the Tickets Section
  const ticketsSectionRef = useRef<HTMLDivElement | null>(null);
  
  // State for ticket count
  const [regularTicketCount, setRegularTicketCount] = useState(0);
  
  // Functions to handle increment and decrement
  const incrementTicket = () => setRegularTicketCount(prevCount => prevCount + 1);
  const decrementTicket = () => setRegularTicketCount(prevCount => Math.max(0, prevCount - 1));
  
  // Scroll to the Tickets Section when button is clicked
  const scrollToTickets = () => {
    if (ticketsSectionRef.current) {
      const offset = -80; // Adjust this value to set how much space to leave above the title
      const topPosition = ticketsSectionRef.current.getBoundingClientRect().top + window.pageYOffset + offset;
      window.scrollTo({ top: topPosition, behavior: 'smooth' });
    }
  };

  const loadSnapScript = (midtransClientKey: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!midtransClientKey) {
        console.error("Midtrans Client Key is not defined");
        reject("Midtrans Client Key is not defined");
        return;
      }
  
      if (document.querySelector(`script[src="https://app.sandbox.midtrans.com/snap/snap.js"]`)) {
        console.log("Snap script already loaded");
        resolve(); // Resolve immediately if already loaded
        return;
      }
  
      const script = document.createElement("script");
      script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
      script.setAttribute("data-client-key", midtransClientKey);
      script.async = true;
  
      script.onload = () => {
        console.log("Snap script loaded successfully");
        resolve();
      };
  
      script.onerror = () => {
        console.error("Failed to load Snap script");
        reject("Failed to load Snap script");
      };
  
      document.body.appendChild(script);
    });
  };

  // handleCheckout function
  const handleCheckout = async() => {
    if (regularTicketCount > 0) {    
      const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY

      try {
        await loadSnapScript(midtransClientKey as string)

        mutateCreateTransaction({
          eventId: id,
          totalPrice: Math.round(event.price * regularTicketCount),
        }); 
      } catch (error) {
        console.error(error)
        toast.error("Payment system is not ready. Please try again.", { position: "top-center" });
      }
                    
    } else {
      scrollToTickets(); // Scroll to tickets section if no tickets are selected
    } 
  }

  // Define the mutation
  const { mutate: mutateCreateTransaction } = useMutation({
    mutationFn: async (data: { eventId: string; totalPrice: number }) => {
      // Send request to create transaction
      return await instance.post('/transaction/create-transaction', data);
    },

    onSuccess: (res) => {
      console.log(res.data)
      const transactionToken = res.data.token; // Extract transaction token from response
      const redirectUrl = res.data.redirect_url; // Extract redirect URL from response

      console.log(transactionToken)
      console.log(redirectUrl)

      // Handle payment using Snap popup or redirect URL
      if (window.snap) {
        window.snap.pay(transactionToken, {
          onSuccess: function (result) {
            alert("Payment successful!");
            console.log("Payment success:", result);
          },
          onPending: function (result) {
            alert("Waiting for your payment!");
            console.log("Payment pending:", result);
          },
          onError: function (result) {
            alert("Payment failed!");
            console.error("Payment failed:", result);
          },
          onClose: function () {
            alert("You closed the popup without finishing the payment.");
          },
        });
      } else {
        console.warn("Snap is not available. Redirecting to the payment page...");
        // window.location.href = redirectUrl 
      }
    },
  
    onError: (error) => {
      console.error("Transaction creation failed:", error);
      toast.error("Transaction creation failed", { position: "top-center" });
    },
  });

  // if there are no event being fetched
  if (!event) {
    return <div>Loading...</div>; 
  }

  return (

    <div className="bg-gray-100 min-h-screen">
      
      {/* Container for the entire page content with a two-column layout */}
      <div className="max-w-6xl mx-auto p-6 flex">
        
        {/* Left side (Main Content) - 3/4 width */}
        <div className="w-3/4 pr-8">
          {/* Header Section */}
          <header className="text-center py-8">
            <h1 className="text-3xl font-bold text-gray-800">{event.name}</h1>
            <p className="text-gray-500">{formatDate(event.startDate)}</p>
          </header>

          {/* Banner Section */}
          <section className="flex flex-col lg:flex-row items-center justify-between bg-blue-900 p-6 rounded-lg shadow-lg mt-8">
            
            {/* Text Section */}
            <div className="text-left lg:w-1/2 lg:pl-6">
              <h1 className="text-5xl font-bold mb-2 text-pink-400">
                {event.name}
                <span className="block text-4xl text-yellow-300">{event.location}</span>
              </h1>
              {/* <p className="text-lg text-white">
                Join us for an exciting festival celebrating culture and music! Explore live performances, activities, and more in the heart of Jakarta.
              </p> */}
            </div>

            {/* Image Section */}
            <div className="w-full lg:w-1/2 mt-4 lg:mt-0">
              <img
                src={"http://localhost:4700/api"+event?.url}
                alt="SangSang Festival Jakarta"
                className="w-full rounded-lg"
              />
            </div>

          </section>

          {/* Event Details Section */}
          <section className="bg-white rounded-lg shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-semibold text-gray-800">Event Details</h2>
            <p className="mt-4 text-gray-600">
              {event.description} 
            </p>
            {/* <ul className="list-disc list-inside mt-4 space-y-2">
              <li className="text-gray-600">Noraebang</li>
              <li className="text-gray-600">K-Pop Dance</li>
              <li className="text-gray-600">Photobox</li>
              <li className="text-gray-600">Traditional Korean Games</li>
            </ul> */}
          </section>
          
          {/* About Event Section */}
          <section className="bg-white rounded-lg shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-semibold text-gray-800">About this event</h2>
            {event.detailedDescription}
          </section>

          {/* Tickets Section */} 
          <section ref={ticketsSectionRef} className="bg-white rounded-lg shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-semibold text-gray-800">Tickets</h2>
            <div className="mt-4 space-y-4">
              <div className="flex justify-between items-center border border-gray-300 rounded-lg p-4">
                <div>
                  <h3 className="text-gray-800 font-semibold">Early Bird</h3>
                  <p className="text-gray-600">FREE</p>
                </div>
                <span className="text-gray-500">Sales ended</span>
              </div>
              <div className="flex justify-between items-center border border-gray-300 rounded-lg p-4">
                <div>
                  <h3 className="text-gray-800 font-semibold">Regular</h3>
                  <p className="text-gray-600">FREE</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button onClick={decrementTicket} className="border border-gray-300 text-gray-500 p-1 rounded hover:border-[#f05537] hover:text-gray-500">-</button>
                  <span>{regularTicketCount}</span>
                  <button onClick={incrementTicket} className="border border-gray-300 text-blue-500 p-1 rounded hover:border-[#f05537] hover:text-gray-500">+</button>
                </div>
                <span className="text-blue-500 cursor-pointer">Read more</span>
              </div>
              <div className="flex justify-between items-center border border-gray-300 rounded-lg p-4">
                <div>
                  <h3 className="text-gray-800 font-semibold">On The Spot</h3>
                  <p className="text-gray-600">FREE</p>
                </div>
                <span className="text-gray-500">Sales start on Nov 01, 2024</span>
                <span className="text-blue-500 cursor-pointer">Read more</span>
              </div>
            </div>
          </section>

          {/* Tags Section */}
          <section className="bg-white rounded-lg shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-semibold text-gray-800">Tags</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {event.tags.map((tag: any) => (
                <span 
                  key={tag.id} 
                  className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                  # {tag.name}
                </span>
              ))}
            </div>
          </section>

          {/* Organized By Section */}
          <section className="bg-white rounded-lg shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-semibold text-gray-800">Organized by</h2>
            <div className="flex items-center justify-between mt-4 p-4 bg-gray-50 rounded-lg shadow-inner">
              <div>
                <p className="text-gray-800 font-semibold">KT&G SangSang Univ. Indonesia</p>
                <p className="text-gray-500">449 followers</p>
                <p className="text-gray-500">5.6k attendees hosted</p>
              </div>
              <div className="flex space-x-4">
                <button className="text-blue-500 font-semibold">Contact</button>
                <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600">Follow</button>
              </div>
            </div>
            <p className="text-blue-500 mt-4 cursor-pointer">Report this event</p>
          </section>
        </div>
        
        {/* Right side (Persistent Select Tickets Button) - 1/4 width */}
        <div className="w-1/4">
          {/* Sticky container for the button */}
          <div className="sticky top-20">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <button
                className="bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-orange-600 w-full"
                onClick={() => {handleCheckout()}}
              >
                {regularTicketCount > 0 ? 'Checkout' : 'Select tickets'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <OtherEventsSection otherEvents={otherEvents}/>

    </div>
  );
}
