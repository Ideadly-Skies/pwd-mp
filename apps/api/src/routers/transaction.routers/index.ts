import { createTransaction, updateTransactionStatus, midtransWebhook } from "@/controllers/transaction.controller/transaction.controller";

import { Router } from "express";
import { verifyToken } from "@/middlewares/verify.token";
const transactionRouter = Router();

transactionRouter.post('/create-transaction',verifyToken,createTransaction);
transactionRouter.post("/update-transaction-status", updateTransactionStatus); // Update transaction status manually
transactionRouter.post("/webhook", midtransWebhook); // Handle Midtrans webhook notifications

export default transactionRouter;