'use client';

import { motion } from 'framer-motion';
import ChatInterface from '@/components/chat/ChatInterface';

export default function ChatPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Protein AI Assistant
          </h1>
          <p className="text-muted-foreground mb-6">
            Ask questions about proteins, molecular biology, and biochemistry
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <ChatInterface />
        </motion.div>
      </div>
    </div>
  );
}
