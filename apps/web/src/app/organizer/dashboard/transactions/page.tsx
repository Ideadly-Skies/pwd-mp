'use client';
import React from 'react';
import { useState, Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
import { Skeleton } from '@/components/ui/skeleton';
import instance from '@/utils/axiosinstance';

// interface Transaction {
//   id: string;
//   date: string;
//   amount: number;
//   status: 'completed' | 'pending' | 'failed';
//   customerName: string;
// }

function TransactionListSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Event Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(5)].map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-4 w-[100px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[80px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[150px]" />
            </TableCell>
            <TableCell>
              <Skeleton className="h-4 w-[100px]" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function TransactionList() {
  const [page, setPage] = useState(1);
  // const [limit, setLimit] = useState(8);
  const { data, isLoading, error } = useQuery({
    queryKey: ['transactionsList', page],
    queryFn: async () => {
      const response = await instance.get(`/transaction/transaction-lists`, {
        params: {
          page,
          limit: 8
        },
      });
      return response.data.data;
    },
    keepPreviousData: false
  });
  // console.log('Received data:', data);
  console.log('Fetched data for page:', page, data);

  if (isLoading) return <TransactionListSkeleton />;
  if (error) return <p>Error loading transactions</p>;

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Username</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Event Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data && Array.isArray(data.transactions) && data.transactions.length > 0 ? (
            data.transactions.map((transaction: any) => (
              <TableRow key={transaction.username + transaction.date}>
                <TableCell>{transaction.username}</TableCell>
                <TableCell>
                  {transaction.amount !== undefined ? `IDR ${transaction.amount.toFixed(2)}` : 'N/A'}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      transaction.status === 'COMPLETED'
                        ? 'bg-green-100 text-green-800'
                        : transaction.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : transaction.status === 'CANCELLED'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell>{transaction.date ? format(new Date(transaction.date), 'PPP') : 'Invalid date'}</TableCell>
                <TableCell>{transaction.event}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5}>No transactions available.</TableCell>
            </TableRow>
          )}
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
        <span> Page {page} of {data.totalPages}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(page + 1)}
          disabled={page === data.totalPages}
        >
          <span className="sr-only">Next page</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<TransactionListSkeleton />}>
            <TransactionList />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}


  