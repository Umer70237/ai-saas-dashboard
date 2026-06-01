import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Zap, ArrowRight, GitBranch, Globe } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setEmail('demo@neuralo.ai');
    setPassword('demo1234');
    setError('');
    setLoading(true);
    try {
      await login('demo@neuralo.ai', 'demo1234');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-100" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />

      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center">
            <Zap size={16} className="text-slate-950" fill="currentColor" />
          </div>
          <span className="font-display font-bold text-slate-100 text-lg tracking-tight">NeuralOS</span>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5">
              <div className="dot-pulse" />
              <span className="text-cyan-400 text-xs font-mono">System Operational</span>
            </div>
            <h1 className="font-display font-extrabold text-5xl text-slate-100 leading-tight tracking-tight">
              Intelligence<br />
              <span className="text-gradient">Amplified.</span>
            </h1>
            <p className="text-slate-400 text-lg font-body max-w-md leading-relaxed">
              The AI command center built for teams that move fast. Access every model, trace every token, ship every day.
            </p>
          </div>

          {/* Testimonial */}
          <div className="glass-card p-6 space-y-3 max-w-md">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              ))}
            </div>
            <p className="text-slate-300 text-sm font-body leading-relaxed">
              "NeuralOS cut our AI integration time from weeks to hours. The analytics alone are worth it."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold">SR</div>
              <div>
                <p className="text-slate-200 text-sm font-medium">Sofia Rodriguez</p>
                <p className="text-slate-500 text-xs">CTO @ Luminary Labs</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6 text-slate-600 text-xs font-mono">
          <span>SOC 2 Type II</span>
          <span>GDPR</span>
          <span>ISO 27001</span>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-up">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center">
              <Zap size={16} className="text-slate-950" fill="currentColor" />
            </div>
            <span className="font-display font-bold text-slate-100 text-lg">NeuralOS</span>
          </div>

          <div className="glass-card p-8 space-y-6">
            <div className="space-y-1">
              <h2 className="font-display font-bold text-2xl text-slate-100">Welcome back</h2>
              <p className="text-slate-400 text-sm font-body">Sign in to your AI workspace</p>
            </div>

            {/* Social logins */}
            {/* 🔐 REAL AUTH: Connect these to your OAuth providers */}
            <div className="grid grid-cols-2 gap-3">
             
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-800" />
        
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Email address</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="you@company.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="label mb-0">Password</label>
                
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input-field pr-11"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm font-body">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin cursor-pointer" />
                ) : (
                  <>Sign in <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            <button
              onClick={handleDemo}
              disabled={loading}
            className="w-full text-center text-lg text-cyan-500 hover:text-cyan-400 font-body transition-colors duration-200 py-3 px-4 cursor-pointer rounded-md"
            >
              → Try demo account (no signup needed)
            </button>

            <p className="text-center text-slate-500 text-sm font-body">
              No account?{' '}
              <Link to="/signup" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}