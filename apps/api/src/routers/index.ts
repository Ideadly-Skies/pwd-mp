import express,{ Router } from "express";
import authRouters from './auth.routers/index'
import eventRouters from './event.routers/index'

const router = Router()
router.use('*/images', express.static('src/public/images'))
router.use('/api/auth', authRouters)
router.use('/api/event', eventRouters)

export default router