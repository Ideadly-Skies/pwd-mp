'use client';
import Link from 'next/link';
import Image from 'next/image';
import { IoMdSearch } from 'react-icons/io';
import { FaUser } from 'react-icons/fa';
import { VscThreeBars } from 'react-icons/vsc';
import { FaLocationDot } from 'react-icons/fa6';
import { useState } from 'react';

function Navbar() {
    const [eventSearch, setEventSearch] = useState('');
    const [locationSearch, setLocationSearch] = useState('');

    const handleSearch = (e: any) => {
        e.preventDefault();
        console.log('Searching for:', eventSearch, 'in', locationSearch);
    };

    return (
        <div className="w-full border-b border-gray-200 sticky top-0 left-0 z-50 bg-white">
            <nav className="flex items-center justify-between px-4 py-3 mx-auto max-w-7xl w-full">
                {/* Logo aligned to the far left */}
                <div className="flex items-center">
                    <Link href="/" className="flex items-center">
                        <Image
                            src="https://www.eventbrite.com/blog/wp-content/themes/eventbrite-blockbase/assets/icons/evb-all-access-logo.svg"
                            width="150"
                            height="40"
                            alt="Eventbrite Logo"
                        />
                    </Link>
                </div>

                {/* Compact Integrated Search Bar */}
                <form
                    onSubmit={handleSearch}
                    className="flex items-center border rounded-full overflow-hidden max-w-md mx-4"
                >
                    <div className="flex items-center px-3 space-x-2">
                        <IoMdSearch className="text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search events"
                            value={eventSearch}
                            onChange={(e) => setEventSearch(e.target.value)}
                            className="w-44 px-2 py-1 text-sm outline-none"
                        />
                    </div>
                    <div className="flex items-center border-l px-3 space-x-2">
                        <FaLocationDot className="text-gray-500" />
                        <input
                            type="text"
                            placeholder="Location"
                            value={locationSearch}
                            onChange={(e) => setLocationSearch(e.target.value)}
                            className="w-32 px-2 py-1 text-sm outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-red-600 text-white p-1 rounded-full"
                    >
                        <IoMdSearch className="text-white" />
                    </button>
                </form>

                {/* Navigation Links */}
                <div className="hidden lg:flex space-x-6 items-center">
                    <Link href="/event/asd" className="text-gray-800 hover:text-red-600">
                        Find Events
                    </Link>
                    <Link href="/create-event" className="text-gray-800 hover:text-red-600">
                        Create Events
                    </Link>
                    <Link href="/help" className="text-gray-800 hover:text-red-600">
                        Help Center
                    </Link>
                </div>

                {/* User Section */}
                <div className="flex space-x-4 items-center">
                    <Link href="/tickets" className="text-gray-800 hover:text-red-600">
                        Find My Tickets
                    </Link>
                    <div className="flex items-center space-x-2 cursor-pointer">
                        <FaUser className="text-gray-800" />
                        <Link href="/login" className="hover:text-red-600">
                            Log In
                        </Link>
                        <Link href="/signup" className="hover:text-red-600">
                            Sign Up
                        </Link>
                    </div>

                    {/* Mobile Menu Icon */}
                    <div className="lg:hidden">
                        <VscThreeBars className="text-2xl cursor-pointer" />
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;
