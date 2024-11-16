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

export const getTransactionListService = async ({ usersId, page, limit }: any) => {
  const offset = (page - 1) * limit;

  // Fetch transactions with relevant fields
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
          name: true, // Include event name if needed
        },
      },
    },
    skip: offset,
    take: limit,
  });

  // Count the total number of transactions for pagination
  const totalTransactions = await prisma.transaction.count({
    where: {
      event: {
        eoId: usersId, // Same filter for total count
      },
    },
  });

  // Process the transactions to create the response structure
  const processedTransactions = transactions.map((transaction) => {
    return {
      username: transaction.user.username,                // Username of the user
      amount: transaction.totalPrice,                     // Use totalPrice from the Transaction model
      status: transaction.status || 'Unknown',            // Use status directly
      date: transaction.createdAt,                        // Transaction creation date
      event: transaction.event.name,                      // Event name
      profilePictureUrl: transaction.user.profilePictureUrl, // User's profile picture URL
    };
  });

  return {
    transactions: processedTransactions,
    totalPages: Math.ceil(totalTransactions / limit), // Pagination logic
  };
};

export const updateTransactionStatusService = async (orderId: string, status: string) => {
  return prisma.transaction.update({
    where: { id: orderId },
    data: { status },
  });
};