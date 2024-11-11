import express,{ Router } from "express";
import authRouters from './auth.routers/index'
import profileRouters from './profile.routers/index'
import eventRouter from "./event.routers";
import transactionRouter from "./transaction.routers";

const router = Router()
router.use('*/images', express.static('src/public/images'))
router.use('/api/auth', authRouters);
router.use('/api/profile',profileRouters);
router.use('/api/event', eventRouter);
router.use('/api/transaction', transactionRouter)

export default router;