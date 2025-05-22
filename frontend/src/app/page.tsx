'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  id: string;
  alias: string;
  content: string;
  timestamp: Date;
  isSent: boolean;
  expirationTime?: number;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      alias: 'System',
      content: 'Welcome to anon_chat! Messages are end-to-end encrypted.',
      timestamp: new Date(),
      isSent: false,
    },
    {
      id: '2',
      alias: 'Alice',
      content: 'Hello everyone! 👋',
      timestamp: new Date(),
      isSent: false,
    },
    {
      id: '3',
      alias: 'Bob',
      content: 'Hey Alice! How are you?',
      timestamp: new Date(),
      isSent: false,
    },
  ]);

  const [alias, setAlias] = useState('');
  const [message, setMessage] = useState('');
  const [expirationTime, setExpirationTime] = useState('60');
  const [isSending, setIsSending] = useState(false);
  const [errors, setErrors] = useState<{ alias?: string; message?: string }>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessageId, setNewMessageId] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const validateForm = () => {
    const newErrors: { alias?: string; message?: string } = {};
    if (!alias.trim()) {
      newErrors.alias = 'Alias is required';
    }
    if (!message.trim()) {
      newErrors.message = 'Message is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = async () => {
    if (!validateForm()) return;

    setIsSending(true);
    const newMessage: Message = {
      id: Date.now().toString(),
      alias,
      content: message,
      timestamp: new Date(),
      isSent: true,
      expirationTime: parseInt(expirationTime),
    };

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setMessages(prev => [...prev, newMessage]);
    setNewMessageId(newMessage.id);
    setMessage('');
    setIsSending(false);

    // Remove highlight after animation
    setTimeout(() => {
      setNewMessageId(null);
    }, 1000);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="chat-container">
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button 
          className="sidebar-toggle"
          onClick={toggleSidebar}
          style={{ display: 'none' }}
        >
          ☰
        </button>
        <nav>
          <Link href="/" className="sidebar-link">Home</Link>
          <Link href="/send" className="sidebar-link">Send</Link>
          <Link href="/view" className="sidebar-link">View</Link>
        </nav>
      </div>

      <div className="main-content">
        <div className="messages-container">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message-wrapper ${message.isSent ? 'sent' : 'received'} ${
                message.id === newMessageId ? 'new' : ''
              }`}
            >
              <div className={`message-bubble ${message.isSent ? 'sent' : 'received'}`}>
                <div className="message-alias">{message.alias}</div>
                <p className="message-content">{message.content}</p>
                <p className="message-timestamp">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                  {message.expirationTime && (
                    <span> • Expires in {message.expirationTime} minutes</span>
                  )}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <div className="input-container">
            <div className="input-row">
              <div className="input-group">
                <label className="input-label">Your Alias</label>
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="Enter your alias"
                  className="alias-input"
                />
                {errors.alias && <p className="error-message">{errors.alias}</p>}
              </div>
              <div className="input-group">
                <label className="input-label">Expires in (minutes)</label>
                <input
                  type="number"
                  value={expirationTime}
                  onChange={(e) => setExpirationTime(e.target.value)}
                  className="expiration-select"
                  min="1"
                  max="1440"
                />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="message-input"
                rows={3}
              />
              {errors.message && <p className="error-message">{errors.message}</p>}
            </div>
            <button
              onClick={handleSend}
              disabled={isSending}
              className="send-button"
            >
              {isSending ? (
                <>
                  <div className="spinner" />
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
