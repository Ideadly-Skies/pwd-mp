import { Router } from "express";
import { verifyToken } from "@/middlewares/verify.token";
import { verifyRole } from "@/middlewares/verify.role";
import { dashboardPageData, getEventForOrganizer, getEventForOrganizerById } from "@/controllers/organizer.controllers";

const router = Router()

router.get('/events', verifyToken, verifyRole, getEventForOrganizer)
router.get('/events/:id',verifyToken, getEventForOrganizerById)
router.get('/dashboard',verifyToken, dashboardPageData)

export default router