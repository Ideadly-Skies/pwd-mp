import Image from 'next/image';

function EventCard({ number, imageSrc, title, date, time, location, price, followers }: any) {
  return (
    <div className="relative w-64 bg-white rounded-lg shadow-md overflow-hidden">
      {/* Large Number Indicator */}
      <div className="absolute top-2 left-2 text-blue-600 text-4xl font-bold z-10">
        {number}
      </div>
      {/* Image Section */}
      <Image
        src={imageSrc}
        alt={title}
        width={256}
        height={150}
        className="w-full h-40 object-cover"
      />
      {/* Content Section */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">
          {date} • {time}
        </p>
        <p className="text-sm text-gray-600">{location}</p>
        <p className="text-sm font-medium mt-2">{price}</p>
        <p className="text-xs text-gray-500 mt-1">
          {followers} followers
        </p>
      </div>
    </div>
  );
}

export default function TrendingEvents() {
  const events = [
    {
      number: 1,
      imageSrc: "/images/event1.jpg", // Replace with the path to your image
      title: "KT&G SangSang Festival Jakarta 2024",
      date: "Friday",
      time: "2:00 PM",
      location: "Pos Bloc Jakarta",
      price: "Free",
      followers: "KT&G SangSang Univ. Indonesia & 411 followers",
    },
    {
      number: 2,
      imageSrc: "/images/event2.jpg",
      title: "Nation Building Conference 2024",
      date: "Fri, Nov 8",
      time: "9:00 AM",
      location: "Balai Sarbini",
      price: "Free",
      followers: "STMIK Kuwera - School of Technopreneur Nusantara & 16 followers",
    },
    {
      number: 3,
      imageSrc: "/images/event3.jpg",
      title: "Final Day - NTT Startup Challenge 2024",
      date: "Thu, Nov 14",
      time: "12:30 PM",
      location: "Soehanna Hall",
      price: "Free",
      followers: "NTT Startup Challenge & 70 followers",
    },
    {
      number: 4,
      imageSrc: "/images/event4.jpg",
      title: "BCI Equinox Jakarta 2024",
      date: "Fri, Nov 15",
      time: "3:00 PM",
      location: "The Hall",
      price: "Free",
      followers: "BCI Central & 770 followers",
    },
  ];

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Top trending in Jakarta
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {events.map((event, index) => (
          <EventCard key={index} {...event} />
        ))}
      </div>
    </div>
  );
}
