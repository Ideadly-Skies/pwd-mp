import { createTransaction, updateTransactionStatus, midtransWebhook , getTransactionList, getTransactionDetail } from "@/controllers/transaction.controller/transaction.controller";
import { Router } from "express";
import { verifyToken } from "@/middlewares/verify.token";
import { verifyRole } from "@/middlewares/verify.role";
const transactionRouter = Router();

transactionRouter.post('/create-transaction',verifyToken,createTransaction);
transactionRouter.post("/update-transaction-status", updateTransactionStatus); // Update transaction status manually
transactionRouter.post("/webhook", midtransWebhook); // Handle Midtrans webhook notifications
transactionRouter.get('/transaction-lists',verifyToken,verifyRole, getTransactionList)
transactionRouter.get('/transaction-detail/:id', verifyToken, verifyRole, getTransactionDetail)


export default transactionRouter;