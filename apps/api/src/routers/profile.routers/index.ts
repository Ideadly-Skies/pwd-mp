import { Router } from "express";
import { verifyToken } from "@/middlewares/verify.token";
import { uploader } from "@/middlewares/uploader";
import { createUserProfile, editUserProfile, findUserProfile } from "@/controllers/profile.controllers";


const router = Router()

router.post('/',verifyToken,uploader, createUserProfile)
router.get('/', verifyToken, findUserProfile)
router.put('/',verifyToken ,uploader, editUserProfile)

export default router