import { createEvent } from "@/controllers/event.controller";
import { Router } from "express";
import { uploader } from "@/middlewares/uploader";
import { verifyToken } from "@/middlewares/verify.token";
const eventRouter = Router();

eventRouter.post('/create-event',verifyToken, uploader,createEvent);

export default eventRouter;