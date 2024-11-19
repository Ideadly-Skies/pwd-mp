import { NextFunction, Request, Response } from "express";
import { prisma } from "../../connection";
import nodemailer from "nodemailer";

export const getEmailByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // get usersId from req.body
    const {usersId} = req.body
    console.log("req.body from getEmailByUserId", req.body)    
    console.log("invoked from getEmailByUserId ", usersId)

    // fetch emails from message db
    const emails = await prisma.message.findMany({
      where: {
        receiver: usersId
      }
    })

    // email fetched successfully!
    res.status(200).json({
      error: false,
      message: "emails fetched successfully",
      data: emails,
    })

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
}

// export const createReferralAndNotifyUsers = async (eventId: string, organizerId: string, messageContent: string) => {
//   // Fetch users in referralDiscounts
//   const users = await prisma.referralDiscount.findMany({
//     include: { user: true },
//   });

//   // Create a referral link
//   const referralLink = `https://event-platform.com/event/${eventId}?ref=DISCOUNT15`;

//   // Send email to all users
//   const transporter = nodemailer.createTransport({
//     service: "Gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   const emailPromises = users.map((user) =>
//     transporter.sendMail({
//       from: `"Event Organizer" <${process.env.EMAIL_USER}>`,
//       to: user.user.email,
//       subject: "Special Referral for Event",
//       text: `${messageContent}\n\nReferral Link: ${referralLink}`,
//     })
//   );

//   await Promise.all(emailPromises);

//   // Log messages in the database
//   const messages = users.map((user) => ({
//     subject: "Event Referral Discount",
//     content: `${messageContent}\n\nReferral Link: ${referralLink}`,
//     sender: organizerId,
//     receiver: user.userId,
//   }));

//   await prisma.message.createMany({ data: messages });
// };