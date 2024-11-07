import { prisma } from "../../connection";
import { ICreateEvent } from "./types";

export const createEventService = async({name, type, category, location, locationName, url, summary, eventStartDate, eventEndDate, isPaid, capacity}: ICreateEvent) => {
    const categoryRecord = await prisma.category.findMany({
        where: {
            name: category,
        },
    });
    
    // Step 2: Handle case where categoryRecord is null
    if (!categoryRecord) {
        throw new Error(`Category "${category}" not found.`);
    } 
    
    // create new event service
    await prisma.event.create({
        data: {
            name: name,
            type: type,
            locationName: locationName,
            location: location,
            url: url,
            description: summary,
            startDate: new Date(eventStartDate),
            endDate: new Date(eventEndDate),
            isPaid: isPaid,
            capacity: Number(capacity),
            categoryId: categoryRecord[0].id,
            eoId: 'f3ede333-04bb-4ef2-8acd-5c599cbf500d'
        }
    }) 
}