import React from 'react';
import Link from 'next/link';

export default function OtherEventsSection({ otherEvents }: any) {
  return (
    <section className="bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Other events you may like</h2>
        
        {/* Horizontal Scrollable Container */}
        <div className="flex space-x-4 overflow-x-auto">
          {otherEvents?.map((event: any, index: any) => (
            <Link href={`/event/${event.id}`} key={index} passHref>
              <div className="min-w-[250px] bg-white rounded-lg shadow-lg p-4 flex-shrink-0 transition-transform duration-300 transform hover:scale-105 hover:border-2 hover:border-[#f05537] cursor-pointer">
                
                {/* Event Image */}
                <div className="relative h-36 w-full rounded-lg overflow-hidden">
                  <img src={"http://localhost:4700/api" + event.url} alt={event.name} className="w-full h-full object-cover" />

                  {/* Action Icons */}
                  <div className="absolute bottom-2 right-2 flex space-x-2">
                    <button className="bg-white p-1 rounded-full shadow hover:bg-gray-100">
                      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>
                    <button className="bg-white p-1 rounded-full shadow hover:bg-gray-100">
                      <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 20h16v2H4v-2zM10.79 3.71l1.41 1.42L8.83 8.5l3.37 3.37-1.41 1.41L6 9.91l4.79-6.2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Event Details */}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-800">{event.name}</h3>
                  <p className="text-sm text-gray-500">{event.date}</p>
                  <p className="text-sm text-gray-600">{event.price}</p>
                  <p className="text-sm text-gray-500">{event.organizer}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}