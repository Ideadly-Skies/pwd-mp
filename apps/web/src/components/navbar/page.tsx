'use client';
import Link from 'next/link';
import Image from 'next/image';
import { IoMdSearch } from 'react-icons/io';
import { VscThreeBars } from 'react-icons/vsc';
import { FaLocationDot } from 'react-icons/fa6';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import authStore from '@/zustand/authStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Cloud,
  CreditCard,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

function Navbar() {
  const [eventSearch, setEventSearch] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const token = authStore((state) => state.token); // Access token from authStore
  const firstName = authStore((state) => state.firstName);
  const lastName = authStore((state) => state.lastName);
  const profilePictureUrl = authStore((state) => state.profilePictureUrl);
  console.log(profilePictureUrl);
  const handleLogout = authStore((state) => state.setAuthLogout);
  const router = useRouter();

  const isTokenValid = (token: string) => {
    if (!token) return false;
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp! * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  };

  const handleSearch = (e: any) => {
    e.preventDefault();
    console.log('Searching for:', eventSearch, 'in', locationSearch);
  };

  const handleSignOut = () => {
    handleLogout();
    toast.success('Successfully logged out');
    setTimeout(() => {
      router.push('/');
    }, 1000);
  };

  const tokenIsValid = isTokenValid(token);

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
          <Link
            href="/event/all-events"
            className="text-gray-800 hover:text-red-600"
          >
            Find Events
          </Link>
          <Link
            href="/create-event"
            className="text-gray-800 hover:text-red-600"
          >
            Create Events
          </Link>
          <Link href="/help" className="text-gray-800 hover:text-red-600">
            Help Center
          </Link>
        </div>

        {/* Conditional User Section */}
        <div className="flex space-x-4 items-center">
          <Link href="/tickets" className="text-gray-800 hover:text-red-600">
            Find My Tickets
          </Link>

          {tokenIsValid ? (
            /* Avatar with Dropdown Menu */
            <DropdownMenu>
              <h1 className="text-[#f05537] font-semibold">
                {' '}
                Hello, {firstName}!
              </h1>
              <DropdownMenuTrigger className="cursor-pointer">
                <Avatar>
                  <AvatarImage
                    src={profilePictureUrl? `http://localhost:4700/images/${profilePictureUrl}`: ''}
                    alt="profile-picture"
                  />
                  <AvatarFallback className='font-semibold'>
                    {firstName?.[0]}
                    {lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <User />
                    <Link href="/profile">
                      <span>Profile</span>
                    </Link>
                    <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CreditCard />
                    <span>Billing</span>
                    <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings />
                    <span>Settings</span>
                    <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Keyboard />
                    <span>Keyboard shortcuts</span>
                    <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Users />
                    <span>Team</span>
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <UserPlus />
                      <span>Invite users</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>
                          <Mail />
                          <span>Email</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <MessageSquare />
                          <span>Message</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <PlusCircle />
                          <span>More...</span>
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuItem>
                    <Plus />
                    <span>New Team</span>
                    <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Github />
                  <span>GitHub</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LifeBuoy />
                  <span>Support</span>
                </DropdownMenuItem>
                <DropdownMenuItem disabled>
                  <Cloud />
                  <span>API</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut />
                  <span>Log out</span>
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            /* Log In and Sign Up Links */
            <div className="flex items-center space-x-2 cursor-pointer">
              <Link
                href="/login/user"
                className="text-gray-800 hover:text-red-600 px-2"
              >
                Log In
              </Link>
              <Link
                href="/register/user"
                className="text-gray-800 hover:text-red-600"
              >
                Sign Up
              </Link>
            </div>
          )}

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
