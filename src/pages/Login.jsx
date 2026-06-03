import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginStatus, setLoginStatus] = useState('idle');
  const navigate = useNavigate();
  const { user, startSession } = useAuth();

  // Jika sudah login, arahkan ke dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginStatus('loading');

    try {
      // Start session BEFORE Firebase auth resolves, so that when 
      // onAuthStateChanged triggers, the session is already valid.
      startSession();
      await signInWithEmailAndPassword(auth, email, password);

      setLoginStatus('success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error("Login error:", error);
      alert('Kredensial tidak valid atau terjadi kesalahan.');
      setLoginStatus('idle');
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-r from-primary-100 via-white to-primary-200">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-10">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mx-auto mb-6"
            >
              <img src={logo} alt="Logo" className="w-24 h-24 object-contain mx-auto drop-shadow-md" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Login Admin</h1>
            <p className="text-gray-500 mt-2">Masuk ke dasbor kelulusan MTsN 11 Tasikmalaya</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-11"
                  placeholder="admin@mtsn11.sch.id"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kata Sandi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-11 pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginStatus !== 'idle'}
              className={`btn-primary w-full mt-8 flex justify-center items-center h-12 transition-all duration-300 ${loginStatus === 'success' ? 'bg-green-500 hover:bg-green-600 border-green-500' : ''
                }`}
            >
              <AnimatePresence mode="wait">
                {loginStatus === 'idle' && (
                  <motion.div key="idle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2">
                    <LogIn size={20} />
                    <span>Masuk</span>
                  </motion.div>
                )}
                {loginStatus === 'loading' && (
                  <motion.div key="loading" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-2">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                    <span>Memverifikasi...</span>
                  </motion.div>
                )}
                {loginStatus === 'success' && (
                  <motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2">
                    <CheckCircle2 size={20} />
                    <span>Berhasil Login!</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Silakan masuk menggunakan akun admin.
          </div>
        </div>
      </motion.div>

      <footer className="w-full text-center text-xs text-gray-500 font-medium py-4 mt-8 z-10 relative">
        Portal Kelulusan MTsN 11 Tasikmalaya @2026 | Developed By : TIM Teknis MTsN 11 Tasikmalaya
      </footer>
    </div>
  );
}
