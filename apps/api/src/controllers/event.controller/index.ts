import { NextFunction, Request, Response } from "express";
import { createEventService } from "@/services/event.services";

/* 
[1] [Object: null prototype] {
[1]   name: 'Mixology Class',
[1]   type: 'Conference',
[1]   category: 'Business',
[1]   eventPrice: '150',
[1]   capacity: '200',
[1]   tags: [ 'world', 'hello' ],
[1]   tagInput: '',
[1]   venue: 'Japan',
[1]   locationName: 'miyagi school',
[1]   eventType: 'Single Event',
[1]   eventStartDate: '2024-11-06',
[1]   eventStartTime: '16:40',
[1]   eventEndDate: '2024-11-06',
[1]   eventEndTime: '18:40',
[1]   displayStartTime: 'true',
[1]   displayEndTime: 'true',
[1]   timeZone: 'GMT-0400',
[1]   eventPageLanguage: 'Spanish',
[1]   locationType: 'Venue',
[1]   mainImageUrl: 'blob:http://localhost:3000/dbb713f7-376f-4048-a210-d2d54c148866',
[1]   summary: 'where the fuck?',
[1]   detailedDescription: '???'
[1] }
[1] [Object: null prototype] {
[1]   mainImage: [
[1]     {
[1]       fieldname: 'mainImage',
[1]       originalname: 'Ariana_and_Mac_OSCARS_2018_After_Party.jpg',
[1]       encoding: '7bit',
[1]       mimetype: 'image/jpeg',
[1]       destination: 'src/public/images',
[1]       filename: 'mainImage-1730886305518-894163883.jpg',
[1]       path: 'src/public/images/mainImage-1730886305518-894163883.jpg',
[1]       size: 54870
[1]     }
[1]   ]
[1] }
*/

export const createEvent = async(req: Request, res: Response, next: NextFunction) => {
    try {
        let {name, type, category, location, locationName, summary, eventStartDate, eventEndDate, capacity, eventPrice} = req.body
        
        console.log(req.body);

        // set category to lowercase
        category = category.toLowerCase()
        console.log(category)

        // Assuming you're using Multer and `mainImage` is the key for the uploaded file(s)
        const mainImageFile = (req.files as { [fieldname: string]: Express.Multer.File[] }).mainImage?.[0];
        let url = ''

        if (mainImageFile) {
            url = mainImageFile.path; // Access the `path` of the file
            console.log("Image URL:", url);
        } else {
            throw new Error("Main image is required.");
        }

        // determine if the event is paid or not
        let price = Number(eventPrice)
        let isPaid = false;
        if (price > 0) isPaid = true;

        // create event
        await createEventService({name, type, category, location, locationName, url, summary, eventStartDate, eventEndDate, isPaid, capacity})
        
        // login user success to trigger success message
        res.status(201).json({
            error: false, 
            message: `Event creation successful!`,
            data: req.body
        }) 

    } catch (error) {
        console.log(error)

        // Check if error is a custom error with a specific status
        if (error instanceof Error) {
            res.status(400).json({
                error: true,
                message: error.message,
            });
        } else {
            console.log(error)
            next(error); // Pass to global error handler if it's not a handled error
        }
    }
}