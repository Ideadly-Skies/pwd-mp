import { prisma } from "@/connection";

export const getEventForOrganizerService = async({usersId}:any) => {
   return await prisma.event.findMany({
        where: {
            eoId: usersId
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
                            profilePictureUrl: true
                        }
                    }
                }
            }
        }
    })
}

export const getEventForOrganizerByIdService = async ({usersId, id}: any) => {
    const events = await prisma.event.findUnique({
        where: {
            id: id
        }
    })
}

export const dashboardPageDataService = async ({usersId}: any) => {
    const events = await prisma.event.findMany({
        where: {
          eoId: usersId,
        },
        include: {
          tickets: true,
          transactions: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  profilePictureUrl: true,
                },
              },
              status: {
                where: {
                    status: 'COMPLETED',
                }
              }
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
    
      const eventTypeData = events.reduce<{ [key: string]: number }>((acc, event) => {
        acc[event.type] = (acc[event.type] || 0) + 1;
        return acc;
      }, {});
    
      const eventTypeChartData = Object.entries(eventTypeData).map(([name, value]) => ({
        name,
        value,
      }));
    
      const totalEvents = events.length;
      const totalCapacity = events.reduce((sum, event) => sum + event.capacity, 0);
      const paidEvents = events.filter((event) => event.isPaid).length;
    
      const recentTransactions = events.flatMap((event) => event.transactions)
        .filter((transaction) => transaction.status.some((status) => status.status === 'COMPLETED'))
        .sort((a, b) => b.id - a.id)
        .slice(0, 10)
        .map(({ id, user, totalPrice }) => ({
          id,
          userName: `${user.firstName} ${user.lastName}`,
          amount: totalPrice,
          profilePictureUrl: user.profilePictureUrl || '/placeholder.svg?height=40&width=40',
        }));

        const totalRevenue = events.reduce((sum, event) => {
            const completedTransaction = event.transactions.filter((transaction) => 
            transaction.status.some((status) => status.status === 'COMPLETED')
            )
            const totalEventRevenue = completedTransaction.reduce((eventSum, transaction) => eventSum + transaction.totalPrice, 0);
            return sum + totalEventRevenue;
          }, 0);
  
        console.log('events:',events)
        console.log('eventTypeChartData:',eventTypeChartData)
        console.log('totalEvents:',totalEvents)
        console.log('totalCapacity:',totalCapacity)
        console.log('paidEvents:',paidEvents)
        console.log('recentTransactions:',recentTransactions)
        console.log('totalRevenue',totalRevenue)
    
      return {
        events,
        eventTypeChartData,
        totalEvents,
        totalCapacity,
        paidEvents,
        recentTransactions,
        totalRevenue
      };
    };
