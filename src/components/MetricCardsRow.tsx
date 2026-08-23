import React from 'react';
import { User, Sparkles, ChevronRight } from 'lucide-react';
import { PortalTab } from './PortalNavbar';
import { StudentAccount } from '../types';
import { UserRole } from './MainPortalHeader';

interface MetricCardsRowProps {
  onNavigateTab?: (tab: PortalTab) => void;
  currentStudent?: StudentAccount;
  currentRole?: UserRole;
  onOpenAuthModal?: (view?: 'CHOICE' | 'LOGIN_MAHASISWA' | 'LOGIN_ADMIN' | 'LOGIN_MITRA' | 'REGISTER_MITRA') => void;
}

export const MetricCardsRow: React.FC<MetricCardsRowProps> = ({ 
  onNavigateTab: _onNavigateTab,
  currentStudent,
  currentRole: _currentRole = 'mahasiswa',
  onOpenAuthModal
}) => {
  // Default welcome name per prompt: "Selamat Datang, Andi Muhammad Fikri" (or active student)
  const displayName = currentStudent ? currentStudent.name : 'Andi Muhammad Fikri';
  const displayNIM = currentStudent ? currentStudent.nim : '105841103322';
  const displayProdi = currentStudent ? currentStudent.prodi : 'S1 Teknik Informatika';
  const displayAvatar = currentStudent?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

  return (
    <div className="space-y-4 my-4 animate-fade-in">
      
      {/* 1. Header: Banner Hijau Tua (#004D40 / #005A36) dengan Ucapan "Selamat Datang, Andi Muhammad Fikri" beserta avatar pengguna */}
      <div className="bg-[#004D40] text-white rounded-3xl p-5 sm:p-6 shadow-md border border-[#00382e] relative overflow-hidden">
        {/* Ambient background decoration */}
        <div className="absolute -right-12 -top-12 w-48 h-48 bg-[#005A36]/60 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute right-20 -bottom-10 w-40 h-40 bg-[#E8F5E9]/10 rounded-full blur-xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img 
                src={displayAvatar} 
                alt={displayName}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-[#C8E6C9] shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-[#004D40] rounded-full flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-[#005A36] text-[#C8E6C9] border border-[#C8E6C9]/30 text-[10px] sm:text-xs font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#C8E6C9]" />
                  <span>PORTAL AKADEMIK UNISMUH</span>
                </span>
                <span className="text-[10px] font-mono bg-white/15 text-emerald-100 px-2 py-0.5 rounded-full border border-white/20">
                  NIM: {displayNIM}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Selamat Datang, {displayName}
              </h2>

              <p className="text-xs sm:text-sm text-emerald-100/90 font-medium">
                {displayProdi} • Status: <strong className="text-[#C8E6C9]">Terverifikasi Aktif</strong> • Rekber Escrow Siap
              </p>
            </div>
          </div>

          {/* Quick Profile / Switcher CTA */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => onOpenAuthModal && onOpenAuthModal('CHOICE')}
              className="px-4 py-2.5 bg-[#E8F5E9] hover:bg-[#C8E6C9] text-[#004D40] font-bold text-xs rounded-2xl flex items-center gap-2 transition-all shadow-sm active:scale-95 border border-[#C8E6C9]"
            >
              <User className="w-4 h-4 text-[#004D40]" />
              <span>Ganti / Pilih Akun</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
