'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query'; // Using @tanstack/react-query
import { FiInbox, FiStar, FiSend, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import authStore from '@/zustand/authStore';

type Message = {
  id: string; // Assuming id is a string from your backend schema
  subject: string;
  sender: string;
  content: string;
  receiver: string;
  createdAt: string; // ISO date string
};

export default function Inbox() {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  // Fetch messages using useQuery
  const { data: messages, isLoading, isError } = useQuery({
    queryKey: ['messages'],
    queryFn: async () => {
      const token = authStore.getState().token
      const response = await axios.get('http://localhost:4700/api/email', {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
        },
      });
      return response.data.data; // Make sure this is an array of messages
    },
  });

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading messages...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Failed to load messages. Please try again.
      </div>
    );
  }

  // Fallback if messages is not an array
  const messageList: Message[] = Array.isArray(messages) ? messages : [];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-1/4 bg-gray-100 p-4 border-r">
        <h2 className="text-xl font-semibold mb-4">Inbox</h2>
        <ul className="space-y-2">
          <li className="flex items-center space-x-2 cursor-pointer text-gray-700 hover:text-red-600">
            <FiInbox />
            <span>All Messages</span>
          </li>
          <li className="flex items-center space-x-2 cursor-pointer text-gray-700 hover:text-red-600">
            <FiStar />
            <span>Starred</span>
          </li>
          <li className="flex items-center space-x-2 cursor-pointer text-gray-700 hover:text-red-600">
            <FiSend />
            <span>Sent</span>
          </li>
          <li className="flex items-center space-x-2 cursor-pointer text-gray-700 hover:text-red-600">
            <FiTrash2 />
            <span>Trash</span>
          </li>
        </ul>
      </aside>

      {/* Message List */}
      <section className="w-1/4 bg-white p-4 border-r overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Messages</h2>
        {messageList.length > 0 ? (
          messageList.map((message: Message) => (
            <div
              key={message.id}
              onClick={() => setSelectedMessage(message)}
              className="p-2 mb-2 border rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <h3 className="text-sm font-bold text-gray-800">{message.subject}</h3>
              <p className="text-xs text-gray-500">
                {message.sender} • {new Date(message.createdAt).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600 truncate">{message.content}</p>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No messages available.</div>
        )}
      </section>

      {/* Message Detail */}
      <section className="w-1/2 bg-gray-50 p-6 overflow-y-auto">
        {selectedMessage ? (
          <>
            <h2 className="text-xl font-semibold">{selectedMessage.subject}</h2>
            <p className="text-sm text-gray-500 mb-4">
              From: {selectedMessage.sender} •{' '}
              {new Date(selectedMessage.createdAt).toLocaleString()}
            </p>
            <div className="border-t pt-4">
              <p className="text-sm text-gray-700">{selectedMessage.content}</p>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a message to view its details.
          </div>
        )}
      </section>
    </div>
  );
}