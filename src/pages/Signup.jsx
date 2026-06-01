import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Zap, ArrowRight, Check } from 'lucide-react';

const FEATURES = [
  '1M tokens free every month',
  'Access to 15+ AI models',
  'Real-time usage analytics',
  'Team collaboration tools',
];

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const set = (field) => (e) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const passwordStrength = () => {
    const p = form.password;
    if (p.length === 0) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  };

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-emerald-500'];
  const strength = passwordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await signup(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-100" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />

      {/* Left branding */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center">
            <Zap size={16} className="text-slate-950" fill="currentColor" />
          </div>
          <span className="font-display font-bold text-slate-100 text-lg">NeuralOS</span>
        </div>

        <div className="space-y-8">
          <div>
            <p className="text-emerald-400 text-sm font-mono mb-3 tracking-wider uppercase">Start Free</p>
            <h1 className="font-display font-extrabold text-5xl text-slate-100 leading-tight tracking-tight">
              Build something<br />
              <span className="text-gradient">remarkable.</span>
            </h1>
            <p className="text-slate-400 text-lg font-body mt-4 max-w-md leading-relaxed">
              Join 12,000+ developers and teams using NeuralOS to ship AI-powered products at warp speed.
            </p>
          </div>

          <ul className="space-y-3">
            {FEATURES.map((f, i) => (
              <li key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                  <Check size={10} className="text-emerald-400" strokeWidth={3} />
                </div>
                <span className="text-slate-300 text-sm font-body">{f}</span>
              </li>
            ))}
          </ul>

          <div className="glass-card p-5 flex items-center gap-4">
            <div className="flex -space-x-2">
              {['from-violet-400 to-pink-500','from-cyan-400 to-blue-500','from-amber-400 to-orange-500','from-emerald-400 to-teal-500'].map((g, i) => (
                <div key={i} className={`w-8 h-8 rounded-full bg-gradient-to-br ${g} border-2 border-slate-900 flex items-center justify-center text-white text-xs font-bold`}>
                  {['S','K','R','M'][i]}
                </div>
              ))}
            </div>
            <div>
              <p className="text-slate-200 text-sm font-medium">12,000+ teams aboard</p>
              <p className="text-slate-500 text-xs font-body">Joined in the last 30 days</p>
            </div>
          </div>
        </div>

        <p className="text-slate-600 text-xs font-body">By signing up, you agree to our Terms of Service and Privacy Policy.</p>
      </div>

      {/* Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md animate-fade-up">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-500 flex items-center justify-center">
              <Zap size={16} className="text-slate-950" fill="currentColor" />
            </div>
            <span className="font-display font-bold text-slate-100 text-lg">NeuralOS</span>
          </div>

          <div className="glass-card p-8 space-y-6">
            <div>
              <h2 className="font-display font-bold text-2xl text-slate-100">Create your account</h2>
              <p className="text-slate-400 text-sm font-body mt-1">Free forever. No credit card required.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Full name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Alex Rivera"
                  value={form.name}
                  onChange={set('name')}
                  required
                />
              </div>

              <div>
                <label className="label">Work email</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="alex@company.com"
                  value={form.email}
                  onChange={set('email')}
                  required
                />
              </div>

              <div>
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="input-field pr-11"
                    placeholder="Min. 8 characters"
                    value={form.password}
                    onChange={set('password')}
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

                {/* Password strength */}
                {form.password.length > 0 && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex gap-1.5">
                      {[1,2,3,4].map(i => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            i <= strength ? strengthColor[strength] : 'bg-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs font-body ${
                      strength <= 1 ? 'text-red-400' : strength <= 2 ? 'text-yellow-400' : strength <= 3 ? 'text-blue-400' : 'text-emerald-400'
                    }`}>
                      {strengthLabel[strength]} password
                    </p>
                  </div>
                )}
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
                  <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                ) : (
                  <>Create account <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            <p className="text-center text-slate-500 text-sm font-body">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}