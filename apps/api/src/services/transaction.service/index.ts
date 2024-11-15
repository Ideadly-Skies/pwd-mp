import { prisma } from "../../connection";

export const createTransactionService = async({orderId, usersId, eventId, totalPrice}: any) => {
    
    // create new event service
    await prisma.transaction.create({
        data: {
            id: orderId,
            userId: usersId,
            eventId: Number(eventId),
            totalPrice: totalPrice,
        }
    }) 
}

export const updateTransactionStatusService = async (orderId: string, status: string) => {
    return prisma.transaction.update({
      where: { id: orderId },
      data: { status },
    });
};