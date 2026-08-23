import React from 'react';
import { AlertCircle, CheckCircle2, Clock, MapPin, Users, HelpCircle, Layers, ArrowRight } from 'lucide-react';

export const CaseStudySection: React.FC = () => {
  return (
    <section id="studi-kasus" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider">
            Studi Kasus Nyata
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Pengelolaan Alur Jasa Titip Mahasiswa Unismuh Makassar
          </h2>
          <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Menganalisis friksi nyata keseharian mahasiswa di lingkungan Universitas Muhammadiyah Makassar: padatnya jadwal kuliah, praktikum laboratorium, kemacetan di sepanjang Jl. Sultan Alauddin, hingga kebutuhan konsumsi makan siang, print dokumen/skripsi, dan perlengkapan kuliah mendadak.
          </p>
        </div>

        {/* Problem vs Solution Split */}
        <div className="grid lg:grid-cols-2 gap-8 items-stretch mb-14">
          
          {/* Problem Card */}
          <div className="bg-red-50/80 p-6 sm:p-8 rounded-2xl border border-red-200/90 shadow-sm space-y-5 relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-red-500 rounded-full shrink-0"></div>
              <div>
                <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Permasalahan Mahasiswa</span>
                <h3 className="text-lg sm:text-xl font-bold text-red-950">Tantangan Kepadatan Lab & Kebutuhan Mendesak</h3>
              </div>
            </div>

            <p className="text-slate-700 text-sm sm:text-base leading-relaxed italic">
              "Mahasiswa FT sering terjebak jadwal praktikum panjang di laboratorium atau asistensi di studio hingga sore hari, sehingga sangat sulit keluar kampus melewati kemacetan Jl. Sultan Alauddin hanya untuk membeli makan atau perlengkapan."
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-red-200 text-red-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                <span><strong>Praktikum Berkelanjutan:</strong> Sedang asistensi tugas besar di Studio Arsitektur atau praktikum di Lab Jaringan/Elektronika sehingga tidak dapat meninggalkan ruangan.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-red-200 text-red-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                <span><strong>Kebutuhan Spesifik:</strong> Membutuhkan kertas kalkir cetak A1/A2, resistor/modul sensor dari toko komponen, atau makan siang favorit dari luar yang tidak tersedia di kantin fakultas.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-red-200 text-red-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                <span><strong>Kendala Jastip Manual:</strong> Menitip via WhatsApp sering terkendala uang kembalian tidak pas, jastiper lupa pesanan, overload bawaan motor, atau jastiper terlambat masuk kelas.</span>
              </li>
            </ul>
          </div>

          {/* Solution Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-2 h-8 bg-blue-600 rounded-full shrink-0"></div>
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Solusi Terstruktur</span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900">Sistem Jastip Kampus Berbasis Microservices</h3>
              </div>
            </div>

            <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
              Platform peer-to-peer terotomatisasi yang memberdayakan mahasiswa yang memiliki fleksibilitas waktu (Jastiper) untuk membantu rekan di kampus dengan sistem terstandar:
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</span>
                <span><strong>Kapasitas Terukur:</strong> Order-Service menghitung kuota berat bawaan agar motor/tas jastiper tidak overload dan aman saat berkendara.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</span>
                <span><strong>Penutupan Order Otomatis (Closing Time):</strong> Tepat 30 menit sebelum keberangkatan, pesanan dikunci sehingga jastiper punya waktu belanja tanpa telat.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">3</span>
                <span><strong>Rekening Bersama (Escrow):</strong> Payment-Service menjamin keamanan dana—jastiper tidak perlu nombok uang pribadi, pemesan terhindar dari penipuan.</span>
              </li>
            </ul>
          </div>

        </div>

        {/* 4-Step Operational Flowchart Card */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
            <div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest block">Alur Utama Sistem Jastip Kampus</span>
              <h3 className="text-xl sm:text-2xl font-bold text-white">4 Pilar Alur: Buka Order &bull; Tawar &bull; Bayar &bull; Lacak</h3>
            </div>
            <span className="bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs px-3 py-1 rounded-full font-medium w-fit">
              Terintegrasi 4 Microservices
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            
            {/* Step 1 */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 space-y-3 relative group hover:border-blue-500 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-blue-400 font-mono">01</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-900/80 text-blue-300 px-2 py-0.5 rounded">Buka Order</span>
              </div>
              <h4 className="font-bold text-white text-base">Buka Sesi Titipan</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Jastiper membuka rute (contoh: <em>Dari Sentra Kuliner Jl. Sultan Alauddin ke Kampus Unismuh</em>), menetapkan batas berat (maks 5 kg) dan jadwal jalan (12:00 WITA).
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 space-y-3 relative group hover:border-blue-500 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-emerald-400 font-mono">02</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-900/80 text-emerald-300 px-2 py-0.5 rounded">Tawar / Pilih Item</span>
              </div>
              <h4 className="font-bold text-white text-base">Pilih & Tawar Jastip</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Mahasiswa pemesan di kampus memilih makanan/ATK/print dari toko sekitar Unismuh dan menyepakati tarif jastip yang transparan serta adil.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 space-y-3 relative group hover:border-blue-500 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-amber-400 font-mono">03</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-900/80 text-amber-300 px-2 py-0.5 rounded">Bayar (Escrow)</span>
              </div>
              <h4 className="font-bold text-white text-base">Bayar Aman & Closing</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Dana ditampung aman di Payment-Service Rekening Bersama. Tepat 30 menit sebelum jadwal berangkat (11:30 WITA), order dikunci otomatis.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 space-y-3 relative group hover:border-blue-500 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-indigo-400 font-mono">04</span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-900/80 text-indigo-300 px-2 py-0.5 rounded">Lacak Status</span>
              </div>
              <h4 className="font-bold text-white text-base">Lacak & Serah Terima</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Tracking-Service memantau posisi jastiper real-time. Barang diserahterimakan di titik temu kampus (Menara Iqra / Lab Terpadu) dengan verifikasi QR.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
