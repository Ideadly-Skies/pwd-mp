import { createEvent, getEvent, getEventById, getEventByUserId } from "@/controllers/event.controller";
import { Router } from "express";
import { uploader } from "@/middlewares/uploader";
import { verifyToken } from "@/middlewares/verify.token";
const eventRouter = Router();

eventRouter.post('/create-event',verifyToken, uploader,createEvent);
eventRouter.get('/',getEvent)
eventRouter.get('/:id', getEventById)
eventRouter.get('/user/:usersId', getEventByUserId)

export default eventRouter;