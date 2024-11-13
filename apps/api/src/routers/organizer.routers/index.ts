import { Router } from "express";
import { verifyToken } from "@/middlewares/verify.token";
import { verifyRole } from "@/middlewares/verify.role";
import { dashboardPageData, getEventForOrganizer, getEventForOrganizerById } from "@/controllers/organizer.controllers";

const router = Router()

router.get('/events', verifyToken, verifyRole, getEventForOrganizer)
router.get('/events/:id',verifyToken, verifyRole, getEventForOrganizerById)
router.get('/dashboard',verifyToken, verifyRole, dashboardPageData)

export default router