import React from 'react';
import { ArrowRight, ShieldCheck, MapPin, Users, PackageCheck, Zap, Sparkles, Store, Clock } from 'lucide-react';
import { JastipSession } from '../types';

interface HeroSectionProps {
  activeSessions: JastipSession[];
  onOpenOrderModal: (session: JastipSession) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ activeSessions, onOpenOrderModal }) => {
  const primarySession = activeSessions[0];

  return (
    <section className="relative overflow-hidden bg-slate-50 text-slate-900 pt-8 pb-16 lg:pt-10 lg:pb-20 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Hero Sleek Banner Card */}
        <div className="blue-gradient p-6 sm:p-10 lg:p-12 rounded-3xl text-white relative overflow-hidden shadow-xl mb-10">
          
          {/* Subtle Background Watermark Graphic */}
          <div className="absolute right-0 bottom-0 opacity-10 scale-150 rotate-12 pointer-events-none">
            <svg width="300" height="300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 7h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM10 4h4v3h-4V4zM4 9h16v11H4V9z"/>
            </svg>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Column: Headlines & Action */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Campus Tag Pill */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-full text-xs font-semibold text-white">
                <Sparkles className="w-3.5 h-3.5 text-blue-200 animate-pulse" />
                <span>Jastip Kampus — Universitas Muhammadiyah Makassar</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight sm:leading-tight lg:leading-tight">
                Titip-Beli Antar Mahasiswa: Buka Order, Tawar, Bayar, Lacak
              </h1>

              <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-xl">
                Solusi praktis mahasiswa Unismuh yang sedang sibuk praktikum atau kuliah di kampus. Titip makanan, fotocopy berkas, modul praktikum, dan ATK dari warung & toko di sekitaran Unismuh (Jl. Sultan Alauddin, Talasalapang, Minasa Upa) dengan aman dan tepat waktu.
              </p>

              {/* Action Buttons & Quick Stats */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <a
                  href="#simulator"
                  className="bg-white text-blue-900 px-6 py-3 rounded-xl text-sm font-bold shadow-md hover:bg-blue-50 transition-all inline-flex items-center gap-2"
                >
                  <span>Coba Buka Order & Lacak</span>
                  <ArrowRight className="w-4 h-4 text-blue-700" />
                </a>

                <a
                  href="#microservices"
                  className="bg-white/15 hover:bg-white/25 border border-white/30 text-white backdrop-blur px-5 py-3 rounded-xl text-sm font-semibold transition-all inline-flex items-center gap-2"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>4 Microservices Stack</span>
                </a>
              </div>

              {/* Glass Stats Badges */}
              <div className="flex flex-wrap gap-3 pt-3">
                <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-xs font-semibold">
                  Buka Order Cepat
                </div>
                <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-xs font-semibold">
                  Tawar Ongkir Pas
                </div>
                <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-xs font-semibold">
                  Bayar Escrow Aman
                </div>
                <div className="bg-white/20 backdrop-blur px-4 py-2 rounded-full text-xs font-semibold">
                  Lacak Real-Time
                </div>
              </div>

            </div>

            {/* Right Column: Live Session Interactive Preview */}
            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-lg space-y-4">
                
                {/* Session Card Header */}
                <div className="flex items-center justify-between border-b border-white/20 pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                    </span>
                    <div>
                      <h2 className="text-xs font-bold text-white tracking-wider uppercase">Sesi Jastip Aktif</h2>
                      <p className="text-[10px] text-blue-100">Menuju Kampus Unismuh</p>
                    </div>
                  </div>
                  <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    Slot Buka
                  </span>
                </div>

                {primarySession && (
                  <div className="bg-white rounded-xl p-4 text-slate-900 space-y-3.5 shadow-sm">
                    {/* Jastiper Profile */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={primarySession.jastiperAvatar} 
                          alt={primarySession.jastiperName}
                          className="w-10 h-10 rounded-full object-cover border-2 border-blue-600 shadow-sm"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">{primarySession.jastiperName}</h3>
                          <p className="text-xs text-blue-600 font-semibold">{primarySession.jastiperProdi}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-400 block uppercase">Closing Order</span>
                        <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block">
                          {primarySession.closingTime}
                        </span>
                      </div>
                    </div>

                    {/* Route details */}
                    <div className="bg-slate-50 rounded-lg p-2.5 space-y-1.5 border border-slate-200/80 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                        <span className="text-slate-500 text-[11px]">Dari:</span>
                        <span className="font-bold text-slate-800 truncate">{primarySession.routeFrom}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-600"></div>
                        <span className="text-slate-500 text-[11px]">Tujuan:</span>
                        <span className="font-bold text-slate-800 truncate">{primarySession.meetingPoint}</span>
                      </div>
                    </div>

                    {/* Capacity Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-600 flex items-center gap-1">
                          <PackageCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>Kapasitas Muatan</span>
                        </span>
                        <span className="text-blue-700 font-bold">{primarySession.currentCapacityKg} / {primarySession.maxCapacityKg} kg</span>
                      </div>
                      <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-blue-600 h-full rounded-full transition-all"
                          style={{ width: `${(primarySession.currentCapacityKg / primarySession.maxCapacityKg) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Stores */}
                    <div className="flex flex-wrap gap-1">
                      {primarySession.availableStores.slice(0, 3).map((store, idx) => (
                        <span key={idx} className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded border border-blue-100 flex items-center gap-1">
                          <Store className="w-2.5 h-2.5" />
                          {store}
                        </span>
                      ))}
                    </div>

                    {/* Button */}
                    <button
                      onClick={() => onOpenOrderModal(primarySession)}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>Pilih Barang Dari Sesi Ini</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>

        {/* 3 Sleek Trust Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">100% Rekening Bersama</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Dana ditampung di Payment-Service Escrow hingga serah terima di kampus selesai.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Closing Tepat Waktu</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Order dikunci otomatis H-30 menit sebelum keberangkatan agar tidak telat kuliah.
              </p>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Titik Temu Kampus Terjadwal</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                Pengambilan langsung di Lobby Menara Iqra, Gedung Lab Terpadu, atau Gazebo Kampus Unismuh.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
