import { prisma } from "../../connection";

export const createTransactionService = async({orderId, usersId, eventId, totalPrice}: any) => {
    
    // create new event service
    await prisma.transaction.create({
        data: {
            id: orderId,
            userId: usersId,
            eventId: Number(eventId),
            totalPrice: totalPrice,
        }
    }) 
}

export const getTransactionListService = async({ usersId, page, limit }: any) => {
  const offset = (page - 1) * limit;

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
          profilePictureUrl: true,
        },
      },
      event: {
        select: {
          name: true,        // Include event name if needed
          tickets: {         // Include the tickets relation
            select: {
              price: true,  // Include ticket price
              available: true, // Include available quantity
            }
          },
        },
      },
    },
    skip: offset,
    take: limit,
  });

  // Count the total number of transactions (for pagination metadata)
  const totalTransactions = await prisma.transaction.count({
    where: {
      event: {
        eoId: usersId, // Same filter for total count
      },
    },
  });

  // Process the transactions to include username, amount, status, and date
  const processedTransactions = transactions.map((transaction) => {
    // Assuming you want to calculate the total price based on associated EventTicket(s)
    const totalAmount = transaction.event.tickets.reduce(
      (sum, ticket) => sum + ticket.price * ticket.available, // Adjust this logic based on your model
      0
    );

    // Access the status directly (it's a field in the Transaction model)
    const latestStatus = transaction.status || 'Unknown'; // If status is a string or field, use it directly

    return {
      username: transaction.user.username, // Username of the user
      amount: totalAmount,                 // Total amount for the transaction
      status: latestStatus,                // Latest status (just use the field directly)
      date: transaction.createdAt,         // Date the transaction was created
      event: transaction.event.name,       // Event name
      profilePictureUrl: transaction.user.profilePictureUrl, // User's profile picture URL
    };
  });

  return {
    transactions: processedTransactions,
    totalPages: Math.ceil(totalTransactions / limit), // Pagination logic
  };
};