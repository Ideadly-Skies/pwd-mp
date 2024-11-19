import express,{ Router } from "express";
import authRouters from './auth.routers/index'
import profileRouters from './profile.routers/index'
import eventRouter from "./event.routers";
import organizerRouters from './organizer.routers/index'
import transactionRouter from "./transaction.routers/index";
import reviewRouter from "./review.routers";
import ticketRouter from "./ticket.routers";
import emailRouter from "./mail.routers";
import referralRouter from "./referral.routers";

const router = Router()
router.use('*/images', express.static('src/public/images'))
router.use('/api/auth', authRouters);
router.use('/api/profile',profileRouters);
router.use('/api/event', eventRouter);
router.use('/api/organizer', organizerRouters)
router.use('/api/transaction', transactionRouter)
router.use('/api/review', reviewRouter);
router.use('/api/ticket',ticketRouter)
router.use('/api/email', emailRouter)
router.use('/api/referral', referralRouter)

export default router;