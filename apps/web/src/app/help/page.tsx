import React from 'react';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
        {/* Main Title */}
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900">How can we help?</h1>
            <div className="mt-4">
            <input
                type="text"
                placeholder="Search help articles"
                className="w-full max-w-md mx-auto p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
            <button className="px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-semibold">
            Attending an event
            </button>
            <button className="px-4 py-2 text-gray-600 border-b-2 border-transparent font-semibold hover:text-blue-600 hover:border-blue-600">
            Organizing an event
            </button>
        </div>

        {/* Featured Articles */}
        <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Featured articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {["Find your tickets", "Request a refund", "Contact the event organizer", "What is this charge from Eventbrite?", "Transfer tickets to someone else", "Edit your order information"].map((article) => (
                <div key={article} className="flex items-center border border-gray-300 rounded-lg p-4 hover:shadow-md cursor-pointer">
                <span className="text-indigo-600 mr-3">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V4a2 2 0 00-2-2H4zm3 3h6a1 1 0 110 2H7a1 1 0 110-2zM4 10h12v6H4v-6z" />
                    </svg>
                </span>
                <span className="text-gray-700 font-semibold">{article}</span>
                </div>
            ))}
            </div>
        </div>

        {/* Floating Button */}
        <div className="fixed bottom-8 right-8">
            <button className="bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-orange-600 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-2.586l-4.707 4.707A1 1 0 019 19v-4H4a2 2 0 01-2-2V5z" />
            </svg>
            Ask a question
            </button>
        </div>

        {/* Browse by Topic */}
        <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Browse by topic</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { icon: '$', label: 'Buy and register' },
                { icon: '🎟️', label: 'Your tickets' },
                { icon: '👤', label: 'Your account' },
                { icon: '📄', label: 'Terms and policies' }
            ].map((topic) => (
                <div key={topic.label} className="flex flex-col items-center justify-center border border-gray-200 rounded-lg p-6 hover:shadow-md">
                <span className="text-blue-500 text-4xl mb-2">{topic.icon}</span>
                <p className="text-gray-800 font-semibold">{topic.label}</p>
                </div>
            ))}
            </div>
        </div>

        {/* Still Have Questions */}
        <div className="text-center mt-16">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Still have questions?</h3>
            <button className="bg-orange-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-orange-600">
            Contact us
            </button>
        </div>

        {/* Floating "Ask a Question" Button */}
        <div className="fixed bottom-8 right-8">
            <button className="bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-orange-600 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2h-2.586l-4.707 4.707A1 1 0 019 19v-4H4a2 2 0 01-2-2V5z" />
            </svg>
            Ask a question
            </button>
        </div>
    </div>
  );
}