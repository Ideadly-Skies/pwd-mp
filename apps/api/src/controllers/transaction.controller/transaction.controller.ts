import { NextFunction, Request, Response } from "express";
import { createTransactionDetailService, createTransactionService, getTransactionDetailService, getTransactionListService, updateTransactionStatusService } from "../../services/transaction.service";
import { prisma } from "../../connection";
import { updateTicketQtyService } from "@/services/ticket.services";
const { v4: uuidv4 } = require('uuid');

// server.js or your backend file
const midtransClient = require('midtrans-client')
const midtransServerKey = process.env.MIDTRANS_SERVER_KEY;

export const updateTransactionStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { orderId, status, regularTicketQty, regularTicketPrice, vipTicketQty, vipTicketPrice, eventId } = req.body; // Get the order ID and status from the request body
      console.log("from update transaction status:",req.body);

      if (!orderId || !status) {
        return res.status(400).json({
          error: true,
          message: "Order ID and status are required",
        });
      }

      // Update the transaction status
      const updatedTransaction = await updateTransactionStatusService(orderId, status);

      if (status == "paid"){
        // post to the transaction details backend
        let detailId = `DETAIL-${uuidv4()}`;
        await createTransactionDetailService({detailId, orderId, regularTicketPrice, regularTicketQty, vipTicketPrice, vipTicketQty})
  
        // update the corresponding ticket table (decrease the regularTicketQty and vipTicketQty accordingly)
        await updateTicketQtyService({ eventId, regularTicketQty, vipTicketQty });

        res.status(200).json({
          error: false,
          message: "Transaction status, detail, and ticket availability updated successfully",
          data: updatedTransaction
        })
      } else {
        res.status(200).json({
          error: false,
          message: "Transaction status and details updated successfully",
          data: updatedTransaction,
        });
      }
    } catch (error) {
      console.error("Error updating transaction status, detail, and ticket availability:", error);
  
      if (error instanceof Error) {
        res.status(400).json({
          error: true,
          message: error.message,
        });
      } else {
        next(error);
      }
    }
};

export const midtransWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { order_id, transaction_status } = req.body;
        
      // Map Midtrans statuses to your system's statuses
      const statusMapping: Record<string, string> = {
        settlement: "paid",
        pending: "pending",
        deny: "failed",
        cancel: "cancelled",
        expire: "expired",
      };
  
      const status = statusMapping[transaction_status] || "unknown";
  
      // Update the transaction status
      await updateTransactionStatusService(order_id, status);
  
      res.status(200).json({ error: false, message: "Webhook processed successfully" });
    } catch (error) {
      console.error("Error processing webhook:", error);
      next(error);
    }
  };


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
        
        // fetch the ids of the referralDiscounts for the user who's performing the transaction
        // const referralDiscounts = await prisma.referralDiscount.findMany({
        //   where: {userId: usersId, isUsed: false}
        // })

        /* 
          for referralDiscount in referralDiscounts {
            
            // this is to find the referred user
            referralPoint = await prisma.ReferralPoint.findFirst({
              where: {id: referralDiscount.id} 
            })
          
            // referred user id
            let refferedUserId = referralPoint.userId; 
            
            // check if the referred user has registered for the event
            const referredUser = await prisma.transaction.findFirst({
              where: { userId: referredUserId, eventId: eventId },
            });

            if (referredUser){
              // obtain the referral code for the event to send to the user
              const eventReferral = await prisma.eventReferralCode.findFirst({
                where: {eventId: eventId} 
              })

              // send message to the current user who's making the transaction (userId)
              await prisma.message.create({
                data: {
                  subject: "Referral Code Discount Details",
                  content: `You have received a discount for the event "${eventId}" using referral code "${eventReferral.referralCode}". The discount is ${eventReferral.discountPercentage}%.`,
                  sender: "EventOrganizer",
                  receiver: usersId,
                  createdAt: new Date(),
                } 
              }) 
              
              // update the referral discount as read
              await prisma.referralDiscount.update({
                where: {id: referralDiscount.id},
                data: {isUsed: true} 
              })

              // break here there's no need to continue the loop

            }

          }
        */
        
        // (1) send email to all users who's registered using another person's referralId
        // who's registered for this event first

        // Fetch all unused referralDiscounts for the current user (usersId)
        const referralDiscounts = await prisma.referralDiscount.findMany({
          where: { userId: usersId, isUsed: false },
        });

        // Iterate over each referralDiscount
        for (const referralDiscount of referralDiscounts) {
          // Find the corresponding referralPoint entry for the current referralDiscount
          const referralPoint = await prisma.referralPoint.findFirst({
              where: { id: referralDiscount.id }, // Match referralDiscount.id to referralPoint.id
          });

          // If no referralPoint is found, skip to the next iteration
          if (!referralPoint) continue;

          // Extract the referred user's ID
          const referredUserId = referralPoint.userId;

          // Check if the referred user has registered for the given event
          const referredUserTransaction = await prisma.transaction.findFirst({
              where: { userId: referredUserId, eventId: Number(eventId) },
          });

          // If the referred user has registered for the event
          if (referredUserTransaction) {
              // Fetch the referral code details for the event
              const eventReferral = await prisma.eventReferralCode.findFirst({
                  where: { eventId: Number(eventId) },
              });

              // If no referral code is found, skip to the next iteration
              if (!eventReferral) continue;

              // Send a message to the current user (usersId) with referral code details
              await prisma.message.create({
                  data: {
                      subject: "Referral Code Discount Details",
                      content: `You have received a discount for the event "${eventId}" using referral code "${eventReferral.referralCode}". The discount is ${eventReferral.discountPercentage}%.`,
                      sender: "EventOrganizer", 
                      receiver: usersId,
                      createdAt: new Date(),
                  },
              });

              // Mark the referral discount as used
              await prisma.referralDiscount.update({
                  where: { id: referralDiscount.id },
                  data: { isUsed: true },
              });

              // Break the loop as we've successfully handled the referral
              break;
          }
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
            orderId: orderId,
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

      console.log(transactionList)
      

      res.status(200).json({
          error: false,
          message: 'Transaction retrieved',
          data: transactionList
      })
   } catch (error) {
      next(error)
  }
}

export const getTransactionDetail = async(req: Request, res: Response, next: NextFunction) => {
  try {
    const {id} = req.params

    const {usersId} = req.body

    const transactionDetails = await getTransactionDetailService({id, usersId})
    
    res.status(200).json({
      error: false,
      message: 'Transaction retrieved',
      data: transactionDetails
  })
  } catch (error) {
    next(error)
  }
}