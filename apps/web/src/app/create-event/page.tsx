"use client"
import React, { useState } from 'react';

export default function CreateEventPage() {
    const [title, setTitle] = useState('');
    const [organizer, setOrganizer] = useState('Eventbrite Training 2');
    const [type, setType] = useState('');
    const [category, setCategory] = useState('');
    const [tags, setTags] = useState<string[]>([]); // Define tags as an array of strings
    const [tagInput, setTagInput] = useState('');

    // set isSaved to false
    const [isSaved, setIsSaved] = useState(false);

    const [locationType, setLocationType] = useState('Venue');
    const [eventType, setEventType] = useState('Single Event');
    
    // event detail page
    const [summary, setSummary] = useState('');

    const addTag = () => {
        if (tagInput && tags.length < 25) {
        setTags([...tags, tagInput]); // Now this will work without errors
        setTagInput('');
        }
    };
  
    return (
        <>
            {!isSaved ? (
                <div className="min-h-screen bg-gray-50 p-8">
                    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Basic Info</h2>
                        <p className="text-gray-600 mb-8">Name your event and tell event-goers why they should come. Add details that highlight what makes it unique.</p>
                        
                        {/* Event Title */}
                        <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="title">
                            Event Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            placeholder="Mixology Class"
                            maxLength={75}
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                        />
                        <p className="text-right text-sm text-gray-500">{title.length}/75</p>
                        </div>
            
                        {/* Organizer */}
                        {/* <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Organizer</label>
                        <select
                            value={organizer}
                            onChange={(e) => setOrganizer(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                        >
                            <option>Eventbrite Training 2</option>
                            <option>Another Organizer</option>
                        </select>
                        <p className="text-sm text-gray-500 mt-1">This profile describes a unique organizer and shows all of the events on one page. <a href="#" className="text-blue-500 underline">View Organizer Info</a></p>
                        </div> */}
            
                        {/* Type and Category */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Type</label>
                            <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                            >
                            <option value="">Select Type</option>
                            <option value="Conference">Conference</option>
                            <option value="Seminar">Seminar</option>
                            <option value="Workshop">Workshop</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Category</label>
                            <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                            >
                            <option value="">Select Category</option>
                            <option value="Education">Education</option>
                            <option value="Business">Business</option>
                            <option value="Health">Health</option>
                            </select>
                        </div>
                        </div>
            
                        {/* Tags */}
                        <div className="mb-8">
                        <label className="block text-gray-700 text-sm font-semibold mb-2">Tags</label>
                        <p className="text-gray-500 mb-2">Improve discoverability of your event by adding tags relevant to the subject matter.</p>
                        <div className="flex items-center mb-4">
                            <input
                            type="text"
                            placeholder="Add search keywords to your event"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500"
                            />
                            <button
                            onClick={addTag}
                            className="bg-gray-200 text-gray-700 ml-2 px-4 py-2 rounded-lg hover:bg-gray-300"
                            >
                            Add
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag, index) => (
                            <span key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">{tag}</span>
                            ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-2">{tags.length}/25 tags</p>
                        </div>
                        
                        {/* Location Section */}
                        <div className="mb-12">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Location</h3>
                            <p className="text-gray-600 mb-6">Help people in the area discover your event and let attendees know where to show up.</p>
                            <div className="flex space-x-3 mb-6">
                                <button
                                    onClick={() => setLocationType('Venue')}
                                    className={`py-2 px-4 rounded-lg ${locationType === 'Venue' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                >
                                    Venue
                                </button>
                                <button
                                    onClick={() => setLocationType('Online event')}
                                    className={`py-2 px-4 rounded-lg ${locationType === 'Online event' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                >
                                    Online event
                                </button>
                                <button
                                    onClick={() => setLocationType('To be announced')}
                                    className={`py-2 px-4 rounded-lg ${locationType === 'To be announced' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                >
                                    To be announced
                                </button>
                            </div>
                            {locationType === 'Venue' && (
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search for a venue or address"
                                        className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            )}
                        </div>
            
                        {/* Date and Time Section */}
                        <div className="mb-12">
                            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Date and Time</h3>
                            <p className="text-gray-600 mb-6">Tell event-goers when your event starts and ends so they can make plans to attend.</p>
                            
                            {/* Event Type Selection */}
                            <div className="flex space-x-3 mb-6">
                                <button
                                    onClick={() => setEventType('Single Event')}
                                    className={`py-2 px-4 rounded-lg ${eventType === 'Single Event' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                >
                                    Single Event
                                </button>
                                <button
                                    onClick={() => setEventType('Recurring Event')}
                                    className={`py-2 px-4 rounded-lg ${eventType === 'Recurring Event' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                                >
                                    Recurring Event
                                </button>
                            </div>
                            
                            {/* Conditionally Render Date and Time Details */}
                            {eventType === 'Single Event' && (
                                <>
                                    <p className="text-gray-500 mb-6">Single event happens once and can last multiple days.</p>
                                    {/* Event Date and Time Inputs */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Event Starts</label>
                                            <div className="flex space-x-2">
                                                <input type="date" className="w-full border border-gray-300 rounded-lg p-2" />
                                                <input type="time" className="w-full border border-gray-300 rounded-lg p-2" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-gray-700 font-medium mb-2">Event Ends</label>
                                            <div className="flex space-x-2">
                                                <input type="date" className="w-full border border-gray-300 rounded-lg p-2" />
                                                <input type="time" className="w-full border border-gray-300 rounded-lg p-2" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Display Time Checkboxes */}
                                    <div className="flex items-center space-x-4 mb-6">
                                        <label className="flex items-center text-gray-700">
                                            <input type="checkbox" className="mr-2" /> Display start time
                                        </label>
                                        <label className="flex items-center text-gray-700">
                                            <input type="checkbox" className="mr-2" /> Display end time
                                        </label>
                                    </div>
                                    
                                    {/* Time Zone Selection */}
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-medium mb-2">Time Zone</label>
                                        <select className="w-full border border-gray-300 rounded-lg p-2">
                                            <option>GMT-0400 United States (New York)</option>
                                            <option>GMT+0100 United Kingdom (London)</option>
                                            <option>GMT+0900 Japan (Tokyo)</option>
                                            {/* Add more time zones as needed */}
                                        </select>
                                    </div>
                                    
                                    {/* Event Page Language Selection */}
                                    <div className="mb-4">
                                        <label className="block text-gray-700 font-medium mb-2">Event Page Language</label>
                                        <select className="w-full border border-gray-300 rounded-lg p-2">
                                            <option>English (US)</option>
                                            <option>Spanish</option>
                                            <option>French</option>
                                            {/* Add more languages as needed */}
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>
                    
                        {/* Buttons */}
                        <div className="flex justify-between">
                            <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Discard</button>
                            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600" onClick={() => setIsSaved(true)}>Save & Continue</button>
                        </div>
                    </div>
                </div>
            ) : 
            
            (
                <>
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
                                        <input type="file" className="hidden" />
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
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Summary <span className="text-red-500">*</span></label>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 resize-none"
                                        placeholder="Write a short event summary to get attendees excited..."
                                        maxLength={140}
                                        value={summary}
                                        onChange={(e) => setSummary(e.target.value)}
                                        rows={3}
                                    />
                                    <p className="text-right text-gray-500 text-sm mt-1">{summary.length}/140</p>
                                </div>

                                {/* Detailed Description Input */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Detailed Description</label>
                                    <textarea
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:border-blue-500 resize-none"
                                        placeholder="Provide a detailed description for your event here..."
                                        rows={6}
                                    />
                                    
                                    <div className="flex justify-end mt-2 text-gray-500 space-x-2">
                                        <button className="text-gray-500 hover:text-gray-700">B</button>
                                        <button className="text-gray-500 hover:text-gray-700">I</button>
                                        <button className="text-gray-500 hover:text-gray-700">U</button>
                                        <button className="text-gray-500 hover:text-gray-700">•</button>
                                        <button className="text-gray-500 hover:text-gray-700">List</button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-8 flex justify-between items-center">
                                    {/* Go Back Button */}
                                    <button
                                        onClick={() => setIsSaved(false)}
                                        className="text-blue-500 font-semibold hover:text-blue-700"
                                    >
                                        Go Back
                                    </button>

                                    {/* Submit Now Button */}
                                    <button
                                        className="bg-orange-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-orange-500"
                                    >
                                        Submit Now
                                    </button>
                                </div>
                            </section>
                        </div>
                    </div>                
                </>
            )};
        </>
    )
}
