'use client'

import { useState } from 'react'
import { useMutation } from "@tanstack/react-query"
import { useRouter } from 'next/navigation'
import { Formik, Field, Form, ErrorMessage, useFormikContext } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import instance from '@/utils/axiosinstance'
import { errorHandler } from '@/utils/errorHandler'

export default function CreateEventPage() {
    const router = useRouter()
    const [isSaved, setIsSaved] = useState(false)

    const EventTypeButtons = () => {
        const { values, setFieldValue } = useFormikContext<any>()
        return (
            <div className="flex space-x-3 mb-6">
                <Button
                    type="button"
                    onClick={() => setFieldValue('eventType', 'Single Event')}
                    variant={values.eventType === 'Single Event' ? 'default' : 'outline'}
                >
                    Single Event
                </Button>
                <Button
                    type="button"
                    onClick={() => setFieldValue('eventType', 'Recurring Event')}
                    variant={values.eventType === 'Recurring Event' ? 'default' : 'outline'}
                >
                    Recurring Event
                </Button>
            </div>
        )
    }

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
        timeZone: '',
        eventPageLanguage: '',
        locationType: 'Venue',
        images: null,
        mainImageUrl: '',
        summary: '',
        detailedDescription: ''
    }

    const validationSchema = Yup.object({
        name: Yup.string().required('Event name is required').max(75, 'Event name cannot exceed 75 characters'),
        type: Yup.string().required('Please select an event type'),
        category: Yup.string().required('Please select a category'),
        eventPrice: Yup.number().required('Price is required').min(0, 'Price cannot be negative'),
        capacity: Yup.number().required('Capacity is required').min(1, 'Capacity must be at least 1'),
        tags: Yup.array().of(Yup.string()).min(1, 'Please add at least one tag').required('Tags are required'),
        location: Yup.string().when('locationType', {
            is: 'Venue',
            then: schema => schema.required('Location is required for this location type'),
        }),
        locationName: Yup.string().when('locationType', {
            is: 'Venue',
            then: schema => schema.required('Location name is required when selecting a location'),
            otherwise: schema => schema.notRequired(),
        }),
        eventStartDate: Yup.date().required('Start date is required').typeError('Please enter a valid start date'),
        eventStartTime: Yup.string().required('Start time is required').matches(/^([01]\d|2[0-3]):?([0-5]\d)$/, 'Start time must be in HH:mm format'),
        eventEndDate: Yup.date().required('End date is required').min(Yup.ref('eventStartDate'), 'End date cannot be before start date').typeError('Please enter a valid end date'),
        eventEndTime: Yup.string().required('End time is required').matches(/^([01]\d|2[0-3]):?([0-5]\d)$/, 'End time must be in HH:mm format'),
        timeZone: Yup.string().required('Please select a time zone'),
        eventPageLanguage: Yup.string().required('Please select an event page language'),
        summary: Yup.string().required('Summary is required').max(500, 'Summary cannot exceed 500 characters'),
    })

    const { mutate: mutateCreateEvent } = useMutation({
        mutationFn: async (fd: any) => {
            return await instance.post('/event/create-event', fd)
        },
        onSuccess: (res) => {
            toast.success(res.data.message)
            router.push('/dashboard/events')
        },
        onError: (err) => {
            errorHandler(err)
        }
    })

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Create New Event</CardTitle>
                <CardDescription>Fill in the details to create a new event.</CardDescription>
            </CardHeader>
            <CardContent>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        const formData = new FormData()
                        Object.keys(values).forEach(key => {
                            if (key === 'tags') {
                                values[key].forEach((tag: string) => formData.append('tags[]', tag))
                            } else if (key === 'images' && values[key]) {
                                formData.append('images', values[key])
                            } else {
                                formData.append(key, values[key])
                            }
                        })
                        mutateCreateEvent(formData)
                        setSubmitting(false)
                    }}
                >
                    {({ values, setFieldValue, isSubmitting }) => (
                        <Form className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Event Name</Label>
                                    <Field
                                        as={Input}
                                        id="name"
                                        name="name"
                                        placeholder="Enter event name"
                                    />
                                    <ErrorMessage name="name" component="p" className="text-red-500 text-sm" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="type">Type</Label>
                                        <Select as={Select} id="type" name="type">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Conference">Conference</SelectItem>
                                                <SelectItem value="Seminar">Seminar</SelectItem>
                                                <SelectItem value="Workshop">Workshop</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <ErrorMessage name="type" component="p" className="text-red-500 text-sm" />
                                    </div>
                                    <div>
                                        <Label htmlFor="category">Category</Label>
                                        <Field as={Select} id="category" name="category">
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Education">Education</SelectItem>
                                                <SelectItem value="Business">Business</SelectItem>
                                                <SelectItem value="Health">Health</SelectItem>
                                            </SelectContent>
                                        </Field>
                                        <ErrorMessage name="category" component="p" className="text-red-500 text-sm" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="eventPrice">Event Price ($)</Label>
                                        <Field
                                            as={Input}
                                            id="eventPrice"
                                            name="eventPrice"
                                            type="number"
                                            min="0"
                                            placeholder="Enter price"
                                        />
                                        <ErrorMessage name="eventPrice" component="p" className="text-red-500 text-sm" />
                                    </div>
                                    <div>
                                        <Label htmlFor="capacity">Capacity</Label>
                                        <Field
                                            as={Input}
                                            id="capacity"
                                            name="capacity"
                                            type="number"
                                            min="1"
                                            placeholder="Enter capacity"
                                        />
                                        <ErrorMessage name="capacity" component="p" className="text-red-500 text-sm" />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="tagInput">Tags</Label>
                                    <div className="flex items-center space-x-2">
                                        <Field
                                            as={Input}
                                            id="tagInput"
                                            name="tagInput"
                                            placeholder="Add search keywords to your event"
                                        />
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                if (values.tagInput && values.tags.length < 25) {
                                                    setFieldValue("tags", [...values.tags, values.tagInput])
                                                    setFieldValue("tagInput", '')
                                                }
                                            }}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {values.tags.map((tag: string, index: number) => (
                                            <span key={index} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-sm">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <ErrorMessage name="tags" component="p" className="text-red-500 text-sm" />
                                </div>

                                <div>
                                    <Label>Location Type</Label>
                                    <div className="flex space-x-2 mt-2">
                                        {['Venue', 'Online event', 'To be announced'].map((type) => (
                                            <Button
                                                key={type}
                                                type="button"
                                                onClick={() => setFieldValue('locationType', type)}
                                                variant={values.locationType === type ? 'default' : 'outline'}
                                            >
                                                {type}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {values.locationType === 'Venue' && (
                                    <>
                                        <div>
                                            <Label htmlFor="location">Location</Label>
                                            <Field
                                                as={Input}
                                                id="location"
                                                name="location"
                                                placeholder="Search for a location or address"
                                            />
                                            <ErrorMessage name="location" component="p" className="text-red-500 text-sm" />
                                        </div>
                                        <div>
                                            <Label htmlFor="locationName">Location Name</Label>
                                            <Field
                                                as={Input}
                                                id="locationName"
                                                name="locationName"
                                                placeholder="Enter location name"
                                            />
                                            <ErrorMessage name="locationName" component="p" className="text-red-500 text-sm" />
                                        </div>
                                    </>
                                )}

                                <EventTypeButtons />

                                {values.eventType === 'Single Event' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="eventStartDate">Event Start Date</Label>
                                                <Field
                                                    as={Input}
                                                    id="eventStartDate"
                                                    name="eventStartDate"
                                                    type="date"
                                                />
                                                <ErrorMessage name="eventStartDate" component="p" className="text-red-500 text-sm" />
                                            </div>
                                            <div>
                                                <Label htmlFor="eventStartTime">Event Start Time</Label>
                                                <Field
                                                    as={Input}
                                                    id="eventStartTime"
                                                    name="eventStartTime"
                                                    type="time"
                                                />
                                                <ErrorMessage name="eventStartTime" component="p" className="text-red-500 text-sm" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="eventEndDate">Event End Date</Label>
                                                <Field
                                                    as={Input}
                                                    id="eventEndDate"
                                                    name="eventEndDate"
                                                    type="date"
                                                />
                                                <ErrorMessage name="eventEndDate" component="p" className="text-red-500 text-sm" />
                                            </div>
                                            <div>
                                                <Label htmlFor="eventEndTime">Event End Time</Label>
                                                <Field
                                                    as={Input}
                                                    id="eventEndTime"
                                                    name="eventEndTime"
                                                    type="time"
                                                />
                                                <ErrorMessage name="eventEndTime" component="p" className="text-red-500 text-sm" />
                                            </div>
                                        </div>
                                        <div>
                                            <Label htmlFor="timeZone">Time Zone</Label>
                                            <Select id="timeZone" name="timeZone">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Time Zone" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="GMT-0400">GMT-0400 United States (New York)</SelectItem>
                                                    <SelectItem value="GMT+0100">GMT+0100 United Kingdom (London)</SelectItem>
                                                    <SelectItem value="GMT+0900">GMT+0900 Japan (Tokyo)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <ErrorMessage name="timeZone" component="p" className="text-red-500 text-sm" />
                                        </div>
                                        <div>
                                            <Label htmlFor="eventPageLanguage">Event Page Language</Label>
                                            <Select id="eventPageLanguage" name="eventPageLanguage">
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Language" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="English">English (US)</SelectItem>
                                                    <SelectItem value="Spanish">Spanish</SelectItem>
                                                    <SelectItem value="French">French</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <ErrorMessage name="eventPageLanguage" component="p" className="text-red-500 text-sm" />
                                        </div>
                                    </>
                                )}

                                <div>
                                    <Label htmlFor="mainImageUrl">Main Event Image</Label>
                                    <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                                        <div className="space-y-1 text-center">
                                            {values.mainImageUrl ? (
                                                <img src={values.mainImageUrl} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded-md" />
                                            ) : (
                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                            <div className="flex text-sm text-gray-600">
                                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                                    <span>Upload a file</span>
                                                    <input 
                                                        id="file-upload" 
                                                        name="file-upload" 
                                                        type="file" 
                                                        className="sr-only"
                                                        onChange={(event) => {
                                                            const file = event.currentTarget.files?.[0]
                                                            if (file) {
                                                                setFieldValue('mainImageUrl', URL.createObjectURL(file))
                                                                setFieldValue('images', file)
                                                            }
                                                        }}
                                                    />
                                                </label>
                                                <p className="pl-1">or drag and drop</p>
                                            </div>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="summary">Summary</Label>
                                    <Field
                                        as={Textarea}
                                        id="summary"
                                        name="summary"
                                        placeholder="Write a short event summary to get attendees excited..."
                                        rows={3}
                                    />
                                    <ErrorMessage name="summary" component="p" className="text-red-500 text-sm" />
                                </div>

                                <div>
                                    <Label htmlFor="detailedDescription">Detailed Description</Label>
                                    <Field
                                        as={Textarea}
                                        id="detailedDescription"
                                        name="detailedDescription"
                                        placeholder="Provide a detailed description for your event here..."
                                        rows={6}
                                    />
                                    <ErrorMessage name="detailedDescription" component="p" className="text-red-500 text-sm" />
                                </div>
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => router.push('/dashboard/events')}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Creating...' : 'Create Event'}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </CardContent>
        </Card>
    )
}