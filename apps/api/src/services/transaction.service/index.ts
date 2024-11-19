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

export const createTransactionDetailService = async({detailId, orderId, regularTicketPrice, regularTicketQty, vipTicketPrice, vipTicketQty}: any) => {

    // post to the transactionDetails db
    await prisma.transactionDetail.create({
        data: {
            id: detailId,
            transactionId: orderId,
            regularTicketPrice: regularTicketPrice,
            regularTicketQty: regularTicketQty,
            vipTicketPrice: vipTicketPrice,
            vipTicketQty: vipTicketQty 
        }
    })
} 