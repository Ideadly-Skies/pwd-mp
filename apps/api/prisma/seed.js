import { PrismaClient, EventType, Status } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

const saltRounds = 10;
const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

// Seed data arrays
const categories = [
  { name: 'Technology' },
];

const eventOrganizers = [
  {
    firstName: 'Alice',
    lastName: 'Johnson',
    username: 'alicej',
    email: 'alice@organizers.com',
    password: 'abc123',
    companyName: 'Event Masters',
    phoneNumber: '123-456-7890',
    pic: 'http://example.com/pic.jpg',
  },
];

const users = [
  {
    firstName: 'Ahmad',
    lastName: 'Subejo',
    username: 'bejo123',
    email: 'bejo@gmail.com',
    password: 'abc123',
    referralCode: 'ABC123',
    phoneNumber: '123-456-7890',
    totalPoint: 100,
  },
];

const events = [
  {
    name: 'Tech Conference 2024',
    type: EventType.ONLINE,
    locationName: 'Virtual Event',
    location: 'http://techconference.com',
    url: 'http://techconference.com/register',
    description: 'A conference about the latest in technology.',
    startDate: new Date('2024-05-10T09:00:00.000Z'),
    endDate: new Date('2024-05-12T17:00:00.000Z'),
    isPaid: true,
    capacity: 100,
  },
];

const referralPoints = [
  {
    point: 50,
    expiry: new Date('2025-01-01T00:00:00.000Z'),
  },
];

const referralDiscounts = [
  {
    discount: 20,
    expiry: new Date('2025-01-01T00:00:00.000Z'),
    isUsed: false,
  },
];

const eventTickets = [
  {
    name: 'Standard Admission',
    price: 100,
    available: 50,
    bookSeat: 0,
    discount: 10,
    discountStart: new Date('2024-04-01T00:00:00.000Z'),
    discountExpiry: new Date('2024-05-01T00:00:00.000Z'),
    startDate: new Date('2024-05-10T09:00:00.000Z'),
    endDate: new Date('2024-05-12T17:00:00.000Z'),
  },
];

const eventImages = [
  {
    url: 'http://example.com/event-image.jpg',
  },
];

async function main() {
  // Seed Categories
  categories.forEach(async (category) => {
    await prisma.category.create({ data: category });
  });

  // Seed Event Organizers with hashed passwords
  eventOrganizers.forEach(async (organizer) => {
    await prisma.eventOrganizer.create({
      data: {
        ...organizer,
        password: await hashPassword(organizer.password),
      },
    });
  });

  // Seed Users with hashed passwords
  users.forEach(async (user) => {
    await prisma.user.create({
      data: {
        ...user,
        password: await hashPassword(user.password),
      },
    });
  });

  // Fetching organizer and category to assign foreign keys in events
  const organizer = await prisma.eventOrganizer.findFirst({ where: { email: eventOrganizers[0].email } });
  const category = await prisma.category.findFirst({ where: { name: categories[0].name } });

  // Seed Events
  events.forEach(async (event) => {
    await prisma.event.create({
      data: {
        ...event,
        eoId: organizer.id,
        categoryId: category.id,
      },
    });
  });

  // Fetch user and event to assign foreign keys in referral points, discounts, transactions
  const user = await prisma.user.findFirst({ where: { email: users[0].email } });
  const event = await prisma.event.findFirst({ where: { name: events[0].name } });

  // Seed Referral Points
  referralPoints.forEach(async (point) => {
    await prisma.referralPoint.create({
      data: {
        ...point,
        userId: user.id,
      },
    });
  });

  // Seed Referral Discounts
  referralDiscounts.forEach(async (discount) => {
    await prisma.referralDiscount.create({
      data: {
        ...discount,
        userId: user.id,
      },
    });
  });

  // Seed Event Tickets
  eventTickets.forEach(async (ticket) => {
    await prisma.eventTicket.create({
      data: {
        ...ticket,
        eventId: event.id,
      },
    });
  });

  // Seed Event Images
  eventImages.forEach(async (image) => {
    await prisma.eventImage.create({
      data: {
        ...image,
        eventId: event.id,
      },
    });
  });

  // Seed Transactions
  const transaction = await prisma.transaction.create({
    data: {
      eventId: event.id,
      totalPrice: 100,
      userId: user.id,
    },
  });

  // Seed Transaction Details
  await prisma.transactionDetail.create({
    data: {
      transactionId: transaction.id,
      ticketId: (await prisma.eventTicket.findFirst({ where: { eventId: event.id } })).id,
      price: 100,
      qty: 1,
    },
  });

  // Seed Transaction Status
  await prisma.transactionStatus.create({
    data: {
      status: Status.PAID,
      transactionId: transaction.id,
    },
  });

  // Seed Reviews
  await prisma.review.create({
    data: {
      userId: user.id,
      eventId: event.id,
      comments: 'Great event!',
      rating: 5,
      feedback: 'Loved the content and organization.',
    },
  });
}

main()
  .then(() => {
    console.log('Database seeded');
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });