import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Link as LinkIcon, Users, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

export default function Dashboard() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "siswa"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const studentData = [];
      snapshot.forEach((doc) => {
        studentData.push({ id: doc.id, ...doc.data() });
      });
      setStudents(studentData);
    });
    
    return () => unsubscribe();
  }, []);

  const totalSiswa = students.length;
  const totalLulus = students.filter(s => s.statusLulus).length;
  const totalTidakLulus = totalSiswa - totalLulus;

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Ringkasan statistik kelulusan siswa MTsN 11.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="glass-card p-6 flex items-center gap-5"
          >
            <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
              <Users size={28} />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Total Data</div>
              <div className="text-3xl font-bold text-gray-900">{totalSiswa}</div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
            className="glass-card p-6 flex items-center gap-5"
          >
            <div className="w-14 h-14 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
              <CheckCircle size={28} />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Total Lulus</div>
              <div className="text-3xl font-bold text-gray-900">{totalLulus}</div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
            className="glass-card p-6 flex items-center gap-5"
          >
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
              <XCircle size={28} />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">Tidak Lulus</div>
              <div className="text-3xl font-bold text-gray-900">{totalTidakLulus}</div>
            </div>
          </motion.div>
        </div>

        {/* List Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="glass-card overflow-hidden">
            <div className="p-5 border-b border-white/40 bg-white/20 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800">Data Siswa Terbaru</h2>
            </div>
            
            <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
              <AnimatePresence>
                {students.map((student) => (
                  <motion.div 
                    key={student.id}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="p-5 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        student.statusLulus ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {student.statusLulus ? <Check size={20} /> : <X size={20} />}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{student.nama}</div>
                        <div className="text-sm text-gray-500 mt-0.5">{student.nisn}</div>
                      </div>
                    </div>
                    <div className="sm:text-right flex sm:flex-col justify-between items-center sm:items-end">
                      <div className={`text-sm font-semibold mt-2 sm:mt-0 ${
                        student.statusLulus ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {student.statusLulus ? 'LULUS' : 'TIDAK LULUS'}
                      </div>
                      <a href={student.tautanDrive} target="_blank" rel="noreferrer" className="text-xs text-primary-500 hover:underline flex items-center gap-1 mt-1">
                        Lihat Berkas <LinkIcon size={12} />
                      </a>
                    </div>
                  </motion.div>
                ))}
                {students.length === 0 && (
                  <div className="p-10 text-center text-gray-500 text-sm">
                    Belum ada data siswa.
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
