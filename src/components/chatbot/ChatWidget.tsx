import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Phone, Shield, ArrowRight } from 'lucide-react';
import { chatbotApi } from '../../services/api';
import { OWNER_CONTACTS } from '../../data/mockData';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  quickReplies?: string[];
  handoff?: boolean;
}

interface ChatWidgetProps {
  onNavigate?: (route: string) => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: 'Hello! I am your CCTV Security Assistant. How can we help protect your home, shop, or enterprise premises today?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickReplies: ['Book Free Site Survey', 'Compare Cameras', 'Renew 4G/Cloud Plan', 'Emergency Repair', 'Talk to Expert'],
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (userText: string, category?: string) => {
    if (!userText.trim()) return;

    const userMsg: Message = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Special client-side route shortcuts from quick-reply buttons
      if (userText === 'Book Free Site Survey' && onNavigate) {
        onNavigate('/survey');
      } else if (userText === 'Compare Cameras' && onNavigate) {
        onNavigate('/compare');
      } else if (userText === 'Renew 4G/Cloud Plan' && onNavigate) {
        onNavigate('/recharge');
      } else if (userText === 'Emergency Repair' && onNavigate) {
        onNavigate('/service-request');
      }

      const res = await chatbotApi.sendMessage(userText, category);
      const botMsg: Message = {
        id: 'bot-' + Date.now(),
        sender: 'bot',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        quickReplies: res.quickReplies,
        handoff: res.handoff,
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: 'bot-' + Date.now(),
          sender: 'bot',
          text: 'Our technical lines are open. Please call Anand Gaikwad at +91 9370150563 or Swapnil Gandule at +91 91753 37285 directly.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          handoff: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          id="chatbot-launcher-btn"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-16 md:bottom-6 right-5 z-40 bg-[#5A5A40] hover:bg-[#4A4A35] text-white p-3.5 rounded-full shadow-2xl flex items-center gap-2.5 transition-transform hover:scale-105"
          title="Chat with CCTV Security Team"
        >
          <div className="relative">
            <Bot className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white animate-pulse" />
          </div>
          <span className="font-semibold text-sm hidden sm:inline">Ask CCTV Expert</span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div
          id="chatbot-window"
          className="fixed bottom-16 md:bottom-6 right-4 sm:right-6 z-50 w-[92vw] sm:w-96 bg-white rounded-[28px] shadow-2xl border border-stone-200 flex flex-col overflow-hidden max-h-[580px] h-[520px]"
        >
          {/* Header */}
          <div className="bg-[#5A5A40] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-white">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm leading-tight text-white">CCTV Security Desk</h4>
                <p className="text-[11px] text-stone-200 font-medium">Direct support from Anand & Swapnil</p>
              </div>
            </div>
            <button
              id="chatbot-close-btn"
              onClick={() => setIsOpen(false)}
              className="text-stone-300 hover:text-white p-1 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-[#F5F5F0] text-xs sm:text-sm">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#5A5A40] text-white rounded-tr-none'
                      : 'bg-white border border-stone-200 text-[#1A1A1A] rounded-tl-none'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`block text-[10px] mt-1 text-right ${
                      msg.sender === 'user' ? 'text-stone-200' : 'text-stone-400'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>

                {/* Handoff Contact Cards */}
                {msg.handoff && (
                  <div className="mt-2 w-full bg-white border border-stone-200 rounded-2xl p-3 space-y-2 text-[#1A1A1A]">
                    <p className="text-xs font-bold text-[#5A5A40] uppercase tracking-wider">Direct Partner Hotlines:</p>
                    {OWNER_CONTACTS.map((c, i) => (
                      <div key={i} className="flex items-center justify-between text-xs bg-[#F5F5F0] p-2.5 rounded-xl border border-stone-200">
                        <div>
                          <span className="font-bold text-[#1A1A1A] block">{c.name}</span>
                          <span className="text-[11px] text-[#5A5A40] font-mono">{c.displayPhone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <a
                            href={`tel:${c.phone}`}
                            className="p-1.5 bg-white hover:bg-stone-100 rounded-lg text-[#5A5A40] font-medium border border-stone-200"
                            title="Call"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                          <a
                            href={`https://wa.me/${c.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                              'Hello, I need CCTV support.'
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-[#5A5A40] hover:bg-[#4A4A35] text-white rounded-lg font-medium"
                            title="WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Reply Pills */}
                {msg.quickReplies && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.quickReplies.map((qr, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(qr)}
                        className="text-[11px] bg-white hover:bg-stone-100 border border-stone-300 text-[#5A5A40] font-medium px-3 py-1 rounded-full transition-all flex items-center gap-1 shadow-2xs"
                      >
                        <span>{qr}</span>
                        <ArrowRight className="w-2.5 h-2.5 opacity-60" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-1.5 text-stone-500 text-xs py-1">
                <span className="w-2 h-2 rounded-full bg-[#5A5A40] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#5A5A40] animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-[#5A5A40] animate-bounce [animation-delay:0.4s]" />
                <span className="ml-1">Assistant checking knowledge base...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 bg-white border-t border-stone-200 flex items-center gap-2"
          >
            <input
              id="chatbot-input"
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about installation, prices, AMC..."
              className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 bg-[#F5F5F0] border border-stone-200 rounded-xl focus:outline-hidden focus:border-[#5A5A40] focus:bg-white text-[#1A1A1A]"
            />
            <button
              id="chatbot-send-btn"
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 bg-[#5A5A40] hover:bg-[#4A4A35] disabled:opacity-50 text-white rounded-xl transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
