"use client"
import React, { useState } from 'react';
import instance from '@/utils/axiosinstance';
import { useMutation, UseQueryResult } from "@tanstack/react-query";
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { errorHandler } from '@/utils/errorHandler';
import authStore from '@/zustand/authStore';
import Link from 'next/link';

// Formik
import { Formik, Field, Form, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';

// create event page
export default function CreateEventPage() {
    const router = useRouter();
    const role = authStore((state) => state.role)
    const token = authStore((state) => state.token)

    // if(role !== 'organizer' || !token){
    //     setTimeout(() => {
    //         router.push('/')
    //     },3000) 
    //     toast.error('Please login as organizer')
    //     return(
    //         <main className='w-full h-screen pt-72'>
    //             <div className='text-center items-center justify-center'>
    //                 <h1 className='text-3xl font-bold text-center items-center justify-center pb-10'>
    //                     Oopsie, Please log in as Organizer to proceed
    //                 </h1>
    //                 <button className='bg-orange-500 rounded-lg items-center justify-center'>
    //                     <Link href='/'>
    //                     <span className='px-5 py-5 text-lg font-bold'>
    //                         go back to Homepage
    //                     </span>     
    //                     </Link>
    //                 </button>
    //             </div>
    //         </main>
    //     )     
    // }
    
    const EventTypeButtons = () => {
        const { values, setFieldValue } = useFormikContext<any>();
        return (
            <div className="flex space-x-3 mb-6">
                <button
                    type="button"
                    onClick={() => setFieldValue('eventType', 'Single Event')}
                    className={`py-2 px-4 rounded-lg ${
                        values.eventType === 'Single Event' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                >
                    Single Event
                </button>
                <button
                    type="button"
                    onClick={() => setFieldValue('eventType', 'Recurring Event')}
                    className={`py-2 px-4 rounded-lg ${
                        values.eventType === 'Recurring Event' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                >
                    Recurring Event
                </button>
            </div>
        );
    };

    // State to hold form values and initialize Formik
    const initialValues = {
        name: '',
        type: '',
        category: '',
        eventPrice: '',
        capacity: '',
        tags: [],
        tagInput: '',
        location: '',
        locationName: '',
        eventType: 'Single Event',
        eventStartDate: '',
        eventStartTime: '',
        eventEndDate: '',
        eventEndTime: '',
        displayStartTime: false,
        displayEndTime: false,
        timeZone: '',
        eventPageLanguage: '',
        locationType: 'Venue',
    };

    // state to hold form values and initialize Formik for page 2
    const initialValues2 = {
        images: null,
        mainImageUrl: '',
        summary: '',
        detailedDescription: ''
    }

    // first page
    const [formValues, setFormValues] = useState(initialValues);
    const [isSaved, setIsSaved] = useState(false);
    const [showRefillPrompt, setShowRefillPrompt] = useState(false);

    const validationSchema = Yup.object({
        name: Yup.string().required('Event name is required').max(75, 'event name cannot exceed 75 characters'),
        type: Yup.string().required('Please select an event type'),
        category: Yup.string().required('Please select a category'),
        eventPrice: Yup.number().required('Price is required').min(0, 'Price cannot be negative'),
        capacity: Yup.number().required('Capacity is required').min(1, 'Capacity must be at least 1'),
        tags: Yup.array()
            .of(Yup.string())
            .min(1, 'Please add at least one tag') // Require at least one tag
            .required('Tags are required'), // Make sure tags array itself is required
        location: Yup.string().when('type', {
            is: 'Venue',
            then: schema => schema.required('location is required for this location type'),
        }),
        locationName: Yup.string().when('type', {
            is: 'Venue',
            then: schema => schema.required('Location name is required when selecting a location'),
            otherwise: schema => schema.notRequired(),
        }),
        eventStartDate: Yup.date()
        .required('Start date is required')
        .typeError('Please enter a valid start date'),
        eventStartTime: Yup.string()
            .required('Start time is required')
            .matches(
                /^([01]\d|2[0-3]):?([0-5]\d)$/,
                'Start time must be in HH:mm format'
            ),
        eventEndDate: Yup.date()
            .required('End date is required')
            .min(Yup.ref('eventStartDate'), 'End date cannot be before start date')
            .typeError('Please enter a valid end date'),
        eventEndTime: Yup.string()
            .required('End time is required')
            .matches(
                /^([01]\d|2[0-3]):?([0-5]\d)$/,
                'End time must be in HH:mm format'
            ),
        displayStartTime: Yup.boolean(),
        displayEndTime: Yup.boolean(),
        timeZone: Yup.string().required('Please select a time zone'),
        eventPageLanguage: Yup.string().required('Please select an event page language'),
    });

    // mutateCreateEvent
    const {mutate: mutateCreateEvent} = useMutation({
        mutationFn: async(fd: any) => {
            return await instance.post('/event/create-event', fd)
        },

        onSuccess: (res) => {
            toast.success(res.data.message)
            router.push('/');
            console.log(res);
        },

        onError: (err) => {
            errorHandler(err)
            console.log(err);
        }
    })

    // List of fields with default values that shouldn't be considered in the "empty" check
    const fieldsWithDefaultValues = ['eventType', 'locationType'];

    const isFormEmpty = Object.entries(formValues)
        .filter(([key]) => !fieldsWithDefaultValues.includes(key)) // Exclude specific fields
        .every(([, value]) => value === '' || value === false || (Array.isArray(value) && value.length === 0));    
        
    // if form is filled and you are faced with a decision whether to refill/ not refill
    if (!isFormEmpty && !isSaved && !showRefillPrompt) {
        return (
            <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
                <p className="text-lg text-gray-700 mb-4">You have previously filled out this form. Would you like to refill it or continue to the summary?</p>
                <div className="space-x-4">
                    <button
                        onClick={() => setShowRefillPrompt(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Refill Form
                    </button>
                    <button
                        onClick={() => setIsSaved(true)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                    >
                        Go to Summary
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>  
            {/* check if you want to overwrite the formValues */}
            {!isSaved ? (
                <div className="min-h-screen bg-gray-50 p-8">
                    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Basic Info</h2>
                        <p className="text-gray-600 mb-8">Name your event and tell event-goers why they should come. Add details that highlight what makes it unique.</p>

                        <Formik
                            initialValues = {initialValues}
                            validationSchema = {validationSchema}
                            onSubmit={(values) => {
                                console.log('first form submitted: ', values);
                                setFormValues(values);
                                setIsSaved(true);
                            }}
                        >
                            {({ values, setFieldValue }) => (
                                <Form>
                                    {/* Event Name */}
                                    <div className="mb-6">
                                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="name">
                                            Event Name <span className="text-red-500">*</span>
                                        </label>
                                        <Field
                                            name="name"
                                            id="name"
                                            type="text"
                                            placeholder="Mixology Class"
                                            maxLength={75}
                                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                                        />
                                        <ErrorMessage name="name" component="p" className="text-red-500 text-sm" />
                                        <p className="text-right text-sm text-gray-500">{values.name.length}/75</p>
                                    </div>
                    
                                    {/* Type and Category */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-2">Type</label>
                                            <Field
                                                as="select"
                                                name="type"
                                                // value={type}
                                                // onChange={(e: any) => {
                                                //     setType(e.target.value)
                                                // }}
                                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="">Select Type</option>
                                                <option value="Conference">Conference</option>
                                                <option value="Seminar">Seminar</option>
                                                <option value="Workshop">Workshop</option>
                                            </Field>
                                            <ErrorMessage name="type" component="p" className="text-red-500 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-2">Category</label>
                                            <Field
                                                as="select"
                                                name="category"
                                                // value={category}
                                                // onChange={(e: any) => setCategory(e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                                            >
                                                <option value="">Select Category</option>
                                                <option value="Education">Education</option>
                                                <option value="Business">Business</option>
                                                <option value="Health">Health</option>
                                            </Field>
                                            <ErrorMessage name="category" component="p" className="text-red-500 text-sm" />
                                        </div>
                                    </div>

                                    {/* Event Price and Capacity */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-2">Event Price ($)</label>
                                            <Field
                                                name="eventPrice"
                                                type="number"
                                                min={0}
                                                placeholder="Enter price"
                                                // value={price}
                                                // onChange={(e: any) => setEventPrice(e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                                            />
                                            <ErrorMessage name="eventPrice" component="p" className="text-red-500 text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 text-sm font-semibold mb-2">Capacity</label>
                                            <Field
                                                name="capacity"
                                                type="number"
                                                min={1}
                                                placeholder="Enter capacity"
                                                // value={capacity}
                                                // onChange={(e: any) => setCapacity(e.target.value)}
                                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                                            />
                                            <ErrorMessage name="capacity" component="p" className="text-red-500 text-sm" />
                                        </div>
                                    </div>

                                    {/* Tags Section */}
                                    <div className="mb-8">
                                        <label className="block text-gray-700 text-sm font-semibold mb-2">Tags</label>
                                        <p className="text-gray-500 mb-2">Improve discoverability of your event by adding tags relevant to the subject matter.</p>
                                        <div className="flex items-center mb-4">
                                            <Field
                                                name="tagInput"
                                                placeholder="Add search keywords to your event"
                                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const { tagInput, tags } = values;
                                                    if (tagInput && tags.length < 25) {
                                                        setFieldValue("tags", [...tags, tagInput]);
                                                        setFieldValue("tagInput", ''); // Clear input
                                                    }
                                                }}
                                                className="bg-gray-200 text-gray-700 ml-2 px-4 py-2 rounded-lg hover:bg-gray-300"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        <ErrorMessage name="tags" component="p" className="text-red-500 text-sm" />
                                        <div className="flex flex-wrap gap-2">
                                            {values.tags.map((tag: any, index: any) => (
                                                <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">{values.tags.length}/25 tags</p>
                                    </div>

                                    {/* Location Section */}
                                    <div className="mb-12">
                                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Location</h3>
                                        <p className="text-gray-600 mb-6">Help people in the area discover your event and let attendees know where to show up.</p>
                                        <div className="flex space-x-3 mb-6">
                                            <button
                                                type="button"
                                                onClick={() => setFieldValue('locationType', 'Venue')}
                                                className={`py-2 px-4 rounded-lg ${values.locationType === 'Venue' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                            >
                                                Venue
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFieldValue('locationType', 'Online event')}
                                                className={`py-2 px-4 rounded-lg ${values.locationType === 'Online event' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                            >
                                                Online event
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFieldValue('locationType', 'To be announced')}
                                                className={`py-2 px-4 rounded-lg ${values.locationType === 'To be announced' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                            >
                                                To be announced
                                            </button>
                                        </div>
                                        
                                        {/* Render location field unconditionally but hide with CSS */}
                                        <div className={`relative ${values.locationType !== 'Venue' ? 'hidden' : ''}`}>
                                            <Field
                                                name="location"
                                                type="text"
                                                placeholder="Search for a location or address"
                                                className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:border-blue-500"
                                            />
                                            <ErrorMessage name="location" component="p" className="text-red-500 text-sm" />
                                        </div>

                                        {/* Location Name field, visible only when 'Venue' is selected */}
                                        <div className={`relative mt-4 ${values.locationType !== 'Venue' ? 'hidden' : ''}`}>
                                            <Field
                                                name="locationName"
                                                type="text"
                                                placeholder="Enter location name"
                                                className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:border-blue-500"
                                            />
                                            <ErrorMessage name="locationName" component="p" className="text-red-500 text-sm" />
                                        </div>
                                    </div>
                                    
                                    {/* Event Type Selection */}
                                    <EventTypeButtons />

                                    {/* Conditionally Render Date and Time Details */}
                                    {values.eventType === 'Single Event' && (
                                        <>
                                            <p className="text-gray-500 mb-6">Single event happens once and can last multiple days.</p>

                                            {/* Event Date and Time Inputs */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2">Event Starts</label>
                                                    <div className="flex space-x-2">
                                                        <Field
                                                            type="date"
                                                            name="eventStartDate"
                                                            // value={startDate}
                                                            // onChange={(e: any) => {setStartDate(e)}}
                                                            className="w-full border border-gray-300 rounded-lg p-2"
                                                        />
                                                        <Field
                                                            type="time"
                                                            name="eventStartTime"
                                                            // value={startTime}
                                                            // onChange={(e: any) => {setStartTime(e)}}
                                                            className="w-full border border-gray-300 rounded-lg p-2"
                                                        />
                                                    </div>
                                                    <ErrorMessage name="eventStartDate" component="p" className="text-red-500 text-sm" />
                                                    <ErrorMessage name="eventStartTime" component="p" className="text-red-500 text-sm" />
                                                </div>

                                                <div>
                                                    <label className="block text-gray-700 font-medium mb-2">Event Ends</label>
                                                    <div className="flex space-x-2">
                                                        <Field
                                                            type="date"
                                                            name="eventEndDate"
                                                            // value={endDate}
                                                            // onChange={(e: any) => {setEndDate(e)}}
                                                            className="w-full border border-gray-300 rounded-lg p-2"
                                                        />
                                                        <Field
                                                            type="time"
                                                            name="eventEndTime"
                                                            // value={endTime}
                                                            // onChange={(e: any) => {setEndTime(e)}}
                                                            className="w-full border border-gray-300 rounded-lg p-2"
                                                        />
                                                    </div>
                                                    <ErrorMessage name="eventEndDate" component="p" className="text-red-500 text-sm" />
                                                    <ErrorMessage name="eventEndTime" component="p" className="text-red-500 text-sm" />
                                                </div>
                                            </div>

                                            {/* Display Time Checkboxes */}
                                            {/* <div className="flex items-center space-x-4 mb-6">
                                                <label className="flex items-center text-gray-700">
                                                    <Field type="checkbox" name="displayStartTime" className="mr-2" />
                                                    Display start time
                                                </label>
                                                <label className="flex items-center text-gray-700">
                                                    <Field type="checkbox" name="displayEndTime" className="mr-2" />
                                                    Display end time
                                                </label>
                                            </div> */}

                                            {/* Time Zone Selection */}
                                            <div className="mb-4">
                                                <label className="block text-gray-700 font-medium mb-2">Time Zone</label>
                                                <Field
                                                    as="select"
                                                    name="timeZone"
                                                    // value={timezone}
                                                    // onChange={(e: any) => {setTimezone(e)}}
                                                    className="w-full border border-gray-300 rounded-lg p-2"
                                                >
                                                    <option value="">Select Time Zone</option>
                                                    <option value="GMT-0400">GMT-0400 United States (New York)</option>
                                                    <option value="GMT+0100">GMT+0100 United Kingdom (London)</option>
                                                    <option value="GMT+0900">GMT+0900 Japan (Tokyo)</option>
                                                </Field>
                                                <ErrorMessage name="timeZone" component="p" className="text-red-500 text-sm" />
                                            </div>

                                            {/* Event Page Language Selection */}
                                            <div className="mb-4">
                                                <label className="block text-gray-700 font-medium mb-2">Event Page Language</label>
                                                <Field
                                                    as="select"
                                                    name="eventPageLanguage"
                                                    // value={language}
                                                    // onChange={(e: any) => {setLanguage(e)}}
                                                    className="w-full border border-gray-300 rounded-lg p-2"
                                                >
                                                    <option value="">Select Language</option>
                                                    <option value="English">English (US)</option>
                                                    <option value="Spanish">Spanish</option>
                                                    <option value="French">French</option>
                                                </Field>
                                                <ErrorMessage name="eventPageLanguage" component="p" className="text-red-500 text-sm" />
                                            </div>
                                        </>
                                    )}

                                    {/* Buttons */}
                                    <div className="flex justify-between">
                                        <button type="button" className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">
                                            Discard
                                        </button>
                                        <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
                                            Save & Continue
                                        </button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>

            ) : 
            
            (
                <Formik
                    // tanya kak ryan (2)
                    initialValues={initialValues2}
                    // merge the form values with the previous form values
                    onSubmit={(values) => {
                        // Merge the previous form values with the current form values
                        const allValues: any = {
                            ...formValues,  // Existing values from the first form
                            ...values,      // New values from the current form
                        };

                        console.log(allValues);

                        // Update the formValues state with the merged data
                        setFormValues(allValues);

                        // Create a new FormData object
                        const formData = new FormData();

                        // Append each field in the merged form values to the FormData
                        for (const key in allValues) {
                            if (allValues[key] instanceof File) {
                                // If the value is a File (for image uploads)
                                formData.append(key, allValues[key]);
                            } else if (Array.isArray(allValues[key])) {
                                // If the value is an array (e.g., tags), append each item
                                allValues[key].forEach((item) => formData.append(`${key}[]`, item));
                            } else {
                                // Otherwise, append as a regular value
                                formData.append(key, allValues[key]);
                            }
                        }
                        mutateCreateEvent(formData);
                        // setIsSaved(true);
                    }}
                    // validationSchema={validationSchema2}
                >
                    {({ values, setFieldValue }) => (
                        <Form>
                            <div className="p-8 bg-gray-50 min-h-screen">
                                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                                    {/* Main Event Image Section */}
                                    <section className="mb-8">
                                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Main Event Image</h3>
                                        <p className="text-gray-600 mb-6">
                                            This is the first image attendees will see at the top of your listing. Use a high-quality image: 2160x1080px (2:1 ratio). 
                                            <a href="#" className="text-blue-500 underline ml-1">Learn more</a>
                                        </p>
                                        
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center cursor-pointer hover:bg-gray-50">
                                            <label className="flex flex-col items-center cursor-pointer">
                                                {values.mainImageUrl && (
                                                    <img src={values.mainImageUrl} alt="Preview" className="mb-4 w-full max-h-48 object-cover" />
                                                )}
                                                <svg
                                                    className="w-12 h-12 text-gray-400 mb-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M3 7v4m0 0a2 2 0 002 2h4m10-6V5a2 2 0 00-2-2h-4m0 0a2 2 0 00-2 2v4m0 0h4m0 4v4m0 0a2 2 0 002 2h4m0-10h-4m0 0H9m10 10V5a2 2 0 00-2-2H9m0 0H7a2 2 0 00-2 2v10a2 2 0 002 2h4m4 0h2a2 2 0 002-2v-4m-6 0h4"
                                                    ></path>
                                                </svg>
                                                <span className="text-gray-500">Drag & drop or click to add main event image.</span>
                                                <span className="text-gray-400 text-sm">JPEG or PNG, no larger than 10MB.</span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={(e: any) => {
                                                        const file = e.target.files[0];
                                                        if (file) {
                                                            setFieldValue('mainImageUrl', URL.createObjectURL(file));
                                                            setFieldValue('images', file);  // Store the file for FormData
                                                        }
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </section>
                                                
                                    {/* Description Section */}
                                    <section>
                                        <h3 className="text-2xl font-semibold text-gray-800 mb-4">Description</h3>
                                        <p className="text-gray-600 mb-4">
                                            Add more details to your event like your schedule, sponsors, or featured guests.
                                            <a href="#" className="text-blue-500 underline ml-1">Learn more</a>
                                        </p>
        
                                        {/* Summary Input */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Summary <span className="text-red-500">*</span>
                                            </label>
                                            <Field
                                                as="textarea"
                                                name="summary"
                                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 resize-none"
                                                placeholder="Write a short event summary to get attendees excited..."
                                                maxLength={500}
                                                rows={3}
                                            />
                                            <ErrorMessage name="summary" component="p" className="text-red-500 text-sm" />
                                            <p className="text-right text-gray-500 text-sm mt-1">{values.summary.length}/500</p>
                                        </div>
        
                                        {/* Detailed Description Input */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Detailed Description</label>
                                            <Field
                                                as="textarea"
                                                name="detailedDescription"
                                                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 resize-none"
                                                placeholder="Provide a detailed description for your event here..."
                                                rows={6}
                                            />
                                            <ErrorMessage name="detailedDescription" component="p" className="text-red-500 text-sm" />
                                        </div>
        
                                        {/* Action Buttons */}
                                        <div className="mt-8 flex justify-between items-center">
                                            {/* Go Back Button */}
                                            <button
                                                type="button"
                                                onClick={() => setIsSaved(false)}
                                                className="text-blue-500 font-semibold hover:text-blue-700"
                                            >
                                                Go Back
                                            </button>
        
                                            {/* Submit Now Button */}
                                            <button type="submit" className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-orange-500">
                                                Submit Now
                                            </button>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            )};
        </>
    )
}