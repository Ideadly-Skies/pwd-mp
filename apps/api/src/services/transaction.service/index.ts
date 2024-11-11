import { prisma } from "../../connection";

export const createTransactionService = async({usersId, eventId, totalPrice}: any) => {
    
    // create new event service
    await prisma.transaction.create({
        data: {
            userId: usersId,
            eventId: eventId,
            totalPrice: totalPrice
        }
    }) 
}