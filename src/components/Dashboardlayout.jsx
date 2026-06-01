import { createPortal } from "react-dom";
import { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard, MessageSquare, BarChart3, Cpu, Users,
  Settings, Zap, Menu, X, Bell, ChevronDown,
  Search, Sparkles
} from 'lucide-react';

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/chat', icon: MessageSquare, label: 'AI Chat' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/models', icon: Cpu, label: 'Models' },
  { to: '/team', icon: Users, label: 'Team' },
];

function Avatar({ user, size = 'sm' }) {
  const s = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm';

  const avatar =
    user?.user_metadata?.avatar_url ||
    user?.avatar_url;

  const name =
    user?.user_metadata?.full_name ||
    user?.email ||
    'User';

  const initials =
    name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  if (avatar) {
    return (
      <img
        src={avatar}
        className={`${s} rounded-full object-cover flex-shrink-0`}
      />
    );
  }

  return (
    <div className={`${s} rounded-full bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center text-slate-950 font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // ✅ Close dropdown on outside click
  useEffect(() => {
    if (!userMenuOpen) return;

    const handleClick = () => setUserMenuOpen(false);

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, [userMenuOpen]);

  const tokenPct =
    Math.round((user?.tokensUsed / user?.tokensLimit) * 100) || 0;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center">
            <Zap size={15} className="text-slate-950" />
          </div>
          <div>
            <p className="font-bold text-slate-100 text-sm">NeuralOS</p>
            <p className="text-slate-500 text-xs">v2.4.1</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 border-b border-slate-800/60">
        <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2">
          <Search size={14} className="text-slate-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-slate-400 outline-none w-full"
          />
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              isActive ? 'text-cyan-400' : 'text-slate-400'
            }
          >
            <div className="flex items-center gap-2 py-2">
              <Icon size={16} />
              {label}
            </div>
          </NavLink>
        ))}
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-slate-800/60">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative w-64 bg-slate-900 z-50">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-14 flex items-center justify-between px-4 border-b border-slate-800/60 relative z-40">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu />
          </button>

          <div />

          <div className="flex items-center gap-3 relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUserMenuOpen(v => !v);
              }}
              className="flex items-center gap-2"
              type="button"
            >
              <Avatar user={user} size="sm" />
              <ChevronDown size={14} />
            </button>

            {/* ✅ PORTAL DROPDOWN */}
            {userMenuOpen &&
              createPortal(
                <div
                  className="fixed right-6 top-16 w-48 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl z-[999999]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-4 py-2 border-b border-slate-800">
                    <p className="text-xs text-slate-400">{user?.email}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(false);
                      navigate('/settings');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-800 text-sm"
                  >
                    Settings
                  </button>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-slate-800 text-sm text-red-400"
                  >
                    Sign out
                  </button>
                </div>,
                document.body
              )}
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}