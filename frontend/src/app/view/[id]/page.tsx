'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Message {
  content: string;
  alias: string;
  created_at: string;
  expires_at: string;
}

export default function ViewPage() {
  const params = useParams();
  const [message, setMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch(`http://localhost:8000/messages/${params.id}`);
        if (!response.ok) {
          throw new Error('Message not found or expired');
        }
        const data = await response.json();
        setMessage(data);
        // Trigger fade-in animation
        setTimeout(() => setIsVisible(true), 100);
      } catch (err) {
        setError('This message has expired or doesn\'t exist.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessage();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <div className="text-red-600 dark:text-red-400 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Message Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <Link
              href="/send"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Send a New Message
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!message) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div
          className={`bg-white dark:bg-gray-800 shadow rounded-lg p-6 transition-all duration-500 transform ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Anonymous Message</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              From: {message.alias || 'Anonymous'} • {formatDate(message.created_at)}
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none mb-6">
            <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{message.content}</p>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Expires: {formatDate(message.expires_at)}
            </p>
          </div>

          <div className="mt-6">
            <Link
              href="/send"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Send Your Own Message
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 