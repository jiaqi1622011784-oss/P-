import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mic, Send, Sparkles } from 'lucide-react';
import { PersonalityType, ChatMessage } from '../types';
import { PUSHERS } from '../constants';
import { parseTask } from '../services/ai';
import PusherAvatar from './PusherAvatar';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  personality: PersonalityType;
  onTaskParsed: (taskData: any) => void;
}

export default function ChatPanel({ isOpen, onClose, personality, onTaskParsed }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const scrollRef = useRef<HTMLDivElement>(null);
  const pusher = PUSHERS[personality];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = pusher.greetings[Math.floor(Math.random() * pusher.greetings.length)];
      setMessages([{
        id: '1',
        role: 'pusher',
        content: greeting,
        timestamp: Date.now()
      }]);
    }
  }, [isOpen, personality]);

  const handleSend = async () => {
    if (!input.trim() || status === 'thinking') return;
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setStatus('thinking');

    try {
      const result = await parseTask(input, personality);
      
      const pusherMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'pusher',
        content: result.dialogue,
        timestamp: Date.now(),
        type: result.task ? 'task_confirm' : 'text',
        taskData: result.task
      };
      
      setMessages(prev => [...prev, pusherMsg]);
      
      if (result.task && !result.need_confirm) {
        onTaskParsed(result.task);
      } else if (result.task && result.need_confirm) {
        // Show confirm modal or special UI in chat
        onTaskParsed(result.task);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setStatus('idle');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-40"
          />
          
          {/* Panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 h-[70vh] bg-white rounded-t-3xl z-50 flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <PusherAvatar personality={personality} size="sm" status={status} />
                <div>
                  <h3 className="font-semibold text-lg">与 {pusher.name} 对话</h3>
                  <p className="text-xs text-text-secondary">
                    {status === 'thinking' ? '思考中...' : '在线'}
                  </p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-text-secondary" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-bg-secondary/30">
              {messages.map((msg) => (
                <div key={msg.id} className={cn(
                  "flex gap-3",
                  msg.role === 'user' ? "flex-row-reverse" : "flex-row"
                )}>
                  {msg.role === 'pusher' && (
                    <PusherAvatar personality={personality} size="sm" />
                  )}
                  <div className={cn(
                    "max-w-[80%] p-4 rounded-2xl shadow-sm",
                    msg.role === 'user' 
                      ? "bg-blue-500 text-white rounded-tr-none" 
                      : "bg-white text-text-primary rounded-tl-none border border-gray-100"
                  )}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    
                    {msg.type === 'task_confirm' && (
                      <div className="mt-4 p-3 bg-bg-secondary rounded-xl border border-border">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-yellow-500" />
                          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">识别到任务</span>
                        </div>
                        <h4 className="font-bold text-sm mb-1">{msg.taskData.title}</h4>
                        <div className="flex gap-3 text-xs text-text-secondary">
                          <span>📅 {msg.taskData.deadline}</span>
                          <span>⏱️ {msg.taskData.total_hours}h</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-100 safe-bottom">
              <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
                {['帮我排优先级', '我完成了', '推迟这个', '太难了'].map(phrase => (
                  <button 
                    key={phrase}
                    onClick={() => setInput(phrase)}
                    className="whitespace-nowrap px-3 py-1.5 bg-bg-secondary rounded-full text-xs text-text-secondary hover:bg-gray-100 transition-colors"
                  >
                    {phrase}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 bg-bg-secondary rounded-2xl px-4 py-2">
                <button className="p-1 text-text-secondary hover:text-blue-500 transition-colors">
                  <Mic className="w-6 h-6" />
                </button>
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="输入任务，如：下周三要交报告..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2"
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || status === 'thinking'}
                  className={cn(
                    "p-2 rounded-xl transition-all",
                    input.trim() && status !== 'thinking' ? "bg-blue-500 text-white shadow-md scale-100" : "bg-gray-200 text-gray-400 scale-90"
                  )}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
