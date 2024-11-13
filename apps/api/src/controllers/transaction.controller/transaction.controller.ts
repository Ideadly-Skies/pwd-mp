import { NextFunction, Request, Response } from "express";
import { createTransactionService, getTransactionListService } from "@/services/transaction.service";

export const createTransaction = async(req: Request, res: Response, next: NextFunction) => {
    try {
        // grab usersId, eventId, totalPrice from req.body
        let {usersId, eventId, totalPrice} = req.body
        
        // create event
        await createTransactionService({usersId, eventId, totalPrice})
        
        // login user success to trigger success message
        res.status(201).json({
            error: false, 
            message: `Transaction creation successful!`,
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
            next(error); 
        }
    }
}

export const getTransactionList = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {usersId} = req.body
        const {page = 1, limit = 8} = req.query

        const transactionList = await getTransactionListService({usersId, page: Number(page), limit: Number(limit)})

        res.status(200).json({
            error: false,
            message: 'Transaction retrieved',
            data: transactionList
        })
     } catch (error) {
        next(error)
    }
}