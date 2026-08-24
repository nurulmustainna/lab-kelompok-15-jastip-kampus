import React, { useState } from 'react';
import { 
  X, UserCheck, ShieldCheck, KeyRound, LogIn, 
  Sparkles, CheckCircle2, Wallet, GraduationCap, Building, Phone,
  User, Shield, Bike, UserPlus, Lock, ArrowLeft, ArrowRight,
  Upload, FileText, MapPin, CreditCard, AlertCircle, HelpCircle, Check
} from 'lucide-react';
import { StudentAccount } from '../types';
import { MOCK_STUDENT_ACCOUNTS } from '../data/mockData';

export type AuthViewMode = 
  | 'CHOICE' 
  | 'LOGIN_MAHASISWA' 
  | 'LOGIN_ADMIN' 
  | 'LOGIN_MITRA' 
  | 'REGISTER_MITRA' 
  | 'VERIFIED_3' 
  | 'TOP_UP';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStudent: StudentAccount;
  onSelectStudent: (student: StudentAccount) => void;
  onTopUpBalance?: (amount: number) => void;
  initialView?: AuthViewMode;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentStudent,
  onSelectStudent,
  onTopUpBalance,
  initialView = 'CHOICE'
}) => {
  if (!isOpen) return null;

  const [viewMode, setViewMode] = useState<AuthViewMode>(initialView);

  // Mitra Login form state
  const [mitraId, setMitraId] = useState('JST-105841103322');
  const [mitraPassword, setMitraPassword] = useState('••••••••');
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Admin Login form state
  const [adminId, setAdminId] = useState('ADMIN-UNISMUH-01');
  const [adminPassword, setAdminPassword] = useState('••••••••');

  // Mahasiswa SSO Login state
  const [nimInput, setNimInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [prodiInput, setProdiInput] = useState('S1 Teknik Informatika');

  // Stepper Registration State (3 Steps per prompt)
  const [regStep, setRegStep] = useState<1 | 2 | 3>(1);
  const [regFullName, setRegFullName] = useState('Andi Muhammad Fikri');
  const [regNIM, setRegNIM] = useState('105841103322');
  const [regProdi, setRegProdi] = useState('S1 Teknik Informatika');
  const [regPhone, setRegPhone] = useState('0812-3456-7890');
  const [regEmail, setRegEmail] = useState('105841103322@student.unismuh.ac.id');
  const [regDocUploaded, setRegDocUploaded] = useState(true);
  const [regDocName, setRegDocName] = useState('KTM_UNISMUH_105841103322.jpg');
  const [regBank, setRegBank] = useState('Bank Syariah Indonesia (BSI)');
  const [regAccountNumber, setRegAccountNumber] = useState('719888105841');
  const [regOperationalLocation, setRegOperationalLocation] = useState('Menara Iqra & Lab Terpadu');
  const [regSuccess, setRegSuccess] = useState(false);

  // Top Up state
  const [topUpAmount, setTopUpAmount] = useState<number>(50000);
  const [topUpSuccess, setTopUpSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectPredefined = (student: StudentAccount) => {
    onSelectStudent(student);
    onClose();
  };

  const handleMitraLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Log in as Jastiper Andi Muhammad Fikri or matched account
      const mitraAcc = MOCK_STUDENT_ACCOUNTS.find(a => a.role === 'jastiper') || MOCK_STUDENT_ACCOUNTS[1];
      onSelectStudent(mitraAcc);
      onClose();
    }, 500);
  };

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const adminAcc: StudentAccount = {
        id: 'ADMIN-01',
        nim: '198501012015041001',
        name: 'Dr. Wahyudin (Admin Kampus)',
        email: 'admin.jastip@unismuh.ac.id',
        faculty: 'Direktorat Sistem Informasi & Teknologi',
        prodi: 'Pusat Kontrol Unismuh',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
        phone: '0811-4400-9988',
        role: 'admin',
        balance: 5000000,
        verifiedStatus: 'TERVERIFIKASI_KAMPUS',
        totalOrders: 100,
        rating: 5.0,
        joinedYear: '2020'
      };
      onSelectStudent(adminAcc);
      onClose();
    }, 500);
  };

  const handleManualStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nimInput.trim()) {
      alert('Silakan masukkan NIM atau Email Mahasiswa Unismuh.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const customStudent: StudentAccount = {
        id: `MHS-${Date.now().toString().slice(-4)}`,
        nim: nimInput.trim().replace(/\D/g, '') || nimInput.trim(),
        name: nameInput.trim() || `Mahasiswa (${nimInput.trim()})`,
        email: nimInput.includes('@') ? nimInput.trim() : `${nimInput.trim()}@student.unismuh.ac.id`,
        faculty: 'Fakultas Teknik',
        prodi: prodiInput,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        phone: '0812-4455-6677',
        role: 'mahasiswa',
        balance: 100000,
        verifiedStatus: 'TERVERIFIKASI_KAMPUS',
        totalOrders: 1,
        rating: 5.0,
        joinedYear: '2023'
      };

      onSelectStudent(customStudent);
      onClose();
    }, 500);
  };

  const handleRegisterMitraSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setRegSuccess(true);
      setTimeout(() => {
        const newMitra: StudentAccount = {
          id: `MITRA-${Date.now().toString().slice(-4)}`,
          nim: regNIM,
          name: regFullName,
          email: regEmail,
          faculty: 'Fakultas Teknik',
          prodi: regProdi,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          phone: regPhone,
          role: 'jastiper',
          balance: 200000,
          verifiedStatus: 'TERVERIFIKASI_KAMPUS',
          totalOrders: 0,
          rating: 5.0,
          joinedYear: '2024'
        };
        onSelectStudent(newMitra);
        setRegSuccess(false);
        onClose();
      }, 1200);
    }, 600);
  };

  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onTopUpBalance && topUpAmount > 0) {
      onTopUpBalance(topUpAmount);
      setTopUpSuccess(true);
      setTimeout(() => {
        setTopUpSuccess(false);
        onClose();
      }, 1200);
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setResetSuccess(true);
    setTimeout(() => {
      setResetSuccess(false);
      setIsForgotPasswordOpen(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#004D40]/60 backdrop-blur-xs animate-fade-in">
      
      {/* 
        ========================================================================
        MODAL 1: MODAL REGISTRASI MITRA STEPPER (/register)
        Karakteristik: Berlatar Hijau Tua (#004D40) dengan teks putih.
        ========================================================================
      */}
      {viewMode === 'REGISTER_MITRA' ? (
        <div 
          className="bg-[#004D40] text-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#005A36] overflow-hidden animate-scale-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 bg-[#00382e] flex items-center justify-between border-b border-[#005A36]">
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => setViewMode('CHOICE')}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                title="Kembali"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                  <span>Daftar Akun Baru (Mitra Jastip)</span>
                  <span className="text-[10px] font-mono bg-[#E8F5E9] text-[#004D40] px-2 py-0.5 rounded-full font-bold">
                    STEP {regStep}/3
                  </span>
                </h3>
                <p className="text-xs text-emerald-200 font-medium">
                  Bergabung menjadi kurir jastiper resmi mahasiswa Unismuh
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Stepper Indicator (3 Langkah per prompt) */}
          <div className="bg-[#004539] p-3.5 border-b border-[#005A36]">
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
              
              {/* Step 1 */}
              <div 
                onClick={() => setRegStep(1)}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  regStep === 1 
                    ? 'text-white' 
                    : regStep > 1 
                      ? 'text-[#C8E6C9]' 
                      : 'text-emerald-300/60'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                  regStep > 1 
                    ? 'bg-[#E8F5E9] text-[#004D40] font-black' 
                    : regStep === 1 
                      ? 'bg-white text-[#004D40] font-black ring-2 ring-[#C8E6C9]' 
                      : 'bg-white/15 text-white'
                }`}>
                  {regStep > 1 ? <Check className="w-4 h-4" /> : '1'}
                </div>
                <span className="text-[11px] leading-tight flex items-center justify-center gap-1">
                  <span>Data Diri</span>
                  {regStep > 1 && <span className="text-[#C8E6C9] font-mono text-[10px]">[✓ Terverifikasi]</span>}
                </span>
              </div>

              {/* Step 2 */}
              <div 
                onClick={() => setRegStep(2)}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  regStep === 2 
                    ? 'text-white' 
                    : regStep > 2 
                      ? 'text-[#C8E6C9]' 
                      : 'text-emerald-300/60'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                  regStep > 2 
                    ? 'bg-[#E8F5E9] text-[#004D40] font-black' 
                    : regStep === 2 
                      ? 'bg-white text-[#004D40] font-black ring-2 ring-[#C8E6C9]' 
                      : 'bg-white/15 text-white'
                }`}>
                  {regStep > 2 ? <Check className="w-4 h-4" /> : '2'}
                </div>
                <span className="text-[11px] leading-tight">
                  Unggah Dokumen (KTP/KTM)
                </span>
              </div>

              {/* Step 3 */}
              <div 
                onClick={() => setRegStep(3)}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  regStep === 3 
                    ? 'text-white' 
                    : 'text-emerald-300/60'
                }`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                  regStep === 3 
                    ? 'bg-white text-[#004D40] font-black ring-2 ring-[#C8E6C9]' 
                    : 'bg-white/15 text-white'
                }`}>
                  3
                </div>
                <span className="text-[11px] leading-tight">
                  Rekening & Lokasi
                </span>
              </div>

            </div>
          </div>

          {/* Stepper Body */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-grow space-y-4">
            
            {regSuccess ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#E8F5E9] text-[#004D40] mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h4 className="text-xl font-bold text-white">
                  Registrasi Mitra Jastip Berhasil!
                </h4>
                <p className="text-xs text-emerald-200 max-w-sm mx-auto">
                  Akun jastiper Anda telah terverifikasi otomatis dengan sistem SIMAK Unismuh. Mengalihkan ke dashboard...
                </p>
              </div>
            ) : (
              <form onSubmit={handleRegisterMitraSubmit} className="space-y-4">
                
                {/* STEP 1: Data Diri Mahasiswa */}
                {regStep === 1 && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="bg-[#00382e] p-3 rounded-2xl border border-[#005A36] text-xs text-emerald-100 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#C8E6C9] shrink-0" />
                      <span>Data identitas divalidasi langsung dengan Pangkalan Data SIMAK Unismuh.</span>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-emerald-100 mb-1">
                        Nama Lengkap Mahasiswa:
                      </label>
                      <input 
                        type="text"
                        value={regFullName}
                        onChange={(e) => setRegFullName(e.target.value)}
                        className="w-full p-3 bg-white/10 border border-emerald-400/40 rounded-xl text-xs font-medium text-white placeholder-emerald-300/50 focus:ring-2 focus:ring-[#C8E6C9] focus:outline-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-emerald-100 mb-1">
                          NIM Mahasiswa:
                        </label>
                        <input 
                          type="text"
                          value={regNIM}
                          onChange={(e) => setRegNIM(e.target.value)}
                          className="w-full p-3 bg-white/10 border border-emerald-400/40 rounded-xl text-xs font-mono font-bold text-white focus:ring-2 focus:ring-[#C8E6C9] focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-emerald-100 mb-1">
                          Nomor WhatsApp:
                        </label>
                        <input 
                          type="text"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          className="w-full p-3 bg-white/10 border border-emerald-400/40 rounded-xl text-xs font-mono text-white focus:ring-2 focus:ring-[#C8E6C9] focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-emerald-100 mb-1">
                        Program Studi / Fakultas:
                      </label>
                      <select 
                        value={regProdi}
                        onChange={(e) => setRegProdi(e.target.value)}
                        className="w-full p-3 bg-[#00382e] border border-emerald-400/40 rounded-xl text-xs font-medium text-white focus:ring-2 focus:ring-[#C8E6C9] focus:outline-none"
                      >
                        <option value="S1 Teknik Informatika">S1 Teknik Informatika - Fakultas Teknik</option>
                        <option value="S1 Teknik Elektro">S1 Teknik Elektro - Fakultas Teknik</option>
                        <option value="S1 Farmasi">S1 Farmasi - FKIK</option>
                        <option value="S1 Manajemen">S1 Manajemen - FEB</option>
                        <option value="S1 Pendidikan Dokter">S1 Pendidikan Dokter - FKIK</option>
                      </select>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setRegStep(2)}
                        className="px-5 py-2.5 bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#004D40] font-black text-xs rounded-xl flex items-center gap-2 transition-all shadow-md"
                      >
                        <span>Lanjut ke Step 2 (Dokumen)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Unggah Dokumen (KTP/KTM) */}
                {regStep === 2 && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="bg-[#00382e] p-3 rounded-2xl border border-[#005A36] text-xs text-emerald-100">
                      <p>
                        Unggah foto <strong>Kartu Tanda Mahasiswa (KTM)</strong> atau <strong>KTP</strong> untuk verifikasi keamanan rekening bersama (Escrow).
                      </p>
                    </div>

                    <div className="border-2 border-dashed border-emerald-400/50 rounded-2xl p-6 text-center space-y-3 bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                      <div className="w-12 h-12 rounded-2xl bg-[#00382e] text-[#C8E6C9] mx-auto flex items-center justify-center border border-[#005A36]">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-white">
                          Klik untuk Unggah Foto KTM / KTP
                        </p>
                        <p className="text-[11px] text-emerald-200">
                          Format JPG, PNG, atau PDF (Maks. 5 MB)
                        </p>
                      </div>
                      {regDocUploaded && (
                        <div className="inline-flex items-center gap-2 bg-[#E8F5E9] text-[#004D40] px-3 py-1 rounded-full text-xs font-bold font-mono">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{regDocName} (Terverifikasi)</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setRegStep(1)}
                        className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRegStep(3)}
                        className="px-5 py-2.5 bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#004D40] font-black text-xs rounded-xl flex items-center gap-2 transition-all shadow-md"
                      >
                        <span>Lanjut ke Step 3 (Rekening)</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Rekening & Lokasi Operasional */}
                {regStep === 3 && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="bg-[#00382e] p-3 rounded-2xl border border-[#005A36] text-xs text-emerald-100">
                      <p>
                        Rekening bank untuk pencairan otomatis hasil jastip & titik kumpul pengantaran barang di kampus.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-emerald-100 mb-1">
                        Bank Penampung Pencairan:
                      </label>
                      <select 
                        value={regBank}
                        onChange={(e) => setRegBank(e.target.value)}
                        className="w-full p-3 bg-[#00382e] border border-emerald-400/40 rounded-xl text-xs font-medium text-white focus:ring-2 focus:ring-[#C8E6C9] focus:outline-none"
                      >
                        <option value="Bank Syariah Indonesia (BSI)">Bank Syariah Indonesia (BSI) - Mitra Resmi Unismuh</option>
                        <option value="Bank Rakyat Indonesia (BRI)">Bank Rakyat Indonesia (BRI)</option>
                        <option value="Bank Central Asia (BCA)">Bank Central Asia (BCA)</option>
                        <option value="Bank Mandiri">Bank Mandiri</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-emerald-100 mb-1">
                        Nomor Rekening Bank:
                      </label>
                      <input 
                        type="text"
                        value={regAccountNumber}
                        onChange={(e) => setRegAccountNumber(e.target.value)}
                        placeholder="Contoh: 719888105841"
                        className="w-full p-3 bg-white/10 border border-emerald-400/40 rounded-xl text-xs font-mono font-bold text-white focus:ring-2 focus:ring-[#C8E6C9] focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-emerald-100 mb-1">
                        Titik Temu / Area Kumpul Utama:
                      </label>
                      <select 
                        value={regOperationalLocation}
                        onChange={(e) => setRegOperationalLocation(e.target.value)}
                        className="w-full p-3 bg-[#00382e] border border-emerald-400/40 rounded-xl text-xs font-medium text-white focus:ring-2 focus:ring-[#C8E6C9] focus:outline-none"
                      >
                        <option value="Menara Iqra & Lab Terpadu">Lobby Menara Iqra & Lab Terpadu</option>
                        <option value="Gazebo Rektorat">Gazebo Utama Depan Rektorat</option>
                        <option value="Masjid Subulussalam">Pelataran Masjid Subulussalam</option>
                      </select>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setRegStep(2)}
                        className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali</span>
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-3 bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#004D40] font-black text-xs rounded-xl flex items-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <span>Memvalidasi...</span>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Kirim & Verifikasi Akun Mitra</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

              </form>
            )}

          </div>
        </div>

      ) : viewMode === 'LOGIN_MITRA' ? (
        
        /* 
          ========================================================================
          MODAL 2: MODAL FORM LOGIN MITRA JASTIP (/login/mitra)
          Karakteristik: Modal melayang berlatar putih dengan Header Hijau Tua (#004D40)
          ========================================================================
        */
        <div 
          className="bg-white rounded-3xl max-w-md w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#C8E6C9] overflow-hidden animate-scale-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Hijau Tua */}
          <div className="p-5 bg-[#004D40] text-white flex items-center justify-between border-b border-[#00382e]">
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => setViewMode('CHOICE')}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                title="Kembali ke Pilihan Auth"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="w-10 h-10 rounded-2xl bg-[#005A36] border border-[#C8E6C9]/40 flex items-center justify-center text-[#C8E6C9] shadow-sm">
                <Bike className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-white tracking-tight">
                  Login Jastip (Mitra)
                </h3>
                <p className="text-xs text-emerald-200 font-medium">
                  Portal Kurir Mahasiswa & Manajemen Rute
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Body */}
          <div className="p-6 space-y-4">
            
            {isForgotPasswordOpen ? (
              <form onSubmit={handleResetPassword} className="space-y-3.5 animate-fade-in">
                <div className="bg-[#E8F5E9] p-3.5 rounded-2xl border border-[#C8E6C9] text-xs text-[#004D40] flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>
                    Masukkan alamat email kampus (@student.unismuh.ac.id) Anda untuk menerima tautan reset kata sandi akun mitra jastip.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Email Mahasiswa Terdaftar:
                  </label>
                  <input 
                    type="email"
                    placeholder="105841103322@student.unismuh.ac.id"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#004D40] focus:outline-none"
                    required
                  />
                </div>

                {resetSuccess && (
                  <div className="p-3 bg-emerald-100 text-[#004D40] border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Tautan reset kata sandi telah dikirim ke email kampus Anda!</span>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-700"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#004D40] hover:bg-[#00382e] text-white font-bold text-xs rounded-xl shadow-md transition-all"
                  >
                    Kirim Tautan Reset
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleMitraLoginSubmit} className="space-y-4">
                
                {/* Field 1: ID Mitra Jastip (Icon Bike/User) */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
                    <span>ID Mitra Jastip / NIM:</span>
                    <span className="text-[10px] text-slate-400 font-mono">Format: JST-NIM</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Bike className="w-4 h-4 text-[#004D40]" />
                    </div>
                    <input 
                      type="text"
                      value={mitraId}
                      onChange={(e) => setMitraId(e.target.value)}
                      placeholder="Contoh: JST-105841103322 atau 105841103322"
                      className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#004D40] focus:border-[#004D40] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Field 2: Password (Icon Lock) */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Password Akun Mitra:
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4 text-[#004D40]" />
                    </div>
                    <input 
                      type="password"
                      value={mitraPassword}
                      onChange={(e) => setMitraPassword(e.target.value)}
                      placeholder="Masukkan kata sandi akun mitra"
                      className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#004D40] focus:border-[#004D40] focus:outline-none"
                      required
                    />
                  </div>
                </div>

                {/* Quick Info Box */}
                <div className="p-3 bg-[#E8F5E9] rounded-xl border border-[#C8E6C9] text-[11px] text-[#004D40] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-[#004D40]" />
                  <span>Akun Demo Jastiper: <strong>Andi Muhammad Fikri</strong> (NIM 105841103322)</span>
                </div>

                {/* Action Button: Tombol Utama Hijau Tua */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-[#004D40] hover:bg-[#00382e] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95 disabled:opacity-60"
                >
                  {isLoading ? (
                    <span>Memverifikasi Akun Mitra...</span>
                  ) : (
                    <>
                      <Bike className="w-4 h-4 text-[#C8E6C9]" />
                      <span>Login ke Dashboard Mitra Jastip</span>
                    </>
                  )}
                </button>

                {/* Footer Link: Lupa Kata Sandi? */}
                <div className="pt-2 text-center border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(true)}
                    className="text-xs font-semibold text-[#004D40] hover:underline"
                  >
                    Lupa Kata Sandi? Reset Melalui Email
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>

      ) : (

        /* 
          ========================================================================
          MODAL 3: MODAL / POPUP PILIHAN AUTH (/auth) & SSO MAHASISWA
          Karakteristik: Modal melayang berlatar putih dengan sudut rounded-2xl & tombol pill hijau muda
          ========================================================================
        */
        <div 
          className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-emerald-200 overflow-hidden animate-scale-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-5 bg-[#004D40] text-white flex items-center justify-between border-b border-[#00382e]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#005A36] border border-[#C8E6C9]/40 flex items-center justify-center text-white shadow-sm">
                <GraduationCap className="w-5 h-5 text-[#C8E6C9]" />
              </div>
              <div>
                <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                  <span>Silakan Masuk atau Buat Akun</span>
                  <span className="text-[9px] font-mono font-bold bg-[#005A36] text-[#C8E6C9] px-2 py-0.5 rounded border border-[#C8E6C9]/30">
                    SIMAK AUTH
                  </span>
                </h3>
                <p className="text-xs text-emerald-200 font-medium">
                  Portal Autentikasi Sistem Jastip Kampus Unismuh Makassar
                </p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Sub-Navigation Tabs */}
          <div className="grid grid-cols-3 bg-[#E8F5E9] p-2 border-b border-[#C8E6C9] gap-1.5 text-xs font-bold">
            <button
              type="button"
              onClick={() => setViewMode('CHOICE')}
              className={`py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 text-center ${
                viewMode === 'CHOICE'
                  ? 'bg-white text-[#004D40] shadow-sm border border-[#C8E6C9] font-black'
                  : 'text-[#004D40] hover:bg-white/60'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-[#004D40] shrink-0" />
              <span className="truncate">Pilihan Akses</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('VERIFIED_3')}
              className={`py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 text-center ${
                viewMode === 'VERIFIED_3'
                  ? 'bg-white text-[#004D40] shadow-sm border border-[#C8E6C9] font-black'
                  : 'text-[#004D40] hover:bg-white/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#004D40] shrink-0" />
              <span className="truncate">3 Akun Terverifikasi</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('TOP_UP')}
              className={`py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 text-center ${
                viewMode === 'TOP_UP'
                  ? 'bg-white text-[#004D40] shadow-sm border border-[#C8E6C9] font-black'
                  : 'text-[#004D40] hover:bg-white/60'
              }`}
            >
              <Wallet className="w-3.5 h-3.5 text-[#004D40] shrink-0" />
              <span className="truncate">Isi Saldo Dompet</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 overflow-y-auto flex-grow space-y-4">
            
            {/* VIEW A: PILIHAN AUTH (4 Full-Width Pill Buttons berlatar hijau muda per prompt) */}
            {viewMode === 'CHOICE' && (
              <div className="space-y-3.5 animate-fade-in">
                
                <div className="text-center pb-1">
                  <h4 className="text-sm font-black text-[#004D40]">
                    Pilih Jenis Otorisasi Akun
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Silakan pilih peran akun untuk melanjutkan transaksi titip-beli atau manajemen layanan
                  </p>
                </div>

                {/* 4 Opsi Tombol Otorisasi (Full Width Pill Buttons dengan Warna Hijau Muda #E8F5E9 / #C8E6C9) */}
                <div className="space-y-2.5">
                  
                  {/* Button 1: [Icon User] Mahasiswa (Login) */}
                  <button
                    type="button"
                    onClick={() => setViewMode('LOGIN_MAHASISWA')}
                    className="w-full p-3.5 sm:p-4 bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#004D40] border border-[#A5D6A7] rounded-full transition-all flex items-center justify-between group shadow-xs active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-white border border-[#A5D6A7] flex items-center justify-center text-[#004D40] group-hover:scale-105 transition-transform shrink-0 shadow-2xs">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <span className="text-xs sm:text-sm font-black text-[#004D40] block">
                          Mahasiswa (Login)
                        </span>
                        <span className="text-[11px] text-[#004D40]/80 font-medium">
                          Sistem Informasi Akademik SIMAK Mahasiswa
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#004D40] group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>

                  {/* Button 2: [Icon Shield] Admin (Login) */}
                  <button
                    type="button"
                    onClick={() => setViewMode('LOGIN_ADMIN')}
                    className="w-full p-3.5 sm:p-4 bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#004D40] border border-[#A5D6A7] rounded-full transition-all flex items-center justify-between group shadow-xs active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-white border border-[#A5D6A7] flex items-center justify-center text-[#004D40] group-hover:scale-105 transition-transform shrink-0 shadow-2xs">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <span className="text-xs sm:text-sm font-black text-[#004D40] block">
                          Admin (Login)
                        </span>
                        <span className="text-[11px] text-[#004D40]/80 font-medium">
                          Panel Kontrol & Monitoring 4 Microservices
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#004D40] group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>

                  {/* Button 3: [Icon Bicycle/Jastip] Mitra Jastip (Login) */}
                  <button
                    type="button"
                    onClick={() => setViewMode('LOGIN_MITRA')}
                    className="w-full p-3.5 sm:p-4 bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#004D40] border border-[#A5D6A7] rounded-full transition-all flex items-center justify-between group shadow-xs active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-white border border-[#A5D6A7] flex items-center justify-center text-[#004D40] group-hover:scale-105 transition-transform shrink-0 shadow-2xs">
                        <Bike className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <span className="text-xs sm:text-sm font-black text-[#004D40] block">
                          Mitra Jastip (Login)
                        </span>
                        <span className="text-[11px] text-[#004D40]/80 font-medium">
                          Dashboard Kurir Mahasiswa & Buka Sesi Rute
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#004D40] group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>

                  {/* Button 4: [Icon UserPlus] Daftar Baru (Mitra & Mahasiswa) */}
                  <button
                    type="button"
                    onClick={() => setViewMode('REGISTER_MITRA')}
                    className="w-full p-3.5 sm:p-4 bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#004D40] border border-[#A5D6A7] rounded-full transition-all flex items-center justify-between group shadow-xs active:scale-[0.99]"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-white border border-[#A5D6A7] flex items-center justify-center text-[#004D40] group-hover:scale-105 transition-transform shrink-0 shadow-2xs">
                        <UserPlus className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <span className="text-xs sm:text-sm font-black text-[#004D40] block">
                          Daftar Baru (Mitra & Mahasiswa)
                        </span>
                        <span className="text-[11px] text-[#004D40]/80 font-medium">
                          Registrasi Verifikasi Kampus Unismuh 3-Langkah
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#004D40] group-hover:translate-x-1 transition-transform shrink-0" />
                  </button>

                </div>

                <div className="pt-2 text-center">
                  <p className="text-[11px] text-slate-500">
                    Akun terhubung secara terenkripsi dengan Gateway Kampus Unismuh Makassar.
                  </p>
                </div>
              </div>
            )}

            {/* VIEW B: LOGIN MAHASISWA (SSO FORM) */}
            {viewMode === 'LOGIN_MAHASISWA' && (
              <form onSubmit={handleManualStudentLogin} className="space-y-3.5 animate-fade-in">
                <div className="bg-[#E8F5E9] border border-[#C8E6C9] p-3 rounded-2xl text-xs text-[#004D40] flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#004D40] shrink-0" />
                  <p>
                    Masuk menggunakan <strong>NIM & Akun SIMAK Unismuh</strong> resmi Anda.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nomor Induk Mahasiswa (NIM) / Email Kampus:
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: 105841104423 atau 105841104423@student.unismuh.ac.id"
                    value={nimInput}
                    onChange={(e) => setNimInput(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#004D40] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nama Lengkap Mahasiswa:
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Ahmad Fauzan"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#004D40] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Program Studi:
                  </label>
                  <select
                    value={prodiInput}
                    onChange={(e) => setProdiInput(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#004D40] focus:outline-none"
                  >
                    <option value="S1 Teknik Elektro">S1 Teknik Elektro - Fakultas Teknik</option>
                    <option value="S1 Teknik Informatika">S1 Teknik Informatika - Fakultas Teknik</option>
                    <option value="S1 Farmasi">S1 Farmasi - FKIK</option>
                    <option value="S1 Manajemen">S1 Manajemen - FEB</option>
                    <option value="S1 Pendidikan Dokter">S1 Pendidikan Dokter - FKIK</option>
                  </select>
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setViewMode('CHOICE')}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-[#004D40] hover:bg-[#00382e] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    {isLoading ? <span>Memverifikasi SSO...</span> : <span>Login SSO SIMAK</span>}
                  </button>
                </div>
              </form>
            )}

            {/* VIEW C: LOGIN ADMIN */}
            {viewMode === 'LOGIN_ADMIN' && (
              <form onSubmit={handleAdminLoginSubmit} className="space-y-4 animate-fade-in">
                <div className="bg-[#E8F5E9] border border-[#C8E6C9] p-3 rounded-2xl text-xs text-[#004D40] flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#004D40] shrink-0" />
                  <p>
                    Panel Kontrol & Monitoring Admin Layanan Microservices Unismuh.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    ID Administrator Unismuh:
                  </label>
                  <input
                    type="text"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-[#004D40] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Password Administrator:
                  </label>
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#004D40] focus:outline-none"
                    required
                  />
                </div>

                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setViewMode('CHOICE')}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-[#004D40] hover:bg-[#00382e] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    {isLoading ? <span>Memverifikasi Admin...</span> : <span>Login Panel Admin</span>}
                  </button>
                </div>
              </form>
            )}

            {/* VIEW D: 3 AKUN MAHASISWA TERVERIFIKASI KAMPUS */}
            {viewMode === 'VERIFIED_3' && (
              <div className="space-y-3 animate-fade-in">
                <div className="bg-[#E8F5E9] border border-[#C8E6C9] p-3 rounded-2xl flex items-start gap-2.5 text-xs text-[#004D40]">
                  <ShieldCheck className="w-4 h-4 text-[#004D40] shrink-0 mt-0.5" />
                  <p>
                    Tersedia <strong>3 Akun Mahasiswa Terverifikasi Kampus Unismuh</strong>. Klik salah satu akun di bawah untuk langsung beralih profil:
                  </p>
                </div>

                <div className="space-y-2.5">
                  {MOCK_STUDENT_ACCOUNTS.map((acc) => {
                    const isCurrent = acc.nim === currentStudent.nim;
                    return (
                      <div
                        key={acc.id}
                        onClick={() => handleSelectPredefined(acc)}
                        className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isCurrent
                            ? 'border-[#004D40] bg-[#E8F5E9] ring-2 ring-[#004D40] shadow-sm'
                            : 'border-slate-200 bg-white hover:border-[#A5D6A7] hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <img 
                            src={acc.avatar} 
                            alt={acc.name}
                            className="w-12 h-12 rounded-xl object-cover border border-[#C8E6C9] shrink-0" 
                          />
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-bold text-slate-900">
                                {acc.name}
                              </h4>
                              <span className="bg-[#E8F5E9] text-[#004D40] border border-[#C8E6C9] text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md flex items-center gap-1">
                                <CheckCircle2 className="w-2.5 h-2.5 text-[#004D40]" />
                                NIM {acc.nim}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 font-medium">
                              {acc.prodi} • {acc.faculty}
                            </p>
                            <div className="flex items-center gap-2 pt-0.5 text-[11px]">
                              <span className="font-mono font-bold text-[#004D40] bg-emerald-100/70 px-2 py-0.5 rounded border border-emerald-200">
                                Saldo: Rp {acc.balance.toLocaleString('id-ID')}
                              </span>
                              <span className="text-slate-500">
                                Role: <strong className="capitalize text-slate-800">{acc.role}</strong>
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="sm:self-center shrink-0">
                          {isCurrent ? (
                            <span className="w-full sm:w-auto px-3 py-1.5 bg-[#004D40] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 shadow-xs">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Sedang Aktif</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              className="w-full sm:w-auto px-3 py-1.5 bg-white hover:bg-[#004D40] hover:text-white text-[#004D40] border border-[#A5D6A7] rounded-xl text-xs font-bold transition-all shadow-2xs"
                            >
                              Pilih Akun Ini
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* VIEW E: TOP UP SALDO DOMPET JASTIP */}
            {viewMode === 'TOP_UP' && (
              <form onSubmit={handleTopUpSubmit} className="space-y-4 animate-fade-in">
                <div className="bg-[#E8F5E9] border border-[#C8E6C9] p-3.5 rounded-2xl text-xs text-[#004D40]">
                  <p>
                    Top-Up Saldo Dompet Jastip untuk akun <strong>{currentStudent.name} (NIM: {currentStudent.nim})</strong>. Saldo saat ini: <strong>Rp {currentStudent.balance.toLocaleString('id-ID')}</strong>.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-2">
                    Pilih Nominal Top-Up Saldo:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[20000, 50000, 100000, 200000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setTopUpAmount(amt)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-mono font-bold transition-all ${
                          topUpAmount === amt
                            ? 'bg-[#004D40] text-white border-[#004D40] shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-[#004D40]'
                        }`}
                      >
                        Rp {amt.toLocaleString('id-ID')}
                      </button>
                    ))}
                  </div>
                </div>

                {topUpSuccess && (
                  <div className="p-3 bg-[#E8F5E9] text-[#004D40] border border-[#C8E6C9] rounded-xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Top-up Rp {topUpAmount.toLocaleString('id-ID')} berhasil ditambahkan ke saldo dompet!</span>
                  </div>
                )}

                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setViewMode('CHOICE')}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#004D40] hover:bg-[#00382e] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Konfirmasi Top-Up Rp {topUpAmount.toLocaleString('id-ID')}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
