'use client';

import React, { useState, Suspense, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, Search, ChevronDown } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import instance from '@/utils/axiosinstance';
import Link from 'next/link';

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
  const [limit] = useState(8);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'revenue' | 'status'>('revenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data, isLoading, error } = useQuery({
    queryKey: ['transactionsList', page],
    queryFn: async () => {
      const response = await instance.get(`/transaction/transaction-lists`, {
        params: {
          page,
          limit,
        },
      });
      return response.data.data;
    },
  });

  console.log('Fetched data for page:', data);

  const filteredAndSortedTransactions = useMemo(() => {
    if (!data?.transactions) return [];
    
    let filtered = data.transactions.filter((transaction: any) =>
      transaction.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.event.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return filtered.sort((a: any, b: any) => {
      if (sortBy === 'revenue') {
        return sortOrder === 'desc' ? b.amount - a.amount : a.amount - b.amount;
      } else {
        const statusOrder = { paid: 0, pending: 1, failed: 2 };
        return sortOrder === 'desc' 
          ? statusOrder[b.status as keyof typeof statusOrder] - statusOrder[a.status as keyof typeof statusOrder]
          : statusOrder[a.status as keyof typeof statusOrder] - statusOrder[b.status as keyof typeof statusOrder];
      }
    });
  }, [data, searchTerm, sortBy, sortOrder]);

  if (isLoading) return <TransactionListSkeleton />;
  if (error) return <p>Error loading transactions</p>;

  const handleSort = (newSortBy: 'revenue') => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('desc');
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div className="relative flex-grow mr-4">
          <Input
            type="text"
            placeholder="Search by username or event name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Sort by {sortBy === 'revenue' ? 'Revenue' : 'Status'} {sortOrder === 'desc' ? '▼' : '▲'}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleSort('revenue')}>
              Sort by Revenue {sortBy === 'revenue' && (sortOrder === 'desc' ? '▼' : '▲')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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
          {filteredAndSortedTransactions.length > 0 ? (
            filteredAndSortedTransactions.map((transaction: any) => (
              <TableRow key={transaction.username + transaction.date}>
                <TableCell>
                  <Link href={`/organizer/dashboard/transactions/${transaction.id}`} className='hover:text-blue-700 font-bold'>
                    {transaction.username}
                  </Link>
                </TableCell>
                <TableCell>
                  {transaction.amount !== undefined ? `IDR ${transaction.amount.toFixed(2)}` : 'N/A'}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      transaction.status === 'paid'
                        ? 'bg-green-100 text-green-800'
                        : transaction.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : transaction.status === 'failed'
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
              <TableCell colSpan={5} className="text-center">No transactions found matching your search criteria.</TableCell>
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