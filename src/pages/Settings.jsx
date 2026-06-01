import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { User, Key, Bell, Shield, CreditCard, Check, Copy, Eye, EyeOff, Zap, AlertTriangle, Loader } from 'lucide-react';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'api', label: 'API Keys', icon: Key },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
];

const MOCK_KEYS = [
  { id: 'k1', name: 'Production', key: 'nos_live_sk_4f8a2b...e91c', created: 'Jan 15, 2024', lastUsed: '2 min ago', active: true },
  { id: 'k2', name: 'Development', key: 'nos_test_sk_9c3d1a...f72b', created: 'Feb 3, 2024', lastUsed: '3 days ago', active: true },
  { id: 'k3', name: 'Staging', key: 'nos_live_sk_2e7b4c...a38d', created: 'Mar 12, 2024', lastUsed: 'Never', active: false },
];

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5.5 rounded-full transition-all duration-300 flex-shrink-0 ${value ? 'bg-cyan-500' : 'bg-slate-700'}`}
      style={{ height: '22px' }}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${value ? 'left-[calc(100%-18px)]' : 'left-0.5'}`}
      />
    </button>
  );
}

function ProfileTab() {
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const save = async () => {
    setError('');
    setLoading(true);

    try {
      const trimmedName = form.name.trim();

      if (!trimmedName) {
        setError('Name cannot be empty.');
        return;
      }

      await updateUser({
        ...form,
        name: trimmedName,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message || 'Failed to save changes.');
    } finally {
      setLoading(false);
    }
  };

const handleAvatarUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setUploadingAvatar(true);

  try {
    const fileExt = file.name.split('.').pop();
    const filePath = `${user.id}/${Date.now()}.${fileExt}`;

    // 1. Upload
    const { error } = await supabase.storage
      .from('avatars')
      .upload(filePath, file);

    if (error) throw error;

    // 2. Get URL
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    const avatarUrl = data.publicUrl;

    // 3. Save to user
    await updateUser({
      avatar_url: avatarUrl,
    });

  } catch (err) {
    setError(err.message);
  } finally {
    setUploadingAvatar(false);
  }
};
  return (
    <div className="space-y-6">

      <div>
        <h3 className="section-title text-base mb-1">Profile Information</h3>
        <p className="text-slate-500 text-sm font-body">
          Update your personal details
        </p>
      </div>

      {/* AVATAR SECTION (FIXED - THIS IS WHERE IT GOES) */}
      <div className="flex items-center gap-5">

        {user?.user_metadata?.avatar_url ? (
          <img
            src={user.user_metadata.avatar_url}
            className="w-16 h-16 rounded-2xl object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center text-slate-950 text-xl font-bold">
            {form.name
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()
              .slice(0, 2) || '?'}
          </div>
        )}

        <div>
          <input
            type="file"
            accept="image/*"
            id="avatarInput"
            hidden
            onChange={handleAvatarUpload}
          />

         <button
  onClick={() => document.getElementById('avatarInput').click()}
  className="btn-ghost text-sm py-2 px-4 flex items-center gap-2"
  disabled={uploadingAvatar}
>
  {uploadingAvatar ? (
    <>
      <Loader size={14} className="animate-spin" />
      Uploading...
    </>
  ) : (
    'Change avatar'
  )}
</button>
          <p className="text-slate-600 text-xs font-body mt-1.5">
            JPG, PNG or GIF · Max 2MB
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="label">Full name</label>
          <input
            className="input-field"
            value={form.name}
            onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
          />
        </div>

        <div>
          <label className="label">Email</label>
          <input
            className="input-field"
            type="email"
            value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
          />
        </div>

        <div>
          <label className="label">Role</label>
          <input className="input-field opacity-60" value={user?.role} disabled />
        </div>

        <div>
          <label className="label">Plan</label>
          <div className="input-field flex items-center gap-2">
            <span className="text-slate-300">{user?.plan}</span>
            <span className="ml-auto text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full px-2 py-0.5">
              Active
            </span>
          </div>
        </div>
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <button
        onClick={save}
        disabled={loading}
        className={`btn-primary flex items-center gap-2 text-sm ${
          saved ? '!bg-emerald-500' : ''
        }`}
      >
        {loading ? 'Saving...' : saved ? 'Saved!' : 'Save changes'}
      </button>
    </div>
  );
}
function APITab() {
  const [showKey, setShowKey] = useState({});
  const [copied, setCopied] = useState('');

  const copyKey = (id, key) => {
    navigator.clipboard.writeText(key);
    setCopied(id);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="section-title text-base mb-1">API Keys</h3>
          <p className="text-slate-500 text-sm font-body">Manage your secret API keys</p>
        </div>
        <button className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
          <Key size={13} /> New Key
        </button>
      </div>

      <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex gap-3">
        <AlertTriangle size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-amber-300/80 text-sm font-body">
          Keep your API keys secret. Never expose them in client-side code or public repositories.
        </p>
      </div>

      <div className="space-y-3">
        {MOCK_KEYS.map(k => (
          <div key={k.id} className="glass-card p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-200 text-sm font-medium font-body">{k.name}</p>
                <p className="text-slate-600 text-xs font-mono mt-0.5">Created {k.created}</p>
              </div>
              <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${k.active
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-slate-800 text-slate-500 border-slate-700/40'}`}>
                {k.active ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="flex items-center gap-2 bg-slate-800/60 rounded-xl px-3 py-2 border border-slate-700/40">
              <code className="flex-1 text-xs font-mono text-slate-400">
                {showKey[k.id] ? 'nos_live_sk_4f8a2b9c3d1e7f2a8e91c' : k.key}
              </code>
              <button onClick={() => setShowKey(p => ({ ...p, [k.id]: !p[k.id] }))} className="text-slate-600 hover:text-slate-400 transition-colors">
                {showKey[k.id] ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
              <button onClick={() => copyKey(k.id, k.key)} className="text-slate-600 hover:text-cyan-400 transition-colors">
                {copied === k.id ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              </button>
            </div>

            <p className="text-xs text-slate-600 font-mono">Last used: {k.lastUsed}</p>
          </div>
        ))}
      </div>

      {/* Code snippet */}
      <div className="glass-card overflow-hidden">
        <div className="px-4 py-2.5 bg-slate-800/60 border-b border-slate-700/40 flex items-center gap-2">
          <div className="flex gap-1.5">
            {['#f87171', '#fbbf24', '#34d399'].map(c => (
              <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
            ))}
          </div>
          <span className="text-xs font-mono text-slate-500">quickstart.ts</span>
        </div>
        <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
          {`import { NeuralOS } from '@neuralo/sdk';

const client = new NeuralOS({
  apiKey: process.env.NEURAL_API_KEY,
});

const response = await client.chat.complete({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Hello!' }],
});

console.log(response.choices[0].message.content);`}
        </pre>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [settings, setSettings] = useState({
    usageAlerts: true, weeklyDigest: true, newModels: false,
    systemStatus: true, teamActivity: false, billing: true,
  });

  const toggle = (key) => setSettings(p => ({ ...p, [key]: !p[key] }));

  const items = [
    { key: 'usageAlerts', label: 'Usage alerts', desc: 'Get notified when usage hits 80% or 100%' },
    { key: 'weeklyDigest', label: 'Weekly digest', desc: 'Summary of usage, costs and performance' },
    { key: 'newModels', label: 'New models', desc: 'When new AI models become available' },
    { key: 'systemStatus', label: 'System status', desc: 'Downtime and maintenance windows' },
    { key: 'teamActivity', label: 'Team activity', desc: 'When team members join or perform actions' },
    { key: 'billing', label: 'Billing updates', desc: 'Invoices, payment failures and upgrades' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="section-title text-base mb-1">Notifications</h3>
        <p className="text-slate-500 text-sm font-body">Manage how we reach you</p>
      </div>
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.key} className="glass-card p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-slate-200 text-sm font-medium font-body">{item.label}</p>
              <p className="text-slate-500 text-xs font-body mt-0.5">{item.desc}</p>
            </div>
            <Toggle value={settings[item.key]} onChange={() => toggle(item.key)} />
          </div>
        ))}
      </div>
    </div>
  );
}

// FIX 2: SecurityTab — restored full JSX (was missing 2FA + Sessions sections),
// fixed broken return (had JS comments as JSX), made handlePasswordUpdate async
function SecurityTab() {
  const { updatePassword } = useAuth();
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [pwSaved, setPwSaved] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');

  // FIX 3: async + awaits updatePassword + catches the thrown error from AuthContext
  const handlePasswordUpdate = async () => {
    setPwError('');

    if (pwForm.next !== pwForm.confirm) {
      setPwError("New passwords don't match.");
      return;
    }
    if (pwForm.next.length < 8) {
      setPwError('Password must be at least 8 characters.');
      return;
    }

    setPwLoading(true);
    try {
      await updatePassword(pwForm.current, pwForm.next);
      setPwSaved(true);
      setPwForm({ current: '', next: '', confirm: '' });
      setTimeout(() => setPwSaved(false), 2000);
    } catch (err) {
      setPwError(err.message || 'Failed to update password.');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="section-title text-base mb-1">Security</h3>
        <p className="text-slate-500 text-sm font-body">Manage your account security</p>
      </div>

      {/* Change Password */}
      <div className="glass-card p-5 space-y-4">
        <h4 className="text-slate-200 font-medium font-body text-sm">Change Password</h4>
        <div className="space-y-3">
          <div>
            <label className="label">Current password</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={pwForm.current}
              onChange={e => setPwForm(p => ({ ...p, current: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">New password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Min. 8 characters"
              value={pwForm.next}
              onChange={e => setPwForm(p => ({ ...p, next: e.target.value }))}
            />
          </div>
          <div>
            <label className="label">Confirm new password</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={pwForm.confirm}
              onChange={e => setPwForm(p => ({ ...p, confirm: e.target.value }))}
            />
          </div>
        </div>

        {pwError && <p className="text-red-400 text-xs">{pwError}</p>}

        <button
          onClick={handlePasswordUpdate}
          disabled={pwLoading}
          className={`btn-primary text-sm py-2.5 flex items-center gap-2 disabled:opacity-60 ${pwSaved ? '!bg-emerald-500' : ''}`}
        >
          {pwLoading
            ? <><Loader size={14} className="animate-spin" /> Updating...</>
            : pwSaved
            ? <><Check size={14} /> Updated!</>
            : 'Update password'}
        </button>
      </div>

      {/* Two-Factor Authentication */}
      <div className="glass-card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-slate-200 font-medium font-body text-sm">Two-Factor Authentication</h4>
            <p className="text-slate-500 text-xs font-body mt-0.5">Add an extra layer of security</p>
          </div>
          <span className="text-xs font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">Disabled</span>
        </div>
        <button className="btn-ghost text-sm py-2 px-4 flex items-center gap-2">
          <Shield size={13} /> Enable 2FA
        </button>
      </div>

      {/* Active Sessions */}
      <div className="glass-card p-5 space-y-3">
        <h4 className="text-slate-200 font-medium font-body text-sm">Active Sessions</h4>
        {[
          { device: 'MacBook Pro — Chrome 122', location: 'San Francisco, US', current: true },
          { device: 'iPhone 15 — Safari', location: 'San Francisco, US', current: false },
        ].map((s, i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <div>
              <p className="text-slate-300 text-sm font-body">{s.device}</p>
              <p className="text-slate-600 text-xs font-mono">{s.location}</p>
            </div>
            {s.current
              ? <span className="text-xs font-mono text-emerald-400">Current</span>
              : <button className="text-xs text-red-400 hover:text-red-300 font-mono transition-colors">Revoke</button>
            }
          </div>
        ))}
      </div>
    </div>
  );
}

function BillingTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="section-title text-base mb-1">Billing</h3>
        <p className="text-slate-500 text-sm font-body">Manage your subscription and payments</p>
      </div>

      {/* Plan card */}
      <div className="glass-card p-5 border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-transparent space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Zap size={15} className="text-cyan-400" />
              <span className="font-display font-semibold text-slate-100">Pro Plan</span>
            </div>
            <p className="text-slate-400 text-sm font-body mt-1">$49/month · Renews Jun 8, 2026</p>
          </div>
          <button className="btn-ghost text-sm py-2 px-4">Manage</button>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-body">Token usage</span>
            <span className="font-mono text-cyan-400">847K / 1M</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full w-[84.7%] bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full" />
          </div>
        </div>
      </div>

      {/* Invoices */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-800/60">
          <h4 className="text-slate-200 font-medium font-body text-sm">Recent Invoices</h4>
        </div>
        {[
          { date: 'May 1, 2026', amount: '$49.00', status: 'Paid' },
          { date: 'Apr 1, 2026', amount: '$49.00', status: 'Paid' },
          { date: 'Mar 1, 2026', amount: '$49.00', status: 'Paid' },
        ].map((inv, i) => (
          <div key={i} className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800/40 last:border-0">
            <span className="text-slate-300 text-sm font-body">{inv.date}</span>
            <span className="font-mono text-sm text-slate-200">{inv.amount}</span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">{inv.status}</span>
            <button className="text-xs text-cyan-500 hover:text-cyan-400 font-mono transition-colors">Download</button>
          </div>
        ))}
      </div>

      <div className="glass-card p-5 border-red-500/10">
        <h4 className="text-slate-200 font-medium font-body text-sm mb-2">Danger Zone</h4>
        <p className="text-slate-500 text-xs font-body mb-3">Cancel your subscription. You'll retain access until the end of the billing period.</p>
        <button className="text-sm text-red-400 border border-red-500/20 hover:bg-red-500/5 px-4 py-2 rounded-xl transition-colors font-body">
          Cancel subscription
        </button>
      </div>
    </div>
  );
}

const TAB_COMPONENTS = {
  profile: ProfileTab,
  api: APITab,
  notifications: NotificationsTab,
  security: SecurityTab,
  billing: BillingTab,
};

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const TabComponent = TAB_COMPONENTS[activeTab];

  return (
    <div className="p-6 lg:p-8 relative">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-40 pointer-events-none" />

      <div className="relative max-w-4xl">
        <div className="mb-6">
          <h1 className="font-display font-bold text-2xl text-slate-100">Settings</h1>
          <p className="text-slate-500 text-sm font-body mt-0.5">Manage your account and workspace</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar tabs */}
          <div className="lg:w-48 flex-shrink-0">
            <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-body transition-all duration-200 whitespace-nowrap ${activeTab === id
                    ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                >
                  <Icon size={15} />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 glass-card p-6 animate-scale-in">
            <TabComponent />
          </div>
        </div>
      </div>
    </div>
  );
}