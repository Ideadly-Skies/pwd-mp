import { NextFunction, Request, Response } from "express";
import prisma from "@/prisma";

// server.js or your backend file
const midtransClient = require('midtrans-client')
const midtransServerKey = process.env.MIDTRANS_SERVER_KEY;
import { createTransactionService, getTransactionListService } from "@/services/transaction.service";

export const createTransaction = async(req: Request, res: Response, next: NextFunction) => {
    try {
        // initialize midtrans client
        let snap = new midtransClient.Snap({
            isProduction: false,
            serverKey: midtransServerKey
        })

        // grab usersId, eventId, totalPrice from req.body
        let {usersId, eventId, totalPrice} = req.body
        
        // Fetch user details from the database
        const user = await prisma.user.findUnique({
            where: {id: usersId}
        })
        
        if (!user){
            return res.status(404).json({
                error: true,
                message: "User not found",
            });
        }
        
        // generate a unique order ID (e.g., using timestamp or UUID)
        let orderId = `ORDER-${Date.now()}`

        // Optional: Add customer details if available
        let customerDetails = {
            first_name: user.firstName || "Guest",
            last_name: user.lastName || "",
            email: user.email || "guest@example.com",
            phone: user.phoneNumber || "08123456789",
        }
        
        // set up transaction parameters for Midtrans
        let parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: totalPrice, // use total price from req.body
            },
            credit_card: {
                secure: true             // Enable 3DS for credit card payments
            },   
            customer_details: customerDetails
        }

        // create the transaction token with Midtrans
        const transaction = await snap.createTransaction(parameter); 
        console.log(transaction);

        await createTransactionService({orderId, usersId, eventId, totalPrice})
        
        // respond with the transaction token for the frontend to use
        res.status(201).json({
            error: false, 
            message: `Transaction creation successful!`,
            token: transaction.token,
            redirect_url: transaction.redirect_url,
            data: {orderId, totalPrice, usersId, eventId, customerDetails} 
        }) 

    } catch (error) {
        console.log(error)

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