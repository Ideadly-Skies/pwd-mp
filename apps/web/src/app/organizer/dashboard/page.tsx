'use client';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import instance from '@/utils/axiosinstance';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { isError } from 'cypress/types/lodash';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
  const [dateRange, setDateRange] = useState('year');
  const [chartData, setChartData] = useState([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await instance.get(`organizer/dashboard`);
      return response.data.data;
    },
  });

  console.log(data);

  useEffect(() => {
    if (data) {
      setChartData(getChartDataByRange(data, dateRange));
    }
  }, [data, dateRange]);

  // Function to get chart data based on selected range
  const getChartDataByRange = (data: any, range: string) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();

    switch (range) {
      case 'day': {
        // Filter and map revenue data for the current month
        const currentMonthRevenue = data.revenueByDate
          .map((item: any) => {
            const date = new Date(item.date);
            return {
              date: date.getDate().toString(), // Numeric date for x-axis
              fullDate: date.toLocaleDateString('en-US', {
                // Full date for tooltip
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }),
              revenue: item.total,
              originalDate: date,
            };
          })
          .sort((a: any, b: any) => a.originalDate - b.originalDate);

        // Create array for all days in current month
        const daysInMonth = new Date(
          currentYear,
          currentMonth + 1,
          0,
        ).getDate();
        const allDays = Array.from({ length: daysInMonth }, (_, i) => {
          const currentDate = new Date(currentYear, currentMonth, i + 1);
          return {
            date: (i + 1).toString(),
            fullDate: currentDate.toLocaleDateString('en-US', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            }),
            revenue: 0,
            originalDate: currentDate,
          };
        });

        // Merge actual revenue data with all days
        currentMonthRevenue.forEach((item: any) => {
          const matchingDay = allDays.find(
            (day) => day.originalDate.getDate() === item.originalDate.getDate(),
          );
          if (matchingDay) {
            matchingDay.revenue = item.revenue;
          }
        });

        // Remove the originalDate property before returning
        return allDays.map(({ date, fullDate, revenue }) => ({
          date,
          fullDate,
          revenue,
        }));
      }
      case 'month': {
        // Filter and map revenue data for the current year
        const currentYearRevenue = data.revenueByMonth
          .map((item: any) => {
            const date = new Date(item.month + '-01');
            return {
              month: date.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              }),
              revenue: item.total,
              originalDate: date,
            };
          })
          .sort((a: any, b: any) => a.originalDate - b.originalDate);

        // Create array for all months in the year
        const allMonths = getMonthsInYear(currentYear).map((date) => ({
          month: date.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          }),
          revenue: 0,
          originalDate: date,
        }));

        // Merge actual revenue data with all months
        currentYearRevenue.forEach((item: any) => {
          const matchingMonth = allMonths.find(
            (month) =>
              month.originalDate.getMonth() === item.originalDate.getMonth() &&
              month.originalDate.getFullYear() ===
                item.originalDate.getFullYear(),
          );
          if (matchingMonth) {
            matchingMonth.revenue = item.revenue;
          }
        });

        // Remove the originalDate property before returning
        return allMonths.map(({ month, revenue }) => ({ month, revenue }));
      }

      case 'year': {
        // Get the last 5 years including current year
        const currentYear = new Date().getFullYear();
        const last5Years = Array.from({ length: 5 }, (_, i) => {
          const year = currentYear - 4 + i;
          return {
            year: year.toString(),
            revenue: 0,
            originalDate: new Date(year, 0, 1),
          };
        });

        // Fill in the revenue data where available
        if (data.revenueByYear) {
          data.revenueByYear.forEach((item: any) => {
            const yearData = last5Years.find((y) => y.year === item.year);
            if (yearData) {
              yearData.revenue = item.total;
            }
          });
        }

        // Sort by year and remove the originalDate property
        return last5Years
          .sort((a: any, b: any) => a.originalDate - b.originalDate)
          .map(({ year, revenue }) => ({ year, revenue }));
      }

      default:
        return [];
    }
  };

  if (isLoading) {
    return <Progress value={50} className="items-center justify-center" />;
  }


  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <h1 className="text-3xl font-bold">Event Management Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalEvents}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Capacity
              </CardTitle>
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
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
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
                    <div
                      key={transaction.id}
                      className="flex items-center space-x-4"
                    >
                      <Avatar>
                        <AvatarImage
                          src={transaction.profilePictureUrl}
                          alt={transaction.userName}
                        />
                        <AvatarFallback>
                          {transaction.userName
                            .split(' ')
                            .map((n: any) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {transaction.userName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Transaction #{transaction.id}
                        </p>
                      </div>
                      <div className="font-medium items-start justify-start">
                        IDR {transaction.amount}
                      </div>
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
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {data.eventTypeChartData.map(
                      (entry: any, index: number) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ),
                    )}
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
                  <SelectItem value="day">By Date (This Month)</SelectItem>
                  <SelectItem value="month">By Month</SelectItem>
                  <SelectItem value="year">By Year</SelectItem>
                </SelectContent>
              </Select>
              <Button>Generate Report</Button>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60, // Increased bottom margin to accommodate angled labels
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey={
                    dateRange === 'year'
                      ? 'year'
                      : dateRange === 'month'
                        ? 'month'
                        : 'date'
                  }
                  tick={{
                    fontSize: 12,
                    angle: -45, // Angle the labels
                    textAnchor: 'end', // Align the text at the end
                    dy: 20, // Move labels down slightly
                  }}
                  height={60} // Increased height for the axis to prevent label clipping
                  interval={0} // Show all ticks
                />
                <YAxis
                  tickFormatter={(value) =>
                    new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                      notation: 'compact',
                    }).format(value)
                  }
                />
                <Tooltip
                  formatter={(value: any) => formatCurrency(value)}
                  labelFormatter={(label, payload) => {
                    if (dateRange === 'day' && payload && payload[0]) {
                      return `Date: ${payload[0].payload.fullDate}`;
                    }
                    switch (dateRange) {
                      case 'month':
                        return `Month: ${label}`;
                      case 'year':
                        return `Year: ${label}`;
                      default:
                        return `Date: ${label}`;
                    }
                  }}
                  cursor={{ strokeWidth: 2 }} // Make the hover line more visible
                />
                <Legend verticalAlign="top" height={36} />
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
  );
};

//db page
export default DashboardPage;
