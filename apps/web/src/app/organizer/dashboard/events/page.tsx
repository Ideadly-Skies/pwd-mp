'use client';

import { useState, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, ArrowUpDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import instance from '@/utils/axiosinstance';

interface Event {
  id: number;
  name: string;
  type: string;
  startDate: string;
  capacity: number;
  totalCapacity: number;
}

function EventListSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Start Date</TableHead>
          <TableHead>Capacity</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-4 w-[250px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[150px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[50px]" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function EventList() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data, isLoading, error } = useQuery({
    queryKey: ['events', page],
    queryFn: async () => {
      const response = await instance.get(`organizer/events`, {
        params: {
          page,
          limit: 8,
        },
      });
      return response.data.data;
    },
  });

  console.log(data);

  const sortedAndFilteredEvents = useMemo(() => {
    if (!data?.events) return [];

    return data.events
      .filter((event: Event) =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a: Event, b: Event) =>
        sortOrder === 'desc'
          ? b.totalCapacity - a.totalCapacity
          : a.totalCapacity - b.totalCapacity
      );
  }, [data, searchTerm, sortOrder]);

  if (isLoading) return <EventListSkeleton />;
  if (error) return <p>Error loading events</p>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="relative w-full sm:w-auto flex-grow">
          <Input
            placeholder="Search events"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            className="pl-10 pr-4 py-2 w-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>
        <Button
          variant="outline"
          onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
          className="w-full sm:w-auto whitespace-nowrap"
        >
          <ArrowUpDown className="mr-2 h-4 w-4" />
          Sort by Capacity {sortOrder === 'desc' ? '▼' : '▲'}
        </Button>
      </div>
      {sortedAndFilteredEvents.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-500">
            No events founded.
          </p>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Capacity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedAndFilteredEvents.map((event: Event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <Link
                      href={`/organizer/dashboard/events/${event.id}`}
                      className="hover:text-blue-700 font-bold"
                    >
                      {event.name}
                    </Link>
                  </TableCell>
                  <TableCell>{event.type}</TableCell>
                  <TableCell>
                    {format(new Date(event.startDate), 'PPP')}
                  </TableCell>
                  <TableCell>{event.totalCapacity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <span> Page {page} of {data?.totalPages}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={sortedAndFilteredEvents.length < 8}
            >
              <span className="sr-only">Next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default function EventsPage() {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">My Events</CardTitle>
          <Link href="/create-event" passHref>
            <Button>Create Event</Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<EventListSkeleton />}>
            <EventList />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}