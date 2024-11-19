import { prisma } from "../../connection";

export const createReviewService = async({usersId, eventId, comments, rating, feedback}: any) => {
    
    // create new event service
    await prisma.review.create({
        data: {
            userId: usersId,
            eventId: Number(eventId),
            comments: comments,
            rating: Number(rating),
            feedback: feedback 
        }
    }) 
}