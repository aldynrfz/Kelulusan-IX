import { CheckCircle2, LayoutDashboard, LogOut, Users, ChevronDown, Key, AlertTriangle, X, Menu } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo.png';

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Handle resize to auto-hide sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogoutClick = () => {
    setIsProfileOpen(false);
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
      setToastMsg('Berhasil logout');
      setTimeout(() => navigate('/login'), 1000);
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggingOut(false);
    }
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive
      ? 'bg-primary-50 text-primary-700'
      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
    }`;

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-primary-100 via-white to-primary-200 animate-gradient-x relative overflow-hidden">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/40 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Responsive */}
      <aside
        className={`fixed inset-y-0 left-0 bg-white/40 backdrop-blur-xl border-r border-white/60 z-30 flex flex-col transition-all duration-300 ease-in-out md:relative ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-0 overflow-hidden opacity-0 md:opacity-100'
          }`}
      >
        <div className="p-6 border-b border-gray-100 flex items-center justify-between whitespace-nowrap">
          <div className="flex items-center gap-3 text-primary-600 font-bold text-xl">
            <img src={logo} alt="Logo" className="w-8 h-8 object-contain flex-shrink-0" />
            <span>Kelulusan IX</span>
          </div>
          {/* Close button for mobile */}
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-hidden">
          <ul className="space-y-2 w-56">
            <li>
              <NavLink to="/dashboard" onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)} className={navItemClass}>
                <LayoutDashboard size={20} className="flex-shrink-0" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/data-siswa" onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)} className={navItemClass}>
                <Users size={20} className="flex-shrink-0" />
                <span>Data Siswa</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Desktop Header */}
        <header className="hidden md:flex bg-white/40 backdrop-blur-xl h-20 border-b border-white/60 items-center justify-between px-8 flex-shrink-0 z-10">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors"
          >
            <Menu size={24} />
          </button>

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-xl transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-bold">
                A
              </div>
              <div className="text-left hidden lg:block">
                <div className="text-sm font-bold text-gray-900">Administrator</div>
                <div className="text-xs text-gray-500">admin@mtsn11.sch.id</div>
              </div>
              <ChevronDown size={16} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <>
                  {/* Backdrop for click outside */}
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsProfileOpen(false)}
                  ></div>

                  {/* Dropdown Menu */}
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/60 py-2 z-40"
                  >
                    <div className="px-4 py-3 border-b border-gray-50 lg:hidden">
                      <div className="text-sm font-bold text-gray-900">Administrator</div>
                      <div className="text-xs text-gray-500">admin@mtsn11.sch.id</div>
                    </div>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        alert('Fitur ubah password akan segera hadir.');
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                    >
                      <Key size={16} className="text-gray-400" />
                      Ubah Password
                    </button>
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button
                      onClick={handleLogoutClick}
                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors font-medium"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Mobile Header */}
        <div className="md:hidden bg-white/40 backdrop-blur-xl p-4 border-b border-white/60 flex justify-between items-center z-10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2 font-bold text-primary-600">

            </div>
          </div>

          {/* Mobile Profile Toggle */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-600 font-bold text-sm"
            >
              A
            </button>
            <AnimatePresence>
              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsProfileOpen(false)}
                  ></div>
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-48 bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/60 py-2 z-40"
                  >
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        alert('Fitur ubah password akan segera hadir.');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Key size={16} className="text-gray-400" />
                      Ubah Password
                    </button>
                    <button
                      onClick={handleLogoutClick}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Removed horizontal mobile nav */}

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 bg-transparent">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {isLogoutModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogoutModalOpen(false)}
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[60]"
            />
            <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="w-full max-w-sm pointer-events-auto glass-card overflow-hidden"
              >
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <LogOut size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Konfirmasi Logout</h3>
                  <p className="text-sm text-gray-500 mb-6">Apakah Anda yakin ingin keluar dari halaman administrator?</p>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setIsLogoutModalOpen(false)}
                      className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      onClick={confirmLogout}
                      disabled={isLoggingOut}
                      className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors relative overflow-hidden flex items-center justify-center"
                    >
                      {isLoggingOut ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                      ) : (
                        'Ya, Keluar'
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-[100]"
          >
            <div className="bg-green-500/20 text-green-400 p-1.5 rounded-full">
              <CheckCircle2 size={18} />
            </div>
            <div className="font-medium text-sm">{toastMsg}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
