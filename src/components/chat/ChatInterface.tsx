'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { ChatMessage } from '@/types/chat';

let messageCounter = 0;

function generateId() {
  return `msg-${Date.now()}-${++messageCounter}`;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyMissing, setApiKeyMissing] = useState(false);

  const handleSend = async (content: string) => {
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorText = err instanceof Error ? err.message : 'Unknown error';

      if (errorText.includes('ANTHROPIC_API_KEY') || errorText.includes('API key')) {
        setApiKeyMissing(true);
      }

      const errorMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${errorText}. Please make sure the API key is configured in \`.env.local\`.`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-16rem)] rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm overflow-hidden">
      {apiKeyMissing && (
        <div className="mx-4 mt-4 p-4 rounded-lg border border-amber-500/50 bg-amber-500/10 flex-shrink-0">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-500">API Key Not Configured</p>
              <p className="text-xs text-muted-foreground mt-1">
                Add your Anthropic API key to{' '}
                <code className="px-1 py-0.5 rounded bg-secondary text-foreground">.env.local</code>{' '}
                to enable AI chat. Get one at{' '}
                <a
                  href="https://console.anthropic.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  console.anthropic.com
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
      <MessageList messages={messages} isLoading={isLoading} onSendMessage={handleSend} />
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
