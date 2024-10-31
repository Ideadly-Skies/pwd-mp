import { prisma } from "@/connection";
import { IRegisterUser } from "./types";

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