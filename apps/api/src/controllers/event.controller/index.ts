import { NextFunction, Request, Response } from "express";
import { createEventService, getEventByIdService, getEventService, createEventReferralService } from "@/services/event.services";
import { prisma } from "../../connection";
import { createTicketService } from "@/services/ticket.services";
import { addDays, subDays } from "date-fns"; // Ensure date-fns is installed

export const createEvent = async(req: Request, res: Response, next: NextFunction) => {
    try {
        let {
            name, 
            type, 
            category, 
            location, 
            locationName, 
            summary, 
            detailedDescription, 
            eventStartDate, 
            eventEndDate, 
            capacity, 
            eventPrice, 
            usersId, 
            tags,
            enableReferralDiscount,
            referralCode,
            discountPercentage,
        } = req.body
        
        // console.log(req.body)
        
        // set category to lowercase
        category = category.toLowerCase()

        // Assuming you're using Multer and `mainImage` is the key for the uploaded file(s)
        const mainImageFile = (req.files as { [fieldname: string]: Express.Multer.File[] }).mainImage?.[0];
        let url = ''

        if (mainImageFile) {
            url = mainImageFile.path; // Access the `path` of the file
            console.log("Image URL:", url);
        } else {
            throw new Error("Main image is required.");
        }

        // convert eventStartDate and eventEndDate to Date objects
        const parsedEventStartDate = new Date(eventStartDate)
        const parsedEventEndDate = new Date(eventEndDate) 

        // calculate ticket startDate and endDate
        const ticketStartDate = subDays(parsedEventStartDate, 7); 
        const ticketEndDate = subDays(parsedEventEndDate, 7); 

        // Query the database for the latest eventId
        const latestEvent = await prisma.event.findFirst({
            orderBy: { id: 'desc' }, // Get the event with the highest id
        });
        const eventId = latestEvent ? latestEvent.id + 1 : 1; // If no events exist, start with 1
        console.log(eventId)

        // invoke createEventService to create new event
        await createEventService({name, type, category, location, locationName, summary, detailedDescription, eventStartDate, eventEndDate, usersId, tags, url})

        // create regular ticket (4/5 of capacity, base-price of eventPrice)
        const regularTicketCapacity = Math.floor((capacity * 4) / 5); // 4/5 of total capacity
        await createTicketService({name: "Regular Ticket", price: Number(eventPrice) + 25000, available: regularTicketCapacity, startDate: ticketStartDate, endDate: ticketEndDate, eventId: eventId})

        // create vip ticket (1/5 of capacity, base)
        const vipTicketCapacity = capacity - regularTicketCapacity; // Remaining capacity for VIP
        await createTicketService({name: "VIP Ticket", price: Number(eventPrice) + 350000, available: vipTicketCapacity, startDate: ticketStartDate, endDate: ticketEndDate, eventId: eventId })
        
        // Handle referral discount if enabled
        if (enableReferralDiscount === 'true') {
            if (!referralCode || !discountPercentage) {
                throw new Error("Referral code and discount percentage are required when enabling referral discount.");
            }

            // Post to event_referral_code backend
            await createEventReferralService({
                eventId: eventId,
                referralCode: referralCode,
                discountPercentage: parseInt(discountPercentage, 10), // Ensure the percentage is an integer
                createdAt: ticketStartDate
            });
        }

        // login user success to trigger success message
        res.status(201).json({
            error: false, 
            message: `Event creation successful!`,
            data: req.body
        }) 

    } catch (error) {
        console.log(error)

        // Check if error is a custom error with a specific status
        if (error instanceof Error) {
            res.status(400).json({
                error: true,
                message: error.message,
            });
        } else {
            next(error); // Pass to global error handler if it's not a handled error
        }
    }
}

export const getEvent = async(req: Request, res: Response, next: NextFunction) => {
    try {
        let data = await getEventService()
        // console.log(data)

        // get event success
        res.status(200).json({
            error: false,
            message: `get event successful!`,
            data: data
        })

    } catch (error: any) {
        // Pass the error to next, but only if no response has been sent
        if (!res.headersSent) {
            return next(error);
        }
    }
}

export const getEventById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        // get the id from the request parameter
        const {id} = req.params; 
        console.log(id);        

        // fetch the event by ID
        let data = await getEventByIdService({id})
        
        // return the event data as JSON
        if (data){
            res.status(200).json({success: true, data})
        } else {
            res.status(400).json({success: false, message: 'event not found', data: {}})
        }

    } catch (error) {
        // Pass the error to next, but only if no response has been sent
        if (!res.headersSent) {
            return next(error);
        }
    }
}

export const getEventByUserId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // get the id from the request parameter
        const {usersId} = req.params
        console.log("from getEventByUserId controller:",usersId)
        
        // Validate input
        if (!usersId) {
            res.status(400).json({ success: false, message: "usersId is required" });
            return; // Explicitly stop execution
        }

        // Fetch transactions by userId
        const transactions = await prisma.transaction.findMany({
            where: {
                userId: usersId,
                status: "paid", // ensure only paid transaction are accepted 
            },
        });

        // Handle response
        if (transactions.length > 0) {
            // extract all eventIds from the fetched transactions
            const eventIds = transactions.map(transaction => transaction.eventId)

            // fetch all events where eventId is in the list of eventIds
            const events = await prisma.event.findMany({
                where: {
                    id : {
                        in: eventIds, // use the 'in' operator
                    }
                }
            });

            // send out result positive
            res.status(200).json({ 
                success: true, 
                data: {
                    transactions,
                    events
                }
            });
        } else {
            res.status(404).json({
                success: false, 
                message: "No transactions found for this user" 
            });
        }

    } catch (error) {
        console.error("Error in getEventByUserId:", error);

        // Pass error to Express error handler if response not already sent
        if (!res.headersSent) {
            next(error);
        }
    }
};

