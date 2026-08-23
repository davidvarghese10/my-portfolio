import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Loader2 } from 'lucide-react';
import { sendChatMessage } from '../services/geminiService';
import { ChatMessage } from '../types';

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi! I'm Livoq. Ask me anything about my projects or skills." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    const responseText = await sendChatMessage(userMsg);

    setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-80 md:w-96 bg-black/60 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col"
            style={{ maxHeight: '500px', minHeight: '400px' }}
          >
            {/* Header */}
            <div className="bg-black/40 text-white p-4 flex justify-between items-center border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00f3ff] animate-pulse"></div>
                <span className="font-medium text-sm">Livoq Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-[#00f3ff] transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent scroll-smooth">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-2xl text-sm backdrop-blur-sm ${
                      msg.role === 'user' 
                        ? 'bg-[#00f3ff] text-black rounded-tr-none font-medium' 
                        : 'bg-white/10 border border-white/5 text-gray-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/10 border border-white/5 p-3 rounded-2xl rounded-tl-none">
                    <Loader2 className="w-4 h-4 animate-spin text-[#00f3ff]" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-black/40 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 bg-white/5 text-white placeholder-neutral-500 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#00f3ff] border border-white/5"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="w-10 h-10 flex items-center justify-center shrink-0 bg-[#00f3ff] text-black rounded-full hover:bg-[#00cce6] disabled:opacity-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        initial="idle"
        whileHover="hover"
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="liquid-glass-button p-4 rounded-full flex items-center overflow-hidden"
      >
        <div className="relative z-10">
            {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </div>
        
        {!isOpen && (
            <motion.div
                variants={{
                    idle: { width: 0, opacity: 0, marginLeft: 0 },
                    hover: { 
                        width: "auto", 
                        opacity: 1, 
                        marginLeft: 12,
                        transition: { type: "spring", stiffness: 300, damping: 30, mass: 0.8 }
                    }
                }}
                className="overflow-hidden whitespace-nowrap text-sm font-bold"
            >
                Ask AI
            </motion.div>
        )}
      </motion.button>
    </div>
  );
};

export default AIChat;