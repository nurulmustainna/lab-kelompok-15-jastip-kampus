import React, { useState, useEffect } from 'react';
import { ShoppingBag, Clock, ShieldCheck, Cpu, ChevronRight, Menu, X } from 'lucide-react';

interface NavbarProps {
  onSelectSimulatorTab?: (tab: 'catalog' | 'order' | 'tracking') => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTimeWita, setCurrentTimeWita] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    // Update WITA (Makassar UTC+8) clock
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Makassar',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      setCurrentTimeWita(new Intl.DateTimeFormat('id-ID', options).format(now) + ' WITA');
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(interval);
    };
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md border-b border-blue-100' : 'bg-white border-b border-slate-100'
    }`}>
      {/* Top Banner for Unismuh Makassar Campus context */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium">Universitas Muhammadiyah Makassar (Unismuh)</span>
            <span className="hidden sm:inline text-blue-300">|</span>
            <span className="hidden sm:inline text-blue-200">Jastip Kampus: Buka Order, Tawar, Bayar, Lacak</span>
          </div>
          <div className="flex items-center space-x-3 text-blue-200">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-blue-300" />
              <span className="font-mono text-white font-semibold">{currentTimeWita || '12:00:00 WITA'}</span>
            </span>
            <span className="hidden md:inline bg-blue-700/60 px-2 py-0.5 rounded text-[11px] text-blue-100">
              Zona Makassar (WITA)
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          
          {/* Brand Logo */}
          <a href="#" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 blue-gradient rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-bold text-blue-950">Jastip<span className="text-blue-600">Kampus</span></span>
                <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider border border-blue-200">Unismuh</span>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mt-1">Buka Order • Tawar • Bayar • Lacak</span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-4 text-sm font-medium text-slate-600">
            <a 
              href="#studi-kasus" 
              className="px-3 py-1.5 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              Studi Kasus
            </a>
            <a 
              href="#microservices" 
              className="px-3 py-1.5 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1.5"
            >
              <Cpu className="w-4 h-4 text-blue-500" />
              <span>4 Microservices</span>
            </a>
            <a 
              href="#simulator" 
              className="px-3 py-1.5 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Simulasi & Escrow</span>
            </a>
            <a 
              href="#aturan-closing" 
              className="px-3 py-1.5 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              Aturan Closing
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <a 
              href="#simulator"
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5"
            >
              <span>Coba Jastip Sekarang</span>
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-lg">
          <div className="flex flex-col space-y-1">
            <a 
              href="#studi-kasus" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
            >
              Studi Kasus Kampus Unismuh
            </a>
            <a 
              href="#microservices" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center justify-between"
            >
              <span>4 Komponen Microservices</span>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded font-bold">4 Services</span>
            </a>
            <a 
              href="#simulator" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
            >
              Simulasi Alur Titip & Escrow
            </a>
            <a 
              href="#aturan-closing" 
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-600"
            >
              Aturan Penutupan Order (Closing Time)
            </a>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <a 
              href="#simulator"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 px-4 text-sm font-bold text-center text-white bg-blue-600 rounded-lg shadow-sm"
            >
              Buka Demo Interaktif
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
