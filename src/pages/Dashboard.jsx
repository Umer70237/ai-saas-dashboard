import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import {
  TrendingUp, TrendingDown, Zap, MessageSquare, Clock, DollarSign,
  ArrowUpRight, Cpu, Activity, ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// ─── Mock Data ────────────────────────────────────────────────────────────────
const usageData = [
  { day: 'Mon', tokens: 84000, cost: 2.1, requests: 340 },
  { day: 'Tue', tokens: 120000, cost: 3.0, requests: 480 },
  { day: 'Wed', tokens: 98000, cost: 2.45, requests: 392 },
  { day: 'Thu', tokens: 156000, cost: 3.9, requests: 624 },
  { day: 'Fri', tokens: 134000, cost: 3.35, requests: 536 },
  { day: 'Sat', tokens: 72000, cost: 1.8, requests: 288 },
  { day: 'Sun', tokens: 183291, cost: 4.58, requests: 733 },
];

const modelData = [
  { name: 'GPT-4o', usage: 42, color: '#22d3ee' },
  { name: 'Claude 3.5', usage: 28, color: '#34d399' },
  { name: 'Gemini Pro', usage: 18, color: '#a78bfa' },
  { name: 'Llama 3', usage: 12, color: '#fb923c' },
];

const recentActivity = [
  { id: 1, model: 'GPT-4o', task: 'Code generation — React component', tokens: 3421, time: '2m ago', status: 'done' },
  { id: 2, model: 'Claude 3.5', task: 'Document summarization', tokens: 8932, time: '8m ago', status: 'done' },
  { id: 3, model: 'GPT-4o', task: 'Customer support draft', tokens: 1204, time: '15m ago', status: 'done' },
  { id: 4, model: 'Gemini Pro', task: 'Image analysis pipeline', tokens: 5670, time: '31m ago', status: 'error' },
  { id: 5, model: 'Llama 3', task: 'Batch sentiment analysis', tokens: 22891, time: '1h ago', status: 'done' },
];

// ─── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2.5 text-xs font-mono border border-slate-700/60">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {p.value?.toLocaleString()}</p>
      ))}
    </div>
  );
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ title, value, sub, delta, icon: Icon, accent = 'cyan', delay = 0 }) {
  const isUp = delta > 0;
  const accentMap = {
    cyan: 'from-cyan-500/20 to-cyan-500/0 border-cyan-500/20',
    emerald: 'from-emerald-500/20 to-emerald-500/0 border-emerald-500/20',
    violet: 'from-violet-500/20 to-violet-500/0 border-violet-500/20',
    amber: 'from-amber-500/20 to-amber-500/0 border-amber-500/20',
  };
  const iconColor = { cyan: 'text-cyan-400', emerald: 'text-emerald-400', violet: 'text-violet-400', amber: 'text-amber-400' };

  return (
    <div
      className={`glass-card-hover p-5 space-y-3 animate-fade-up opacity-0`}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <div className="flex justify-between items-start">
        <p className="text-slate-400 text-sm font-body">{title}</p>
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${accentMap[accent]} border flex items-center justify-center`}>
          <Icon size={16} className={iconColor[accent]} />
        </div>
      </div>
      <div>
        <p className="font-display font-bold text-2xl text-slate-100 tracking-tight">{value}</p>
        <p className="text-slate-500 text-xs font-body mt-0.5">{sub}</p>
      </div>
      {delta !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-mono ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
          {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {isUp ? '+' : ''}{delta}% vs last week
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {

  const { user } = useAuth();
  const [chartTab, setChartTab] = useState('tokens');

  const navigate = useNavigate();

  const handleNewChat = () => {
    navigate('/chat');
  }

  const handleAnalytics = () => {
  navigate('/analytics');
};

console.log(user);
  return (
    <div className="p-6 lg:p-8 space-y-8 relative">
      {/* Grid bg */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid pointer-events-none opacity-50" />

      {/* Header */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-slate-500 text-sm font-body mb-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="font-display font-bold text-2xl lg:text-3xl text-slate-100 tracking-tight">
  Welcome,{" "}
  <span className="text-gradient">
    {user?.user_metadata?.full_name?.split(' ')[0]}
  </span>{" "}
  👋
</h1>

        </div>
        <div className="flex gap-3">
        <button
  onClick={handleAnalytics}
  className="btn-ghost text-sm py-2 px-4 flex items-center gap-2"
> Usage Report
          </button>
         <button
      onClick={handleNewChat}
      className="btn-primary text-sm py-2 px-4 flex items-center gap-2"
> New Chat
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard title="Total Tokens" value="847K" sub="of 1M limit" delta={12.4} icon={Zap} accent="cyan" delay={0} />
        <StatCard title="API Requests" value="12,841" sub="this month" delta={8.7} icon={MessageSquare} accent="emerald" delay={100} />
        <StatCard title="Avg Latency" value="342ms" sub="p95: 890ms" delta={-4.2} icon={Clock} accent="violet" delay={200} />
        <StatCard title="Est. Cost" value="$21.42" sub="this month" delta={6.1} icon={DollarSign} accent="amber" delay={300} />
      </div>

      {/* Charts row */}
      <div className="relative grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Usage chart */}
        <div className="xl:col-span-2 glass-card p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="section-title text-base">Usage Over Time</h2>
              <p className="text-slate-500 text-xs font-body mt-0.5">Last 7 days</p>
            </div>
            <div className="flex bg-slate-800/60 rounded-xl p-1 gap-1">
              {['tokens', 'cost', 'requests'].map(t => (
                <button
                  key={t}
                  onClick={() => setChartTab(t)}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg capitalize transition-all duration-200 ${
                    chartTab === t
                      ? 'bg-cyan-500 text-slate-950 font-medium'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={usageData}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} width={45} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey={chartTab}
                stroke="#22d3ee"
                strokeWidth={2}
                fill="url(#chartGrad)"
                dot={{ fill: '#22d3ee', strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, fill: '#22d3ee', stroke: '#0f172a', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Model distribution */}
        <div className="glass-card p-5 space-y-4">
          <div>
            <h2 className="section-title text-base">Model Usage</h2>
            <p className="text-slate-500 text-xs font-body mt-0.5">Distribution this month</p>
          </div>
          <div className="space-y-4">
            {modelData.map((m, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: m.color }} />
                    <span className="text-sm text-slate-300 font-body">{m.name}</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">{m.usage}%</span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${m.usage}%`, background: m.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick bar chart */}
          <div className="pt-2">
            <ResponsiveContainer width="100%" height={100}>
              <BarChart data={modelData} barSize={24}>
                <Bar dataKey="usage" radius={[4, 4, 0, 0]}>
                  {modelData.map((m, i) => (
                    <rect key={i} fill={m.color} />
                  ))}
                </Bar>
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="relative glass-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/60">
          <div>
            <h2 className="section-title text-base">Recent Activity</h2>
            <p className="text-slate-500 text-xs font-body mt-0.5">Latest API calls</p>
          </div>
         
        </div>
        <div className="divide-y divide-slate-800/40">
          {recentActivity.map((item, i) => (
            <div
              key={item.id}
              className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-800/30 transition-colors animate-fade-up opacity-0"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'forwards' }}
            >
              <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                <Cpu size={14} className="text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200 font-body truncate">{item.task}</p>
                <p className="text-xs text-slate-500 font-mono">{item.model} · {item.tokens.toLocaleString()} tokens</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span
                  className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                    item.status === 'done'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}
                >
                  {item.status}
                </span>
                <span className="text-xs text-slate-600 font-mono hidden sm:block">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}