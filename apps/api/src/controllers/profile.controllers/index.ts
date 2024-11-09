import { Request, Response, NextFunction } from "express";
import { deleteFiles } from "@/utils/delete.files";
import { createUserProfileService, editUserProfileService, findUserProfileService } from "@/services/profile.services";

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

        await editUserProfileService({id: usersId, firstName,lastName,email,phoneNumber,uploadedImage})

        res.status(200).json({
            error: false,
            message: 'Profile successfully edited',
            data: {}
        })
    } catch (error) {
        next(error)
    }
}

