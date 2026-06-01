import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Filter, Download } from 'lucide-react';
import { useState } from 'react';

const dailyData = Array.from({ length: 90 }, (_, i) => ({
  date: `Day ${i + 1}`,
  tokens: 50000 + Math.floor(Math.random() * 150000),
  cost: 1 + Math.random() * 5,
  errors: Math.floor(Math.random() * 6),
  latency: 200 + Math.floor(Math.random() * 200),
}));

const hourlyLatency = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  p50: 200 + Math.random() * 100,
  p95: 400 + Math.random() * 300,
  p99: 700 + Math.random() * 400,
}));

const RANGES = ['7d', '14d', '30d', '90d'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2.5 text-xs font-mono border border-slate-700/60 space-y-1">
      <p className="text-slate-400 mb-1.5 border-b border-slate-700/40 pb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}</p>
      ))}
    </div>
  );
};

function MiniStat({ label, value, delta, color = 'cyan' }) {
  const isUp = delta > 0;
  const colors = { cyan: 'text-cyan-400', emerald: 'text-emerald-400', violet: 'text-violet-400', red: 'text-red-400' };
  return (
    <div className="glass-card p-4 space-y-1.5">
      <p className="text-slate-500 text-xs font-body">{label}</p>
      <p className={`font-display font-bold text-xl ${colors[color]}`}>{value}</p>
      <div className={`flex items-center gap-1 text-xs font-mono ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
        {isUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
        {isUp ? '+' : ''}{delta}%
      </div>
    </div>
  );
}


export default function Analytics() {
  const [range, setRange] = useState('7d');
  const filteredData =
  range === '7d'
    ? dailyData.slice(-7)
    : range === '14d'
    ? dailyData.slice(-14)
    : range === '30d'
    ? dailyData.slice(-30)
    : dailyData.slice(-90);

    const totalTokens = filteredData.reduce((sum, d) => sum + d.tokens, 0);

const totalCost = filteredData.reduce((sum, d) => sum + d.cost, 0);

const avgLatency = Math.round(
  filteredData.reduce((sum, d) => sum + d.latency, 0) / filteredData.length
);

const totalErrors = filteredData.reduce((sum, d) => sum + d.errors, 0);

const [filterOpen, setFilterOpen] = useState(false);


const handleExport = () => {
  const csv = [
    ['date', 'tokens', 'cost', 'errors', 'latency'],
    ...filteredData.map(d => [
      d.date,
      d.tokens,
      d.cost,
      d.errors,
      d.latency,
    ]),
  ]
    .map(row => row.join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `analytics-${range}.csv`;
  a.click();
};


  return (
    <div className="p-6 lg:p-8 space-y-8 relative">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40 pointer-events-none" />

      {/* Header */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-100">Analytics</h1>
          <p className="text-slate-500 text-sm font-body mt-0.5">Deep-dive into your API usage and performance</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div className="flex bg-slate-800/60 rounded-xl p-1 gap-1">
            {RANGES.map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-all duration-200 ${
                  range === r ? 'bg-cyan-500 text-slate-950 font-medium' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {filterOpen && (
  <div className="glass-card p-4 text-sm text-slate-300">
    <p>Filter options coming soon 🚀</p>
  </div>
)}
          <button
  onClick={() => setFilterOpen(!filterOpen)}
  className="btn-ghost py-2 px-3 flex items-center gap-2 text-xs"
>
  <Filter size={13} /> Filter
</button>
          <button
  onClick={handleExport}
  className="btn-ghost py-2 px-3 flex items-center gap-2 text-xs"
>
  <Download size={13} /> Export
</button>
        </div>
      </div>

      {/* KPI row */}
      <div className="relative grid grid-cols-2 xl:grid-cols-4 gap-4">
       <MiniStat
  label="Total Tokens"
  value={`${Math.round(totalTokens / 1000)}K`}
  delta={12.4}
  color="cyan"
/>
        <MiniStat label="Total Cost" value={`$${totalCost.toFixed(2)}`} delta={6.1} color="emerald" />
        <MiniStat label="Avg Latency" value={`${avgLatency}ms`} delta={-4.2} color="violet" />
        <MiniStat label="Error Rate" value={`${totalErrors} errors`} delta={-18.7} color="red" />
      </div>

      {/* Token & cost area chart */}
      <div className="relative glass-card p-5 space-y-4">
        <div>
          <h2 className="section-title text-base">Token & Cost Trend</h2>
          <p className="text-slate-500 text-xs font-body mt-0.5">Daily breakdown over selected period</p>
        </div>
        <ResponsiveContainer width="100%" height={260}>
         <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="tokGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="tok" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} width={55} />
            <YAxis yAxisId="cost" orientation="right" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} width={40} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'JetBrains Mono', color: '#64748b' }} />
            <Area yAxisId="tok" type="monotone" dataKey="tokens" name="Tokens" stroke="#22d3ee" strokeWidth={2} fill="url(#tokGrad)" dot={false} />
            <Area yAxisId="cost" type="monotone" dataKey="cost" name="Cost ($)" stroke="#34d399" strokeWidth={2} fill="url(#costGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Error & request bar chart */}
        <div className="glass-card p-5 space-y-4">
          <div>
            <h2 className="section-title text-base">Requests vs Errors</h2>
            <p className="text-slate-500 text-xs font-body mt-0.5">Volume and reliability</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
           <BarChart data={filteredData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} width={35} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="errors" name="Errors" fill="#f87171" radius={[3, 3, 0, 0]} opacity={0.8} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Latency percentiles */}
        <div className="glass-card p-5 space-y-4">
          <div>
            <h2 className="section-title text-base">Latency Percentiles</h2>
            <p className="text-slate-500 text-xs font-body mt-0.5">p50 / p95 / p99 (ms) over 24h</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={hourlyLatency.filter((_, i) => i % 3 === 0)}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="hour" tick={{ fill: '#64748b', fontSize: 9, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'JetBrains Mono', color: '#64748b' }} />
              <Line type="monotone" dataKey="p50" name="p50" stroke="#22d3ee" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="p95" name="p95" stroke="#a78bfa" strokeWidth={2} dot={false} strokeDasharray="4 2" />
              <Line type="monotone" dataKey="p99" name="p99" stroke="#fb923c" strokeWidth={2} dot={false} strokeDasharray="2 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}