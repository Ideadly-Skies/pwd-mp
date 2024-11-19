'use client';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useQuery } from "@tanstack/react-query"
import { usePathname } from "next/navigation"
import instance from "@/utils/axiosinstance"

interface TransactionItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export default function TransactionDetails() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'paid':
        return 'bg-green-500 hover:bg-green-600';
      case 'failed':
        return 'bg-red-500 hover:bg-red-600';
      default:
        return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const pathname = usePathname()
  const id = pathname.split('/')[4] // Assuming the event ID is in the URL
  const { data: transactionDetail, isLoading, isError } = useQuery<any>({
    queryKey: ['transactionDetail', id],
    queryFn: async () => {
      const res = await instance.get(`/transaction/transaction-detail/${id}`)
      return res.data.data
    }
  })

 if(isLoading) return <h1>Loading ...</h1>

  console.log(transactionDetail)  

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">Transaction Details</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Transaction Number: {transactionDetail.transactionNumber}</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-semibold">{transactionDetail.user.name}</span>
              <Avatar className="h-10 w-10">
                <AvatarImage src={`http://localhost:4700/images/${transactionDetail.user.profilePictureUrl}`} alt={transactionDetail.user.name} />
                <AvatarFallback>{transactionDetail.user.name.split(' ').map(n => n[0]).join('').toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex justify-between items-center">
            <Badge className={`${getStatusColor(transactionDetail.status)} text-white capitalize`}>
              {transactionDetail.status}
            </Badge>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactionDetail.items.map((item: any, index: number) => (
                <TableRow key={index}>
                  <TableCell>{item.item}</TableCell>
                  <TableCell className="text-right">{item.price.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{item.amount}</TableCell>
                  <TableCell className="text-right">{(item.price * item.amount).toLocaleString()}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={3} className="font-semibold text-right">Total Amount:</TableCell>
                <TableCell className="font-semibold text-right">{transactionDetail.totalPrice.toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}