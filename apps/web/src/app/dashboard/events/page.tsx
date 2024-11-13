'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import instance from '@/utils/axiosinstance'

interface Event {
  id: number
  name: string
  type: string
  startDate: string
  capacity: number
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
            <TableCell><Skeleton className="h-4 w-[250px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
            <TableCell><Skeleton className="h-4 w-[50px]" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function EventList() {
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = useQuery({
    queryKey: ['events', page],
    queryFn: async () => {
      const response = await instance.get(`organizer/events`)
      return response.data
    },
  })

  console.log(data)

  if (isLoading) return <EventListSkeleton />
  if (error) return <p>Error loading events</p>

  return (
    <div>
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
          {data.data.map((event: Event) => (
            <TableRow key={event.id}>
            <Link href={`/admin/events/${event.id}`} className='hover:text-blue-700 font-bold'>
              <TableCell className="font-medium">{event.name}</TableCell>       
            </Link>
              <TableCell>{event.type}</TableCell>
              <TableCell>{format(new Date(event.startDate), 'PPP')}</TableCell>
              <TableCell>{event.capacity}</TableCell>
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
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page + 1)}
          disabled={data.data.length < 10} // Assuming 10 is the page limit
        >
          <span className="sr-only">Next page</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
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
  )
}