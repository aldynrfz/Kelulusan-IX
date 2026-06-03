import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, FileText, User, Link as LinkIcon, CheckCircle2, Search, Plus, Edit, Trash2, ExternalLink, X, ChevronLeft, ChevronRight, AlertCircle, Upload, Download, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import AdminLayout from '../components/AdminLayout';
import { db } from '../firebase';
import { collection, onSnapshot, query, addDoc, updateDoc, deleteDoc, doc, writeBatch, orderBy, getDocs } from 'firebase/firestore';

const ITEMS_PER_PAGE = 10;

/* =========================================================
   1. KOMPONEN MODAL FORMULIR SISWA (Dioptimalkan)
   Memisahkan state input (formData) agar tidak merender
   ulang seluruh tabel setiap kali pengguna mengetik.
========================================================= */
const StudentFormModal = memo(({ isOpen, onClose, onSubmit, initialData }) => {
  // State form lokal, hanya merender komponen ini saat mengetik
  const [formData, setFormData] = useState(
    initialData || { nisn: '', nama: '', statusLulus: true, tautanDrive: '', tautanKelakuanBaik: '' }
  );
  const [isSaving, setIsSaving] = useState(false);

  // Reset form ketika modal dibuka/ditutup atau data awal berubah
  React.useEffect(() => {
    if (isOpen) {
      setFormData(initialData || { nisn: '', nama: '', statusLulus: true, tautanDrive: '', tautanKelakuanBaik: '' });
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulasi simpan data
    setTimeout(() => {
      setIsSaving(false);
      onSubmit(formData);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
        className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40"
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="w-full max-w-lg pointer-events-auto"
        >
          <div className="glass-card overflow-hidden">
            <div className="px-6 py-4 border-b border-white/40 flex justify-between items-center bg-white/20">
              <h2 className="text-lg font-bold text-gray-900">
                {initialData ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
              </h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">NISN</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.nisn}
                      onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                      className="input-field pl-10 py-2.5"
                      placeholder="Masukkan NISN"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.nama}
                      onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                      className="input-field pl-10 py-2.5"
                      placeholder="Nama Lengkap Siswa"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Status Kelulusan</label>
                  <div className="flex bg-gray-100 p-1.5 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, statusLulus: true })}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${formData.statusLulus ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      LULUS
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, statusLulus: false })}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${!formData.statusLulus ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                      TIDAK LULUS
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tautan Google Drive (Surat)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LinkIcon size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="url"
                      required
                      value={formData.tautanDrive}
                      onChange={(e) => setFormData({ ...formData, tautanDrive: e.target.value })}
                      className="input-field pl-10 py-2.5"
                      placeholder="https://drive.google.com/..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tautan Kelakuan Baik</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LinkIcon size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="url"
                      value={formData.tautanKelakuanBaik || ''}
                      onChange={(e) => setFormData({ ...formData, tautanKelakuanBaik: e.target.value })}
                      className="input-field pl-10 py-2.5"
                      placeholder="https://drive.google.com/..."
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={onClose} className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                    Batal
                  </button>
                  <button type="submit" disabled={isSaving} className="btn-primary flex-1 py-2.5 relative overflow-hidden">
                    {isSaving ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mx-auto" />
                    ) : (
                      <><Save size={18} /><span>Simpan</span></>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
});

/* =========================================================
   2. KOMPONEN MODAL UPLOAD (Dioptimalkan)
========================================================= */
const UploadModal = memo(({ isOpen, onClose, onSubmit, students = [] }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPreview, setUploadPreview] = useState(null);
  const fileInputRef = useRef(null);

  React.useEffect(() => {
    if (isOpen) {
      setUploadedFile(null);
      setUploadPreview(null);
    }
  }, [isOpen]);

  const handleDownloadTemplate = () => {
    let templateData;
    if (students.length > 0) {
      templateData = students.map(s => ({
        NISN: s.nisn,
        'Nama Siswa': s.nama,
        'Status Lulus': s.statusLulus ? 'Ya' : 'Tidak',
        'Tautan Google Drive (SKL)': s.tautanDrive || '',
        'Tautan Kelakuan Baik': s.tautanKelakuanBaik || ''
      }));
    } else {
      templateData = [{ NISN: '0012345678', 'Nama Siswa': 'Contoh Nama', 'Status Lulus': 'Ya', 'Tautan Google Drive (SKL)': 'https://drive.google.com/...', 'Tautan Kelakuan Baik': 'https://drive.google.com/...' }];
    }
    const ws = XLSX.utils.json_to_sheet(templateData);
    ws['!cols'] = [{ wch: 15 }, { wch: 25 }, { wch: 15 }, { wch: 40 }, { wch: 40 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Siswa');
    XLSX.writeFile(wb, 'data_siswa.xlsx');
  };

  const parseExcelFile = useCallback((file) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = evt.target.result;
      const workbook = XLSX.read(data, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const parsed = jsonData.map((row, idx) => ({
        id: Date.now() + idx,
        nisn: String(row['NISN'] || ''),
        nama: String(row['Nama Siswa'] || ''),
        statusLulus: String(row['Status Lulus'] || '').toLowerCase() === 'ya',
        tautanDrive: String(row['Tautan Google Drive (SKL)'] || row['Tautan Google Drive'] || ''),
        tautanKelakuanBaik: String(row['Tautan Kelakuan Baik'] || ''),
      }));
      setUploadPreview(parsed);
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const handleFileSelect = (file) => {
    if (!file) return;
    const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', '.xlsx', '.xls'];
    const isValid = validTypes.includes(file.type) || file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
    if (!isValid) {
      alert('Format file tidak valid. Silakan gunakan file Excel (.xlsx atau .xls).');
      return;
    }
    setUploadedFile(file);
    parseExcelFile(file);
  };

  const handleUploadSubmit = () => {
    if (!uploadPreview || uploadPreview.length === 0) return;
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      onSubmit(uploadPreview);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} onClick={onClose} className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40" />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="w-full max-w-lg pointer-events-auto">
          <div className="glass-card overflow-hidden">
            <div className="px-6 py-4 border-b border-white/40 flex justify-between items-center bg-white/20">
              <h2 className="text-lg font-bold text-gray-900">Upload Data Siswa</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-5">
              {/* Template Download */}
              <div className="flex items-center justify-between bg-blue-50 border border-blue-100 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0"><FileSpreadsheet size={22} /></div>
                  <div><div className="text-sm font-semibold text-blue-900">Template Excel</div><div className="text-xs text-blue-600">Download dan isi sesuai format</div></div>
                </div>
                <button onClick={handleDownloadTemplate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-sm"><Download size={16} />Download</button>
              </div>

              {/* Drag and Drop */}
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileSelect(e.dataTransfer.files[0]); }}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${isDragging ? 'border-primary-400 bg-primary-50 scale-[1.02]' : uploadedFile ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-gray-50/50 hover:border-gray-300 hover:bg-gray-50'}`}
              >
                <input ref={fileInputRef} type="file" accept=".xlsx,.xls" onChange={(e) => handleFileSelect(e.target.files[0])} className="hidden" />
                {uploadedFile ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3"><CheckCircle2 size={28} /></div>
                    <div className="text-sm font-semibold text-green-800">{uploadedFile.name}</div>
                    <div className="text-xs text-green-600 mt-1">{uploadPreview ? `${uploadPreview.length} data siswa terdeteksi` : 'Membaca file...'}</div>
                    <button onClick={(e) => { e.stopPropagation(); setUploadedFile(null); setUploadPreview(null); }} className="text-xs text-gray-400 hover:text-red-500 mt-3 underline">Ganti file</button>
                  </motion.div>
                ) : (
                  <div className="flex flex-col items-center">
                    <motion.div animate={isDragging ? { scale: 1.1, y: -5 } : { scale: 1, y: 0 }} className="w-14 h-14 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-3"><Upload size={28} /></motion.div>
                    <div className="text-sm font-semibold text-gray-700">{isDragging ? 'Lepaskan file di sini' : 'Seret & lepas file Excel di sini'}</div>
                    <div className="text-xs text-gray-400 mt-1">atau klik untuk memilih file</div>
                  </div>
                )}
              </div>

              {/* Data Preview */}
              {uploadPreview && uploadPreview.length > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="rounded-xl border border-gray-100 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500 border-b border-gray-100">Preview Data ({uploadPreview.length} baris)</div>
                  <div className="max-h-36 overflow-y-auto divide-y divide-gray-50">
                    {uploadPreview.slice(0, 5).map((row, idx) => (
                      <div key={idx} className="px-4 py-2 flex justify-between items-center text-sm">
                        <div><span className="font-medium text-gray-900">{row.nama}</span><span className="text-gray-400 ml-2 text-xs">{row.nisn}</span></div>
                        <span className={`text-xs font-semibold ${row.statusLulus ? 'text-green-600' : 'text-red-600'}`}>{row.statusLulus ? 'Lulus' : 'Tidak Lulus'}</span>
                      </div>
                    ))}
                    {uploadPreview.length > 5 && <div className="px-4 py-2 text-xs text-gray-400 text-center">...dan {uploadPreview.length - 5} data lainnya</div>}
                  </div>
                </motion.div>
              )}

              {/* Actions */}
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={onClose} className="flex-1 py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50">Batal</button>
                <button onClick={handleUploadSubmit} disabled={!uploadPreview || uploadPreview.length === 0 || isUploading} className="btn-primary flex-1 py-2.5 disabled:opacity-50 disabled:cursor-not-allowed">
                  {isUploading ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mx-auto" /> : <><Upload size={18} /><span>Import Data</span></>}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
});

/* =========================================================
   3. KOMPONEN MODAL KONFIRMASI HAPUS
========================================================= */
const ConfirmDeleteModal = memo(({ isOpen, onClose, onConfirm, studentName }) => {
  if (!isOpen) return null;
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} onClick={onClose} className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40" />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="w-full max-w-sm pointer-events-auto glass-card overflow-hidden">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus Data</h3>
            <p className="text-sm text-gray-500 mb-6">Apakah Anda yakin ingin menghapus data siswa <span className="font-semibold text-gray-900">{studentName}</span>? Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors">Batal</button>
              <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors">Ya, Hapus</button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
});

/* =========================================================
   4. KOMPONEN MODAL KONFIRMASI HAPUS SEMUA DATA
========================================================= */
const ConfirmDeleteAllModal = memo(({ isOpen, onClose, onConfirm }) => {
  const [verifyText, setVerifyText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setVerifyText('');
      setIsDeleting(false);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    setIsDeleting(true);
    onConfirm();
  };

  if (!isOpen) return null;
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} onClick={!isDeleting ? onClose : undefined} className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-40" />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none">
        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }} className="w-full max-w-sm pointer-events-auto glass-card overflow-hidden">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Hapus SEMUA Data</h3>
            <p className="text-sm text-gray-500 mb-4">Tindakan ini akan menghapus permanen <strong>seluruh data siswa ({verifyText === 'HAPUS SEMUA' ? 'TERVERIFIKASI' : '...'})</strong>. Tindakan ini tidak dapat dibatalkan.</p>

            <div className="text-left mb-6">
              <label className="block text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider text-center">Ketik "HAPUS SEMUA" untuk konfirmasi</label>
              <input
                type="text"
                value={verifyText}
                onChange={(e) => setVerifyText(e.target.value)}
                className="input-field py-2.5 w-full text-center font-bold tracking-widest text-red-600 border-red-200 focus:border-red-500 focus:ring-red-500/20"
                placeholder="HAPUS SEMUA"
                disabled={isDeleting}
              />
            </div>

            <div className="flex gap-3">
              <button onClick={onClose} disabled={isDeleting} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50">Batal</button>
              <button onClick={handleConfirm} disabled={verifyText !== 'HAPUS SEMUA' || isDeleting} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                {isDeleting ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mx-auto" /> : 'Hapus Semua'}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
});

/* =========================================================
   5. KOMPONEN UTAMA (Tabel Data)
========================================================= */
export default function DataSiswa() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "siswa"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const studentData = [];
      snapshot.forEach((doc) => {
        studentData.push({ id: doc.id, ...doc.data() });
      });
      setStudents(studentData);
    });

    return () => unsubscribe();
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Modal states (hanya flag boolean dan edit reference)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Toast
  const [toastMsg, setToastMsg] = useState('');
  const showToastNotification = useCallback((msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  }, []);

  // Filter & Pagination
  const filteredStudents = useMemo(() => {
    return students.filter(
      (s) =>
        s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.nisn.includes(searchQuery)
    );
  }, [students, searchQuery]);

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const currentData = useMemo(() => {
    return filteredStudents.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredStudents, currentPage]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleDeleteClick = useCallback((student) => {
    setStudentToDelete(student);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (studentToDelete) {
      try {
        await deleteDoc(doc(db, "siswa", studentToDelete.id));
        showToastNotification('Data berhasil dihapus');
        setStudentToDelete(null);
      } catch (error) {
        console.error("Error deleting document: ", error);
        showToastNotification('Gagal menghapus data');
      }
    }
  }, [studentToDelete, showToastNotification]);

  const handleDeleteAll = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "siswa"));
      let batch = writeBatch(db);
      let operationCount = 0;

      for (const document of querySnapshot.docs) {
        batch.delete(doc(db, "siswa", document.id));
        operationCount++;
        if (operationCount === 450) {
          await batch.commit();
          batch = writeBatch(db);
          operationCount = 0;
        }
      }

      if (operationCount > 0) {
        await batch.commit();
      }

      showToastNotification('Seluruh data berhasil dihapus');
      setIsDeleteAllModalOpen(false);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error deleting all documents: ", error);
      showToastNotification('Gagal menghapus seluruh data');
    }
  }, [showToastNotification]);

  const handleSaveStudent = useCallback(async (formData) => {
    try {
      // Cek duplikat NISN
      const isDuplicate = students.some(s => s.nisn === formData.nisn && (!editStudent || s.id !== editStudent.id));
      if (isDuplicate) {
        showToastNotification('Gagal: NISN sudah terdaftar');
        return;
      }

      if (editStudent) {
        await updateDoc(doc(db, "siswa", editStudent.id), formData);
        showToastNotification('Data berhasil diperbarui');
      } else {
        const maxOrder = students.length > 0 ? Math.max(...students.map(s => s.order || 0)) : 0;
        await addDoc(collection(db, "siswa"), { ...formData, order: maxOrder + 1 });
        showToastNotification('Data berhasil ditambahkan');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving document: ", error);
      showToastNotification('Gagal menyimpan data');
    }
  }, [editStudent, students, showToastNotification]);

  const handleImportData = useCallback(async (importedData) => {
    try {
      // Hapus duplikat NISN dari data yang diimport
      const uniqueData = [];
      const seenNisn = new Set();
      importedData.forEach((student) => {
        if (!seenNisn.has(student.nisn)) {
          seenNisn.add(student.nisn);
          uniqueData.push(student);
        }
      });

      let batch = writeBatch(db);
      let operationCount = 0;

      // Hapus semua data lama (termasuk yang tidak memiliki field order)
      const querySnapshot = await getDocs(collection(db, "siswa"));
      for (const document of querySnapshot.docs) {
        batch.delete(doc(db, "siswa", document.id));
        operationCount++;
        if (operationCount === 450) {
          await batch.commit();
          batch = writeBatch(db);
          operationCount = 0;
        }
      }

      // Tambahkan data baru dengan order
      for (let i = 0; i < uniqueData.length; i++) {
        const student = uniqueData[i];
        const docRef = doc(collection(db, "siswa"));
        batch.set(docRef, {
          nisn: student.nisn,
          nama: student.nama,
          statusLulus: student.statusLulus,
          tautanDrive: student.tautanDrive,
          tautanKelakuanBaik: student.tautanKelakuanBaik,
          order: i
        });
        operationCount++;
        if (operationCount === 450) {
          await batch.commit();
          batch = writeBatch(db);
          operationCount = 0;
        }
      }

      if (operationCount > 0) {
        await batch.commit();
      }

      showToastNotification(`${uniqueData.length} data siswa berhasil diimport (data lama diganti)`);
      setIsUploadModalOpen(false);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error importing documents: ", error);
      showToastNotification('Gagal mengimport data');
    }
  }, [students, showToastNotification]);

  return (
    <AdminLayout>
      <div className="space-y-6 relative">
        {/* Header & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Data Siswa</h1>
            <p className="text-gray-500 mt-1">Kelola informasi kelulusan siswa MTsN 11 Tasikmalaya</p>
          </div>

          <div className="flex w-full sm:w-auto items-center gap-3">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearch}
                className="input-field pl-10 py-2 w-full text-sm"
                placeholder="Cari nama atau NISN..."
              />
            </div>

            <button
              onClick={() => setIsDeleteAllModalOpen(true)}
              className="py-2 px-4 whitespace-nowrap text-sm rounded-xl border border-red-200 bg-red-50 text-red-600 font-semibold hover:bg-red-100 hover:border-red-300 transition-all flex items-center gap-2 shadow-sm"
              title="Hapus Semua Data"
            >
              <Trash2 size={18} />
              <span className="hidden sm:inline">Hapus Semua</span>
            </button>

            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="py-2 px-4 whitespace-nowrap text-sm rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2 shadow-sm"
            >
              <Upload size={18} />
              <span className="hidden sm:inline">Upload Data</span>
            </button>

            <button
              onClick={() => { setEditStudent(null); setIsModalOpen(true); }}
              className="btn-primary py-2 px-4 whitespace-nowrap text-sm"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Tambah Siswa</span>
            </button>
          </div>
        </div>

        {/* Data Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/20 border-b-2 border-white/40 text-gray-700 text-sm">
                  <th className="px-6 py-4 font-semibold w-16 border-r border-gray-100 text-center">No</th>
                  <th className="px-6 py-4 font-semibold border-r border-gray-100">NISN</th>
                  <th className="px-6 py-4 font-semibold border-r border-gray-100">Nama Siswa</th>
                  <th className="px-6 py-4 font-semibold border-r border-gray-100">Status Kelulusan</th>
                  <th className="px-6 py-4 font-semibold border-r border-gray-100 w-48">Dokumen</th>
                  <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <AnimatePresence mode="wait">
                  {currentData.map((student, index) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="hover:bg-primary-50/60 hover:shadow-[inset_4px_0_0_0_theme(colors.primary.500)] transition-all duration-150 cursor-default"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-700 border-r border-gray-100 text-center">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-700 border-r border-gray-100">{student.nisn}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium border-r border-gray-100">{student.nama}</td>
                      <td className="px-6 py-4 text-sm border-r border-gray-100">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${student.statusLulus ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {student.statusLulus ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                          {student.statusLulus ? 'LULUS' : 'TIDAK LULUS'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm border-r border-gray-100">
                        <div className="flex flex-col gap-1.5">
                          <div className={`flex items-center gap-1.5 text-xs font-medium ${student.tautanDrive ? 'text-green-600' : 'text-gray-400'}`}>
                            {student.tautanDrive ? <CheckCircle2 size={14} /> : <X size={14} />} SKL
                          </div>
                          <div className={`flex items-center gap-1.5 text-xs font-medium ${student.tautanKelakuanBaik ? 'text-green-600' : 'text-gray-400'}`}>
                            {student.tautanKelakuanBaik ? <CheckCircle2 size={14} /> : <X size={14} />} Kelakuan Baik
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <a href={student.tautanDrive} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors" title="Lihat Berkas"><ExternalLink size={16} /></a>
                        <button onClick={() => { setEditStudent(student); setIsModalOpen(true); }} className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors" title="Edit Data"><Edit size={16} /></button>
                        <button onClick={() => handleDeleteClick(student)} className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title="Hapus Data"><Trash2 size={16} /></button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {currentData.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Search size={40} className="text-gray-300 mb-3" />
                        <p>Tidak ada data siswa ditemukan.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="px-4 sm:px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between bg-gray-50/50 gap-4">
              <div className="text-sm text-gray-500 w-full sm:w-auto text-center sm:text-left">
                Menampilkan <span className="font-semibold text-gray-900">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> hingga <span className="font-semibold text-gray-900">{Math.min(currentPage * ITEMS_PER_PAGE, filteredStudents.length)}</span> dari <span className="font-semibold text-gray-900">{filteredStudents.length}</span> data
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="flex items-center gap-1">
                  {(() => {
                    let pages = [];
                    if (totalPages <= 5) {
                      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
                    } else if (currentPage <= 3) {
                      pages = [1, 2, 3, 4, '...', totalPages];
                    } else if (currentPage >= totalPages - 2) {
                      pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
                    } else {
                      pages = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
                    }

                    return pages.map((page, index) => {
                      if (page === '...') {
                        return <span key={`ellipsis-${index}`} className="w-8 h-9 flex items-center justify-center text-gray-400">...</span>;
                      }
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-semibold transition-all ${currentPage === page
                              ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900 shadow-sm'
                            } ${/* Sembunyikan angka tengah di mobile, kecuali halaman 1, terakhir, dan saat ini */ ''}
                             ${page !== 1 && page !== totalPages && page !== currentPage ? 'hidden sm:flex' : 'flex'}
                          `}
                        >
                          {page}
                        </button>
                      );
                    });
                  })()}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modals yang Dipisahkan (Mencegah Re-render Tabel saat Form Berubah) */}
        <AnimatePresence>
          {isModalOpen && (
            <StudentFormModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onSubmit={handleSaveStudent}
              initialData={editStudent}
            />
          )}

          {isUploadModalOpen && (
            <UploadModal
              isOpen={isUploadModalOpen}
              onClose={() => setIsUploadModalOpen(false)}
              onSubmit={handleImportData}
              students={students}
            />
          )}

          {studentToDelete && (
            <ConfirmDeleteModal
              isOpen={!!studentToDelete}
              onClose={() => setStudentToDelete(null)}
              onConfirm={confirmDelete}
              studentName={studentToDelete.nama}
            />
          )}

          {isDeleteAllModalOpen && (
            <ConfirmDeleteAllModal
              isOpen={isDeleteAllModalOpen}
              onClose={() => setIsDeleteAllModalOpen(false)}
              onConfirm={handleDeleteAll}
            />
          )}
        </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="fixed bottom-6 right-6 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50"
            >
              <div className="bg-green-500/20 text-green-400 p-1.5 rounded-full"><CheckCircle2 size={18} /></div>
              <div className="font-medium text-sm">{toastMsg}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
}
