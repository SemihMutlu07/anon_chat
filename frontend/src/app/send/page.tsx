'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SendPage() {
  const router = useRouter();
  const [alias, setAlias] = useState('');
  const [content, setContent] = useState('');
  const [expires, setExpires] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch('http://localhost:8000/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alias: alias.trim(),
          content: content.trim(),
          expires_in_minutes: expires ? parseInt(expires) : undefined,
        }),
      });

      if (!res.ok) throw new Error('Failed to send message');

      const data = await res.json();
      setSuccess(`/view/${data.id}`);
      setAlias('');
      setContent('');
      setExpires('');
    } catch {
      setError('Could not send your message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="main-content">
      <div className="chat-card">
        <h2 className="chat-title">Send a Message</h2>
        <p className="chat-desc">Share your thoughts anonymously</p>

        {success ? (
          <div className="chat-success">
            <div>
              Message sent! <a href={success} className="chat-link">View it here</a>
            </div>
            <button
              className="chat-button chat-button-secondary"
              onClick={() => setSuccess(null)}
            >
              Send another
            </button>
          </div>
        ) : (
          <form className="chat-form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="alias" className="chat-label">Alias (optional)</label>
              <input
                id="alias"
                type="text"
                maxLength={100}
                className="chat-input"
                value={alias}
                onChange={e => setAlias(e.target.value)}
                placeholder="Anonymous"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="content" className="chat-label">Message</label>
              <textarea
                id="content"
                maxLength={500}
                required
                className="chat-textarea"
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="Type your message here..."
                disabled={isLoading}
              />
              <div className="chat-count">{content.length}/500</div>
            </div>
            <div>
              <label htmlFor="expires" className="chat-label">Expires in (minutes)</label>
              <input
                id="expires"
                type="number"
                min={1}
                max={10080}
                className="chat-expiry"
                value={expires}
                onChange={e => setExpires(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="e.g. 60"
                disabled={isLoading}
              />
            </div>
            {error && <div className="chat-error">{error}</div>}
            <button
              type="submit"
              className="chat-button chat-button-primary"
              disabled={isLoading || !content.trim()}
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
