import { prisma } from "../../connection";

export const createTicketService = async({name, price, available, startDate, endDate, eventId}: any) => {
  // create new ticket service
  await prisma.eventTicket.create({
    data: {
      name: name,
      price: price,
      available: available,
      startDate: startDate,
      endDate: endDate,
      eventId: eventId
    }
  }) 
}

export const findTicketByEventIdService = async({id}: any) => {
    // create new event service
    return await prisma.eventTicket.findMany({
        where: {
            eventId: Number(id)
        }

    })
}

export const updateTicketQtyService = async ({ eventId, regularTicketQty, vipTicketQty }: any) => {
    // Check and update the Regular ticket availability
    if (regularTicketQty > 0) {
      const regularTicket = await prisma.eventTicket.findFirst({
        where: {
          name: { contains: "Regular" }, // Match Regular tickets
          eventId: Number(eventId), // Ensure it's tied to the correct event
        },
      });
  
      if (!regularTicket) {
        throw new Error("Regular ticket not found for the event.");
      }
  
      if (regularTicket.available < regularTicketQty) {
        throw new Error(
          `Not enough Regular tickets available. Requested: ${regularTicketQty}, Available: ${regularTicket.available}`
        );
      }
  
      await prisma.eventTicket.update({
        where: { id: regularTicket.id },
        data: {
          available: {
            decrement: regularTicketQty, // Reduce the available count
          },
        },
      });
    }
  
    // Check and update the VIP ticket availability
    if (vipTicketQty > 0) {
      const vipTicket = await prisma.eventTicket.findFirst({
        where: {
          name: { contains: "VIP" }, // Match VIP tickets
          eventId: Number(eventId), // Ensure it's tied to the correct event
        },
      });
  
      if (!vipTicket) {
        throw new Error("VIP ticket not found for the event.");
      }
  
      if (vipTicket.available < vipTicketQty) {
        throw new Error(
          `Not enough VIP tickets available. Requested: ${vipTicketQty}, Available: ${vipTicket.available}`
        );
      }
  
      await prisma.eventTicket.update({
        where: { id: vipTicket.id },
        data: {
          available: {
            decrement: vipTicketQty, // Reduce the available count
          },
        },
      });
    }
  
    return {
      message: "Ticket quantities updated successfully",
    };
  };