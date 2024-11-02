import express,{ Router } from "express";
import authRouters from './auth.routers/index'

const router = Router()

router.use('*/images', express.static('src/public/images'))
router.use('/api/auth', authRouters)

export default router