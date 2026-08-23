import React from 'react';
import { ShoppingBag, Sparkles, LogOut, CheckCircle2, UserCheck, Wallet, ChevronDown } from 'lucide-react';
import { StudentAccount } from '../types';

export type UserRole = 'mahasiswa' | 'jastiper' | 'admin';

interface MainPortalHeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeOrderCount: number;
  currentStudent: StudentAccount;
  onOpenAuthModal: () => void;
  onLogout?: () => void;
}

export const MainPortalHeader: React.FC<MainPortalHeaderProps> = ({
  currentRole,
  onRoleChange,
  activeOrderCount: _activeOrderCount,
  currentStudent,
  onOpenAuthModal,
  onLogout
}) => {
  return (
    <header className="bg-white text-slate-800 border-b border-emerald-200 shadow-sm sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Left: App Identity & Version */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-11 h-11 rounded-2xl bg-emerald-600 border border-emerald-500 flex items-center justify-center shadow-md shadow-emerald-600/20 shrink-0">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-black text-emerald-900 tracking-tight">
                Sistem Jastip Kampus
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                UNISMUH
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 font-medium">
              Titip-Beli Antar Mahasiswa: Buka Order, Tawar, Bayar, Lacak • Unismuh Makassar
            </p>
          </div>
        </div>

        {/* Right: Demo Role Switcher & Student Account Button & Keluar Button */}
        <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-2.5 w-full md:w-auto">
          
          {/* Demo Role Switcher */}
          <div className="flex items-center bg-emerald-50/90 p-1 rounded-xl border border-emerald-200 text-xs">
            <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider px-2 hidden sm:flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Role:</span>
            </span>
            
            <button
              type="button"
              onClick={() => onRoleChange('mahasiswa')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                currentRole === 'mahasiswa'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100'
              }`}
            >
              Mahasiswa
            </button>

            <button
              type="button"
              onClick={() => onRoleChange('jastiper')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                currentRole === 'jastiper'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100'
              }`}
            >
              Jastiper
            </button>

            <button
              type="button"
              onClick={() => onRoleChange('admin')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                currentRole === 'admin'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-emerald-800 hover:text-emerald-950 hover:bg-emerald-100'
              }`}
            >
              Admin
            </button>
          </div>

          {/* Student Profile & Auth Switcher Button */}
          <button
            type="button"
            onClick={onOpenAuthModal}
            className="flex items-center gap-2 bg-white hover:bg-emerald-50/80 border border-emerald-300 hover:border-emerald-500 px-2.5 sm:px-3 py-1.5 rounded-2xl shadow-xs transition-all text-left group"
            title="Klik untuk ganti akun mahasiswa (3 akun terverifikasi) atau login SSO"
          >
            <div className="relative">
              <img 
                src={currentStudent.avatar} 
                alt={currentStudent.name}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover border border-emerald-300" 
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-600 border-2 border-white rounded-full"></span>
            </div>

            <div className="text-left hidden xs:block">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-emerald-950 leading-tight">
                  {currentRole === 'admin' ? 'Dr. Wahyudin (Admin)' : currentStudent.name}
                </span>
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {currentStudent.nim}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-700 font-medium">
                <Wallet className="w-3 h-3 text-emerald-600" />
                <span className="font-mono font-bold text-emerald-850">
                  Rp {currentStudent.balance.toLocaleString('id-ID')}
                </span>
                <span className="text-emerald-400">•</span>
                <span className="text-emerald-600 font-semibold group-hover:underline flex items-center gap-0.5">
                  Ganti Akun <ChevronDown className="w-3 h-3" />
                </span>
              </div>
            </div>

            <div className="p-1 rounded-lg bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <UserCheck className="w-4 h-4" />
            </div>
          </button>

          {/* Tombol Keluar (Logout) untuk Mahasiswa, Jastiper, Admin */}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 hover:border-rose-300 rounded-2xl font-bold text-xs shadow-xs transition-all active:scale-95 group"
              title="Keluar dari sesi ini dan kembali ke Halaman Depan"
            >
              <LogOut className="w-4 h-4 text-rose-600 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
