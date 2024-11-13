import { createTransaction, getTransactionList } from "@/controllers/transaction.controller/transaction.controller";
import { Router } from "express";
import { verifyToken } from "@/middlewares/verify.token";
const transactionRouter = Router();

transactionRouter.post('/create-transaction',verifyToken,createTransaction);
transactionRouter.get('/transaction-lists',verifyToken, getTransactionList)

export default transactionRouter;