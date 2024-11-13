import { Router } from "express";
import { verifyToken } from "@/middlewares/verify.token";
import { uploader } from "@/middlewares/uploader";
import { createUserProfile, editOrganizerProfile, editUserProfile, findOrganizerProfile, findUserProfile } from "@/controllers/profile.controllers";
import { verifyRole } from "@/middlewares/verify.role";


const router = Router()

router.post('/',verifyToken,uploader, createUserProfile)
router.get('/', verifyToken, findUserProfile)
router.patch('/',verifyToken ,uploader, editUserProfile)
router.get('/organizer',verifyToken,verifyRole, findOrganizerProfile)
router.patch('/organizer',verifyToken, verifyRole, uploader, editOrganizerProfile)

export default router