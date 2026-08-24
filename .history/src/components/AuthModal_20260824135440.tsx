import React, { useState } from 'react';
import { 
  X, LogIn, Sparkles, CheckCircle2, Wallet, GraduationCap, Building, Phone,
  User, Shield, Bike, UserPlus, Lock, ArrowLeft, ArrowRight,
  Upload, FileText, MapPin, AlertCircle, Eye, EyeOff, Check
} from 'lucide-react';
import { StudentAccount } from '../types';
import { MOCK_STUDENT_ACCOUNTS } from '../data/mockData';

export type AuthViewMode = 
  | 'LOGIN_FORM'
  | 'REGISTER'
  | 'TOP_UP';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStudent: StudentAccount;
  onSelectStudent: (student: StudentAccount) => void;
  onTopUpBalance?: (amount: number) => void;
  initialView?: AuthViewMode;
  studentAccounts?: StudentAccount[];
  onAddStudent?: (student: StudentAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentStudent,
  onSelectStudent,
  onTopUpBalance,
  initialView = 'LOGIN_FORM',
  studentAccounts = [],
  onAddStudent
}) => {
  if (!isOpen) return null;

  console.log('=== AuthModal MOUNTED/UPDATED ===');
  console.log('studentAccounts prop received, count:', studentAccounts.length);
  if (studentAccounts.length > 0) {
    console.log('First 3 accounts emails:', studentAccounts.slice(0, 3).map(a => a.email));
  }
  console.log('onAddStudent callback:', onAddStudent ? 'YES' : 'NO');

  const [viewMode, setViewMode] = useState<AuthViewMode>(
    initialView === 'REGISTER' || initialView === 'TOP_UP' ? initialView : 'LOGIN_FORM'
  );

  // Single Unified Login Form State
  const [emailOrNim, setEmailOrNim] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Registration Form State
  const [regFullName, setRegFullName] = useState('');
  const [regNIM, setRegNIM] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regProdi, setRegProdi] = useState('S1 Teknik Informatika');
  const [regFaculty, setRegFaculty] = useState('Fakultas Teknik');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<'mahasiswa' | 'jastiper'>('mahasiswa');
  const [regSuccess, setRegSuccess] = useState(false);

  // Top Up state
  const [topUpAmount, setTopUpAmount] = useState<number>(50000);
  const [topUpSuccess, setTopUpSuccess] = useState(false);

  // Quick Preset Helper for User Convenience
  const handleFillPreset = (emailVal: string, passVal: string) => {
    setEmailOrNim(emailVal);
    setPassword(passVal);
    setErrorMessage(null);
  };

  // Unified Single Login Handler for all 3 Roles:
  // 1. Admin: kelompok15@gmail.com / kelompok15
  // 2. Jasa Titip (Mitra): jasatitip@gmail.com / jasatitip
  // 3. Mahasiswa: Email / NIM Unismuh (or pre-registered / custom)
  // 
  // VALIDATION REQUIRED FOR ALL ROLES:
  // - Identity must be found or valid NIM format
  // - Password must match exactly
  // - No login without both checks passing
  const handleUnifiedLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanInput = emailOrNim.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanInput) {
      setErrorMessage('Silakan masukkan Email atau NIM Anda.');
      return;
    }
    if (!cleanPass) {
      setErrorMessage('Silakan masukkan password akun Anda.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      // 1. KHUSUS ADMIN (kelompok15@gmail.com / kelompok15)
      if (cleanInput === 'kelompok15@gmail.com' || cleanInput === 'kelompok15' || cleanInput === 'admin') {
        if (cleanPass !== 'kelompok15') {
          setErrorMessage('Password Admin salah! Gunakan password: kelompok15');
          return;
        }

        const adminAcc: StudentAccount = {
          id: 'ADMIN-KELOMPOK15',
          nim: '198501012015041001',
          name: 'Kelompok 15 (Super Admin SRE)',
          email: 'kelompok15@gmail.com',
          password: 'kelompok15',
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

        setSuccessMessage('Login Admin Kelompok 15 Berhasil! Mengalihkan...');
        setTimeout(() => {
          onSelectStudent(adminAcc);
          onClose();
        }, 500);
        return;
      }

      // 2. KHUSUS JASA TITIP / MITRA (jasatitip@gmail.com / jasatitip)
      if (cleanInput === 'jasatitip@gmail.com' || cleanInput === 'jasatitip' || cleanInput === 'jastiper') {
        if (cleanPass !== 'jasatitip') {
          setErrorMessage('Password Jasa Titip salah! Gunakan password: jasatitip');
          return;
        }

        const jastiperAcc: StudentAccount = {
          id: 'JST-MITRA-01',
          nim: '105841103322',
          name: 'Andi Muhammad Fikri (Mitra Jastip)',
          email: 'jasatitip@gmail.com',
          password: 'jasatitip',
          faculty: 'Fakultas Teknik',
          prodi: 'S1 Teknik Informatika',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          phone: '0852-4411-3322',
          role: 'jastiper',
          balance: 350000,
          verifiedStatus: 'TERVERIFIKASI_KAMPUS',
          totalOrders: 42,
          rating: 4.9,
          joinedYear: '2023'
        };

        setSuccessMessage('Login Mitra Jasa Titip Berhasil! Mengalihkan...');
        setTimeout(() => {
          onSelectStudent(jastiperAcc);
          onClose();
        }, 500);
        return;
      }

      // 3. MAHASISWA & PENGGUNA TERDAFTAR
      // Cari user dengan tiga cara: email, NIM full, atau NIM tanpa format
      let foundMock: StudentAccount | undefined;
      
      // DEBUG: Log login input
      console.log('=== LOGIN DEBUG (Mahasiswa) ===');
      console.log('Login input (identifier):', cleanInput);
      console.log('Searching in studentAccounts source');
      console.log('Total accounts in studentAccounts:', studentAccounts.length);
      
      // Cara 1: Cek email (case-insensitive)
      foundMock = studentAccounts.find(acc => 
        acc.email.toLowerCase() === cleanInput
      );
      if (foundMock) console.log('MATCH: Found by email');
      
      // Cara 2: Jika belum ketemu, cek NIM (case-insensitive)
      if (!foundMock) {
        foundMock = studentAccounts.find(acc => 
          acc.nim.toLowerCase() === cleanInput
        );
        if (foundMock) console.log('MATCH: Found by NIM');
      }
      
      // Cara 3: Jika belum ketemu, cek NIM tanpa digit (filter non-digits dari input)
      if (!foundMock) {
        const inputDigitsOnly = cleanInput.replace(/\D/g, '');
        if (inputDigitsOnly.length > 0) {
          foundMock = studentAccounts.find(acc => 
            acc.nim === inputDigitsOnly
          );
          if (foundMock) console.log('MATCH: Found by NIM digits-only');
        }
      }

      console.log('User found:', foundMock ? 'YES' : 'NO');

      // Jika user ditemukan, validasi password
      if (foundMock) {
        // VALIDASI PASSWORD: HARUS COCOK SEBELUM LOGIN
        if (foundMock.password !== cleanPass) {
          setErrorMessage(`Password salah! Silakan periksa kembali.`);
          return;
        }
        
        setSuccessMessage(`Login Berhasil! Selamat datang, ${foundMock.name}.`);
        setTimeout(() => {
          onSelectStudent(foundMock);
          onClose();
        }, 500);
        return;
      }

      // Jika user tidak ditemukan
      console.log('NO MATCH: Account not found. Available accounts email:', studentAccounts.map(a => a.email));
      setErrorMessage('Akun tidak ditemukan. Silakan daftar terlebih dahulu.');

    }, 450);
  };

  // Registration Form Submission Handler
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setErrorMessage('Harap lengkapi semua kolom pendaftaran.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const cleanEmail = regEmail.trim().toLowerCase();
      const cleanNim = regNIM.trim() || '1058411' + Math.floor(10000 + Math.random() * 90000);
      
      // CHECK FOR DUPLICATE ACCOUNT
      const emailExists = studentAccounts.some(acc => acc.email.toLowerCase() === cleanEmail);
      const nimExists = studentAccounts.some(acc => acc.nim === cleanNim);
      
      if (emailExists) {
        setErrorMessage('Email sudah terdaftar. Gunakan email lain atau login dengan akun Anda.');
        return;
      }
      
      if (nimExists) {
        setErrorMessage('NIM sudah terdaftar. Gunakan NIM lain atau login dengan akun Anda.');
        return;
      }
      
      const newAccount: StudentAccount = {
        id: regRole === 'jastiper' ? `JST-${Date.now().toString().slice(-4)}` : `MHS-${Date.now().toString().slice(-4)}`,
        nim: cleanNim,
        name: regFullName.trim(),
        email: cleanEmail,
        password: regPassword.trim(),
        faculty: regFaculty,
        prodi: regProdi,
        avatar: regRole === 'jastiper' 
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        phone: regPhone.trim() || '0812-3456-7890',
        role: regRole,
        balance: regRole === 'jastiper' ? 250000 : 100000,
        verifiedStatus: 'TERVERIFIKASI_KAMPUS',
        totalOrders: 0,
        rating: 5.0,
        joinedYear: '2024'
      };

      // DEBUG: Log registration
      console.log('=== REGISTER DEBUG ===');
      console.log('User identifier (email):', cleanEmail);
      console.log('User identifier (nim):', cleanNim);
      console.log('Storage method: localStorage + state callback');
      console.log('Total accounts to save:', studentAccounts.length + 1);

      // SAVE TO STATE AND LOCALSTORAGE
      if (onAddStudent) {
        onAddStudent(newAccount);
        console.log('onAddStudent callback called');
      }
      
      // Also persist to localStorage
      try {
        const allAccounts = [...studentAccounts, newAccount];
        localStorage.setItem('jastip_users', JSON.stringify(allAccounts));
        console.log('Saved to localStorage key: jastip_users');
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }

      setRegSuccess(true);
      setTimeout(() => {
        onSelectStudent(newAccount);
        setRegSuccess(false);
        onClose();
      }, 800);
    }, 500);
  };

  // Top Up Submission Handler
  const handleTopUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onTopUpBalance && topUpAmount > 0) {
      onTopUpBalance(topUpAmount);
      setTopUpSuccess(true);
      setTimeout(() => {
        setTopUpSuccess(false);
        onClose();
      }, 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      
      <div 
        className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-emerald-200 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bersih & Elegan */}
        <div className="p-5 bg-[#004D40] text-white flex items-center justify-between border-b border-[#00382e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#005A36] border border-[#C8E6C9]/40 flex items-center justify-center text-white shadow-sm">
              <GraduationCap className="w-5 h-5 text-[#C8E6C9]" />
            </div>
            <div>
              <h3 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                <span>{viewMode === 'REGISTER' ? 'Daftar Pengguna Baru' : viewMode === 'TOP_UP' ? 'Isi Saldo Dompet' : 'Masuk ke Sistem Jastip'}</span>
                <span className="text-[9px] font-mono font-bold bg-[#005A36] text-[#C8E6C9] px-2 py-0.5 rounded border border-[#C8E6C9]/30">
                  UNISMUH
                </span>
              </h3>
              <p className="text-xs text-emerald-200 font-medium">
                {viewMode === 'REGISTER' 
                  ? 'Registrasi akun mahasiswa & mitra kurir kampus'
                  : viewMode === 'TOP_UP'
                  ? 'Top-up saldo dompet titip beli'
                  : 'Satu pintu login untuk Mahasiswa, Mitra Jastip & Admin'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            type="button"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigasi Header: Masuk / Daftar / Isi Saldo */}
        <div className="grid grid-cols-3 bg-[#E8F5E9] p-1.5 border-b border-[#C8E6C9] gap-1.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setViewMode('LOGIN_FORM');
              setErrorMessage(null);
            }}
            className={`py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 text-center cursor-pointer ${
              viewMode === 'LOGIN_FORM'
                ? 'bg-white text-[#004D40] shadow-sm border border-[#C8E6C9] font-black'
                : 'text-[#004D40] hover:bg-white/60'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Masuk (Login)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode('REGISTER');
              setErrorMessage(null);
            }}
            className={`py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 text-center cursor-pointer ${
              viewMode === 'REGISTER'
                ? 'bg-white text-[#004D40] shadow-sm border border-[#C8E6C9] font-black'
                : 'text-[#004D40] hover:bg-white/60'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Daftar Akun</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode('TOP_UP');
              setErrorMessage(null);
            }}
            className={`py-2 px-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 text-center cursor-pointer ${
              viewMode === 'TOP_UP'
                ? 'bg-white text-[#004D40] shadow-sm border border-[#C8E6C9] font-black'
                : 'text-[#004D40] hover:bg-white/60'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Isi Saldo</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-grow space-y-4">
          
          {/* ========================================================= */}
          {/* VIEW 1: TAMPILAN LOGIN TUNGGAL (1 FORM UNTUK KETIGANYA)    */}
          {/* ========================================================= */}
          {viewMode === 'LOGIN_FORM' && (
            <div className="space-y-4">
              
              {/* Alert Pesan Error / Sukses */}
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Form Input Email & Password Biasa */}
              <form onSubmit={handleUnifiedLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1.5">
                    Email / NIM / Username:
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: kelompok15@gmail.com / jasatitip@gmail.com / 105841104423"
                    value={emailOrNim}
                    onChange={(e) => setEmailOrNim(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#004D40] focus:border-transparent focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-800">
                      Password:
                    </label>
                    <span className="text-[10px] text-slate-400">
                      Ketik password akun Anda
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Masukkan password Anda"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#004D40] focus:border-transparent focus:outline-hidden"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                      title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-[#004D40] hover:bg-[#00382e] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-98 disabled:opacity-60 cursor-pointer"
                >
                  {isLoading ? (
                    <span>Memverifikasi Akun...</span>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 text-[#C8E6C9]" />
                      <span>Masuk Sekarang</span>
                    </>
                  )}
                </button>
              </form>

            </div>
          )}

          {/* ========================================================= */}
          {/* VIEW 2: TAMPILAN PENDAFTARAN PENGGUNA BARU (DAFTAR)        */}
          {/* ========================================================= */}
          {viewMode === 'REGISTER' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 animate-in fade-in">
              <div className="bg-[#E8F5E9] border border-[#C8E6C9] p-3 rounded-2xl text-xs text-[#004D40] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#004D40] shrink-0" />
                <p>
                  Form pendaftaran akun resmi mahasiswa & kurir mitra jastip Unismuh.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {regSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Pendaftaran Berhasil! Akun Anda siap digunakan.</span>
                </div>
              )}

              {/* Pilihan Peran Akun */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  Daftar Sebagai:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegRole('mahasiswa')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      regRole === 'mahasiswa'
                        ? 'bg-[#004D40] text-white border-[#004D40] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Mahasiswa (Pemesan)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRegRole('jastiper')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      regRole === 'jastiper'
                        ? 'bg-[#004D40] text-white border-[#004D40] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Bike className="w-3.5 h-3.5" />
                    <span>Mitra Jastip (Kurir)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Nama Lengkap:
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Muhammad Rezky"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#004D40] focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    NIM Mahasiswa:
                  </label>
                  <input
                    type="text"
                    placeholder="10584110xxxx"
                    value={regNIM}
                    onChange={(e) => setRegNIM(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#004D40] focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Nomor WhatsApp / HP:
                  </label>
                  <input
                    type="tel"
                    placeholder="0812-xxxx-xxxx"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#004D40] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Email Pengguna:
                  </label>
                  <input
                    type="email"
                    placeholder="nama@student.unismuh.ac.id"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#004D40] focus:outline-hidden"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Kata Sandi (Password):
                  </label>
                  <input
                    type="password"
                    placeholder="Minimal 6 karakter"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#004D40] focus:outline-hidden"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Program Studi:
                </label>
                <select
                  value={regProdi}
                  onChange={(e) => setRegProdi(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-[#004D40] focus:outline-hidden"
                >
                  <option value="S1 Teknik Informatika">S1 Teknik Informatika - Fakultas Teknik</option>
                  <option value="S1 Teknik Elektro">S1 Teknik Elektro - Fakultas Teknik</option>
                  <option value="S1 Farmasi">S1 Farmasi - FKIK</option>
                  <option value="S1 Manajemen">S1 Manajemen - FEB</option>
                  <option value="S1 Pendidikan Dokter">S1 Pendidikan Dokter - FKIK</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setViewMode('LOGIN_FORM')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Sudah Punya Akun? Masuk
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-[#004D40] hover:bg-[#00382e] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? <span>Mendaftarkan...</span> : <span>Daftar Sekarang</span>}
                </button>
              </div>
            </form>
          )}

          {/* ========================================================= */}
          {/* VIEW 3: TAMPILAN TOP UP SALDO DOMPET JASTIP                */}
          {/* ========================================================= */}
          {viewMode === 'TOP_UP' && (
            <form onSubmit={handleTopUpSubmit} className="space-y-4 animate-in fade-in">
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
                      className={`py-2.5 px-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                        topUpAmount === amt
                          ? 'bg-[#004D40] text-white border-[#004D40] shadow-xs'
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
                  onClick={() => setViewMode('LOGIN_FORM')}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#004D40] hover:bg-[#00382e] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Konfirmasi Top-Up Rp {topUpAmount.toLocaleString('id-ID')}</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>

    </div>
  );
};
