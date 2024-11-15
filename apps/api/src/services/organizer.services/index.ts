import { prisma } from '@/connection';

export const getEventForOrganizerService = async ({ usersId }: any) => {
  return await prisma.event.findMany({
    where: {
      eoId: usersId,
    },
    include: {
      tickets: true,
      transactions: true,
      reviews: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              profilePictureUrl: true,
            },
          },
        },
      },
    },
  });
};

export const getEventForOrganizerByIdService = async ({ usersId, id }: any) => {
  const eventId = parseInt(id, 10);
  const event = await prisma.event.findUnique({
    where: {
      id: eventId,
      eoId: usersId,
    },
    include: {
      transactions: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              profilePictureUrl: true,
            },
          },
        },
      },
      tickets: true,
      reviews: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              profilePictureUrl: true,
            },
          },
        },
      },
    },
  });

  if (!event) {
    throw new Error(
      'Event not found or you are not authorized to view this event.',
    );
  }

  // Calculate totals and ratings without additional reduce calls
  const totalRevenue = event.transactions.reduce(
    (acc, transaction) => acc + transaction.totalPrice,
    0,
  );

  const totalCapacity = event.tickets.reduce(
    (acc, ticket) => acc + ticket.available,
    0,
  );
  const totalBookedSeats = event.tickets.reduce(
    (acc, ticket) => acc + ticket.bookSeat,
    0,
  );
  const remainingSeats = totalCapacity - totalBookedSeats;

  const averageRating =
    event.reviews.length > 0
      ? event.reviews.reduce((acc, review) => acc + review.rating, 0) /
        event.reviews.length
      : null;

  const reviewsWithReviewerInfo = event.reviews.map((review) => ({
    rating: review.rating,
    comments: review.comments,
    feedback: review.feedback,
    reviewer: {
      name: `${review.user.firstName} ${review.user.lastName}`,
      profilePictureUrl: review.user.profilePictureUrl,
    },
  }));

  // Adding status directly inside transaction mapping
  const transactionsWithUserInfo = event.transactions.map((transaction) => ({
    ...transaction,
    user: {
      name: `${transaction.user.firstName} ${transaction.user.lastName}`,
      profilePictureUrl: transaction.user.profilePictureUrl,
    },
    status: transaction.status, // Directly include the status field
  }));

  console.log(transactionsWithUserInfo)

  return {
    event,
    totalRevenue,
    totalCapacity,
    remainingSeats,
    averageRating,
    reviews: reviewsWithReviewerInfo,
    transactions: transactionsWithUserInfo,
  };
};

export const dashboardPageDataService = async ({ usersId }: any) => {
  const events = await prisma.event.findMany({
    where: {
      eoId: usersId,
    },
    include: {
      tickets: true,
      transactions: {
        where: {
          status: 'COMPLETED', // Filter transactions by status
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              profilePictureUrl: true,
            },
          },
        },
        orderBy: {
          id: 'desc',
        },
        take: 10, // Limit to the 10 most recent transactions
      },
      reviews: {
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              profilePictureUrl: true,
            },
          },
        },
      },
      tags: true,
      category: {
        select: {
          name: true,
        },
      },
      images: true,
    },
  });

  const eventTypeData = events.reduce<{ [key: string]: number }>(
    (acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1;
      return acc;
    },
    {},
  );

  const eventTypeChartData = Object.entries(eventTypeData).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );

  const totalEvents = events.length;
  const totalCapacity = events.reduce((sum, event) => sum + event.capacity, 0);
  const paidEvents = events.filter((event) => event.isPaid).length;

  const recentTransactions = events
    .flatMap((event) => event.transactions)
    .sort((a: any, b: any) => b.id - a.id)
    .slice(0, 10)
    .map(({ id, user, totalPrice }) => ({
      id,
      userName: `${user.firstName} ${user.lastName}`,
      amount: totalPrice,
      profilePictureUrl:
        user.profilePictureUrl || '/placeholder.svg?height=40&width=40',
    }));

  const totalRevenue = events.reduce((sum, event) => {
    const completedTransaction = event.transactions.filter((transaction) =>
      transaction.status === 'COMPLETED', // Filter the completed transactions directly
    );
    const totalEventRevenue = completedTransaction.reduce(
      (eventSum, transaction) => eventSum + transaction.totalPrice,
      0,
    );
    return sum + totalEventRevenue;
  }, 0);

  return {
    events,
    eventTypeChartData,
    totalEvents,
    totalCapacity,
    paidEvents,
    recentTransactions,
    totalRevenue,
  };
};