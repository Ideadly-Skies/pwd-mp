import { createTransaction } from "@/controllers/transaction.controller/transaction.controller";
import { Router } from "express";
import { verifyToken } from "@/middlewares/verify.token";
const transactionRouter = Router();

transactionRouter.post('/create-transaction',verifyToken,createTransaction);

export default transactionRouter;