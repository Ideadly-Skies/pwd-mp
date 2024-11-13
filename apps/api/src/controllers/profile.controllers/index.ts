import { Request, Response, NextFunction } from "express";
import { createUserProfileService, editUserProfileService, findUserProfileService, findOrganizerProfileService, editOrganizerProfileService } from "@/services/profile.services";

export const createUserProfile = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const uploadedImage = req?.files

        const {usersId, phoneNumber, address} = req.body
        
        
        await createUserProfileService({uploadedImage, usersId, phoneNumber, address})

        res.status(201).json({
            error: false,
            message: 'Profile successfully completed',
            data: {
                phoneNumber,
                address
            }
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

export const findUserProfile = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {usersId} = req.body

        const profile = await findUserProfileService({id: usersId})
        
        const {password , resetPasswordToken, ...userProfile}: any = profile

        res.status(200).json({
            error: false,
            message: 'Profile successfully loaded',
            data: userProfile
        })
    } catch (error) {
        next(error)
    }
}

export const editUserProfile = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {usersId,firstName,lastName,email,phoneNumber,address} = req.body
        const uploadedImage = req.files

        await editUserProfileService({id: usersId, firstName,lastName,email,phoneNumber,uploadedImage,address})

        res.status(200).json({
            error: false,
            message: 'Profile successfully edited',
            data: {}
        })
    } catch (error) {
        next(error)
    }
}

export const findOrganizerProfile = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {usersId} = req.body
    

        const organizerProfile = await findOrganizerProfileService({id: usersId})
   
        res.status(200).json({
            error: false,
            message: 'Organizer Profile retrieved',
            data: organizerProfile
        })
    } catch (error) {
        next(error)
    }
}

export const editOrganizerProfile = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const {usersId, firstName, lastName, username, email, companyName, pic, address, phoneNumber} = req.body
       
        const uploadedImage = req.files
        console.log(req.files)

        await editOrganizerProfileService({usersId, uploadedImage, firstName, lastName, username, email, companyName, pic, address, phoneNumber})
        res.status(200).json({
            error: false,
            message: 'Profile successfully edited',
            data: {}
        })
    } catch (error) {
        next(error)
    }
}

