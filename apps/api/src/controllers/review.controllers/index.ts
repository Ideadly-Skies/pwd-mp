import { NextFunction, Request, Response } from "express";
import { createReviewService } from "@/services/review.services";
import prisma from "@/prisma";

export const getReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Fetch all reviews
        const reviews = await prisma.review.findMany();

        // Return reviews in the appropriate format
        return res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",
            data: reviews,
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

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { usersId, eventId, comments, rating, feedback } = req.body;
  
      // Fetch user details from the database
      const user = await prisma.user.findUnique({
        where: { id: usersId },
      });
  
      if (!user) {
        return res.status(404).json({
          error: true,
          message: "User not found",
        });
      }
  
      // Check if a review already exists for this user and event
      const existingReview = await prisma.review.findUnique({
        where: {
            userId_eventId: { 
                userId: usersId,
                eventId: eventId,
            }, 
        },
      });
  
      if (existingReview) {
        // Update the existing review
        const updatedReview = await prisma.review.update({
          where: {
            userId_eventId: { 
                userId: usersId,
                eventId: eventId,
            },
          },
          data: {
            comments,
            rating,
            feedback,
          },
        });
  
        return res.status(200).json({
          error: false,
          message: `Review updated successfully for user ${usersId}!`,
          data: updatedReview,
        });
      } else {
        // Create a new review
        const newReview = await prisma.review.create({
          data: {
            userId: usersId,
            eventId,
            comments,
            rating,
            feedback,
          },
        });
  
        return res.status(201).json({
          error: false,
          message: `Review creation successful for user ${usersId}!`,
          data: newReview,
        });
      }
    } catch (error) {
      console.error(error);
  
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