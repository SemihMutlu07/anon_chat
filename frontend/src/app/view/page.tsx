'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  alias: string;
  content: string;
  timestamp: Date;
  isSent: boolean;
  expirationTime?: number;
}

export default function ViewPage() {
  const [chatHistory, setChatHistory] = useState<Message[]>([
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
  ]);

  const [alias, setAlias] = useState('');
  const [message, setMessage] = useState('');
  const [expirationTime, setExpirationTime] = useState('60');
  const [isSending, setIsSending] = useState(false);
  const [errors, setErrors] = useState<{ alias?: string; message?: string }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newMessageId, setNewMessageId] = useState<string | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const validateForm = () => {
    const newErrors: { alias?: string; message?: string } = {};
    if (!alias.trim()) newErrors.alias = 'Alias is required';
    if (!message.trim()) newErrors.message = 'Message is required';
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

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    setChatHistory(prev => [...prev, newMessage]);
    setNewMessageId(newMessage.id);
    setMessage('');
    setIsSending(false);

    setTimeout(() => setNewMessageId(null), 1000);
  };

  return (
    <div className="main-content">
      <div className="messages-container">
        {chatHistory.map((msg) => (
          <div
            key={msg.id}
            className={`message-wrapper ${msg.isSent ? 'sent' : 'received'} ${msg.id === newMessageId ? 'new' : ''}`}
          >
            <div className={`message-bubble ${msg.isSent ? 'sent' : 'received'}`}>
              <div className="message-alias">{msg.alias}</div>
              <p className="message-content">{msg.content}</p>
              <p className="message-timestamp">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {msg.expirationTime && <span> • Expires in {msg.expirationTime} min</span>}
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
                placeholder="Anonymous"
                className="alias-input"
              />
              {errors.alias && <p className="error-message">{errors.alias}</p>}
            </div>
            <div className="input-group">
              <label className="input-label">Expires in (min)</label>
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
            {isSending ? <><div className="spinner" /> Sending...</> : 'Send Message'}
          </button>
        </div>
      </div>
    </div>
  );
}
