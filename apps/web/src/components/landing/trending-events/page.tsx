import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { format } from 'date-fns';
import { useState, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import Link from 'next/link';

// Function to format date
function formatDate(dateString: any) {
  return format(new Date(dateString), 'MMMM dd, yyyy');
}

function EventCard({ id, url, name, startDate, endDate, location, isPaid, category }: any) {
  return (
    <div className="relative w-64 h-96 bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:border-4 hover:border-[#f05537]">
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
        <p className="text-xs text-gray-500 mt-1">{category.name} event!</p>
      </div>
    </div>
  );
}

export default function TrendingEvents() {
  // useStates
  const [isFirstRender, setIsFirstRender] = useState(true); 
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchInput, setSearchInput] = useState('');

  // router and the rest
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: events, error } = useQuery({
    queryKey: [''],
    queryFn: async () => {
      const res = await axios.get('http://localhost:4700/api/event');
      return res.data.data;
    }
  });

  console.log(events);

  // debounced callback for search params
  const debounced = useDebouncedCallback((value) => {
    setSearchTerm(value);
  }, 1000);

  useEffect(() => {
    if (isFirstRender) return setIsFirstRender(false);
  
    const currentUrl = new URLSearchParams(searchParams);

    if (searchTerm) {
      currentUrl.set('search', searchTerm);
    } else {
      currentUrl.delete('search');
    }

    if (page) {
      currentUrl.set('page', page.toString());
    } else {
      currentUrl.delete('page');
    }

    if (selectedCategory) {
      currentUrl.set('category', selectedCategory);
    } else {
      currentUrl.delete('category');
    }
    
    router.push(`${pathname}?${currentUrl.toString()}`);
  }, [searchTerm, selectedCategory]);

  // Filter events based on search term and category
  const filteredEvents = events?.filter((event: any) => {
    const matchesSearchTerm = event.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? event.category?.name === selectedCategory : true;
    return matchesSearchTerm && matchesCategory;
  });

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Top trending in Jakarta</h2>

      {/* Search and Filter Controls */}
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by event name"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            debounced(e.target.value);
          }}
          className="p-2 border border-gray-300 rounded-md w-full md:w-1/2"
        />

        {/* Category Dropdown */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border border-gray-300 rounded-md w-full md:w-1/2"
        >
          <option value="">All Categories</option>
          <option value="education">Education</option>
          <option value="business">Business</option>
          <option value="health">Health</option>
        </select>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredEvents && filteredEvents.length > 0 ? (
          filteredEvents.map((event: any, index: any) => (
            <Link href={`/event/${event.id}`} key={index}>
              <EventCard key={index} {...event} />
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600">No events found</div>
        )}
      </div>
    </div>
  );
}