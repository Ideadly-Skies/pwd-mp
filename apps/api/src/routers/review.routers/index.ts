import { createReview, getReview } from "@/controllers/review.controllers";
import { Router } from "express";
import { verifyToken } from "@/middlewares/verify.token";
const reviewRouter = Router();

reviewRouter.post('/create-review', verifyToken, createReview)
reviewRouter.get('/', getReview)

export default reviewRouter;