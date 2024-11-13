'use client';
import React from 'react';
import Link from 'next/link';
import {
  Home,
  CreditCard,
  CircleUser,
  LogOut,
  PartyPopper,
} from 'lucide-react'; // Example icons from the 'lucide-react' library
import authStore from '@/zustand/authStore';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const AdminSidebar = () => {
  const firstName = authStore((state) => state.firstName);
  const lastName = authStore((state) => state.lastName);
  const profilePictureUrl = authStore((state) => state.profilePictureUrl);
  return (
    <main className="flex flex-col min-h-fit border-orange-500">
       <div className="border-e border-orange-500 h-full my-2" />
      <div className="flex flex-row items-center py-4 px-2 gap-4 border-orange-500">
        <Avatar className="items-end justify-end">
          <AvatarImage
            src={
              profilePictureUrl
                ? `http://localhost:4700/images/${profilePictureUrl}`
                : ''
            }
            alt="profile-picture"
          />
          <Link href="/dashboard/profile"></Link>
          <AvatarFallback className="font-semibold">
            {firstName?.[0]}
            {lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-bold">
            Hallo, {firstName} {lastName}!
          </h1>
        </div>
      </div>
      <hr className="border-orange-500" />
      <nav className="flex-grow">
        <ul className="space-y-2 mt-4">
          <li className="hover:bg-orange-500">
            <Link
              href="/dashboard"
              className="flex items-center px-4 py-2 space-x-2"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
          </li>
          <li className="hover:bg-orange-500">
            <Link
              href="/dashboard/profile"
              className="flex items-center px-4 py-2 space-x-2"
            >
              <CircleUser className="h-5 w-5" />
              <span>Profile</span>
            </Link>
          </li>
          <li className="hover:bg-orange-500">
            <Link
              href="/dashboard/events"
              className="flex items-center px-4 py-2 space-x-2"
            >
              <PartyPopper className="h-5 w-5" />
              <span>Events</span>
            </Link>
          </li>
          <li className="hover:bg-orange-500">
            <Link
              href="/dashboard/transactions"
              className="flex items-center px-4 py-2 space-x-2"
            >
              <CreditCard className="h-5 w-5" />
              <span>Transactions</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="mt-auto flex-grow">
        <button className="w-full flex items-center px-4 py-2 text-sm hover:bg-orange-500">
          <LogOut className="h-5 w-5 mr-2" />
          <span>Logout</span>
        </button>
      </div>
    </main>
  );
};
