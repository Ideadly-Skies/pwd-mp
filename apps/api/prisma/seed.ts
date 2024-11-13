import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create or find existing categories
  const categoryNames = ['Music Festival', 'Conference', 'Workshop', 'Sports', 'Exhibition'];
  const categories = await Promise.all(
    categoryNames.map(async (name) => {
      // Check if the category already exists
      const existingCategory = await prisma.category.findFirst({
        where: { name },
      });

      // If it doesn't exist, create it
      if (existingCategory) {
        return existingCategory;
      }

      return prisma.category.create({
        data: { name },
      });
    })
  );

  // Create or find existing tags
  const tagNames = ['Outdoor', 'Indoor', 'Family Friendly', 'Adults Only', 'Live Music'];
  const tags = await Promise.all(
    tagNames.map(async (name) => {
      // Check if the tag already exists
      const existingTag = await prisma.tag.findFirst({
        where: { name },
      });

      // If it doesn't exist, create it
      if (existingTag) {
        return existingTag;
      }

      return prisma.tag.create({
        data: { name },
      });
    })
  );

  // Create new users
  const hashedPassword = await hash('password123', 15);
  const users = await Promise.all(
    Array.from({ length: 10 }, async (_, index) => {
      const email = `seeduser${index + 1}@example.com`;
      const username = `seeduser${index + 1}`;

      // Check if user already exists
      const existingUser  = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] },
      });

      if (existingUser ) {
        return existingUser ;
      }

      return prisma.user.create({
        data: {
          firstName: `SeedUser ${index + 1}`,
          lastName: `LastName${index + 1}`,
          username,
          email,
          password: hashedPassword,
          referralCode: `REF${index + 1}${Math.random().toString(36).substring(7)}`,
          totalPoint: Math.floor(Math.random() * 1000),
          isValid: true,
        },
      });
    })
  );

  // Create new event organizers
  const organizers = await Promise.all(
    Array.from({ length: 5 }, async (_, index) => {
      const email = `seedorganizer${index + 1}@example.com`;
      const username = `seedorg${index + 1}`;

      // Check if organizer already exists
      const existingOrganizer = await prisma.eventOrganizer.findFirst({
        where: { OR: [{ email }, { username }] },
      });

      if (existingOrganizer) {
        return existingOrganizer;
      }

      return prisma.eventOrganizer.create({
        data: {
          firstName: `SeedOrganizer${index + 1}`,
          lastName: `OrgLast${index + 1}`,
          username,
          email,
          password: hashedPassword,
          companyName: `SeedCompany ${index + 1}`,
          phoneNumber: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
          pic: `Seed Person In Charge ${index + 1}`,
        },
      });
    })
  );

  // Create new events
  const events = await Promise.all(
    Array.from({ length: 10 }, async (_, index) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30));
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 5) + 1);

      const eventName = `SeedEvent ${index + 1}`;

      // Check if event already exists
      const existingEvent = await prisma.event.findFirst({
        where: { name: eventName },
      });

      if (existingEvent) {
        return existingEvent;
      }

      return prisma.event.create({
        data: {
          name: eventName,
          type: ['Concert', 'Conference', 'Workshop', 'Sports Match', 'Exhibition'][Math.floor(Math.random() * 5)],
          locationName: `Seed Venue ${index + 1}`,
          location: `Seed City ${ index + 1}`,
          url: `https://seedevent${index + 1}.example.com`,
          description: `Short description for Seed Event ${index + 1}`,
          detailedDescription: `Detailed description for Seed Event ${index + 1}. This is a longer text with more information.`,
          startDate,
          endDate,
          isPaid: Math.random() > 0.3,
          capacity: Math.floor(Math.random() * 1000) + 100,
          eoId: organizers[Math.floor(Math.random() * organizers.length)].id,
          categoryId: categories[Math.floor(Math.random() * categories.length)].id,
          tags: {
            connect: [
              { id: tags[Math.floor(Math.random() * tags.length)].id },
              { id: tags[Math.floor(Math.random() * tags.length)].id },
            ],
          },
          images: {
            create: [
              { url: `https://example.com/seedevents/${index + 1}/image1.jpg` },
              { url: `https://example.com/seedevents/${index + 1}/image2.jpg` },
            ],
          },
          tickets: {
            create: [
              {
                name: 'Regular Seed Ticket',
                price: Math.floor(Math.random() * 100) * 1000 + 50000,
                available: 100,
                bookSeat: 0,
                discount: Math.floor(Math.random() * 30),
                discountStart: startDate,
                discountExpiry: endDate,
                startDate,
                endDate,
              },
              {
                name: 'VIP Seed Ticket',
                price: Math.floor(Math.random() * 200) * 1000 + 100000,
                available: 50,
                bookSeat: 0,
                discount: Math.floor(Math.random() * 20),
                discountStart: startDate,
                discountExpiry: endDate,
                startDate,
                endDate,
              },
            ],
          },
        },
      });
    })
  );

  // Create new transactions and reviews
  for (const event of events) {
    const tickets = await prisma.eventTicket.findMany({
      where: { eventId: event.id },
    });

    // Create transactions for random users
    const randomUsers = users
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.floor(Math.random() * 5) + 1);

    for (const user of randomUsers) {
      // Check if transaction already exists
      const existingTransaction = await prisma.transaction.findFirst({
        where: {
          eventId: event.id,
          userId: user.id,
        },
      });

      if (!existingTransaction) {
        const ticket = tickets[Math.floor(Math.random() * tickets.length)];
        const qty = Math.floor(Math.random() * 4) + 1;
        const totalPrice = ticket.price * qty;

        const transaction = await prisma.transaction.create({
          data: {
            eventId: event.id,
            userId: user.id,
            totalPrice,
            details: {
              create: {
                ticketId: ticket.id,
                price: ticket.price,
                qty,
              },
            },
            status: {
              create: {
                status: ['PENDING', 'COMPLETED', 'CANCELLED'][Math.floor(Math.random() * 3)],
              },
            },
          },
        });

        // Create review if it doesn't exist
        const existingReview = await prisma.review.findUnique({
          where: {
            userId_eventId: {
              userId: user.id,
              eventId: event.id,
            },
          },
        });

        if (!existingReview && transaction) {
          await prisma.review.create({
            data: {
              userId: user.id,
              eventId: event.id,
              comments: `Seed review comment for event ${event.id} by user ${user.id}`,
              rating: Math.floor(Math.random() * 5) + 1,
              feedback: `Seed detailed feedback for event ${event.id}`,
            },
          });
        }
      }
    }
  }

  // Create new referral points and discounts
  for (const user of users) {
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 3);

    // Check if referral point exists
    const existingPoint = await prisma.referralPoint.findFirst({
      where: { userId: user.id },
    });

    if (!existingPoint) {
      await prisma.referralPoint.create({
        data: {
          userId: user.id,
          point: Math.floor(Math.random() * 1000),
          expiry: futureDate,
        },
      });
    }

    // Check if referral discount exists
    const existingDiscount = await prisma.referralDiscount.findFirst({
      where: { userId: user.id },
    });

    if (!existingDiscount) {
      await prisma.referralDiscount.create({
        data: {
          userId: user.id,
          discount: Math.floor(Math.random() * 50),
          expiry: futureDate,
          isUsed: Math.random() > 0.5,
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });