import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Download, CheckCircle, XCircle, GraduationCap, AlertCircle } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import confetti from 'canvas-confetti';
import logo from '../assets/logo.png';

const DownloadButton = ({ href, text, baseColor, hoverColor }) => {
  const [status, setStatus] = useState('idle');

  const handleClick = (e) => {
    e.preventDefault();
    if (status !== 'idle') return;

    setStatus('downloading');
    setTimeout(() => {
      setStatus('done');
      window.open(href, '_blank', 'noopener,noreferrer');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1200);
  };

  return (
    <button
      onClick={handleClick}
      className={`relative overflow-hidden inline-flex items-center justify-center gap-2 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300 w-full ${status === 'done' ? 'bg-green-500 hover:bg-green-600' : `${baseColor} ${hoverColor}`
        }`}
    >
      <AnimatePresence mode="wait">
        {status === 'idle' && (
          <motion.div key="idle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2" transition={{ duration: 0.2 }}>
            <Download size={20} />
            <span>{text}</span>
          </motion.div>
        )}
        {status === 'downloading' && (
          <motion.div key="downloading" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-2" transition={{ duration: 0.2 }}>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Memproses...</span>
          </motion.div>
        )}
        {status === 'done' && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} className="flex items-center gap-2" transition={{ duration: 0.3, type: "spring" }}>
            <CheckCircle size={20} />
            <span>Berhasil!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
};

export default function Home() {
  const [nisn, setNisn] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!nisn.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const q = query(collection(db, "siswa"), where("nisn", "==", nisn));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Assuming there is only one student per NISN
        const docData = querySnapshot.docs[0].data();

        if (docData.statusLulus) {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#22c55e', '#4ade80', '#16a34a', '#facc15', '#fbbf24']
          });
        }

        setResult({
          nama: docData.nama,
          nisn: docData.nisn,
          lulus: docData.statusLulus,
          link: docData.tautanDrive || '',
          linkKelakuanBaik: docData.tautanKelakuanBaik || '',
          linkSertifikatTKA: docData.tautanSertifikatTKA || ''
        });
      } else {
        setError('Data siswa dengan NISN tersebut tidak ditemukan.');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan saat mengambil data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-r from-primary-100 via-white to-primary-200">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />

      <div className="w-full max-w-lg z-10 relative flex-1 flex flex-col justify-center py-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card p-10 mb-6"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              className="mx-auto mb-6"
            >
              <img src={logo} alt="Logo MTsN 11" className="w-28 h-28 object-contain mx-auto drop-shadow-md" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Portal Kelulusan</h1>
            <p className="text-gray-500">MTsN 11 Tasikmalaya</p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label htmlFor="nisn" className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Induk Siswa Nasional (NISN)
              </label>
              <div className="relative">
                <input
                  id="nisn"
                  type="text"
                  value={nisn}
                  onChange={(e) => setNisn(e.target.value)}
                  className="input-field pl-4 pr-12 text-lg py-4"
                  placeholder="Masukkan NISN Anda..."
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Search className="text-gray-400 h-6 w-6" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-4 text-lg hover:bg-primary-500 transition-colors duration-300"
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                  <Loader2 size={24} className="text-white" />
                </motion.div>
              ) : (
                <span>Cari Data</span>
              )}
            </button>
          </form>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <div className="mt-8 text-center text-xs text-gray-400">
            Pastikan NISN yang Anda masukkan sudah benar.
          </div>
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
              className="glass-card p-8 text-center"
            >
              <div className="mb-6">
                {result.lulus ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto"
                  >
                    <CheckCircle size={32} />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto"
                  >
                    <XCircle size={32} />
                  </motion.div>
                )}
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-1">{result.nama}</h2>
              <p className="text-gray-500 mb-6">NISN: {result.nisn}</p>

              <div className={`text-xl font-bold p-3 rounded-lg mb-8 ${result.lulus ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                STATUS: {result.lulus ? 'LULUS' : 'TIDAK LULUS'}
              </div>

              {result.lulus && (result.link || result.linkKelakuanBaik || result.linkSertifikatTKA) && (
                <div className="flex flex-col gap-3 w-full">
                  {result.link && (
                    <DownloadButton
                      href={result.link}
                      text="Unduh Surat Keterangan Lulus"
                      baseColor="bg-dark-800"
                      hoverColor="hover:bg-dark-700"
                    />
                  )}
                  {result.linkKelakuanBaik && (
                    <DownloadButton
                      href={result.linkKelakuanBaik}
                      text="Unduh Surat Berkelakuan Baik"
                      baseColor="bg-teal-600"
                      hoverColor="hover:bg-teal-500"
                    />
                  )}
                  {result.linkSertifikatTKA && (
                    <DownloadButton
                      href={result.linkSertifikatTKA}
                      text="Unduh Sertifikat TKA"
                      baseColor="bg-sky-600"
                      hoverColor="hover:bg-sky-500"
                    />
                  )}
                </div>
              )}

              <div className="mt-6 p-4 bg-orange-50 text-orange-700 text-sm rounded-xl border border-orange-100/50 flex items-start gap-3 text-left">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Catatan:</strong> Jika terdapat kesalahan penulisan nama atau data lainnya pada dokumen, silakan hubungi admin/TU.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <footer className="w-full text-center text-xs text-gray-500 font-medium py-4 mt-8 z-10 relative">
        Portal Kelulusan MTsN 11 Tasikmalaya @2026 | Developed By : TIM Teknis MTsN 11 Tasikmalaya
      </footer>
    </div>
  );
}
