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
  // const totalBookedSeats = event.tickets.reduce(
  //   (acc, ticket) => acc + ticket.bookSeat,
  //   0,
  // );
  // const remainingSeats = totalCapacity - totalBookedSeats;

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
  const transactionsWithUserInfo = event.transactions.map((transaction: any) => ({
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
    // remainingSeats,
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
          status: {
            equals: 'paid',
          },
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              profilePictureUrl: true,
            },
          },
          details: true,
        },
        orderBy: {
          id: 'desc',
        },
        take: 10,
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

  // Calculate event type data for chart
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
  
  // Calculate total capacity from all tickets
  const totalCapacity = events.reduce((sum, event) => {
    return sum + event.tickets.reduce((acc, ticket) => acc + ticket.available, 0);
  }, 0);

  // Consider an event paid if it has any tickets with price > 0
  const paidEvents = events.filter((event) => 
    event.tickets.some(ticket => ticket.price > 0)
  ).length;

  const recentTransactions = events
    .flatMap((event) => event.transactions)
    .sort((a, b) => (b.id > a.id ? 1 : -1))
    .slice(0, 10)
    .map(({ id, user, totalPrice }) => ({
      id,
      userName: `${user.firstName} ${user.lastName}`,
      amount: totalPrice,
      profilePictureUrl:
        user.profilePictureUrl || '/placeholder.svg?height=40&width=40',
    }));

  const totalRevenue = events.reduce((sum, event) => {
    const completedTransactions = event.transactions.filter(
      (transaction) => transaction.status === 'paid',
    );
    const totalEventRevenue = completedTransactions.reduce(
      (eventSum, transaction) => eventSum + transaction.totalPrice,
      0,
    );
    return sum + totalEventRevenue;
  }, 0);

  // Sorting revenue by date, month, and year
  const sortedRevenueByDate: Record<string, number> = {};
  const sortedRevenueByMonth: Record<string, number> = {};
  const sortedRevenueByYear: Record<string, number> = {};
  

  events.forEach(event => {
    event.transactions.forEach(transaction => {
      if (transaction.status === 'paid') {
        const date = new Date(transaction.createdAt); // Assuming `createdAt` is present
        const dateKey = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
        const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`; // Format: YYYY-MM
        const yearKey = `${date.getFullYear()}`; // Format: YYYY

        // Revenue per date
        sortedRevenueByDate[dateKey] = (sortedRevenueByDate[dateKey] || 0) + transaction.totalPrice;

        // Revenue per month
        sortedRevenueByMonth[monthKey] = (sortedRevenueByMonth[monthKey] || 0) + transaction.totalPrice;

        // Revenue per year
        sortedRevenueByYear[yearKey] = (sortedRevenueByYear[yearKey] || 0) + transaction.totalPrice;
      }
    });
  });

  // Convert the sorted objects to arrays for charting
  const revenueByDate = Object.entries(sortedRevenueByDate).map(([date, total]) => ({ date, total }));
  const revenueByMonth = Object.entries(sortedRevenueByMonth).map(([month, total]) => ({ month, total }));
  const revenueByYear = Object.entries(sortedRevenueByYear).map(([year, total]) => ({ year, total }));

  return {
    events,
    eventTypeChartData,
    totalEvents,
    totalCapacity,
    paidEvents,
    recentTransactions,
    totalRevenue,
    revenueByDate,
    revenueByMonth,
    revenueByYear,
  };
};