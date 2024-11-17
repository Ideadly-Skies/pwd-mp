import { Router } from "express";
import { getEmailByUserId } from "@/controllers/mail.controllers/mail.controller";
import { verifyToken } from "@/middlewares/verify.token";

const emailRouter = Router()

emailRouter.get('/',verifyToken,getEmailByUserId);

export default emailRouter 