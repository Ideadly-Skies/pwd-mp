const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bcrypt = require('bcrypt'); // Import bcrypt

// Function to hash a password
const hashPassword = async (password) => {
  const saltRounds = 15;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
};

async function main() {
  // Seed Users
  const users = await Promise.all(
    Array.from({ length: 10 }).map(async (_, i) => {
      const hashedPassword = await hashPassword(`password${i}`);
      return prisma.user.create({
        data: {
          firstName: `FirstName${i}`,
          lastName: `LastName${i}`,
          username: `user${i}`,
          email: `user${i}@example.com`,
          password: hashedPassword, // Store the hashed password
          referralCode: `referral${i}`,
          role: 'user',
          phoneNumber: `+123456789${i}`,
          address: `Address ${i}`,
          profilePictureUrl: `https://example.com/profile${i}.jpg`,
        },
      });
    })
  );

  // Seed EventOrganizers
  const organizers = await Promise.all(
    Array.from({ length: 10 }).map(async (_, i) => {
      const hashedPassword = await hashPassword(`password${i}`);
      return prisma.eventOrganizer.create({
        data: {
          firstName: `OrganizerFirst${i}`,
          lastName: `OrganizerLast${i}`,
          username: `organizer${i}`,
          email: `organizer${i}@example.com`,
          password: hashedPassword, // Store the hashed password
          companyName: `Company${i}`,
          phoneNumber: `+123456789${i}`,
          pic: `https://example.com/pic${i}.jpg`,
          profilePictureUrl: `https://example.com/profile${i}.jpg`,
        },
      });
    })
  );

  // Seed Categories
  const categories = await Promise.all(
    Array.from({ length: 10 }).map((_, i) =>
      prisma.category.create({
        data: {
          name: `Category${i}`,
        },
      })
    )
  );

  // Seed Events
  const events = await Promise.all(
    Array.from({ length: 10 }).map((_, i) =>
      prisma.event.create({
        data: {
          name: `Event${i}`,
          type: `Type${i}`,
          locationName: `Location${i}`,
          location: `Location Address ${i}`,
          url: `https://event${i}.com`,
          description: `Description for event ${i}`,
          detailedDescription: `Detailed description for event ${i}`,
          startDate: new Date(),
          endDate: new Date(Date.now() + 86400000), // 1 day later
          isPaid: Boolean(i % 2),
          price: i * 1000 + 100,
          capacity: i * 10 + 50,
          eoId: organizers[i % organizers.length].id,
          categoryId: categories[i % categories.length].id,
        },
      })
    )
  );

  // Seed EventTickets
  const tickets = await Promise.all(
    events.map((event, i) =>
      prisma.eventTicket.create({
        data: {
          name: `Ticket${i}`,
          price: i * 1000 + 100,
          available: 100 - i,
          bookSeat: i,
          discount: 10,
          discountStart: new Date(),
          discountExpiry: new Date(Date.now() + 86400000 * 7), // 1 week later
          startDate: new Date(),
          endDate: new Date(Date.now() + 86400000 * 30), // 30 days later
          eventId: event.id,
        },
      })
    )
  );

  // Seed EventImages
  const images = await Promise.all(
    events.map((event, i) =>
      prisma.eventImage.create({
        data: {
          url: `https://example.com/image${i}.jpg`,
          eventId: event.id,
        },
      })
    )
  );

  // Seed ReferralPoints
  const referralPoints = await Promise.all(
    users.map((user, i) =>
      prisma.referralPoint.create({
        data: {
          point: i * 100,
          expiry: new Date(Date.now() + 86400000 * 30), // 30 days later
          userId: user.id,
        },
      })
    )
  );

  // Seed ReferralDiscounts
  const referralDiscounts = await Promise.all(
    users.map((user, i) =>
      prisma.referralDiscount.create({
        data: {
          discount: 10,
          expiry: new Date(Date.now() + 86400000 * 30), // 30 days later
          isUsed: false,
          userId: user.id,
        },
      })
    )
  );

  // Seed Transactions
  const transactions = await Promise.all(
    Array.from({ length: 10 }).map((_, i) =>
      prisma.transaction.create({
        data: {
          id: `trans${i}`,
          eventId: events[i % events.length].id,
          userId: users[i % users.length].id,
          totalPrice: i * 1000 + 50000,
          createdAt: new Date(),
        },
      })
    )
  );

  // Seed TransactionDetails
  const transactionDetails = await Promise.all(
    transactions.map((transaction, i) =>
      prisma.transactionDetail.create({
        data: {
          id: `transDetail${i}`,
          transactionId: transaction.id,
          ticketId: tickets[i % tickets.length].id,
          price: tickets[i % tickets.length].price,
          qty: i + 1,
        },
      })
    )
  );

  // Seed TransactionStatus
  const transactionStatus = await Promise.all(
    transactions.map((transaction, i) =>
      prisma.transactionStatus.create({
        data: {
          id: `status${i}`,
          status: 'completed',
          transactionId: transaction.id,
          createdAt: new Date(),
        },
      })
    )
  );

  // Seed Tags
  const tags = await Promise.all(
    Array.from({ length: 10 }).map((_, i) =>
      prisma.tag.create({
        data: {
          name: `Tag${i}`,
        },
      })
    )
  );

  // Seed Reviews
  const reviews = await Promise.all(
    Array.from({ length: 10 }).map((_, i) =>
      prisma.review.create({
        data: {
          userId: users[i % users.length].id,
          eventId: events[i % events.length].id,
          comments: `This is review comment ${i}`,
          rating: (i % 5) + 1,
          feedback: `Feedback for review ${i}`,
        },
      })
    )
  );

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });