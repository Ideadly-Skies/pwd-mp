import { validateReferral } from "@/controllers/referral.controllers/referral.controller";
import { Router } from "express";
const referralRouter = Router()

referralRouter.get('/validate-referral',validateReferral);

export default referralRouter 