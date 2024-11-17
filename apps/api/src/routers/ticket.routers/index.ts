import { findTicketByEventId } from "@/controllers/ticket.controllers/ticket.controller";
import { Router } from "express";
const ticketRouter = Router();

ticketRouter.get('/:id',findTicketByEventId)

export default ticketRouter;