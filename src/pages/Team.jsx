import { useState } from 'react';
import { UserPlus, Mail, MoreHorizontal, Shield, ChevronDown, Trash2, Edit2, Check } from 'lucide-react';

const MEMBERS = [
  { id: 1, name: 'Alex Rivera', email: 'alex@neuralo.ai', role: 'Admin', status: 'active', tokens: 421000, joined: 'Jan 15, 2024', gradient: 'from-cyan-400 to-emerald-500' },
  { id: 2, name: 'Jordan Kim', email: 'jordan@neuralo.ai', role: 'Developer', status: 'active', tokens: 198000, joined: 'Feb 3, 2024', gradient: 'from-violet-400 to-pink-500' },
  { id: 3, name: 'Sam Patel', email: 'sam@neuralo.ai', role: 'Developer', status: 'active', tokens: 134000, joined: 'Feb 20, 2024', gradient: 'from-amber-400 to-orange-500' },
  { id: 4, name: 'Casey Morgan', email: 'casey@neuralo.ai', role: 'Viewer', status: 'pending', tokens: 0, joined: 'Mar 5, 2024', gradient: 'from-emerald-400 to-teal-500' },
  { id: 5, name: 'Riley Chen', email: 'riley@neuralo.ai', role: 'Developer', status: 'active', tokens: 94291, joined: 'Mar 12, 2024', gradient: 'from-blue-400 to-indigo-500' },
];

const ROLES = ['Admin', 'Developer', 'Viewer'];

const roleStyle = {
  Admin: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  Developer: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Viewer: 'bg-slate-700/50 text-slate-400 border-slate-600/40',
};

function MemberRow({ member }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const initials = member.name.split(' ').map(n => n[0]).join('');
  const pct = Math.round((member.tokens / 421000) * 100);

  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-slate-800/30 transition-colors group">
      {/* Avatar */}
      <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-slate-950 text-xs font-bold font-display flex-shrink-0`}>
        {initials}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm text-slate-200 font-medium font-body">{member.name}</p>
          {member.status === 'pending' && (
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full">pending</span>
          )}
        </div>
        <p className="text-xs text-slate-500 font-body">{member.email}</p>
      </div>

      {/* Role */}
      <span className={`text-xs font-mono px-2.5 py-1 rounded-full border hidden sm:block ${roleStyle[member.role]}`}>
        {member.role}
      </span>

      {/* Token usage */}
      <div className="hidden lg:flex flex-col gap-1 w-28">
        <div className="flex justify-between">
          <span className="text-xs text-slate-500 font-body">{(member.tokens / 1000).toFixed(0)}K tok</span>
          <span className="text-xs font-mono text-slate-500">{pct}%</span>
        </div>
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Joined */}
      <span className="text-xs text-slate-600 font-mono hidden xl:block w-24">{member.joined}</span>

      {/* Menu */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1.5 text-slate-600 hover:text-slate-300 transition-colors rounded-lg hover:bg-slate-800/60 opacity-0 group-hover:opacity-100"
        >
          <MoreHorizontal size={15} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 w-40 glass-card py-1 z-20 animate-scale-in">
            <button className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/50 flex items-center gap-2 font-body">
              <Edit2 size={12} /> Change role
            </button>
            <button className="w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-800/50 flex items-center gap-2 font-body">
              <Shield size={12} /> View permissions
            </button>
            <div className="border-t border-slate-800/60 my-1" />
            <button className="w-full text-left px-3 py-2 text-xs text-red-400 hover:bg-red-500/5 flex items-center gap-2 font-body">
              <Trash2 size={12} /> Remove member
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Team() {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Developer');
  const [roleOpen, setRoleOpen] = useState(false);
  const [sent, setSent] = useState(false);

  const handleInvite = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => { setSent(false); setInviteEmail(''); setShowInvite(false); }, 2000);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 relative">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40 pointer-events-none" />

      {/* Header */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-100">Team</h1>
          <p className="text-slate-500 text-sm font-body mt-0.5">{MEMBERS.length} members · 2 seats remaining</p>
        </div>
        <button
          onClick={() => setShowInvite(!showInvite)}
          className="btn-primary flex items-center gap-2 text-sm py-2.5"
        >
          <UserPlus size={15} /> Invite member
        </button>
      </div>

      {/* Invite panel */}
      {showInvite && (
        <div className="relative glass-card p-5 border-cyan-500/20 animate-scale-in">
          <h3 className="font-display font-semibold text-slate-100 mb-4">Invite team member</h3>
          <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="input-field pl-9"
                required
              />
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setRoleOpen(!roleOpen)}
                className="input-field flex items-center gap-2 w-40 justify-between"
              >
                <span>{inviteRole}</span>
                <ChevronDown size={14} className="text-slate-500" />
              </button>
              {roleOpen && (
                <div className="absolute top-full left-0 mt-1 w-40 glass-card py-1 z-20">
                  {ROLES.map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => { setInviteRole(r); setRoleOpen(false); }}
                      className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800/50 flex items-center justify-between font-body"
                    >
                      {r}
                      {inviteRole === r && <Check size={12} className="text-cyan-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button type="submit" className={`btn-primary flex items-center gap-2 text-sm py-2.5 whitespace-nowrap ${sent ? '!bg-emerald-500' : ''}`}>
              {sent ? <><Check size={14} /> Sent!</> : 'Send invite'}
            </button>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="relative grid grid-cols-3 gap-4">
        {[
          { label: 'Active Members', val: '4', sub: 'out of 5' },
          { label: 'Pending Invites', val: '1', sub: 'awaiting' },
          { label: 'Seat Limit', val: '7', sub: 'Pro plan' },
        ].map((s, i) => (
          <div key={i} className="glass-card p-4 text-center">
            <p className="font-display font-bold text-2xl text-cyan-400">{s.val}</p>
            <p className="text-slate-300 text-sm font-body mt-0.5">{s.label}</p>
            <p className="text-slate-600 text-xs font-mono">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Members table */}
      <div className="relative glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800/60">
          <h2 className="section-title text-base">Members</h2>
        </div>

        {/* Table header */}
        <div className="flex items-center gap-4 px-5 py-2 border-b border-slate-800/40">
          <div className="w-9 flex-shrink-0" />
          <p className="flex-1 text-xs font-mono text-slate-600 uppercase tracking-wider">Name</p>
          <p className="text-xs font-mono text-slate-600 uppercase tracking-wider hidden sm:block w-20">Role</p>
          <p className="text-xs font-mono text-slate-600 uppercase tracking-wider hidden lg:block w-28">Usage</p>
          <p className="text-xs font-mono text-slate-600 uppercase tracking-wider hidden xl:block w-24">Joined</p>
          <div className="w-8" />
        </div>

        <div className="divide-y divide-slate-800/40">
          {MEMBERS.map((m, i) => (
            <div
              key={m.id}
              className="animate-fade-up opacity-0"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'forwards' }}
            >
              <MemberRow member={m} />
            </div>
          ))}
        </div>
      </div>

      {/* Permissions reference */}
      <div className="relative glass-card p-5">
        <h3 className="section-title text-sm mb-4">Role Permissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-body">
            <thead>
              <tr className="border-b border-slate-800/60">
                <th className="text-left pb-2 text-slate-500 font-mono">Permission</th>
                {ROLES.map(r => (
                  <th key={r} className={`pb-2 text-center font-mono ${roleStyle[r].split(' ')[1]}`}>{r}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {[
                ['Use AI Chat', true, true, true],
                ['View Analytics', true, true, true],
                ['Manage API Keys', true, true, false],
                ['Invite Members', true, false, false],
                ['Billing Access', true, false, false],
                ['Delete Workspace', true, false, false],
              ].map(([perm, ...vals], i) => (
                <tr key={i}>
                  <td className="py-2 text-slate-400">{perm}</td>
                  {vals.map((v, j) => (
                    <td key={j} className="py-2 text-center">
                      <span className={v ? 'text-emerald-400' : 'text-slate-700'}>
                        {v ? '✓' : '✗'}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}