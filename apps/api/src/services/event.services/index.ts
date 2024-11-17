import { prisma } from "../../connection";
// import { IUser } from "./types";

export const createEventService = async({name, type, category, location, locationName, summary, detailedDescription, eventStartDate, eventEndDate,  usersId, tags, url}: any) => {
    const categoryRecord = await prisma.category.findMany({
        where: {
            name: category,
        },
    });
    
    // Step 2: Handle case where categoryRecord is null
    if (!categoryRecord) {
        throw new Error(`Category "${category}" not found.`);
    } 
    
    console.log(categoryRecord);
    
    // create new event service
    await prisma.event.create({
        data: {
            name: name,
            type: type,
            locationName: locationName,
            location: location,
            url: url,
            description: summary,
            detailedDescription: detailedDescription,
            startDate: new Date(eventStartDate),
            endDate: new Date(eventEndDate),
            categoryId: categoryRecord[0].id,
            eoId: usersId,
            tags: {
                connectOrCreate: tags.map((tag: any) => ({
                  where: { name: tag },
                  create: { name: tag },
                })),
            },
        }
    }) 
}

export const createEventReferralService = async({eventId, referralCode, discountPercentage, createdAt}: any) => {
    // post to the event_referral_code backend
    await prisma.eventReferralCode.create({
        data: {
            eventId: eventId,
            referralCode: referralCode,
            discountPercentage: discountPercentage,
            createdAt: createdAt
        }
    })
}

export const getEventService = async() => {
    try {
        // get event service
        return await prisma.event.findMany({
            include: {
                tags: true,
                category: true, // This includes the category information in the response
            }, 
        })
    } catch (error) {
        console.log(error)    
    } 
    
}

/* 
    getEvent by id service
*/
export const getEventByIdService = async({ id }: any) => {
    return await prisma.event.findUnique({
        where: {
            id: Number(id),
        },
        include: {
            tags: true,
            category: true, // This includes the category information in the response
        },
    });
};