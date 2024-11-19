import { createReview, getReview, getReviewById } from "@/controllers/review.controllers";
import { Router } from "express";
import { verifyToken } from "@/middlewares/verify.token";
const reviewRouter = Router();

reviewRouter.post('/create-review', verifyToken, createReview)
reviewRouter.get('/', getReview)
reviewRouter.get('/:id', getReviewById)

export default reviewRouter;