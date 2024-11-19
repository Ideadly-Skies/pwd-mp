'use client'
import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import instance from '@/utils/axiosinstance'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"





const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export const DashboardPage = () => {
  const [dateRange, setDateRange] = useState('year')
  const [chartData, setChartData] = useState([])

 

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await instance.get(`organizer/dashboard`)
      return response.data.data
    },
  })

  console.log(data)

  useEffect(() => {
    if (data) {
      // Generate chart data based on fetched data
      setChartData(generateChartData(data.events, dateRange))
    }
  }, [data, dateRange])

  const generateChartData = (events: any, range: any) => {
    const now = new Date()
    let data = []
    if (range === 'day') {
      for (let i = 0; i < 24; i++) {
        data.push({
          time: `${i}:00`,
          capacity: events.reduce((sum: any, event: any) => sum + Math.floor(Math.random() * 100), 0), // Replace with actual logic if available
          registrations: events.reduce((sum: any, event: any) => sum + Math.floor(Math.random() * 50), 0) // Replace with actual logic if available
        })
      }
    } else if (range === 'month') {
      for (let i = 1; i <= 30; i++) {
        data.push({
          date: `${now.getMonth() + 1}/${i}`,
          capacity: events.reduce((sum: any, event: any) => sum + Math.floor(Math.random() * 1000), 0),
          registrations: events.reduce((sum: any, event: any) => sum + Math.floor(Math.random() * 500), 0)
        })
      }
    } else { // year
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      for (let i = 0; i < 12; i++) {
        data.push({
          month: months[i],
          capacity: events.reduce((sum: any, event: any) => sum + Math.floor(Math.random() * 10000), 0),
          registrations: events.reduce((sum: any, event: any) => sum + Math.floor(Math.random() * 5000), 0)
        })
      }
    }
    return data
  }



  if(isLoading){
    return (
     <Progress value={50} className='items-center justify-center'/>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <h1 className="text-3xl font-bold">Event Management Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalEvents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalCapacity}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.paidEvents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalRevenue}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {data.recentTransactions.map((transaction): any => (
                  <div key={transaction.id} className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={transaction.profilePictureUrl} alt={transaction.userName} />
                      <AvatarFallback>{transaction.userName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{transaction.userName}</p>
                      <p className="text-sm text-muted-foreground">Transaction #{transaction.id}</p>
                    </div>
                    <div className="font-medium items-start justify-start">IDR {transaction.amount}</div>
                  </div>
                ))}
              </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Event Types Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data.eventTypeChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {data.eventTypeChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="capacity">Capacity</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Event Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={dateRange === 'day' ? 'time' : (dateRange === 'month' ? 'date' : 'month')} />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="capacity" fill="#8884d8" name="Capacity" />
                    <Bar yAxisId="right" dataKey="registrations" fill="#82ca9d" name="Registrations" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Event List</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Paid</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-medium">{event.name}</TableCell>
                        <TableCell>{event.type}</TableCell>
                        <TableCell>{new Date(event.startDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(event.endDate).toLocaleDateString()}</TableCell>
                        <TableCell>{event.capacity}</TableCell>
                        <TableCell>{event.isPaid ? 'Yes' : 'No'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="capacity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Capacity Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={dateRange === 'day' ? 'time' : (dateRange === 'month' ? 'date' : 'month')} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="capacity" stroke="#8884d8" name="Capacity" />
                    <Line type="monotone" dataKey="registrations" stroke="#82ca9d" name="Registrations" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Per Day</SelectItem>
                  <SelectItem value="month">Per Month</SelectItem>
                  <SelectItem value="year">Per Year</SelectItem>
                </SelectContent>
              </Select>
              <Button>Generate Report</Button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={dateRange === 'day' ? 'time' : (dateRange === 'month' ? 'date' : 'month')} />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="capacity" stroke="#8884d8" name="Capacity" />
                <Line yAxisId="right" type="monotone" dataKey="registrations" stroke="#82ca9d" name="Registrations" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
export default DashboardPage