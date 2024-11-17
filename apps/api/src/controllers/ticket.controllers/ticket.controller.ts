import { NextFunction, Request, Response } from "express";
import prisma from "@/prisma";
import { findTicketByEventIdService } from "@/services/ticket.services";

export const findTicketByEventId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // get the id from the request parameter
        const {id} = req.params
        console.log(id)

        // fetch all tickets related to that id
        const tickets = await findTicketByEventIdService({id})  
        console.log(tickets) 
        
        // Return reviews in the appropriate format
        return res.status(200).json({
            success: true,
            message: "tickets fetched successfully",
            data: tickets,
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);

        // Handle specific error
        if (error instanceof Error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        // Pass other errors to the error handler middleware
        return next(error);
    }
};