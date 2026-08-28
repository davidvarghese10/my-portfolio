import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Loader2, Sparkles, Send, Key, Check, HelpCircle } from 'lucide-react';
import { sendChatMessage, getStoredApiKey, setStoredApiKey } from '../services/geminiService';
import { ChatMessage } from '../types';

const SUGGESTIONS = [
  "Tell me about Intevra",
  "What is David's tech stack?",
  "Show me his certifications",
  "How can I contact David?"
];

const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [customKeyInput, setCustomKeyInput] = useState('');
  const [hasCustomKey, setHasCustomKey] = useState(false);
  const [keySavedMessage, setKeySavedMessage] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Hi! I'm Livoq, David Varghese's AI assistant. Ask me anything about David's projects, technical skills, cybersecurity background, certifications, or how to get in touch!" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const key = getStoredApiKey();
    setHasCustomKey(Boolean(key && key.trim().length > 0));
    setCustomKeyInput(key);
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, isOpen]);

  useEffect(() => {
    if (isOpen && !showKeyModal) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, showKeyModal]);

  const handleSaveApiKey = () => {
    setStoredApiKey(customKeyInput);
    const key = getStoredApiKey();
    setHasCustomKey(Boolean(key && key.trim().length > 0));
    setKeySavedMessage(true);
    setTimeout(() => {
      setKeySavedMessage(false);
      setShowKeyModal(false);
    }, 1200);
  };

  const handleRemoveApiKey = () => {
    setStoredApiKey('');
    setCustomKeyInput('');
    setHasCustomKey(false);
    setShowKeyModal(false);
  };

  const executeSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg = textToSend.trim();
    setInput('');
    const newHistory: ChatMessage[] = [...messages, { role: 'user', text: userMsg }];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const responseText = await sendChatMessage(userMsg, newHistory);
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
                <div className="relative flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00f3ff] animate-pulse"></div>
                  <div className="absolute w-4 h-4 rounded-full bg-[#00f3ff]/20 animate-ping"></div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-sm text-white tracking-wide">Livoq Assistant</span>
                    <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full border ${hasCustomKey ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' : 'bg-white/10 text-neutral-300 border-white/10'}`}>
                      {hasCustomKey ? 'Gemini 2.5 Active' : 'Smart Engine'}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#00f3ff]/80 block">David's Interactive AI</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowKeyModal(!showKeyModal)}
                  title="Configure Gemini API Key"
                  className={`p-1.5 rounded-lg transition-colors ${showKeyModal ? 'bg-[#00f3ff]/20 text-[#00f3ff]' : 'text-neutral-400 hover:text-[#00f3ff] hover:bg-white/5'}`}
                >
                  <Key size={16} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  aria-label="Close assistant"
                  className="text-neutral-400 hover:text-[#00f3ff] hover:bg-white/5 p-1.5 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Optional API Key Configuration Panel */}
            <AnimatePresence>
              {showKeyModal && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-black/90 border-b border-cyan-500/20 p-4 text-xs overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-white flex items-center gap-1.5">
                      <Key size={14} className="text-[#00f3ff]" />
                      Gemini API Key (Optional)
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">Stored in browser</span>
                  </div>
                  <p className="text-neutral-300 text-[11px] mb-3 leading-relaxed">
                    Paste a free Google Gemini API key to enable live cloud LLM reasoning on any static host, or leave blank to use the built-in portfolio intelligence engine.
                  </p>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="password"
                      value={customKeyInput}
                      onChange={(e) => setCustomKeyInput(e.target.value)}
                      placeholder="AIzaSy..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#00f3ff]"
                    />
                    <button
                      onClick={handleSaveApiKey}
                      className="bg-[#00f3ff] hover:bg-[#00d9e6] text-black font-semibold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 text-xs shrink-0"
                    >
                      {keySavedMessage ? <Check size={14} /> : 'Save'}
                    </button>
                  </div>
                  {hasCustomKey && (
                    <button
                      onClick={handleRemoveApiKey}
                      className="text-[10px] text-red-400 hover:underline hover:text-red-300 font-mono"
                    >
                      Clear saved key
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-transparent scroll-smooth">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
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
                <div className="flex justify-start">
                  <div className="bg-white/10 border border-white/10 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-[#00f3ff]" />
                    <span className="text-xs text-neutral-400 font-mono">Thinking...</span>
                  </div>
                </div>
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
                className="w-9 h-9 flex items-center justify-center shrink-0 bg-[#00f3ff] text-black rounded-full hover:bg-[#00d9e6] hover:scale-105 active:scale-95 disabled:opacity-40 disabled:hover:scale-100 transition-all shadow-[0_0_12px_rgba(0,243,255,0.3)]"
              >
                <Send size={15} className="translate-x-[0.5px]" />
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
        className="liquid-glass-button p-4 rounded-full flex items-center overflow-hidden shadow-2xl"
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
            className="overflow-hidden whitespace-nowrap text-sm font-bold tracking-wide"
          >
            Ask AI
          </motion.div>
        )}
      </motion.button>
    </div>
  );
};

export default AIChat;
