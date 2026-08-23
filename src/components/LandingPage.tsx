import React, { useState } from 'react';
import { 
  ShoppingBag, LogIn, UserPlus, ArrowRight, CheckCircle2, ShieldCheck, 
  Clock, Zap, Sparkles, ChevronRight, HelpCircle, ChevronDown, 
  MapPin, Phone, Star, Layers, Shield, HeartHandshake, Eye, ExternalLink
} from 'lucide-react';
import { AuthViewMode } from './AuthModal';

interface LandingPageProps {
  onOpenAuthModal: (view?: AuthViewMode) => void;
  onEnterDashboard: () => void;
  onSelectCatalogItem?: (itemName: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenAuthModal,
  onEnterDashboard,
  onSelectCatalogItem
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  // 4 Popular Catalog Items specified in prompt
  const popularCatalog = [
    {
      id: 'snack-unismuh',
      title: 'Snacks Unismuh',
      category: 'Makanan & Camilan',
      price: 25000,
      image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=500&auto=format&fit=crop&q=80',
      description: 'Aneka cemilan renyah, kue basah & snack kantin kampus khas mahasiswa Unismuh.',
      rating: 4.9,
      sold: '850+ terjual',
      tag: 'Favorit Break'
    },
    {
      id: 'kosmetik-kampus',
      title: 'Kosmetik Kampus',
      category: 'Skincare & Beauty',
      price: 75000,
      image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&auto=format&fit=crop&q=80',
      description: 'Sunscreen, lip balm, dan paket skincare harian anti kusam untuk aktivitas kuliah outdoor.',
      rating: 4.8,
      sold: '430+ terjual',
      tag: 'Best Seller'
    },
    {
      id: 'atk-mahasiswa',
      title: 'Alat Tulis Mahasiswa',
      category: 'ATK & Kuliah',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&auto=format&fit=crop&q=80',
      description: 'Paket pulpen gel, buku catatan spiral, binder, kalkulator & perlengkapan praktikum.',
      rating: 4.9,
      sold: '1.2k+ terjual',
      tag: 'Wajib Kuliah'
    },
    {
      id: 'merchandise-kampus',
      title: 'Merchandise Kampus',
      category: 'Apparel & Accessories',
      price: 60000,
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=80',
      description: 'Tote bag canvas eksklusif Unismuh, gantungan kunci akrilik, dan pin logo almamater.',
      rating: 5.0,
      sold: '620+ terjual',
      tag: 'Official Unismuh'
    }
  ];

  const layananFeatures = [
    {
      icon: ShieldCheck,
      title: 'Rekber Escrow Otomatis',
      description: 'Dana ditampung aman di payment gateway kampus dan baru diteruskan ke jastiper saat barang diterima utuh.'
    },
    {
      icon: Clock,
      title: 'Auto Closing Tepat Waktu',
      description: 'Sistem otomatis mengunci penerimaan pesanan H-30 menit sebelum keberangkatan kurir agar kuliah tidak terlambat.'
    },
    {
      icon: MapPin,
      title: 'Titik Temu Resmi Kampus',
      description: 'Pengambilan terjadwal di Menara Iqra, Gedung Lab Terpadu, Gazebo Rektorat, atau Masjid Kampus.'
    },
    {
      icon: Zap,
      title: '4 Microservices Real-Time',
      description: 'Arsitektur terpisah antara Catalog, Order, Payment Escrow, dan Delivery Tracking untuk stabilitas tinggi.'
    }
  ];

  const testimonials = [
    {
      name: 'Nur Fadillah',
      prodi: 'S1 Farmasi (2022)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      comment: 'Sangat terbantu kalau lagi praktikum lab seharian. Tinggal buka jastip, titip makan siang di warung Talasalapang, sampai tepat waktu di Menara Iqra!'
    },
    {
      name: 'Rahmat Hidayat',
      prodi: 'S1 Teknik Elektro (2021)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      comment: 'Sebagai jastiper, uang saku tambahan lumayan banget tiap hari. Sistem nego ongkirnya transparan dan pencairan saldonya instan ke BSI.'
    },
    {
      name: 'Siti Aisyah',
      prodi: 'S1 Pendidikan Dokter (2023)',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      comment: 'Fitur lacak kurir di peta real-time sangat akurat. Ga perlu khawatir kena tipu karena ada proteksi rekening bersama kampus.'
    }
  ];

  const faqs = [
    {
      q: 'Bagaimana cara mulai memesan jastip di kampus Unismuh?',
      a: 'Cukup klik tombol Masuk atau Login dengan akun mahasiswa SIMAK Anda, pilih barang dari katalog warung sekitar kampus, lalu tawar ongkir dan bayar melalui QRIS Unismuh atau saldo dompet.'
    },
    {
      q: 'Bagaimana keamanan dana saat titip barang?',
      a: 'Setiap pembayaran dilindungi 100% oleh sistem Payment Escrow Unismuh. Jastiper hanya menerima dana setelah Anda melakukan konfirmasi serah terima barang di lokasi titik temu kampus.'
    },
    {
      q: 'Siapa saja yang bisa menjadi mitra kurir jastip?',
      a: 'Seluruh mahasiswa aktif Unismuh Makassar yang memiliki KTM resmi dapat mendaftar menjadi mitra jastip melalui form verifikasi 3-langkah.'
    },
    {
      q: 'Di mana saja area penjemputan barang jastip?',
      a: 'Titik penjemputan utama tersebar di Lobby Menara Iqra, Lab Terpadu Fakultas Teknik/FKIK, Gazebo Rektorat, dan Pelataran Masjid Kampus Subulussalam.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0D1117] text-slate-100 font-sans selection:bg-[#10B981] selection:text-white relative overflow-x-hidden">
      
      {/* 
        ========================================================================
        1. LAYOUT & TEMA VISUAL (DARK MODE) AMBIENT GLOW EFFECTS
        ========================================================================
      */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#10B981]/15 rounded-full blur-[140px] pointer-events-none -z-0"></div>
      <div className="absolute top-40 right-10 w-80 h-80 bg-[#004D40]/30 rounded-full blur-[120px] pointer-events-none -z-0"></div>
      <div className="absolute top-[900px] left-10 w-96 h-96 bg-[#005A36]/20 rounded-full blur-[150px] pointer-events-none -z-0"></div>

      {/* 
        ========================================================================
        2. NAVBAR UTAMA (TOP NAVIGATION)
        ========================================================================
      */}
      <header className="sticky top-0 z-40 bg-[#0D1117]/85 backdrop-blur-md border-b border-emerald-950/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            
            {/* Left: Logo "Sistem Jastip Kampus" dengan ikon hijau */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#004D40] border border-[#10B981]/40 flex items-center justify-center text-[#10B981] shadow-lg shadow-emerald-950/50">
                <ShoppingBag className="w-5 h-5 text-[#10B981]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-base sm:text-lg font-black tracking-tight text-white">
                    Sistem Jastip <span className="text-[#10B981]">Kampus</span>
                  </span>
                  <span className="bg-[#004D40] text-[#A7F3D0] text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-[#10B981]/30">
                    UNISMUH
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-400">
                  Platform Titip-Beli Mahasiswa Terpercaya
                </span>
              </div>
            </div>

            {/* Center Links: Menu navigasi "Layanan", "Catalog", "Testimoni", "FAQ" */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-6 text-xs sm:text-sm font-semibold text-slate-300">
              <a 
                href="#layanan" 
                className="px-3 py-2 rounded-xl hover:text-[#10B981] hover:bg-white/5 transition-colors"
              >
                Layanan
              </a>
              <a 
                href="#catalog" 
                className="px-3 py-2 rounded-xl hover:text-[#10B981] hover:bg-white/5 transition-colors"
              >
                Catalog
              </a>
              <a 
                href="#testimoni" 
                className="px-3 py-2 rounded-xl hover:text-[#10B981] hover:bg-white/5 transition-colors"
              >
                Testimoni
              </a>
              <a 
                href="#faq" 
                className="px-3 py-2 rounded-xl hover:text-[#10B981] hover:bg-white/5 transition-colors"
              >
                FAQ
              </a>
            </nav>

            {/* Right Action Buttons: Masuk & Daftar */}
            <div className="hidden sm:flex items-center gap-3">
              {/* Tombol Masuk (Hijau Solid dengan icon Login) */}
              <button
                type="button"
                onClick={() => onOpenAuthModal('CHOICE')}
                className="px-4.5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-emerald-950 flex items-center gap-2 transition-all active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk</span>
              </button>

              {/* Tombol Daftar (Putih / Light Button) */}
              <button
                type="button"
                onClick={() => onOpenAuthModal('REGISTER_MITRA')}
                className="px-4.5 py-2.5 bg-white hover:bg-slate-100 text-slate-900 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4 text-slate-800" />
                <span>Daftar</span>
              </button>

              {/* Quick direct Portal view toggle */}
              <button
                type="button"
                onClick={onEnterDashboard}
                className="px-3.5 py-2.5 bg-[#004D40]/80 hover:bg-[#004D40] text-[#A7F3D0] border border-[#10B981]/30 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all"
                title="Buka Portal Dashboard"
              >
                <span>Portal App</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex sm:hidden items-center gap-2">
              <button
                type="button"
                onClick={() => onOpenAuthModal('CHOICE')}
                className="px-3 py-1.5 bg-[#10B981] text-white font-bold text-xs rounded-lg flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Masuk</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* 
        ========================================================================
        3. HERO SECTION (BAGIAN UTAMA)
        ========================================================================
      */}
      <section className="relative z-10 pt-12 pb-16 lg:pt-20 lg:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
          
          {/* Badge Unismuh Makassar */}
          <div className="inline-flex items-center gap-2 bg-[#004D40]/70 border border-[#10B981]/40 px-4 py-1.5 rounded-full text-xs font-semibold text-[#A7F3D0] shadow-md">
            <Sparkles className="w-4 h-4 text-[#10B981]" />
            <span>SISTEM INFORMASI JASTIP UNIVERSITAS MUHAMMADIYAH MAKASSAR</span>
          </div>

          {/* Main Heading: "Temukan Jastip Kampus Terpercaya Anda Di Sini" */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight sm:leading-tight">
            Temukan Jastip Kampus <span className="text-[#10B981] drop-shadow-[0_0_25px_rgba(16,185,129,0.35)]">Terpercaya</span> Anda Di Sini
          </h1>

          {/* Sub-heading */}
          <p className="text-slate-300 text-sm sm:text-lg max-w-2xl leading-relaxed font-normal">
            Platform jastip mahasiswa teraman dengan sistem terintegrasi dan real-time. Titip makanan, fotocopy modul, dan kebutuhan kuliah tanpa khawatir.
          </p>

          {/* Primary Call-to-Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            
            {/* [Icon Enter] Tombol "Masuk" (Warna Hijau Solid) */}
            <button
              type="button"
              onClick={() => onOpenAuthModal('CHOICE')}
              className="px-7 py-3.5 bg-[#10B981] hover:bg-[#059669] text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-950/60 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95"
            >
              <LogIn className="w-5 h-5" />
              <span>Masuk</span>
            </button>

            {/* [Icon UserPlus] Tombol "Daftar Baru" (Warna Putih Solid) */}
            <button
              type="button"
              onClick={() => onOpenAuthModal('REGISTER_MITRA')}
              className="px-7 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-black text-sm sm:text-base rounded-2xl shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center gap-2.5"
            >
              <UserPlus className="w-5 h-5 text-slate-900" />
              <span>Daftar Baru</span>
            </button>

            {/* Direct Dashboard Entry */}
            <button
              type="button"
              onClick={onEnterDashboard}
              className="px-6 py-3.5 bg-[#004D40] hover:bg-[#003d33] border border-[#10B981]/50 text-[#A7F3D0] font-bold text-sm sm:text-base rounded-2xl flex items-center gap-2 transition-all hover:border-[#10B981]"
            >
              <span>Buka Portal Jastip</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

          {/* Stat Counters Grid (3 Kartu Transparan / Glassmorphism) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-10 w-full max-w-3xl">
            
            {/* Stat Card 1: 0.02s - Kecepatan */}
            <div className="bg-white/5 hover:bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-5 text-center shadow-lg transition-all">
              <div className="text-3xl sm:text-4xl font-black text-[#10B981] tracking-tight">
                0.02s
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-200 mt-1">
                Kecepatan
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Latency Microservices Gateway
              </div>
            </div>

            {/* Stat Card 2: 100% - Aman & Terintegrasi */}
            <div className="bg-white/5 hover:bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-5 text-center shadow-lg transition-all">
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                100%
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-200 mt-1">
                Aman & Terintegrasi
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Escrow Rekber & SIMAK Unismuh
              </div>
            </div>

            {/* Stat Card 3: 120k+ - Total Transaksi */}
            <div className="bg-white/5 hover:bg-white/10 backdrop-blur-lg border border-white/10 rounded-2xl p-5 text-center shadow-lg transition-all">
              <div className="text-3xl sm:text-4xl font-black text-[#10B981] tracking-tight">
                120k+
              </div>
              <div className="text-xs sm:text-sm font-bold text-slate-200 mt-1">
                Total Transaksi
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Pesanan Sukses Mahasiswa
              </div>
            </div>

          </div>

        </div>

      </section>

      {/* 
        ========================================================================
        4. CATALOG SECTION ("Catalog Jastip Populer")
        ========================================================================
      */}
      <section id="catalog" className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        
        {/* Heading Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <div className="inline-flex items-center gap-2 bg-[#004D40]/60 border border-[#10B981]/30 px-3 py-1 rounded-full text-xs font-semibold text-[#A7F3D0]">
            <ShoppingBag className="w-3.5 h-3.5 text-[#10B981]" />
            <span>MENU REKOMENDASI TERLARIS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Catalog Jastip Populer
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Jelajahi catalog item jastip favorit dan unik dari Unismuh
          </p>
        </div>

        {/* 4 Cards Grid (Kartu Putih Clean dengan Gambar Produk & Teks Hitam) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularCatalog.map((item) => (
            <div 
              key={item.id}
              onClick={() => {
                if (onSelectCatalogItem) {
                  onSelectCatalogItem(item.title);
                } else {
                  onEnterDashboard();
                }
              }}
              className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group cursor-pointer border border-slate-100"
            >
              <div>
                {/* Product Image Container */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 bg-[#004D40] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                    {item.tag}
                  </span>
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs text-slate-900 text-xs font-black px-2 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{item.rating}</span>
                  </div>
                </div>

                {/* Content Box (Teks Hitam Clean di atas Latar Putih) */}
                <div className="p-5 space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                    {item.category}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight group-hover:text-[#004D40] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Price & Action Row */}
              <div className="px-5 pb-5 pt-2 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Harga Item</span>
                  <span className="text-lg font-black text-slate-900">
                    Rp {item.price.toLocaleString('id-ID')}
                  </span>
                </div>
                
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenAuthModal('CHOICE');
                  }}
                  className="px-3.5 py-2 bg-[#004D40] hover:bg-[#00382e] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                >
                  <span>Titip</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#A7F3D0]" />
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* View full catalog CTA */}
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={onEnterDashboard}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#004D40] hover:bg-[#00382e] text-[#A7F3D0] border border-[#10B981]/40 rounded-2xl font-bold text-sm transition-all hover:scale-105"
          >
            <span>Lihat Semua 50+ Item Katalog Warung Sekitar Kampus</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </section>

      {/* 
        ========================================================================
        5. LAYANAN SECTION
        ========================================================================
      */}
      <section id="layanan" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Keunggulan Layanan Jastip Unismuh
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Didesain khusus untuk ritme perkuliahan mahasiswa Universitas Muhammadiyah Makassar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {layananFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                className="bg-white/5 border border-white/10 hover:border-[#10B981]/50 rounded-3xl p-6 transition-all duration-300 hover:bg-white/10 group space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#004D40] text-[#10B981] border border-[#10B981]/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">
                  {feat.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 
        ========================================================================
        6. TESTIMONI SECTION
        ========================================================================
      */}
      <section id="testimoni" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-800/80">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Apa Kata Mahasiswa Unismuh?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            Testimoni langsung dari ribuan mahasiswa yang telah memanfaatkan ekosistem jastip
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div 
              key={idx}
              className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4 flex flex-col justify-between"
            >
              <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                "{t.comment}"
              </p>

              <div className="flex items-center gap-3 pt-3 border-t border-white/10">
                <img 
                  src={t.avatar} 
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#10B981]"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-emerald-400">
                    {t.prodi}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 
        ========================================================================
        7. FAQ SECTION
        ========================================================================
      */}
      <section id="faq" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-slate-800/80">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Pertanyaan yang Sering Diajukan (FAQ)
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Segala hal yang perlu Anda ketahui mengenai sistem operasional jastip kampus
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full p-4.5 text-left flex items-center justify-between text-white font-bold text-xs sm:text-sm hover:bg-white/5"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-[#10B981] transition-transform ${activeFaq === idx ? 'rotate-180' : ''}`} />
              </button>

              {activeFaq === idx && (
                <div className="px-4.5 pb-4.5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-white/5 bg-white/2">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 
        ========================================================================
        8. CTA BOTTOM BANNER
        ========================================================================
      */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-r from-[#004D40] via-[#005A36] to-[#00382e] rounded-3xl p-8 sm:p-12 text-center text-white border border-[#10B981]/40 shadow-2xl relative overflow-hidden space-y-6">
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <h3 className="text-2xl sm:text-4xl font-black tracking-tight">
              Siap Menitip Makanan atau Mulai Jadi Jastiper?
            </h3>
            <p className="text-xs sm:text-base text-emerald-100">
              Bergabung bersama ribuan mahasiswa Unismuh Makassar sekarang. Buka order instan, negosiasi ongkir, dan nikmati serah terima aman.
            </p>
            <div className="pt-3 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => onOpenAuthModal('CHOICE')}
                className="px-6 py-3 bg-white text-slate-900 font-black text-xs sm:text-sm rounded-xl shadow-lg hover:bg-slate-100 transition-all active:scale-95"
              >
                Mulai Masuk Akun
              </button>
              <button
                type="button"
                onClick={() => onOpenAuthModal('REGISTER_MITRA')}
                className="px-6 py-3 bg-[#10B981] text-white font-black text-xs sm:text-sm rounded-xl shadow-lg hover:bg-[#059669] transition-all active:scale-95"
              >
                Daftar Mitra Jastip
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        9. FOOTER
        ========================================================================
      */}
      <footer className="border-t border-slate-800 bg-[#090D11] text-slate-400 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#004D40] text-[#10B981] flex items-center justify-center font-bold text-xs">
              J
            </div>
            <span className="text-white font-bold">Sistem Jastip Kampus Unismuh</span>
            <span>• © 2026 Universitas Muhammadiyah Makassar</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Jl. Sultan Alauddin No. 259, Makassar</span>
            <span>•</span>
            <button 
              onClick={onEnterDashboard}
              className="text-[#10B981] hover:underline font-bold"
            >
              Masuk ke Portal Aplikasi
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
