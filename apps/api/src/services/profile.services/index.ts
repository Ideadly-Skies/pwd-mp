import { prisma } from "@/connection";
import { IUser } from "@/controllers/auth.controllers/types";
import { deleteFiles } from "@/utils/delete.files";

export const createUserProfileService = async ({ uploadedImage, usersId, phoneNumber, address }: any) => {    
    // Start by creating an object that holds only the data we are sure to update.
    // This includes `phoneNumber` and `address`, which are expected from the request body.
    const completeProfileData: { phoneNumber: string, address: string, profilePictureUrl?: string } = {
        phoneNumber,
        address
    };
    
    // Check if `uploadedImage` exists and contains an image before adding `profilePictureUrl` to `completeProfileData`.
    // `uploadedImage?.images` is an optional chaining check to ensure it only proceeds if `uploadedImage` exists and has an `images` array.
    if (uploadedImage?.images && uploadedImage.images[0]) {
        // If an image is uploaded, set `profilePictureUrl` to the filename of the first uploaded image.
        completeProfileData.profilePictureUrl = uploadedImage.images[0].filename;
    }
    
    // Now that `completeProfileData` contains only the fields to be updated, perform the update operation.
    await prisma.user.update({
        where: {
            id: usersId
        },
        data: completeProfileData  // Update the user with the `updateData` fields
    });
};

export const findUserProfileService = async({id}: any) => {
    return await prisma.user.findUnique({
        where: {
            id: id
        }
    })
}

export const editUserProfileService = async ({ id, firstName, lastName, email, phoneNumber, uploadedImage }: any) => {
    // Retrieve existing user data to get the current profile picture URL.
    const oldImages = await prisma.user.findFirst({
        where: {
            id: id
        }
    });

    // Prepare the data to update, starting with fields that are always present.
    const updateData: { firstName: string, lastName: string, email: string, phoneNumber: string, profilePictureUrl?: string } = {
        firstName,
        lastName,
        email,
        phoneNumber
    };

    // If an image is uploaded, set `profilePictureUrl` in `updateData`.
    if (uploadedImage?.mainImage && uploadedImage.mainImage[0]) {
        updateData.profilePictureUrl = uploadedImage.mainImage[0].filename;
    }

    // Perform the user update with only the fields included in `updateData`.
    await prisma.user.update({
        where: {
            id: id
        },
        data: updateData
    });

    // If an old profile picture exists and a new picture was uploaded, delete the old picture file.
    if (oldImages?.profilePictureUrl && uploadedImage?.mainImage && uploadedImage.mainImage[0]) {
        deleteFiles({
            imagesUploaded: {
                images: [
                    { path: `src/public/images/${oldImages.profilePictureUrl}` }
                ]
            }
        });
    }
};

export const findOrganizerProfileService = async({id}: any) => {
const organizerProfile = await prisma.eventOrganizer.findUnique({
        where: {
            id: id
        },
        select: {
            firstName: true,
            lastName: true,
            username: true,
            email: true,
            companyName: true,
            phoneNumber: true,
            pic: true,
            profilePictureUrl: true,
            role: true,
            address: true
        }
    })
return organizerProfile
}

export const editOrganizerProfileService = async({usersId, uploadedImage, firstName, lastName, username, email, companyName, pic, address, phoneNumber}: any) => {
    const oldImages = await prisma.eventOrganizer.findUnique({
        where: {
            id: usersId
        },
        select: {
            profilePictureUrl: true
        }
    })

    const updateData: {firstName: string, lastName: string, username: string, email: string, companyName: string, pic: string, profilePictureUrl?: string, address?: string, phoneNumber?: string} = {
        firstName, lastName, username, email, companyName, pic, address, phoneNumber
    }

    if (uploadedImage?.mainImage && uploadedImage.mainImage[0]) {
        updateData.profilePictureUrl = uploadedImage.mainImage[0].filename;
    }

    await prisma.eventOrganizer.update({
        where: {
            id: usersId
        },
        data: updateData
    })

    if (oldImages !== null && uploadedImage?.mainImage && uploadedImage.mainImage[0]) {
        deleteFiles({
            imagesUploaded: {
                images: [
                    { path: `src/public/images/${oldImages.profilePictureUrl}` }
                ]
            }
        });
    }
}