import React from 'react';

export default function OtherEventsSection() {
  const events = [
    {
      image: '/path/to/image1.jpg',
      title: 'The Wealthy Black Women Summit 2024',
      date: 'Sat, Nov 16 • 7:00 PM GMT+7',
      price: 'From $79.00',
      organizer: 'The Wealthy Black Women Summit',
      location: '',
      promoted: true,
    },
    {
      image: '/path/to/image2.jpg',
      title: 'Seminar Digital Marketing di Jakarta Barat',
      date: 'Today • 9:00 AM + 60 more',
      price: 'From $289.80',
      organizer: 'Erudite Training',
      location: 'West Jakarta',
      promoted: false,
    },
    {
      image: '/path/to/image3.jpg',
      title: 'Your Favorite Birder… Or A Bird?',
      date: 'Fri, Nov 15 • 6:00 AM GMT+7',
      price: 'From $0.00',
      organizer: 'BirdNote',
      location: '',
      promoted: true,
    },
    {
      image: '/path/to/image4.jpg',
      title: 'Belajar Digital Marketing di Jakarta',
      date: 'Today • 9:00 AM + 60 more',
      price: 'From $289.80',
      organizer: 'Erudite Training',
      location: 'Central Jakarta',
      promoted: false,
    },
  ];

  return (
    <section className="bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Other events you may like</h2>
        
        {/* Horizontal Scrollable Container */}
        <div className="flex space-x-4 overflow-x-auto">
          {events.map((event, index) => (
            <div key={index} className="min-w-[250px] bg-white rounded-lg shadow-lg p-4 flex-shrink-0">
              
              {/* Event Image */}
              <div className="relative h-36 w-full rounded-lg overflow-hidden">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                
                {/* Promoted Tag */}
                {event.promoted && (
                  <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
                    Promoted
                  </span>
                )}

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
                  <button className="bg-white p-1 rounded-full shadow hover:bg-gray-100">
                    <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 12c1.1 0 2-.9 2-2s-.9-2-2-2h-1.5l.29-.29c.39-.39.39-1.02 0-1.41L17.5 4.5c-.39-.39-1.02-.39-1.41 0L16 4.5 15.29 5H10V3H7v4h3v2h-.59L6 12.59 9.59 16 16 9.59V11h4v-2h-4v.5l-3.29-3.29L15 2.5l.71.71.71-.71c.39-.39 1.02-.39 1.41 0L20 4.5c.39.39.39 1.02 0 1.41l-.71.71.29.29H20z" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Event Details */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800">{event.title}</h3>
                <p className="text-sm text-gray-500">{event.date}</p>
                <p className="text-sm text-gray-600">{event.price}</p>
                <p className="text-sm text-gray-500">{event.organizer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
