import React from 'react';
import { ShoppingBag, MapPin, Mail, ShieldCheck, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-emerald-950 text-white pt-16 pb-12 border-t border-emerald-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-emerald-900/60">
          
          {/* Col 1: Brand & Campus Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black text-white tracking-tight">Jastip<span className="text-emerald-300">Kampus</span></span>
                <span className="ml-2 bg-emerald-900 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-700">UNISMUH</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed max-w-md">
              Jastip Kampus — Titip-beli antar mahasiswa: buka order, tawar, bayar, lacak. Menghubungkan mahasiswa Universitas Muhammadiyah Makassar untuk titip makanan, minuman, ATK, print dokumen tugas di sekitaran Jl. Sultan Alauddin & Talasalapang dengan aman & tepat waktu.
            </p>

            <div className="space-y-2 text-xs text-emerald-200/90 pt-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Kampus Unismuh Makassar, Jl. Sultan Alauddin No. 259, Gunung Sari, Kec. Rappocini, Kota Makassar, Sulawesi Selatan 90221</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>jastip@unismuh.ac.id | info@unismuh.ac.id</span>
              </div>
            </div>
          </div>

          {/* Col 2: Layanan & Informasi Kampus */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Layanan Titipan Kampus</h4>
            <ul className="space-y-2 text-xs text-emerald-200/80">
              <li className="hover:text-white transition-colors">• Titip Kuliner & Warung Alauddin</li>
              <li className="hover:text-white transition-colors">• Titip Minuman & Kopi Talasalapang</li>
              <li className="hover:text-white transition-colors">• Print Dokumen & Jilid Makalah/Skripsi</li>
              <li className="hover:text-white transition-colors">• Snack & Kebutuhan Kos Mahasiswa</li>
              <li className="hover:text-white transition-colors">• Perlengkapan & Komponen Kampus</li>
            </ul>
          </div>

          {/* Col 3: Titik Temu Penjemputan */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Titik Temu Penjemputan</h4>
            <ul className="space-y-2 text-xs text-emerald-200/80">
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Lobby Utama Menara Iqra Unismuh</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Gedung Lab Terpadu Teknik & Kedokteran</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Pelataran Masjid Kampus Subulussalam</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Gazebo Rektorat & Gedung Balai Sidang</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-300/80 gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-emerald-100">Sistem Titip Beli Jastip Kampus</span>
            <span className="text-emerald-500">|</span>
            <span>Universitas Muhammadiyah Makassar</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-mono border border-emerald-700">v1.0.4-stable</span>
            <span className="flex items-center gap-1 text-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Escrow Protected</span>
            </span>
            <span className="text-emerald-700">|</span>
            <span className="text-emerald-300">&copy; {new Date().getFullYear()} Jastip Kampus Unismuh</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
