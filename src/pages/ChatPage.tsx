import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bookmark, ThumbsUp, ThumbsDown, Sparkles, Bot, User as UserIcon, AlertCircle } from 'lucide-react';
import { categories, getCategory, type ChatMessage } from '@/data/mockData';
import { getAIResponse } from '@/lib/gemini';
import { supabase, type SavedRecommendation } from '@/lib/supabase';

type ChatPageProps = {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  onSaved: () => void;
};

export default function ChatPage({ messages, setMessages, onSaved }: ChatPageProps) {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async (text: string, categoryId?: string) => {
    if (!text.trim() || isTyping) return;
    setError(null);
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const catId = categoryId ?? categories.find((c) => text.toLowerCase().includes(c.id))?.id;
    const catLabel = catId ? getCategory(catId).label : undefined;

    try {
      const aiText = await getAIResponse(text, catLabel);
      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'ai',
        content: aiText,
        category: catId,
        timestamp: Date.now(),
        liked: null,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get AI response');
    } finally {
      setIsTyping(false);
    }
  };

  const handleSave = async (msg: ChatMessage) => {
    if (msg.saved) return;
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, saved: true } : m)),
    );
    const lines = msg.content.split('\n').filter((l) => l.trim().startsWith('1.'));
    const title = lines[0]?.replace(/^\d+\.\s*\*?\*?/, '').replace(/\*?\*?$/, '').split('—')[0]?.trim() ?? 'Recommendation';
    const snippet = msg.content.split('\n').find((l) => l.includes('—'))?.split('—').slice(1).join('—').trim() ?? msg.content.slice(0, 120);

    try {
      const { error: insertError } = await supabase.from('saved_recommendations').insert({
        category: msg.category ?? 'ideas',
        title,
        snippet: snippet.slice(0, 200),
      });
      if (insertError) throw insertError;
      onSaved();
    } catch {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, saved: false } : m)),
      );
      setError('Failed to save recommendation. Please try again.');
    }
  };

  const handleLike = (msg: ChatMessage, type: 'up' | 'down') => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === msg.id ? { ...m, liked: m.liked === type ? null : type } : m,
      ),
    );
  };

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-4 py-4 lg:px-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-lg shadow-brand-500/20">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="font-display text-lg font-bold text-white">AI Recommendation Chat</h2>
          <p className="text-xs text-slate-400">Tanya apa aja, aku rekomendasiin!</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-6">
          {messages.length === 0 && (
            <EmptyChatState onQuickPrompt={(cat) => sendMessage(cat.label, cat.id)} />
          )}

          {messages.map((msg) => (
            <ChatBubble
              key={msg.id}
              msg={msg}
              onSave={handleSave}
              onLike={handleLike}
              formatTime={formatTime}
            />
          ))}

          {isTyping && (
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="glass rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-2 w-2 rounded-full bg-slate-400"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-rose-400" />
              <span className="text-sm text-rose-300">{error}</span>
              <button
                onClick={() => setError(null)}
                className="ml-auto text-xs text-rose-400 hover:text-rose-300"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </div>
      </div>

      <div className="border-t border-white/[0.06] px-4 py-4 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="glass-strong flex items-end gap-2 p-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
              placeholder="Ketik pertanyaan atau pilih quick prompt di atas..."
              rows={1}
              className="flex-1 resize-none bg-transparent px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none"
              style={{ maxHeight: '120px' }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-500/20 transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-slate-500">
            RecoHub AI dapat membuat kesalahan. Cek info penting ya.
          </p>
        </div>
      </div>
    </div>
  );
}

function EmptyChatState({ onQuickPrompt }: { onQuickPrompt: (cat: { id: string; label: string }) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-8 py-8"
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 shadow-xl shadow-brand-500/30"
        >
          <Sparkles className="h-8 w-8 text-white" />
        </motion.div>
        <div>
          <h3 className="font-display text-2xl font-bold text-white">Mau rekomendasi apa hari ini?</h3>
          <p className="mt-1 text-sm text-slate-400">Pilih quick prompt di bawah atau ketik sendiri</p>
        </div>
      </div>

      <div className="grid w-full max-w-2xl grid-cols-2 gap-3 sm:grid-cols-3">
        {categories.slice(0, 6).map((cat, i) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onQuickPrompt(cat)}
            className="glass glass-hover group flex flex-col items-center gap-2 p-4 text-center"
          >
            <cat.icon className={`h-6 w-6 ${cat.color} transition-transform group-hover:scale-110`} />
            <span className="text-xs font-medium text-slate-300">{cat.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

function ChatBubble({
  msg,
  onSave,
  onLike,
  formatTime,
}: {
  msg: ChatMessage;
  onSave: (msg: ChatMessage) => void;
  onLike: (msg: ChatMessage, type: 'up' | 'down') => void;
  formatTime: (ts: number) => string;
}) {
  const isUser = msg.role === 'user';
  const cat = msg.category ? getCategory(msg.category) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${
          isUser
            ? 'bg-white/[0.06] border border-white/[0.08]'
            : 'bg-gradient-to-br from-brand-500 to-accent-500'
        }`}
      >
        {isUser ? <UserIcon className="h-5 w-5 text-slate-300" /> : <Bot className="h-5 w-5 text-white" />}
      </div>

      <div className={`flex max-w-[80%] flex-col gap-1.5 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-brand-500/15 border border-brand-500/20 text-white rounded-tr-sm'
              : 'glass text-slate-200 rounded-tl-sm'
          }`}
        >
          {cat && !isUser && (
            <div className="mb-2 flex items-center gap-1.5">
              <cat.icon className={`h-3.5 w-3.5 ${cat.color}`} />
              <span className="text-xs font-semibold text-slate-400">{cat.label}</span>
            </div>
          )}
          <FormattedContent content={msg.content} />
        </div>

        {!isUser && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onSave(msg)}
              className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-all ${
                msg.saved
                  ? 'text-accent-400 bg-accent-500/10'
                  : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
              }`}
            >
              <Bookmark className={`h-3.5 w-3.5 ${msg.saved ? 'fill-current' : ''}`} />
              {msg.saved ? 'Saved' : 'Save'}
            </button>
            <button
              onClick={() => onLike(msg, 'up')}
              className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-all ${
                msg.liked === 'up'
                  ? 'text-emerald-400 bg-emerald-500/10'
                  : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
              }`}
            >
              <ThumbsUp className={`h-3.5 w-3.5 ${msg.liked === 'up' ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => onLike(msg, 'down')}
              className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs transition-all ${
                msg.liked === 'down'
                  ? 'text-rose-400 bg-rose-500/10'
                  : 'text-slate-500 hover:bg-white/5 hover:text-slate-300'
              }`}
            >
              <ThumbsDown className={`h-3.5 w-3.5 ${msg.liked === 'down' ? 'fill-current' : ''}`} />
            </button>
            <span className="ml-1 text-xs text-slate-600">{formatTime(msg.timestamp)}</span>
          </div>
        )}

        {isUser && (
          <span className="text-xs text-slate-600">{formatTime(msg.timestamp)}</span>
        )}
      </div>
    </motion.div>
  );
}

function FormattedContent({ content }: { content: string }) {
  const lines = content.split('\n');
  return (
    <div className="whitespace-pre-wrap">
      {lines.map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <div key={i} className="font-semibold text-white">
              {line.slice(2, -2)}
            </div>
          );
        }
        const boldMatch = line.match(/\*\*(.+?)\*\*/);
        if (boldMatch) {
          const parts = line.split(/\*\*(.+?)\*\*/);
          return (
            <div key={i}>
              {parts.map((part, j) =>
                j % 2 === 1 ? <span key={j} className="font-semibold text-white">{part}</span> : <span key={j}>{part}</span>,
              )}
            </div>
          );
        }
        return <div key={i}>{line || '\u00A0'}</div>;
      })}
    </div>
  );
}
