import { prisma } from "../../connection";

export const createTransactionService = async({orderId, usersId, eventId, totalPrice}: any) => {
    
    // create new event service
    await prisma.transaction.create({
        data: {
            id: orderId,
            userId: usersId,
            eventId: Number(eventId),
            totalPrice: totalPrice
        }
    }) 
}

export const getTransactionListService = async({usersId, page, limit}: any) => {
    const offset = (page - 1) * limit
    const transactions = await prisma.transaction.findMany({
        where: {
          event: {
            eoId: usersId, // Filtering by organizer's ID (eoId)
          },
        },
        include: {
          user: {
            select: {
              username: true, // Include the username of the user making the transaction
              profilePictureUrl: true
            },
          },
          details: {
            select: {
              price: true,  // Include the price of the transaction detail
              qty: true,    // Include the quantity of the transaction detail
            },
          },
          status: {
            select: {
              status: true, // Include the status of the transaction
            },
            orderBy: {
              createdAt: 'desc',  // Get the most recent status
            },
            take: 1
          },
          event: {
            select: {
              name: true, // Include event name if needed
            },
          },
        },
        skip: offset,
        take: limit
      });
    //   console.log("Fetched Transactions:", JSON.stringify(transactions, null, 2));

    // Count the total number of transactions (for pagination metadata)
    const totalTransactions = await prisma.transaction.count({
        where: {
            event: {
                eoId: usersId,  // Same filter for total count
            },
        },
    });

      // Process the transactions to include username, amount, status, and date
        const processedTransactions = transactions.map((transaction) => {
            const totalAmount = transaction.details.reduce(
            (sum, detail) => sum + detail.price * detail.qty,0
         );

    // Access the latest status (it should be a single object now)
    const latestStatus = transaction.status.length > 0 ? transaction.status[0].status : 'Unknown';

    return {
      username: transaction.user.username,  // Username of the user
      amount: totalAmount,                  // Total amount for the transaction
      status: latestStatus,                 // Latest status
      date: transaction.createdAt,          // Date the transaction was created
      event: transaction.event.name,         // Event name
      profilePictureUrl: transaction.user.profilePictureUrl
    };
  });
//   console.log(processedTransactions)
  
  return {
    transactions: processedTransactions,
    totalPages: Math.ceil(totalTransactions / limit)
  };
};