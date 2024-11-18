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
import ReviewCarousel from '../review/page';

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
  const pathname = usePathname()
  const id = pathname.split('/')[2]
  
  // usestate variables for referral modal
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(true);
  const [referralCode, setReferralCode] = useState("");
  const [hasReferral, setHasReferral] = useState(false); // To track user choice
  const [totalPrice, setTotalPrice] = useState(100000); // Example total price
  const [isProceeding, setIsProceeding] = useState(false); // Track transaction state

  // console.log("from event page",pathname.split('/'))
  // Using `useQueries` to fetch both the specific event by `id` and all events
  const [eventQuery, allEventsQuery, reviewsQuery, ticketsQuery] = useQueries({
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
      {
        queryKey: ['reviews'],
        queryFn: async () => {
          const res = await axios.get(`http://localhost:4700/api/review/${id}`); // Adjust API URL
          return res.data.data; // Assuming data contains the reviews array
        },
      },{
        queryKey: ['tickets'],
        queryFn: async() => {
          const res = await axios.get(`http://localhost:4700/api/ticket/${id}`)
          return res.data.data;

        }
      }
    ],
  });
  
  // derive data that are fetched from useQueries here
  let event = eventQuery.data
  console.log(event)
  let allEvents = allEventsQuery.data
  let reviews = reviewsQuery.data
  let tickets = ticketsQuery.data
  console.log("tickets", tickets)
  
  // Filter out the current event from all events
  const otherEvents = allEvents?.filter((e: any) => e.id !== Number(id));
  
  // Create a ref for the Tickets Section
  const ticketsSectionRef = useRef<HTMLDivElement | null>(null);
  
  // Initialize ticketCounts safely
  const [ticketCounts, setTicketCounts] = useState<number[]>(
    tickets ? tickets.map(() => 0) : [] // Fallback to an empty array if tickets is undefined
  );

  const incrementTicket = (index: number) => {
    setTicketCounts((prevCounts) =>
      prevCounts.map((count, i) => (i === index ? count + 1 : count))
    );
  };

  const decrementTicket = (index: number) => {
    setTicketCounts((prevCounts) =>
      prevCounts.map((count, i) => (i === index && count > 0 ? count - 1 : count))
    );
  };

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
    if ((ticketCounts[0] || ticketCounts[1]) > 0) {    
      const midtransClientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY
      const regularTicketQty = ticketCounts[0]
      const vipTicketQty = ticketCounts[1]
      const regularTicketPrice = tickets[0].price
      const vipTicketPrice = tickets[1].price      
      const totalPrice = (regularTicketQty * regularTicketPrice) + (vipTicketQty * vipTicketPrice)      

      try {
        await loadSnapScript(midtransClientKey as string)

        const transactionData = {
          eventId: id,
          totalPrice: totalPrice > 0 ? Math.round(totalPrice) : Math.round(1) 
        }

        // create the transaction and retrieve the transaction token and redirect URL
        const {data} = await instance.post("/transaction/create-transaction", transactionData)
        const {token, redirect_url, orderId} = data;
        console.log("data", data);
        
        // window snap to display the midtrans
        if (window.snap) {
          window.snap.pay(token, {
            onSuccess: async function (result) {
              alert("Payment successful!");
  
              // Post paid transaction to the backend
              await instance.post("/transaction/update-transaction-status", {
                orderId: result.order_id,
                regularTicketQty: regularTicketQty,
                regularTicketPrice: regularTicketPrice,
                vipTicketQty: vipTicketQty,
                vipTicketPrice: vipTicketPrice,
                status: "paid",
                eventId: id
              });
  
              console.log("Payment success:", result);
            },
            onPending: async function (result) {
                // Post pending transaction to the backend
                await instance.post("/transaction/update-transaction-status", {
                  orderId: result.order_id,
                  status: "pending",
                });            

              alert("Waiting for your payment!");
              console.log("Payment pending:", result);
            },
            onError: async function (result) {
              // Post paid transaction to the backend
              await instance.post("/transaction/update-transaction-status", {
                orderId: result.order_id,
                status: "failed",
              }); 
              alert("Payment failed!");
              console.error("Payment failed:", result);
            },
            onClose: async function () { 
              alert("You closed the popup without finishing the payment.");
              
              // Post pending transaction to the backend
              await instance.post("/transaction/update-transaction-status", {
                orderId: orderId,
                status: "failed",
              }); 
            },
          });
        } else {
          console.warn("Snap is not available. Redirecting to the payment page...");
          window.location.href = redirect_url; // Redirect to Midtrans payment page
        }         
      } catch (error) {
        console.error(error)
        toast.error("Payment system is not ready. Please try again.", { position: "top-center" });
      }
                    
    } else {
      scrollToTickets(); // Scroll to tickets section if no tickets are selected
    } 
  }

  // Update ticketCounts dynamically when tickets are loaded
  useEffect(() => {
    if (tickets?.length && ticketCounts.length === 0) {
      setTicketCounts(Array(tickets.length).fill(0)); // Initialize with zeros once tickets are available
    }
  }, [tickets]);

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
          </section>
          
          {/* About Event Section */}
          <section className="bg-white rounded-lg shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-semibold text-gray-800">About this event</h2>
            {event.detailedDescription}
          </section>

          {/* Tickets Section */}
          <section ref={ticketsSectionRef} className="bg-white rounded-lg shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-semibold text-gray-800">Tickets</h2>
            {tickets?.length > 0 ? (
              <div className="mt-4 space-y-4">
                {tickets.map((ticket: any, index: number) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border border-gray-300 rounded-lg p-4"
                  >
                    <div className="flex flex-col">
                      <h3 className="text-gray-800 font-semibold">
                        {ticket.name.replace("Seed", "").trim()} {/* Remove 'Seed' */}
                      </h3>
                      <p className="text-gray-600">IDR {ticket.price.toLocaleString('id-ID')}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <h3 className="text-gray-500">Available: {ticket.available}</h3>
                    </div>
                    {new Date() < new Date(ticket.startDate) ? (
                      <div className="text-gray-500 font-medium">
                        Sales start on{" "}
                        {new Date(ticket.startDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    ) : ticket.available > 0 ? (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => decrementTicket(index)}
                          className="border border-gray-300 text-gray-500 p-1 rounded hover:border-[#f05537] hover:text-gray-500"
                        >
                          -
                        </button>
                        <span>{ticketCounts[index] || 0}</span>
                        <button
                          onClick={() => incrementTicket(index)}
                          className="border border-gray-300 text-blue-500 p-1 rounded hover:border-[#f05537] hover:text-gray-500"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <div className="text-gray-500 font-medium">Sold Out!</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-500">No tickets available.</div>
            )}
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

          {/* Review Carousel Section */}
          <ReviewCarousel reviews={reviews}/>
        </div>
        
        {/* Referral Modal - New Feature */}
        {isReferralModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-lg font-bold mb-4 text-center">Do you have a referral code?</h2>
              {!hasReferral ? (
                <div className="flex flex-col space-y-4">
                  <button
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                    onClick={() => setHasReferral(true)}
                  >
                    Yes, I have a referral code
                  </button>
                  <button
                    className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
                    onClick={() => {
                      setHasReferral(false)
                      setIsReferralModalOpen(false)
                    }}
                  >
                    No, proceed without referral code
                  </button>
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="Enter referral code"
                    className="border border-gray-300 w-full p-2 rounded mb-4"
                  />
                  <div className="flex justify-between">
                    <button
                      className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                      // onClick={validateReferralCode}
                    >
                      Apply Code
                    </button>
                    <button
                      className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
                      onClick={() => setIsReferralModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Right side (Persistent Select Tickets Button) - 1/4 width */}
        <div className="w-1/4">
          {/* Sticky container for the button */}
          <div className="sticky top-20">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <button
                className="bg-orange-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-orange-600 w-full"
                onClick={() => {handleCheckout()}}
              >
                {(ticketCounts[0] || ticketCounts[1]) > 0 ? 'Checkout' : 'Select tickets'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <OtherEventsSection otherEvents={otherEvents}/>
    </div>
  );
}
