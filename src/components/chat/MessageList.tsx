'use client';

import { useEffect, useRef } from 'react';
import { ChatMessage } from '@/types/chat';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
}

export default function MessageList({ messages, isLoading, onSendMessage }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      {messages.length === 0 && !isLoading && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-border/50 mb-4">
              <span className="text-2xl">🧬</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Protein AI Assistant
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Ask me anything about proteins, molecular biology, or biochemistry.
              I can help with structure analysis, function explanations, and more.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                'How does protein folding work?',
                'What makes CRISPR revolutionary?',
                'Explain enzyme catalysis',
                'How do antibodies recognize antigens?',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => onSendMessage(q)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border/50 text-muted-foreground bg-secondary/30 hover:bg-secondary/60 hover:text-foreground hover:border-border transition-all duration-200 cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}

      {isLoading && (
        <div className="flex gap-3 mr-auto max-w-[85%]">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
            AI
          </div>
          <div className="rounded-xl px-4 py-3 bg-card border border-border/50">
            <div className="flex gap-1.5">
              <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
              <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}
