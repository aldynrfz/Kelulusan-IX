import { useState } from 'react';
import { CheckCircle2, LayoutDashboard, LogOut, Users, ChevronDown, Key } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    navigate('/login');
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${isActive
      ? 'bg-primary-50 text-primary-700'
      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Desktop */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col z-20">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3 text-primary-600 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
              <CheckCircle2 size={20} />
            </div>
            Kelulusan Kelas IX
          </div>
        </div>

        <div className="p-4 flex-1">
          <ul className="space-y-2">
            <li>
              <NavLink to="/dashboard" className={navItemClass}>
                <LayoutDashboard size={20} />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink to="/data-siswa" className={navItemClass}>
                <Users size={20} />
                Data Siswa
              </NavLink>
            </li>
          </ul>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Desktop Header */}
        <header className="hidden md:flex bg-white h-20 border-b border-gray-200 items-center justify-end px-8 flex-shrink-0 z-10">
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
                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-40"
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
                      onClick={handleLogout}
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
        <div className="md:hidden bg-white p-4 border-b border-gray-200 flex justify-between items-center z-10 flex-shrink-0">
          <div className="flex items-center gap-2 font-bold text-primary-600">
            <CheckCircle2 size={20} />
            Admin
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
                    className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-40"
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
                      onClick={handleLogout}
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

        {/* Mobile Nav */}
        <div className="md:hidden bg-white px-4 py-2 border-b border-gray-100 flex gap-2 overflow-x-auto flex-shrink-0">
          <NavLink to="/dashboard" className={({ isActive }) => `px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-500'}`}>Dashboard</NavLink>
          <NavLink to="/data-siswa" className={({ isActive }) => `px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${isActive ? 'bg-primary-50 text-primary-700' : 'text-gray-500'}`}>Data Siswa</NavLink>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 bg-gray-50/50">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
