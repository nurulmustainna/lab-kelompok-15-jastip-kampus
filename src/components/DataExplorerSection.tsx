import React, { useState } from 'react';
import { 
  Database, Download, Copy, Check, FileCode, Layers, 
  Table, HardDrive, Cpu, Terminal, Sparkles, CheckCircle2, 
  ExternalLink, Search, RefreshCw, FileText, BookOpen, ShieldCheck, Wallet, Banknote, QrCode
} from 'lucide-react';
import { 
  MOCK_CATALOG_ITEMS, 
  MOCK_SESSIONS, 
  MOCK_STUDENT_ACCOUNTS, 
  PAYMENT_METHODS_DATA, 
  MICROSERVICES_DATA, 
  INITIAL_DEMO_ORDER 
} from '../data/mockData';

export const DataExplorerSection: React.FC = () => {
  const [activeDataset, setActiveDataset] = useState<'ALL' | 'CATALOG' | 'SESSIONS' | 'STUDENTS' | 'PAYMENTS' | 'MICROSERVICES' | 'ORDERS' | 'REPORT'>('ALL');
  const [copiedDataset, setCopiedDataset] = useState<string | null>(null);

  // Complete consolidated JSON dataset
  const fullSystemData = {
    meta: {
      systemName: 'Sistem Jastip Antar Mahasiswa Kampus Unismuh Makassar',
      version: '2.4.0',
      academicInstitution: 'Universitas Muhammadiyah Makassar',
      architecture: 'Microservices (Catalog, Order, Payment, Tracking)',
      totalCatalogItems: MOCK_CATALOG_ITEMS.length,
      totalSessions: MOCK_SESSIONS.length,
      totalVerifiedStudents: MOCK_STUDENT_ACCOUNTS.length,
      totalPaymentMethods: PAYMENT_METHODS_DATA.length,
      totalMicroservices: MICROSERVICES_DATA.length,
      exportedAt: new Date().toISOString()
    },
    verifiedStudents: MOCK_STUDENT_ACCOUNTS,
    paymentMethods: PAYMENT_METHODS_DATA,
    jastipSessions: MOCK_SESSIONS,
    catalogItems: MOCK_CATALOG_ITEMS,
    activeOrders: [INITIAL_DEMO_ORDER],
    microservicesArchitecture: MICROSERVICES_DATA
  };

  const reportMarkdown = `# LAPORAN LENGKAP SISTEM INFORMASI JASTIP MAHASISWA KAMPUS UNISMUH MAKASSAAR
Versi: 2.4 Microservices Architecture
Institusi: Universitas Muhammadiyah Makassar (Jl. Sultan Alauddin No. 259, Makassar)

================================================================================
BAB I: RINGKASAN EKSEKUTIF
================================================================================
Platform Jastip Kampus Unismuh Makassar adalah sistem titip-beli terintegrasi 
antar sesama mahasiswa yang memecahkan masalah efisiensi mobilitas konsumsi 
harian di lingkungan kampus dengan keamanan Rekening Bersama (Escrow Vault).

FITUR UTAMA:
1. Autentikasi Mahasiswa SSO SIMAK (3 Akun Terverifikasi Kampus)
2. 50 Item Katalog Titipan Kuliner & ATK sekitar kampus (Alauddin, Talasalapang, Pettarani)
3. 9 Opsi Metode Pembayaran (QRIS Unismuh Pay, Tunai/Cash COD, Saldo Dompet, E-Wallet, VA BSI/BRI/Mandiri)
4. Rekening Bersama (Escrow Vault) dengan pencairan dana instan saat scan QR di kampus
5. 4 Layanan Microservices Independen (Catalog, Order, Payment, Tracking)
6. Batasan Muatan Bagasi Motor (Maksimal 5 kg) & Closing Time H-30 Menit

================================================================================
BAB II: 3 AKUN MAHASISWA TERVERIFIKASI KAMPUS
================================================================================
1. Ahmad Fauzan
   - NIM: 105841104423
   - Prodi: S1 Teknik Elektro, Fakultas Teknik
   - Role: Mahasiswa (Pemesan)
   - Saldo Dompet: Rp 150.000
   - Status: Terverifikasi Kampus SIMAK

2. Andi Muhammad Fikri
   - NIM: 105841103322
   - Prodi: S1 Teknik Informatika, Fakultas Teknik
   - Role: Jastiper (Kurir Mahasiswa)
   - Saldo Dompet: Rp 285.000
   - Status: Terverifikasi Kampus SIMAK

3. Nurul Mutmainnah
   - NIM: 105841102211
   - Prodi: S1 Farmasi, Fakultas Kedokteran & Ilmu Kesehatan
   - Role: Jastiper (Kurir Mahasiswa)
   - Saldo Dompet: Rp 195.000
   - Status: Terverifikasi Kampus SIMAK

================================================================================
BAB III: OPSI METODE PEMBAYARAN
================================================================================
1. QRIS Unismuh Pay (Instan Otomatis dari semua M-Banking & E-Wallet)
2. Tunai / Cash on Delivery (COD) di Titik Temu Kampus Unismuh
3. Saldo Dompet Jastip Mahasiswa (1-Klik Bebas Admin)
4. E-Wallet: GoPay, ShopeePay, OVO, DANA
5. Virtual Account Bank:
   - Bank Syariah Indonesia (BSI - Mitra Resmi Kampus): 9888 + NIM
   - Bank BRI (BRIVA)
   - Bank Mandiri (Livin)

================================================================================
BAB IV: 4 ARSITEKTUR MICROSERVICES
================================================================================
- Catalog-Service  : Port 8001 | PostgreSQL | 50 Item & Warung Mitra
- Order-Service    : Port 8002 | PostgreSQL | Order Lifecycle & Negosiasi Tarif
- Payment-Service  : Port 8003 | PostgreSQL | Rekber Escrow & Dompet Digital
- Tracking-Service : Port 8004 | MongoDB/Redis | GPS Tracker & QR Serah Terima

================================================================================
BAB V: TITIK TEMU RESMI KAMPUS UNISMUH
================================================================================
1. Lobby Utama Menara Iqra Unismuh (Depan Pojok Baca)
2. Lobby Gedung Laboratorium Terpadu Unismuh
3. Gazebo Utama Depan Gedung Rektorat
4. Pelataran Masjid Subulussalam Unismuh Makassar
`;

  const getFilteredData = () => {
    switch (activeDataset) {
      case 'CATALOG':
        return { total: MOCK_CATALOG_ITEMS.length, items: MOCK_CATALOG_ITEMS };
      case 'SESSIONS':
        return { total: MOCK_SESSIONS.length, sessions: MOCK_SESSIONS };
      case 'STUDENTS':
        return { total: MOCK_STUDENT_ACCOUNTS.length, students: MOCK_STUDENT_ACCOUNTS };
      case 'PAYMENTS':
        return { total: PAYMENT_METHODS_DATA.length, methods: PAYMENT_METHODS_DATA };
      case 'MICROSERVICES':
        return { total: MICROSERVICES_DATA.length, services: MICROSERVICES_DATA };
      case 'ORDERS':
        return { total: 1, sampleOrder: INITIAL_DEMO_ORDER };
      case 'REPORT':
        return reportMarkdown;
      case 'ALL':
      default:
        return fullSystemData;
    }
  };

  const isReport = activeDataset === 'REPORT';
  const displayContent = isReport ? reportMarkdown : JSON.stringify(getFilteredData(), null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayContent);
    setCopiedDataset(activeDataset);
    setTimeout(() => setCopiedDataset(null), 2500);
  };

  const handleDownloadFile = () => {
    const isDoc = activeDataset === 'REPORT';
    const filename = isDoc 
      ? `LAPORAN_LENGKAP_JASTIP_UNISMUH_${Date.now().toString().slice(-4)}.txt`
      : `data-jastip-unismuh-${activeDataset.toLowerCase()}-${Date.now().toString().slice(-4)}.json`;
    
    const mimeType = isDoc ? 'text/plain;charset=utf-8' : 'application/json';
    const blob = new Blob([displayContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-100/50 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold font-mono">
              <Database className="w-3.5 h-3.5 text-emerald-700" />
              <span>DATA REPOSITORY & FILE DOWNLOAD PORTAL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-emerald-950 tracking-tight">
              Unduh File Data & Laporan Lengkap
            </h2>
            <p className="text-xs sm:text-sm text-emerald-800 max-w-3xl leading-relaxed">
              Arsip data terstruktur lengkap sistem mencakup <strong>50 item katalog</strong>, <strong>3 akun mahasiswa terverifikasi</strong>, <strong>opsi pembayaran (Cash COD, QRIS, Saldo, VA BSI)</strong>, <strong>rute sesi jastip</strong>, dan <strong>arsitektur 4 microservices</strong>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={handleCopy}
              className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs rounded-2xl flex items-center gap-2 transition-all shadow-2xs"
            >
              {copiedDataset ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-emerald-700" />
                  <span>Salin Teks / JSON</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadFile}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Unduh File ({isReport ? '.TXT Laporan' : '.JSON Dataset'})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dataset Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
        {[
          { id: 'REPORT' as const, label: 'Laporan Lengkap', count: 'Dokumentasi TXT', icon: FileText, highlight: true },
          { id: 'ALL' as const, label: 'Master Dataset', count: '100% JSON File', icon: HardDrive },
          { id: 'CATALOG' as const, label: 'Katalog Menu', count: `${MOCK_CATALOG_ITEMS.length} Items`, icon: Table },
          { id: 'STUDENTS' as const, label: 'Akun Mahasiswa', count: `${MOCK_STUDENT_ACCOUNTS.length} Akun SIMAK`, icon: CheckCircle2 },
          { id: 'PAYMENTS' as const, label: 'Pembayaran', count: `${PAYMENT_METHODS_DATA.length} Opsi (+Cash)`, icon: FileCode },
          { id: 'SESSIONS' as const, label: 'Sesi Jastiper', count: `${MOCK_SESSIONS.length} Rute Aktif`, icon: Layers },
          { id: 'MICROSERVICES' as const, label: 'Microservices', count: '4 Arsitektur', icon: Cpu },
        ].map((item) => {
          const Icon = item.icon;
          const isSelected = activeDataset === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveDataset(item.id)}
              className={`p-3 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-emerald-950 text-white border-emerald-900 ring-2 ring-emerald-500 shadow-md'
                  : item.highlight
                    ? 'bg-emerald-100/70 border-emerald-300 text-emerald-950 font-bold hover:bg-emerald-200/80'
                    : 'bg-white text-emerald-900 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50'
              }`}
            >
              <Icon className={`w-4 h-4 mb-1.5 ${isSelected ? 'text-emerald-300' : 'text-emerald-600'}`} />
              <div className="text-xs font-bold leading-tight line-clamp-1">{item.label}</div>
              <div className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-emerald-300 font-bold' : 'text-emerald-700'}`}>
                {item.count}
              </div>
            </button>
          );
        })}
      </div>

      {/* File Content Preview */}
      <div className="bg-emerald-950 text-emerald-100 rounded-3xl border border-emerald-900 overflow-hidden shadow-2xl">
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-emerald-900/90 border-b border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-200">
              {isReport ? 'LAPORAN_LENGKAP_JASTIP_UNISMUH.txt' : `dataset_${activeDataset.toLowerCase()}_unismuh.json`} ({Math.round(displayContent.length / 1024 * 10) / 10} KB)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-700">
              {isReport ? 'MIME: text/plain' : 'MIME: application/json'}
            </span>
            <button
              onClick={handleDownloadFile}
              className="text-xs text-white hover:bg-emerald-700 font-mono font-bold flex items-center gap-1.5 bg-emerald-600 px-3 py-1 rounded-lg border border-emerald-500 transition-colors shadow-xs"
            >
              <Download className="w-3 h-3" />
              <span>Download File Ini</span>
            </button>
          </div>
        </div>

        {/* Code Content Box */}
        <div className="p-5 overflow-x-auto max-h-[580px] scrollbar-thin scrollbar-thumb-emerald-700 font-mono text-xs text-emerald-200 leading-relaxed bg-emerald-950/90">
          <pre className="whitespace-pre font-mono">
            {displayContent}
          </pre>
        </div>
      </div>
    </div>
  );
};
