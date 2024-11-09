import { prisma } from "@/connection";
import { IUser } from "@/controllers/auth.controllers/types";
import { deleteFiles } from "@/utils/delete.files";

export const createUserProfileService = async({uploadedImage, usersId, phoneNumber, address}: any) => {    
    await prisma.user.update({
        data: {
            phoneNumber,
            profilePictureUrl: uploadedImage.images[0].filename,
            address
        },
        where: {
            id: usersId
        }
    })
}

export const findUserProfileService = async({id}: any) => {
    return await prisma.user.findUnique({
        where: {
            id: id
        }
    })
}

export const editUserProfileService = async({id, firstName,lastName,email,phoneNumber,uploadedImage}: any) => {
    await prisma.user.update({
        where: {
            id: id
        },
        data: {
            firstName,
            lastName,
            email,
            phoneNumber,
            profilePictureUrl: uploadedImage.images[0].filename
        }
    })
    


}