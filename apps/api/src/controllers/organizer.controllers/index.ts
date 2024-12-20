import { dashboardPageDataService, getEventForOrganizerService, getEventForOrganizerByIdService } from "@/services/organizer.services";
import { Request, Response, NextFunction } from "express";

export const getEventForOrganizer = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {usersId} = req.body

        const {page = 1, limit = 8} = req.query

        const events = await getEventForOrganizerService({usersId, page: Number(page), limit: Number(limit)})

        res.status(200).json({
            error: false,
            message: 'Events successfully retrieved',
            data: events
        })
    } catch (error) {
        next(error)
    }
}

export const dashboardPageData = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {usersId} = req.body
        const dashboardPageData = await dashboardPageDataService({usersId})

        res.status(200).json({
            error: false,
            message: 'Data successfully loaded',
            data: dashboardPageData
        })
    } catch (error) {
        next(error)
    }
}

export const getEventForOrganizerById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {id} = req.params
       
        const {usersId} = req.body

        const data = await getEventForOrganizerByIdService({usersId, id})

        console.log('dfata from controller:',data)
        
        res.status(200).json({
            error: false,
            message: 'Event details retrieved',
            data: data
        })
    } catch (error) {
        next(error)
    }
}