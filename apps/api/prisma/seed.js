"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = require("bcrypt");
const prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // Seed categories (in the correct order)
        const categoryNames = ['education', 'business', 'health'];
        const categories = yield Promise.all(categoryNames.map((name) => __awaiter(this, void 0, void 0, function* () {
            const existingCategory = yield prisma.category.findFirst({
                where: { name },
            });
            if (existingCategory)
                return existingCategory;
            return prisma.category.create({ data: { name } });
        })));
        // Seed tags
        const tagNames = ['Outdoor', 'Indoor', 'Family Friendly', 'Adults Only', 'Live Music'];
        const tags = yield Promise.all(tagNames.map((name) => __awaiter(this, void 0, void 0, function* () {
            const existingTag = yield prisma.tag.findFirst({
                where: { name },
            });
            if (existingTag)
                return existingTag;
            return prisma.tag.create({ data: { name } });
        })));
        // Seed users
        const hashedPassword = yield (0, bcrypt_1.hash)('11111111', 15);
        const users = yield Promise.all(Array.from({ length: 10 }, (_, index) => __awaiter(this, void 0, void 0, function* () {
            const email = `seeduser${index + 1}@example.com`;
            const username = `seeduser${index + 1}`;
            const existingUser = yield prisma.user.findFirst({
                where: { OR: [{ email }, { username }] },
            });
            if (existingUser)
                return existingUser;
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
        })));
        // Seed event organizers
        const organizers = yield Promise.all(Array.from({ length: 10 }, (_, index) => __awaiter(this, void 0, void 0, function* () {
            const email = `seedorganizer${index + 1}@example.com`;
            const username = `seedorg${index + 1}`;
            const existingOrganizer = yield prisma.eventOrganizer.findFirst({
                where: { OR: [{ email }, { username }] },
            });
            if (existingOrganizer)
                return existingOrganizer;
            return prisma.eventOrganizer.create({
                data: {
                    firstName: `SeedOrganizer ${index + 1}`,
                    lastName: `OrgLast${index + 1}`,
                    username,
                    email,
                    password: hashedPassword,
                    companyName: `SeedCompany ${index + 1}`,
                    phoneNumber: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
                    pic: `Seed Person In Charge ${index + 1}`,
                },
            });
        })));
        // Seed events
        const events = yield Promise.all(Array.from({ length: 10 }, (_, index) => __awaiter(this, void 0, void 0, function* () {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30));
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 5) + 1);
            const eventName = `SeedEvent ${index + 1}`;
            const existingEvent = yield prisma.event.findFirst({
                where: { name: eventName },
            });
            if (existingEvent)
                return existingEvent;
            return prisma.event.create({
                data: {
                    name: eventName,
                    type: categoryNames[Math.floor(Math.random() * categoryNames.length)], // Ensure event type matches one of the allowed categories
                    locationName: `Seed Venue ${index + 1}`,
                    location: `Seed City ${index + 1}`,
                    url: `https://seedevent${index + 1}.example.com`,
                    description: `Short description for Seed Event ${index + 1}`,
                    detailedDescription: `Detailed description for Seed Event ${index + 1}. This is a longer text with more information.`,
                    startDate,
                    endDate,
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
                                startDate,
                                endDate,
                            },
                            {
                                name: 'VIP Seed Ticket',
                                price: Math.floor(Math.random() * 200) * 1000 + 100000,
                                available: 50,
                                startDate,
                                endDate,
                            },
                        ],
                    },
                },
            });
        })));
        console.log(`Seeded ${users.length} users, ${organizers.length} organizers, and ${events.length} events.`);
    });
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
