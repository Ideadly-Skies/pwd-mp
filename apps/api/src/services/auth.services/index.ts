import { prisma } from "@/connection";
import { IRegisterOrganizer, IRegisterUser } from "./types";

export const registerUserService = async({firstName, lastName, email, username, password, referralCode}: IRegisterUser) => {
    await prisma.user.create({
        data: {
            firstName,
            lastName,
            email,
            username,
            password,
            referralCode
        }
    })
}

export const registerOrganizerService = async({firstName, lastName, email, username, password: hashedPassword, companyName, phoneNumber, pic}: IRegisterOrganizer) => {
    await prisma.eventOrganizer.create({
        data: {
            firstName, 
            lastName, 
            email, 
            username, 
            password: hashedPassword, 
            companyName, 
            phoneNumber, 
            pic
        }
    })
}

export const loginUserService = async (emailOrUsername: string) => {
    // Create the query object based on the input
    const where: { email?: string; username?: string } = {};

    // Determine if the input is an email or username
    if (emailOrUsername.includes('@')) {
        where.email = emailOrUsername; // If it's an email
    } else {
        where.username = emailOrUsername; // Otherwise, treat it as a username
    }

    // Use the constructed where object in the findUnique call
    return await prisma.user.findFirst({
        where: where as any, // Cast as any for TypeScript
    });
};

export const loginOrganizerService = async (emailOrUsername: string) => {
    // Create the query object based on the input
    const where: { email?: string; username?: string } = {};

    // Determine if the input is an email or username
    if (emailOrUsername.includes('@')) {
        where.email = emailOrUsername; // If it's an email
    } else {
        where.username = emailOrUsername; // Otherwise, treat it as a username
    }

    // Use the constructed where object in the findUnique call
    return await prisma.eventOrganizer.findFirst({
        where: where as any, // Cast as any for TypeScript
    });
};