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

const getDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1);
  const days = [];
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

// Helper function to generate hours in a day
const getHoursInDay = () => {
  return Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });
};

// Helper function to get months in a year
const getMonthsInYear = (year: number) => {
  return Array.from({ length: 12 }, (_, i) => {
    return new Date(year, i, 1);
  });
};

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
      setChartData(getChartDataByRange(data, dateRange))
    }
  }, [data, dateRange])

  // Function to get chart data based on selected range
  const getChartDataByRange = (data: any, range: string) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    switch (range) {
      case 'day': {
        // Generate all hours in the day
        const hoursData = getHoursInDay().map(hour => ({
          time: hour,
          revenue: 0
        }));

        // Map actual revenue data
        data.revenueByDate.forEach((item: any) => {
          const date = new Date(item.date);
          if (date.toDateString() === currentDate.toDateString()) {
            const hour = date.getHours();
            const hourString = `${hour.toString().padStart(2, '0')}:00`;
            const existingHour = hoursData.find(h => h.time === hourString);
            if (existingHour) {
              existingHour.revenue = item.total;
            }
          }
        });

        return hoursData;
      }

      case 'month': {
        // Generate all days in the current month
        const daysData = getDaysInMonth(currentYear, currentMonth).map(date => ({
          date: date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }),
          fullDate: date,
          revenue: 0
        }));

        // Map actual revenue data
        data.revenueByDate.forEach((item: any) => {
          const date = new Date(item.date);
          const dayData = daysData.find(d => 
            d.fullDate.toDateString() === date.toDateString()
          );
          if (dayData) {
            dayData.revenue = item.total;
          }
        });

        return daysData.map(({ date, revenue }) => ({ date, revenue }));
      }

      case 'year': {
        // Generate all months in the current year
        const monthsData = getMonthsInYear(currentYear).map(date => ({
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          revenue: 0
        }));

        // Map actual revenue data
        data.revenueByMonth.forEach((item: any) => {
          const [year, month] = item.month.split('-');
          const monthIndex = parseInt(month) - 1;
          if (parseInt(year) === currentYear && monthIndex >= 0 && monthIndex < 12) {
            monthsData[monthIndex].revenue = item.total;
          }
        });

        return monthsData;
      }

      default:
        return [];
    }
  };




  if(isLoading){
    return (
     <Progress value={50} className='items-center justify-center'/>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

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

        <Card>
          <CardHeader>
            <CardTitle>Revenue Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Per Hour</SelectItem>
                  <SelectItem value="month">Per Day</SelectItem>
                  <SelectItem value="year">Per Month</SelectItem>
                </SelectContent>
              </Select>
              <Button>Generate Report</Button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey={dateRange === 'day' ? 'time' : (dateRange === 'month' ? 'date' : 'month')}
                  tick={{ fontSize: 12 }}
                  interval={dateRange === 'day' ? 3 : (dateRange === 'month' ? 2 : 0)}
                />
                <YAxis 
                  tickFormatter={(value) => new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                    notation: 'compact'
                  }).format(value)}
                />
                <Tooltip 
                  formatter={(value: any) => formatCurrency(value)}
                  labelFormatter={(label) => {
                    switch(dateRange) {
                      case 'day':
                        return `Time: ${label}`;
                      case 'month':
                        return `Date: ${label}`;
                      case 'year':
                        return `Month: ${label}`;
                      default:
                        return label;
                    }
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  name="Revenue" 
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

//db page
export default DashboardPage