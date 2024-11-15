import { NextFunction, Request, Response } from "express";
import { createEventService, getEventByIdService, getEventService } from "@/services/event.services";

/* 
[0] 8:16:10 PM - Found 0 errors. Watching for file changes.
[1] ⚡️ [Server]: Server is running at http://localhost:4700
[1] [Object: null prototype] {
[1]   name: 'INFO1113: Object-Oriented Programming',
[1]   type: 'Conference',
[1]   category: 'Education',
[1]   eventPrice: '0',
[1]   capacity: '500',
[1]   tags: [
[1]     'OOP',
[1]     'java',
[1]     'world',
[1]     'concurrency development',
[1]     'gradle',
[1]     'SOFT2201'
[1]   ],
[1]   tagInput: '',
[1]   location: 'Sydney, New South Wales',
[1]   locationName: 'University of Sydney',
[1]   eventType: 'Single Event',
[1]   eventStartDate: '2024-11-08',
[1]   eventStartTime: '20:11',
[1]   eventEndDate: '2024-11-08',
[1]   eventEndTime: '22:11',
[1]   displayStartTime: 'true',
[1]   displayEndTime: 'true',
[1]   timeZone: 'GMT+0900',
[1]   eventPageLanguage: 'Spanish',
[1]   locationType: 'Venue',
[1]   mainImageUrl: 'blob:http://localhost:3000/aaeb8748-11af-411f-9e6d-3b21bbf7f8b8',
[1]   summary: 'Unit of study_\r\n' +
[1]     'INFO1113: Object-Oriented Programming\r\n' +
[1]     '2025 unit information\r\n' +
[1]     '\r\n' +
[1]     'Object-oriented (OO) programming is a technique that arranges code into classes, each encapsulating in one place related data and the operations on that data. Inheritance is used to reuse code from a more general class, in specialised situations. Most modern programming languages provide OO features. Understanding and using these are an essential skill to software developers in industry.',
[1]   detailedDescription: 'At the completion of this unit, you should be able to:\r\n' +
[1]     '\r\n' +
[1]     'LO1. demonstrate an understanding of the concept of Object-Orientation: understand and explain key concepts of object-oriented programming, including classes as encapsulating data, object instances, memory model of references, methods and calling them across objects\r\n' +
[1]     'LO2. read and interpret an object oriented design document\r\n' +
[1]     'LO3. demonstrate an understanding of the memory model and differences between locations of variables\r\n' +
[1]     'LO4. derive a computer program from a design document that uses concepts of OO and memory model, trace and write small examples of code including the following elements: inheritance, polymorphism, abstract classes and interfaces, variables and their type and the relationship between static and dynamic type, exception\r\n' +
[1]     'LO5. demonstrate experience in testing Object-Oriented programs, write tests for standalone objects, be able to generate and handle exceptions, create invariants for classes, methods and objects, pre- and post-conditions for methods, and assertions\r\n' +
[1]     'LO6. create appropriate class/data structure including the data types and methods for simple problems\r\n' +
[1]     'LO7. read, trace and write recursive Object-Oriented programs to perform an operation in a related set of classes that support some nested structure\r\n' +
[1]     'LO8. demonstrate an understanding of Object-Oriented programming language : reading, tracing and writing competence with the following elements of Java programming language: classes, methods, object creation; instance and local variables, parameters and scope; basic types; simple I/O; control flow primitives and understand, modify and add functionality to Java programs\r\n' +
[1]     'LO9. demonstrate experience writing code with common interfaces and collections in Object-Oriented programming language\r\n' +
[1]     'LO10. demonstrate experience in testing and debugging Object-Oriented programs, write tests for stand-alone object code, to be run automatically.\r\n' +
[1]     '\r\n' +
[1]     'Unit availability\r\n' +
[1]     'This section lists the session, attendance modes and locations the unit is available in. There is a unit outline for each of the unit availabilities, which gives you information about the unit including assessment details and a schedule of weekly activities.\r\n' +
[1]     '\r\n' +
[1]     'The outline is published 2 weeks before the first day of teaching. You can look at previous outlines for a guide to the details of a unit.\r\n' +
[1]     '\r\n' +
[1]     'Find your current year census dates\r\n' +
[1]     '\r\n' +
[1]     'Modes of attendance (MoA)\r\n' +
[1]     'This refers to the Mode of attendance (MoA) for the unit as it appears when you’re selecting your units in Sydney Student. Find more information about modes of attendance on our website.',
[1]   usersId: '2be63048-bdd1-4e53-902a-96f91a74d8bf',
[1]   authrorizationRole: 'organizer'
[1] }
*/
export const createEvent = async(req: Request, res: Response, next: NextFunction) => {
    try {
        let {name, type, category, location, locationName, summary, detailedDescription, eventStartDate, eventEndDate, capacity, eventPrice, usersId, tags} = req.body

        // set category to lowercase
        category = category.toLowerCase()

        // Assuming you're using Multer and `mainImage` is the key for the uploaded file(s)
        const mainImageFile = (req.files as { [fieldname: string]: Express.Multer.File[] }).images?.[0];
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
        await createEventService({name, type, category, location, locationName, summary, detailedDescription, eventStartDate, eventEndDate, capacity, eventPrice, usersId, tags, url, isPaid})
        
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
            next(error); // Pass to global error handler if it's not a handled error
        }
    }
}

export const getEvent = async(req: Request, res: Response, next: NextFunction) => {
    try {
        let data = await getEventService()
        // console.log(data)

        // get event success
        res.status(200).json({
            error: false,
            message: `get event successful!`,
            data: data
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
            next(error); // Pass to global error handler if it's not a handled error
        }
        next(error);
    }
}

export const getEventById = async(req: Request, res: Response, next: NextFunction) => {
    try {
        // get the id from the request parameter
        const {id} = req.params; 
        console.log(id);        

        // fetch the event by ID
        let data = await getEventByIdService({id})
        console.log("dipanggil dari getEventById", data);        

        // return the event data as JSON
        if (data){
            res.status(200).json({success: true, data})
        } else {
            res.status(400).json({success: false, message: 'event not found', data: {}})
        }

    } catch (error) {
        console.error('Error fetching event by ID:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
}