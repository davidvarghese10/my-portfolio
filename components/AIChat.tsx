import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { sendChatMessage } from '../services/geminiService';
import { ChatMessage } from '../types';
import { SiriThinkingAnimation } from './SiriThinkingAnimation';
import { AIAssistantAvatar } from './AIAssistantAvatar';

const PaperAirplaneSendIcon: React.FC<{ size?: number; className?: string }> = ({ size = 18, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    className={`shrink-0 ${className}`}
  >
    <g transform="translate(-2.5, -1.2)">
      <path d="M21.92 3.63a1.2 1.2 0 0 0-1.25-.26L2.61 10.66a1.2 1.2 0 0 0 .08 2.26l5.05 1.95 1.9 5.86a1.2 1.2 0 0 0 1.83.6l3.18-2.65 4.58 3.39a1.2 1.2 0 0 0 1.89-.72l3-16.5a1.2 1.2 0 0 0-.21-1.22zM9.54 14.12l8.8-7.92-7.05 9.16-.33 3.4-1.42-4.64z" />
    </g>
  </svg>
);

const AnimatedChatToggleIcon: React.FC<{ isOpen: boolean; size?: number }> = ({ isOpen, size = 30 }) => (
  <div 
    className="relative flex items-center justify-center"
    style={{ width: size, height: size }}
  >
    <AnimatePresence mode="wait">
      {isOpen ? (
        <motion.div
          key="close"
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="text-[#00f3ff] drop-shadow-[0_0_8px_rgba(0,243,255,0.8)] flex items-center justify-center"
        >
          <InterlacedX size={Math.round(size * 0.7)} />
        </motion.div>
      ) : (
        <motion.div
          key="avatar"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-center"
        >
          <AIAssistantAvatar size={size} glow />
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

const InterlacedX: React.FC<{ size?: number; className?: string }> = ({ size = 20, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="none"
  >
    {/* Continuous bottom-left to top-right diagonal */}
    <line
      x1="4.5"
      y1="19.5"
      x2="19.5"
      y2="4.5"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    {/* Top-left segment of broken diagonal */}
    <line
      x1="4.5"
      y1="4.5"
      x2="9.5"
      y2="9.5"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
    {/* Bottom-right segment of broken diagonal */}
    <line
      x1="14.5"
      y1="14.5"
      x2="19.5"
      y2="19.5"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

const SUGGESTIONS = [
  "Tell me about Intevra",
  "What is David's tech stack?",
  "Show me his certifications",
  "How can I contact David?"
];

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi! I'm Livoq, David Varghese's AI assistant. Ask me anything about David's projects, technical skills, cybersecurity background, certifications, or how to get in touch!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const executeSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg = textToSend.trim();
    setInput('');
    const newHistory: ChatMessage[] = [...messages, { role: 'user', text: userMsg }];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const minThinkingTime = new Promise(resolve => setTimeout(resolve, 1100));
      const [responseText] = await Promise.all([
        sendChatMessage(userMsg, newHistory),
        minThinkingTime
      ]);
      setMessages(prev => [...prev, { role: 'model', text: responseText }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: "I'm here to answer questions about David's projects, skills, or background. Feel free to ask or reach out to david3005.scd@gmail.com!" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    executeSend(input);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\`.*?\`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={i} className="bg-white/10 px-1 py-0.5 rounded text-[#00f3ff] text-xs font-mono">{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mb-4 w-[90vw] sm:w-96 bg-black/85 backdrop-blur-2xl rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(0,243,255,0.15)] border border-white/10 overflow-hidden flex flex-col relative"
            style={{ maxHeight: '560px', minHeight: '460px' }}
          >
            {/* Header */}
            <div className="bg-black/60 text-white p-3.5 flex justify-between items-center border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <AIAssistantAvatar size={24} glow />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-sm text-white tracking-wide">Livoq Assistant</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full border bg-cyan-500/20 text-cyan-300 border-cyan-500/30">
                      Online
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#00f3ff]/80 block">David's Interactive AI</span>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                aria-label="Close assistant"
                className="text-neutral-400 hover:text-[#00f3ff] hover:bg-white/5 p-1.5 rounded-lg transition-colors flex items-center justify-center group"
              >
                <InterlacedX size={17} className="group-hover:drop-shadow-[0_0_6px_rgba(0,243,255,0.6)]" />
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-transparent scroll-smooth">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start items-start gap-2.5'}`}
                >
                  {msg.role === 'model' && (
                    <div className="shrink-0 mt-0.5" title="AI Assistant">
                      <AIAssistantAvatar size={22} glow />
                    </div>
                  )}
                  <div 
                    className={`max-w-[82%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user' 
                        ? 'bg-[#00f3ff] text-black font-medium rounded-tr-none shadow-[0_2px_12px_rgba(0,243,255,0.25)]' 
                        : 'bg-white/10 border border-white/10 text-neutral-200 rounded-tl-none backdrop-blur-md'
                    }`}
                  >
                    {renderFormattedText(msg.text)}
                  </div>
                </div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 8 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-center gap-2.5 py-1.5"
                >
                  <div className="shrink-0" title="Thinking...">
                    <AIAssistantAvatar size={22} glow />
                  </div>
                  <SiriThinkingAnimation size="sm" />
                </motion.div>
              )}

              {/* Quick suggestions */}
              {messages.length <= 2 && !isLoading && (
                <div className="pt-2">
                  <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-400 mb-2">
                    <Sparkles size={11} className="text-[#00f3ff]" />
                    Suggested queries:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTIONS.map((suggestion, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => executeSend(suggestion)}
                        className="text-[11px] font-mono text-neutral-300 bg-white/5 hover:bg-[#00f3ff]/10 hover:border-[#00f3ff]/40 hover:text-[#00f3ff] border border-white/10 px-2.5 py-1 rounded-full transition-all text-left"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-black/60 border-t border-white/10 flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about projects, skills, certifications..."
                className="flex-1 bg-white/5 text-white placeholder-neutral-500 rounded-full px-4 py-2 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#00f3ff] border border-white/10"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
                className="w-10 h-10 flex items-center justify-center shrink-0 bg-[#00f3ff] text-black rounded-full hover:bg-[#00d9e6] hover:scale-105 active:scale-95 disabled:opacity-35 disabled:hover:scale-100 disabled:cursor-not-allowed transition-all shadow-[0_0_14px_rgba(0,243,255,0.4)] hover:shadow-[0_0_20px_rgba(0,243,255,0.7)]"
              >
                <PaperAirplaneSendIcon size={19} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        variants={{
          idle: { scale: 1 },
          hover: { scale: 1 },
          tap: { scale: 0.96 },
        }}
        initial="idle"
        animate="idle"
        whileHover="hover"
        whileTap="tap"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close AI Assistant" : "Ask AI Assistant"}
        className="liquid-glass-button h-[60px] min-w-[60px] max-h-[60px] rounded-full flex items-center justify-center overflow-hidden shadow-2xl origin-bottom-right group"
      >
        <div className="relative z-10 w-[60px] h-[60px] flex items-center justify-center shrink-0">
          <AnimatedChatToggleIcon isOpen={isOpen} size={38} />
        </div>
        
        {!isOpen && (
          <motion.div
            variants={{
              idle: { 
                width: 0, 
                opacity: 0,
                transition: { duration: 0.32, ease: [0.32, 0, 0.67, 0] }
              },
              hover: { 
                width: 64, 
                opacity: 1, 
                transition: { duration: 0.44, ease: [0.22, 1, 0.36, 1] }
              }
            }}
            className="h-[60px] flex items-center overflow-hidden whitespace-nowrap"
          >
            <span className="block whitespace-nowrap text-sm font-semibold tracking-wide pr-3.5 text-white">
              Ask AI
            </span>
          </motion.div>
        )}
      </motion.button>
    </div>
  );
};

export default AIChat;
