"use client"
import React, {useRef, useState} from 'react';
import OtherEventsSection from '../section/page';
import { useRouter } from 'next/navigation';

export default function EventPage() {
  // declare router
  const router = useRouter()

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
  

  return (

    <div className="bg-gray-100 min-h-screen">
      
      {/* Container for the entire page content with a two-column layout */}
      <div className="max-w-6xl mx-auto p-6 flex">
        
        {/* Left side (Main Content) - 3/4 width */}
        <div className="w-3/4 pr-8">
          {/* Header Section */}
          <header className="text-center py-8">
            <h1 className="text-3xl font-bold text-gray-800">KT&G SangSang Festival Jakarta 2024</h1>
            <p className="text-gray-500">Friday, November 1</p>
          </header>

          {/* Banner Section */}
          <section className="flex flex-col lg:flex-row items-center justify-between bg-blue-900 p-6 rounded-lg shadow-lg mt-8">
            
            {/* Text Section */}
            <div className="text-left lg:w-1/2 lg:pl-6">
              <h1 className="text-5xl font-bold mb-2 text-pink-400">
                SangSang Festival
                <span className="block text-4xl text-yellow-300">Jakarta</span>
              </h1>
              <p className="text-lg text-white">
                Join us for an exciting festival celebrating culture and music! Explore live performances, activities, and more in the heart of Jakarta.
              </p>
            </div>

            {/* Image Section */}
            <div className="w-full lg:w-1/2 mt-4 lg:mt-0">
              <img
                src="https://img.evbuc.com/https%3A%2F%2Fcdn.evbuc.com%2Fimages%2F884211613%2F1747953025863%2F1%2Foriginal.20241027-100718?crop=focalpoint&fit=crop&w=940&auto=format%2Ccompress&q=75&sharp=10&fp-x=0.5&fp-y=0.5&s=a51d73a2c4c83faf5f95a8fbd152ac57"
                alt="SangSang Festival Jakarta"
                className="w-full rounded-lg"
              />
            </div>

          </section>

          {/* Event Details Section */}
          <section className="bg-white rounded-lg shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-semibold text-gray-800">Event Details</h2>
            <p className="mt-4 text-gray-600">
              Join us for an exciting day filled with Korean cultural experiences! 
              From K-Pop dance to traditional games and Korean food, there's something for everyone.
            </p>
            <ul className="list-disc list-inside mt-4 space-y-2">
              <li className="text-gray-600">Noraebang</li>
              <li className="text-gray-600">K-Pop Dance</li>
              <li className="text-gray-600">Photobox</li>
              <li className="text-gray-600">Traditional Korean Games</li>
            </ul>
          </section>
          
          {/* About Event Section */}
          <section className="bg-white rounded-lg shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-semibold text-gray-800">About this event</h2>
            <p className="mt-4 text-gray-600">
              <strong>Konser GRATIS, KT&G SangSang Festival Jakarta 2024 is back!</strong> <br />
              Yuk, dateng ke konser KT&G SangSang Festival Jakarta 2024! Kali ini, kita bakalan nyanyi bareng 
              Fabio Asher, konser ini memang buat kamu seru-seruan di akhir pekan.
            </p>
            <p className="mt-2 text-gray-600">
              Selain itu, ada Noraebang (karaoke) bareng Sorijileo dan penampilan K-Pop Dance juga, lho!
            </p>
            <p className="mt-2 text-gray-600">
              <strong>Syarat penonton minimal berusia 21 tahun</strong>
            </p>
            <ul className="list-decimal list-inside mt-2 text-gray-600 space-y-1">
              <li>Dilarang membawa benda tajam, obat-obatan terlarang, dan minuman keras</li>
              <li>Dilarang membawa makanan dan minuman ke dalam area konser</li>
              <li>Dilarang melakukan tindak kekerasan, asusila, dan pelecehan seksual di area sekitar konser. Apabila terjadi, segala jenis tindakan tersebut akan diteruskan kepada pihak yang berwajib.</li>
              <li>Have fun!</li>
            </ul>
            <p className="mt-4 text-gray-600">
              <strong>Note:</strong> SangSang Mates bisa join ke salah satu WhatsApp Group yang terdapat di akhir sesi registrasi/Order 
              Confirmation yang masuk ke email masing-masing untuk mendapatkan informasi seputar SangSang Festa dan informasi eksklusif lainnya mengenai SangSang.
            </p>
            <p className="mt-2 text-gray-600">SangSang Haeyo!</p>
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
              {['Indonesia Events', 'DKI Jakarta Events', 'Things to do in Jakarta', 'Jakarta Festivals', 'Jakarta Music Festivals', '#gratis', '#kpopdance', '#hanbok', '#noraebang', '#ktng', '#photobox', '#programcsr', '#fabioasher', '#sangsangfestival'].map(tag => (
                <span key={tag} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">{tag}</span>
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
                onClick={() => {
                  if (regularTicketCount > 0) {
                    router.push('/checkout'); // Navigate to checkout page if ticket count > 0
                  } else {
                    scrollToTickets(); // Scroll to tickets section if no tickets are selected
                  }
                }}
              >
                {regularTicketCount > 0 ? 'Checkout' : 'Select tickets'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <OtherEventsSection/>

    </div>
  );
}
