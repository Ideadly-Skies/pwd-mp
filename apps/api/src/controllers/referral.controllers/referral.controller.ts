import { NextFunction, Request, Response } from "express";
import { prisma } from "../../connection";

export const validateReferral = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract the referral code and event ID from the request
        const { referralCode, eventId } = req.query;

        if (!referralCode || !eventId) {
            return res.status(400).json({
                success: false,
                message: "Missing referralCode or eventId in the request body",
            });
        }

        // Check if the referral code is valid for the given event ID
        const referral = await prisma.eventReferralCode.findFirst({
            where: {
                referralCode: String(referralCode),
                eventId: parseInt(eventId as string, 10), // Ensure eventId is treated as an integer
            },
        });

        if (!referral) {
            return res.status(404).json({
                success: false,
                message: "Invalid referral code or event ID",
            });
        }

        // Return the discount percentage if referral is valid
        return res.status(200).json({
            success: true,
            message: "Referral code validated successfully",
            data: {
                discount: referral.discountPercentage,
            },
        });
    } catch (error) {
        console.error("Error validating referral code:", error);

        // Handle known errors or pass others to error middleware
        if (error instanceof Error) {
            return res.status(500).json({
                success: false,
                message: "Internal server error: " + error.message,
            });
        }

        return next(error);
    }
};