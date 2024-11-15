'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BarChart, Calendar, DollarSign, Users, ImageIcon, Star, MessageSquare } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
import instance from '@/utils/axiosinstance'

interface Review {
  id: string;
  user?: {
    name: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

interface Transaction {
  id: string;
  user: {
    name: string;
  };
  totalPrice: number;
  createdAt: string;
}

interface EventDetails {
  event: {
    name: string;
    startDate: string;
    endDate: string;
    imageUrl?: string;
  };
  totalRevenue: number;
  totalCapacity: number;
  remainingSeats: number;
  transactions: Transaction[];
  reviews?: Review[];
}



export default function EventDetails() {
  const [activeTab, setActiveTab] = useState('overview')
  const router = useRouter()
  const pathname = usePathname()
  const id = pathname.split('/')[4] // Assuming the event ID is in the URL
  
  const { data: eventDetails, isLoading, isError } = useQuery<EventDetails>({
    queryKey: ['eventDetails', id],
    queryFn: async () => {
      const res = await instance.get(`/organizer/events/${id}`)
      return res.data.data
    }
  })

  console.log(eventDetails)

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading event details</div>
  if (!eventDetails) return <div>No event data available</div>

  const soldSeats = eventDetails.totalCapacity - eventDetails.remainingSeats
  const soldPercentage = (soldSeats / eventDetails.totalCapacity) * 100

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{eventDetails.event.name}</h1>
      
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={eventDetails.event.imageUrl || '/placeholder.svg'}
              alt={eventDetails.event.name}
              layout="fill"
              objectFit="cover"
              priority
            />
            {!eventDetails.event.imageUrl && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <ImageIcon className="w-16 h-16 text-white opacity-75" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="reviews">Reviews & Ratings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">IDR {eventDetails.totalRevenue.toLocaleString()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{eventDetails.totalCapacity}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available Seats</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{eventDetails.remainingSeats}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Event Date</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{new Date(eventDetails.event.startDate).toLocaleDateString()} - {new Date(eventDetails.event.endDate).toLocaleDateString()}</div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Ticket Sales Progress</CardTitle>
              <CardDescription>
                {soldSeats} out of {eventDetails.totalCapacity} tickets sold
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={soldPercentage} className="w-full" />
              <div className="mt-2 text-sm text-muted-foreground">
                {soldPercentage.toFixed(1)}% of tickets sold
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventDetails.transactions.slice(0, 5).map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${transaction.user.name}`} />
                            <AvatarFallback>{transaction.user.name[0]}</AvatarFallback>
                          </Avatar>
                          {transaction.user.name}
                        </div>
                      </TableCell>
                      <TableCell>IDR {transaction.totalPrice.toLocaleString()}</TableCell>
                      <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button variant="outline" className="w-full mt-4" onClick={() => setActiveTab('transactions')}>
                View All Transactions
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventDetails.transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Avatar className="h-8 w-8 mr-2">
                            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${transaction.user.name}`} />
                            <AvatarFallback>{transaction.user.name[0]}</AvatarFallback>
                          </Avatar>
                          {transaction.user.name}
                        </div>
                      </TableCell>
                      <TableCell>IDR {transaction.totalPrice.toLocaleString()}</TableCell>
                      <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="success">Completed</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews">
          <ReviewsAndRatings reviews={eventDetails.reviews || []} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ReviewsAndRatings({ reviews }: { reviews: any }) {
    if (!reviews || reviews.length === 0) {
      return (
        <Card>
          <CardHeader>
            <CardTitle>Reviews & Ratings</CardTitle>
            <CardDescription>No reviews available for this event yet.</CardDescription>
          </CardHeader>
        </Card>
      );
    }
  
    // Compute average rating
    const averageRating =
      reviews.reduce((sum: number, review: any) => sum + (review.rating || 0), 0) / reviews.length;
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reviews & Ratings</CardTitle>
          <CardDescription>
            Average Rating: {averageRating.toFixed(1)} / 5
            <div className="flex items-center mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(averageRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviews.map((review: any, index: number) => (
              <div key={index} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage
                        src={review.reviewer?.profilePictureUrl || `https://api.dicebear.com/6.x/initials/svg?seed=${review.reviewer?.name || 'Anonymous'}`}
                      />
                      <AvatarFallback>{review.reviewer?.name?.[0] || 'A'}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{review.reviewer?.name || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= (review.rating || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600">{review.comments}</p>
                {review.feedback && <p className="text-sm text-gray-500 mt-1">Feedback: {review.feedback}</p>}
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }