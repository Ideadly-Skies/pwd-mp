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

export const updateTransactionStatusService = async (orderId: string, status: string) => {
    return prisma.transaction.update({
      where: { id: orderId },
      data: { status },
    });
};

export const createTransactionDetailService = async({detailId, orderId, regularTicketPrice, regularTicketQty, vipTicketPrice, vipTicketQty}: any) => {

    // post to the transactionDetails db
    await prisma.transactionDetail.create({
        data: {
            id: detailId,
            transactionId: orderId,
            regularTicketPrice: regularTicketPrice,
            regularTicketQty: regularTicketQty,
            vipTicketPrice: vipTicketPrice,
            vipTicketQty: vipTicketQty 
        }
    })
} 


export const getTransactionListService = async ({ 
  usersId, 
  page, 
  limit 
}: any) => {
  const offset = (page - 1) * limit;

  const transactions = await prisma.transaction.findMany({
    where: {
      event: {
        eoId: usersId,
      },
    },
    include: {
      user: {
        select: {
          username: true,
          profilePictureUrl: true,
        },
      },
      details: {
        select: {
          regularTicketQty: true,
          regularTicketPrice: true,
          vipTicketQty: true,
          vipTicketPrice: true,
        },
      },
      event: {
        select: {
          name: true,
        },
      },
    },
    skip: offset,
    take: limit,
    orderBy: {
      createdAt: 'desc',
    },
  });

  const totalTransactions = await prisma.transaction.count({
    where: {
      event: {
        eoId: usersId,
      },
    },
  });

  const calculateTotalAmount = (details?: {
    regularTicketQty: number | null;
    regularTicketPrice: number | null;
    vipTicketQty: number | null;
    vipTicketPrice: number | null;
  }) => {
    if (!details) return 0;
  
    const regularTotal = (details.regularTicketQty || 0) * (details.regularTicketPrice || 0);
    const vipTotal = (details.vipTicketQty || 0) * (details.vipTicketPrice || 0);
    return regularTotal + vipTotal;
  };

  const processedTransactions = transactions.map((transaction) => {
    // Calculate total amount considering both regular and VIP tickets
    const totalAmount = calculateTotalAmount(transaction.details[0]);

    return {
      id: transaction.id,
      username: transaction.user.username,
      amount: totalAmount,
      status: transaction.status,
      date: transaction.createdAt,
      event: transaction.event.name,
      profilePictureUrl: transaction.user.profilePictureUrl,
    };
  });

  return {
    transactions: processedTransactions,
    totalPages: Math.ceil(totalTransactions / limit),
    currentPage: page,
    totalTransactions,
  };
};

  export const getTransactionDetailService = async ({ id, usersId }: { id: string; usersId: string }) => {
    const transactionDetails = await prisma.transaction.findFirst({
      where: {
        id: id,
        event: {
          eoId: usersId, // Ensure the transaction is associated with the event organized by this EventOrganizer
        },
      },
      include: {
        details: true, // Include related transaction details
        user: {
          select: {
            firstName: true,
            lastName: true,
            profilePictureUrl: true,
          },
        },
      },
    });
  
    if (!transactionDetails) {
      throw new Error('Transaction not found or access denied.');
    }
  
    // Format the data to match the expected output
    const formattedTransaction = {
      transactionNumber: transactionDetails.id,
      user: {
        name: `${transactionDetails.user.firstName} ${transactionDetails.user.lastName}`,
        profilePictureUrl: transactionDetails.user.profilePictureUrl,
      },
      status: transactionDetails.status,
      totalPrice: transactionDetails.totalPrice,
      items: transactionDetails.details.flatMap((detail) => {
        const items = [];
        
        // Add regular ticket if quantity exists
        if (detail.regularTicketQty) {
          items.push({
            item: 'Regular Ticket',
            amount: detail.regularTicketQty,
            price: detail.regularTicketPrice,
          });
        }
        
        // Add VIP ticket if quantity exists
        if (detail.vipTicketQty) {
          items.push({
            item: 'VIP Ticket',
            amount: detail.vipTicketQty,
            price: detail.vipTicketPrice,
          });
        }
        
        return items;
      }),
    };
  
    return formattedTransaction;
  };