"use client"

import { useState } from "react"
import { Star, Calendar, MapPin } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Event {
  id: string
  name: string
  date: string
  location: string
  imageUrl: string
}

export default function UserDashboard({ userName = "John Doe", userAvatar = "/placeholder.svg?height=40&width=40" }) {
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")
  const [hoveredStar, setHoveredStar] = useState(0)

  const event: Event = {
    id: "1",
    name: "Tech Conference 2024",
    date: "2024-06-15",
    location: "San Francisco, CA",
    imageUrl: "/placeholder.svg?height=100&width=200",
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submitted review:", { rating, review })
    // Here you would typically send this data to your backend
    alert("Thank you for your review!")
    setRating(0)
    setReview("")
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback>{userName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold">Welcome back, {userName}!</h1>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Leave a Review</CardTitle>
          <CardDescription>Share your thoughts on the event you attended</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <img src={event.imageUrl} alt={event.name} className="mb-2 rounded-lg" />
            <h3 className="text-lg font-semibold">{event.name}</h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{event.date}</span>
              <MapPin className="h-4 w-4 ml-2" />
              <span>{event.location}</span>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="rating">Your Rating</Label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-6 w-6 cursor-pointer ${
                      star <= (hoveredStar || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                  />
                ))}
              </div>
            </div>
            <div className="mb-4">
              <Label htmlFor="review">Your Review</Label>
              <Textarea
                id="review"
                placeholder="Write your review here..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={4}
              />
            </div>
            <Button type="submit">Submit Review</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Past Events</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You have no past events to display.</p>
        </CardContent>
        <CardFooter>
          <Button variant="outline">View All Events</Button>
        </CardFooter>
      </Card>
    </div>
  )
}