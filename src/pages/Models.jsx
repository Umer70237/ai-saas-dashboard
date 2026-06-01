import { useState } from 'react';
import { Cpu, Zap, Clock, Star, ExternalLink, Check, Lock, ChevronRight } from 'lucide-react';

const MODELS = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    badge: 'Recommended',
    badgeColor: 'cyan',
    description: 'Most capable multimodal model. Handles text, images, and code with exceptional performance.',
    contextWindow: '128K',
    speed: '120 tok/s',
    cost: '$5 / 1M tok',
    rating: 4.9,
    tags: ['Vision', 'Code', 'Reasoning'],
    available: true,
    color: '#22d3ee',
    gradient: 'from-cyan-500/20 to-blue-500/10',
    border: 'border-cyan-500/30',
  },
  {
    id: 'claude-3-5',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    badge: 'Top Reasoning',
    badgeColor: 'emerald',
    description: 'Best-in-class reasoning, coding and analysis. Excels at long-document tasks.',
    contextWindow: '200K',
    speed: '90 tok/s',
    cost: '$3 / 1M tok',
    rating: 4.8,
    tags: ['Reasoning', 'Code', 'Writing'],
    available: true,
    color: '#34d399',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-500/30',
  },
  {
    id: 'gemini-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    badge: 'Long Context',
    badgeColor: 'violet',
    description: 'Extraordinary 2M token context window. Perfect for massive codebases and documents.',
    contextWindow: '2M',
    speed: '110 tok/s',
    cost: '$3.5 / 1M tok',
    rating: 4.7,
    tags: ['Long Context', 'Vision', 'Analysis'],
    available: true,
    color: '#a78bfa',
    gradient: 'from-violet-500/20 to-purple-500/10',
    border: 'border-violet-500/30',
  },
  {
    id: 'llama-3-70b',
    name: 'Llama 3 70B',
    provider: 'Meta (via Groq)',
    badge: 'Open Source',
    badgeColor: 'amber',
    description: 'Blazing fast open-source model. Great for high-throughput tasks and batch processing.',
    contextWindow: '8K',
    speed: '300 tok/s',
    cost: '$0.7 / 1M tok',
    rating: 4.5,
    tags: ['Fast', 'Open Source', 'Batch'],
    available: true,
    color: '#fb923c',
    gradient: 'from-amber-500/20 to-orange-500/10',
    border: 'border-amber-500/30',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o Mini',
    provider: 'OpenAI',
    badge: 'Best Value',
    badgeColor: 'emerald',
    description: 'Affordable and fast. Best cost-performance ratio for everyday tasks.',
    contextWindow: '128K',
    speed: '200 tok/s',
    cost: '$0.15 / 1M tok',
    rating: 4.4,
    tags: ['Fast', 'Cheap', 'Vision'],
    available: true,
    color: '#22d3ee',
    gradient: 'from-cyan-500/10 to-slate-800/20',
    border: 'border-slate-700/40',
  },
  {
    id: 'o1-preview',
    name: 'o1 Preview',
    provider: 'OpenAI',
    badge: 'Pro Only',
    badgeColor: 'slate',
    description: 'Advanced reasoning model. Thinks before it speaks. Exceptional for math and complex logic.',
    contextWindow: '128K',
    speed: '20 tok/s',
    cost: '$15 / 1M tok',
    rating: 4.9,
    tags: ['Reasoning', 'Math', 'Science'],
    available: false,
    color: '#64748b',
    gradient: 'from-slate-700/20 to-slate-800/20',
    border: 'border-slate-700/30',
  },
];

const badgeStyle = {
  cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  violet: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  slate: 'bg-slate-800 text-slate-400 border-slate-700/40',
};

function ModelCard({ model, selected, onSelect }) {
  return (
    <div
      onClick={() => model.available && onSelect(model.id)}
      className={`glass-card p-5 space-y-4 transition-all duration-300 ${
        model.available ? 'cursor-pointer hover:border-slate-600/60' : 'opacity-60 cursor-not-allowed'
      } ${selected === model.id ? `border ${model.border} shadow-lg` : ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${model.gradient} border ${model.border} flex items-center justify-center`}
          >
            <Cpu size={16} style={{ color: model.color }} />
          </div>
          <div>
            <p className="font-display font-semibold text-slate-100 text-sm">{model.name}</p>
            <p className="text-slate-500 text-xs font-body">{model.provider}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${badgeStyle[model.badgeColor]}`}>
            {model.badge}
          </span>
          {selected === model.id && (
            <div className="w-5 h-5 rounded-full bg-cyan-500 flex items-center justify-center">
              <Check size={10} className="text-slate-950" strokeWidth={3} />
            </div>
          )}
          {!model.available && <Lock size={14} className="text-slate-600" />}
        </div>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-xs font-body leading-relaxed">{model.description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {model.tags.map(tag => (
          <span key={tag} className="text-xs font-mono text-slate-500 bg-slate-800/60 border border-slate-700/40 rounded-full px-2 py-0.5">
            {tag}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800/60">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Cpu size={10} className="text-slate-500" />
            <span className="text-xs font-mono" style={{ color: model.color }}>{model.contextWindow}</span>
          </div>
          <p className="text-slate-600 text-xs font-body">context</p>
        </div>
        <div className="text-center border-x border-slate-800/60">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Zap size={10} className="text-slate-500" />
            <span className="text-xs font-mono" style={{ color: model.color }}>{model.speed}</span>
          </div>
          <p className="text-slate-600 text-xs font-body">speed</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-0.5">
            <Clock size={10} className="text-slate-500" />
            <span className="text-xs font-mono" style={{ color: model.color }}>{model.cost}</span>
          </div>
          <p className="text-slate-600 text-xs font-body">pricing</p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Star size={12} className="text-yellow-400 fill-yellow-400" />
          <span className="text-yellow-400 text-xs font-mono">{model.rating}</span>
          <span className="text-slate-600 text-xs font-body">/ 5.0</span>
        </div>
        {model.available ? (
          <button className="text-xs text-cyan-500 hover:text-cyan-400 font-mono flex items-center gap-1 transition-colors">
            View docs <ExternalLink size={10} />
          </button>
        ) : (
          <button className="text-xs text-slate-600 font-mono flex items-center gap-1">
            Upgrade <ChevronRight size={10} />
          </button>
        )}
      </div>
    </div>
  );
}

export default function Models() {
  const [selected, setSelected] = useState('gpt-4o');
  const [filter, setFilter] = useState('All');

  const filters = ['All', 'OpenAI', 'Anthropic', 'Google', 'Open Source'];

  const filtered = filter === 'All'
    ? MODELS
    : MODELS.filter(m => m.provider.toLowerCase().includes(filter.toLowerCase()) || m.tags.some(t => t.toLowerCase() === filter.toLowerCase()));

  const activeModel = MODELS.find(m => m.id === selected);

  return (
    <div className="p-6 lg:p-8 space-y-6 relative">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40 pointer-events-none" />

      {/* Header */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-100">AI Models</h1>
          <p className="text-slate-500 text-sm font-body mt-0.5">
            Active model: <span className="text-cyan-400 font-mono">{activeModel?.name}</span>
          </p>
        </div>
        <div className="flex bg-slate-800/60 rounded-xl p-1 gap-1 flex-wrap">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all duration-200 ${
                filter === f ? 'bg-cyan-500 text-slate-950 font-medium' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((m, i) => (
          <div
            key={m.id}
            className="animate-fade-up opacity-0"
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: 'forwards' }}
          >
            <ModelCard model={m} selected={selected} onSelect={setSelected} />
          </div>
        ))}
      </div>

      {/* Upgrade CTA */}
      <div className="relative glass-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-violet-500/20 bg-gradient-to-r from-violet-500/5 to-transparent">
        <div>
          <p className="text-slate-100 font-display font-semibold">Unlock o1 Preview & Future Models</p>
          <p className="text-slate-400 text-sm font-body mt-1">Upgrade to Pro for access to reasoning models and priority queue.</p>
        </div>
        <button className="btn-primary whitespace-nowrap flex items-center gap-2 text-sm py-2.5">
          <Zap size={14} /> Upgrade to Pro
        </button>
      </div>
    </div>
  );
}