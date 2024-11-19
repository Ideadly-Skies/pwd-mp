'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Calendar, MapPin, Clock } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import authStore from '@/zustand/authStore';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import instance from '@/utils/axiosinstance';

interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  imageUrl: string;
  status: 'upcoming' | 'past';
}

const sampleEvents: Event[] = [
  {
    id: '1',
    name: 'Tech Conference 2024',
    date: '2024-06-15',
    time: '09:00 AM',
    location: 'San Francisco, CA',
    imageUrl: '/placeholder.svg?height=100&width=200',
    status: 'upcoming',
  },
  {
    id: '2',
    name: 'Web Development Workshop',
    date: '2024-05-20',
    time: '02:00 PM',
    location: 'Online',
    imageUrl: '/placeholder.svg?height=100&width=200',
    status: 'upcoming',
  },
  {
    id: '3',
    name: 'AI Symposium',
    date: '2024-03-10',
    time: '10:00 AM',
    location: 'New York, NY',
    imageUrl: '/placeholder.svg?height=100&width=200',
    status: 'past',
  },
  {
    id: '4',
    name: 'Startup Networking Event',
    date: '2024-02-05',
    time: '06:00 PM',
    location: 'Austin, TX',
    imageUrl: '/placeholder.svg?height=100&width=200',
    status: 'past',
  },
];

export default function UserDashboard() {
  const firstName = authStore((state) => state.firstName);
  const lastName = authStore((state) => state.lastName);
  const profilePictureUrl = authStore((state) => state.profilePictureUrl);
   // initialize hooks 
   const router = useRouter();
   const currentDate = new Date();
 

   // access token from auth store
   const token = authStore((state) => state.token);
  
   // Safe token decoding
   let decodedToken = null;
   try {
     if (token) {
       decodedToken = jwtDecode(token);
     }
   } catch (error) {
     console.error('Token decoding error:', error);
     // Optionally redirect to login or handle invalid token
     router.push('/login');
     return null;
   }
 
   // Only run the query if we have a valid decoded token
   const {data: events, isLoading, isError} = useQuery({
     // Disable the query if no valid token
     enabled: !!decodedToken,
     queryKey: ['userEvents', decodedToken?.data?.id],
     queryFn: async () => {
       if (!decodedToken?.data?.id) throw new Error('No user ID found');
       const res = await instance.get(`/event/user/${decodedToken.data.id}`);
       return res.data.data.events;
     }
   });

   if (isLoading) return <h1>Loading . . .</h1>

   if(isError) return <h1>Something went wrong</h1>
 
   console.log("events invoked from review page",events)
 
   const currentEvents = (events || []).filter((event: any) => new Date(events.endDate) >= currentDate);
   const pastEvents = (events || []).filter((event: any) => new Date(events.endDate) < currentDate);
 
   const EventCard = ({ event }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <img
            src={`http://localhost:4700/images/${event.url}`}
            alt={event.name}
            className="w-24 h-24 rounded-md object-cover"
          />
          <div className="flex-1">
            <h3 className="text-lg font-semibold">{event.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(event.startDate).toLocaleDateString()}</span>
              <Clock className="h-4 w-4 ml-2" />
              <span>{new Date(event.startDate).toLocaleTimeString()}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
              <MapPin className="h-4 w-4" />
              <span>{event.locationName}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage
              src={
                profilePictureUrl
                  ? `http://localhost:4700/images/${profilePictureUrl}`
                  : ''
              }
              alt="profile-picture"
            />
            <AvatarFallback className="font-semibold">
              {firstName?.[0]}
              {lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold">
            Welcome back, {firstName} {lastName}!
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Events</CardTitle>
          <CardDescription>View your upcoming and past events</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming">
              <ScrollArea className="h-[400px] pr-4">
                {(events || [])
                  .filter(event => new Date(event.endDate) >= new Date())
                  .map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="past">
              <ScrollArea className="h-[400px] pr-4">
                {(events || [])
                  .filter(event => new Date(event.endDate) < new Date())
                  .map(event => (
                    <EventCard key={event.id} event={event} />
                  ))}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button variant="outline">View All Events</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
