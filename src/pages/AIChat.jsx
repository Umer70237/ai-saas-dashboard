import { useState, useRef, useEffect } from 'react';
import { Send, Zap, Copy, ThumbsUp, ThumbsDown, RotateCcw, ChevronDown, Sparkles, Code, FileText, Lightbulb, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const MODELS = [
  { id: 'gpt-4o', label: 'GPT-4o', provider: 'OpenAI', color: '#22d3ee' },
  { id: 'claude-3-5', label: 'Claude 3.5 Sonnet', provider: 'Anthropic', color: '#34d399' },
  { id: 'gemini-pro', label: 'Gemini 1.5 Pro', provider: 'Google', color: '#a78bfa' },
  { id: 'llama-3', label: 'Llama 3 70B', provider: 'Meta', color: '#fb923c' },
];

const STARTERS = [
  { icon: Code, label: 'Write a React component', msg: 'Write a production-ready React component for a data table with sorting, filtering, and pagination.' },
  { icon: FileText, label: 'Summarize a document', msg: 'Help me summarize a long technical document into key bullet points.' },
  { icon: Lightbulb, label: 'Brainstorm ideas', msg: 'I\'m building an AI SaaS product. Give me 10 unique feature ideas that would delight users.' },
  { icon: Zap, label: 'Debug my code', msg: 'I have a bug in my TypeScript code. Can you help me debug it?' },
];

const DEMO_RESPONSES = {
  default: `I'm NeuralOS AI, your intelligent coding and productivity assistant. I can help you with:

**💻 Code Generation** — React, TypeScript, Python, and more
**📄 Document Analysis** — Summarize, extract, and transform content
**🧠 Reasoning Tasks** — Complex problem solving and analysis
**🎨 Creative Work** — Copy, ideas, and content strategy

What would you like to build today?`,
  react: `Here's a production-ready data table component:

\`\`\`tsx
import { useState, useMemo } from 'react';

interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
}

export function DataTable<T extends { id: string | number }>({
  data, columns, pageSize = 10
}: DataTableProps<T>) {
  const [sort, setSort] = useState<{ key: keyof T; dir: 'asc' | 'desc' } | null>(null);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let rows = [...data];
    if (filter) rows = rows.filter(row =>
      Object.values(row).some(v => String(v).toLowerCase().includes(filter.toLowerCase()))
    );
    if (sort) rows.sort((a, b) => {
      const va = String(a[sort.key]), vb = String(b[sort.key]);
      return sort.dir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return rows;
  }, [data, filter, sort]);

  const pageData = filtered.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(filtered.length / pageSize);

  return (
    <div className="space-y-3">
      <input
        value={filter}
        onChange={e => { setFilter(e.target.value); setPage(0); }}
        placeholder="Search..."
        className="border rounded px-3 py-2 w-full"
      />
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={String(col.key)} onClick={() => col.sortable && setSort(s =>
                s?.key === col.key ? { key: col.key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key: col.key, dir: 'asc' }
              )} className="text-left p-2 border-b cursor-pointer hover:bg-gray-50">
                {col.label} {sort?.key === col.key ? (sort.dir === 'asc' ? '↑' : '↓') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pageData.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              {columns.map(col => <td key={String(col.key)} className="p-2 border-b">{String(row[col.key])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex gap-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} onClick={() => setPage(i)} className={\`px-3 py-1 rounded \${page === i ? 'bg-blue-500 text-white' : 'border'}\`}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
\`\`\`

This component includes **sorting**, **filtering**, **pagination**, and full **TypeScript generics**. Drop it in and pass your data and column config!`,
};

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderContent = (text) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith('```')) {
        const code = part.replace(/```\w*\n?/, '').replace(/```$/, '');
        return (
          <div key={i} className="my-3 rounded-xl overflow-hidden border border-slate-700/60">
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800/80 border-b border-slate-700/40">
              <span className="text-xs font-mono text-slate-400">code</span>
              <button onClick={copy} className="text-xs text-slate-500 hover:text-cyan-400 font-mono transition-colors flex items-center gap-1">
                <Copy size={11} /> {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed bg-slate-900/80">
              {code.trim()}
            </pre>
          </div>
        );
      }
      return (
        <span key={i}>
          {part.split(/(\*\*[^*]+\*\*)/g).map((s, j) =>
            s.startsWith('**') ? (
              <strong key={j} className="text-slate-100 font-semibold">{s.slice(2, -2)}</strong>
            ) : s
          )}
        </span>
      );
    });
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-fade-up`}>
      <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5 ${
        isUser
          ? 'bg-gradient-to-br from-cyan-400 to-emerald-500 text-slate-950 font-display'
          : 'bg-gradient-to-br from-violet-500 to-pink-500 text-white'
      }`}>
        {isUser ? 'U' : <Sparkles size={12} />}
      </div>

      <div className={`max-w-[75%] space-y-2 ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`rounded-2xl px-4 py-3 text-sm font-body leading-relaxed ${
          isUser
            ? 'bg-cyan-500/20 border border-cyan-500/30 text-slate-100 rounded-tr-sm'
            : 'glass-card text-slate-300 rounded-tl-sm'
        }`}>
          <div className="whitespace-pre-wrap">{renderContent(msg.content)}</div>
        </div>

        {!isUser && (
          <div className="flex items-center gap-2 px-1">
            <button onClick={copy} className="text-slate-600 hover:text-slate-400 transition-colors">
              <Copy size={12} />
            </button>
            <button className="text-slate-600 hover:text-emerald-400 transition-colors">
              <ThumbsUp size={12} />
            </button>
            <button className="text-slate-600 hover:text-red-400 transition-colors">
              <ThumbsDown size={12} />
            </button>
            <span className="text-slate-700 text-xs font-mono">{msg.model}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Mock reply picker ────────────────────────────────────────────────────────
function getMockReply(text) {
  const lower = text.toLowerCase();
  if (lower.includes('react') || lower.includes('component') || lower.includes('table')) {
    return DEMO_RESPONSES.react;
  }
  return `Thanks for your message! You said: **"${text}"**

Here's what I can do with that:

**🔍 Analysis** — I've processed your request and identified the key requirements.
**💡 Suggestion** — Based on your input, I recommend breaking this into smaller tasks.
**✅ Next Steps** — Let me know if you'd like me to dive deeper into any specific area.

`;
}

export default function AIChat() {
  const { user } = useAuth();
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [modelOpen, setModelOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 0, role: 'assistant', content: DEMO_RESPONSES.default, model: 'GPT-4o' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ── FIX 1: send() is now complete — adds user msg, fakes a delay, then adds
  //           the mock assistant reply and resets loading.
  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    setInput('');

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: msg,
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1000));

    const assistantMsg = {
      id: Date.now() + 1,
      role: 'assistant',
      content: getMockReply(msg),
      model: selectedModel.label,
    };

    setMessages(prev => [...prev, assistantMsg]);
    setLoading(false);
  };

  // ── FIX 2: handleKey moved to component scope (was trapped inside send())
  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // ── FIX 3: newChat moved to component scope (was trapped inside send())
  const newChat = () => {
    setMessages([{ id: 0, role: 'assistant', content: DEMO_RESPONSES.default, model: 'GPT-4o' }]);
  };

  // ── FIX 4: return statement is now correctly at component scope
  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="border-b border-slate-800/60 px-6 py-4 flex items-center justify-between bg-slate-900/20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={newChat} className="btn-ghost py-2 px-3 flex items-center gap-2 text-xs">
            <Plus size={13} /> New Chat
          </button>

          {/* Model selector */}
          <div className="relative">
            <button
              onClick={() => setModelOpen(!modelOpen)}
              className="flex items-center gap-2 glass-card px-3 py-2 hover:border-slate-600 transition-all text-sm"
            >
              <div className="w-2 h-2 rounded-full" style={{ background: selectedModel.color }} />
              <span className="text-slate-200 font-body">{selectedModel.label}</span>
              <ChevronDown size={14} className="text-slate-500" />
            </button>
            {modelOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 glass-card py-1 z-20 animate-scale-in">
                {MODELS.map(m => (
                  <button
                    key={m.id}
                    onClick={() => { setSelectedModel(m); setModelOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-800/50 transition-colors flex items-center gap-3 ${
                      selectedModel.id === m.id ? 'text-slate-100' : 'text-slate-400'
                    }`}
                  >
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: m.color }} />
                    <div>
                      <p className="font-body font-medium">{m.label}</p>
                      <p className="text-xs text-slate-600">{m.provider}</p>
                    </div>
                    {selectedModel.id === m.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="text-slate-500 hover:text-slate-300 transition-colors p-2" title="Retry">
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 space-y-6">
        {messages.length === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {STARTERS.map((s, i) => (
              <button
                key={i}
                onClick={() => send(s.msg)}
                className="glass-card-hover p-4 text-left space-y-2 group"
              >
                <s.icon size={16} className="text-cyan-400" />
                <p className="text-sm text-slate-300 font-body group-hover:text-slate-100 transition-colors">{s.label}</p>
              </button>
            ))}
          </div>
        )}

        {messages.map(msg => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        {loading && (
          <div className="flex gap-3 animate-fade-up">
            <div className="w-7 h-7 rounded-full flex-shrink-0 bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center mt-0.5">
              <Sparkles size={12} className="text-white" />
            </div>
            <div className="glass-card px-4 py-3 flex items-center gap-2">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-800/60 px-4 lg:px-8 py-4 bg-slate-900/20 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card flex items-end gap-3 p-3 focus-within:border-cyan-500/40 transition-colors">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask anything... (Shift+Enter for newline)"
              rows={1}
              className="flex-1 bg-transparent text-slate-200 placeholder-slate-600 resize-none outline-none font-body text-sm leading-relaxed max-h-32 overflow-y-auto"
              style={{ minHeight: '24px' }}
              onInput={e => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
              }}
            />
            <button
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                input.trim() && !loading
                  ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 active:scale-95'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              <Send size={16} />
            </button>
          </div>
          <p className="text-center text-slate-700 text-xs font-body mt-2">
            NeuralOS may produce inaccurate information. Always verify critical outputs.
          </p>
        </div>
      </div>
    </div>
  );
}