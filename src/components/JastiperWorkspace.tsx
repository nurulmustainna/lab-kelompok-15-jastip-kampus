import React, { useState } from 'react';
import { 
  Wallet, Bike, MapPin, Star, PlusCircle, Clock, Package, 
  CheckCircle2, ArrowRight, UserCheck, ShieldCheck, DollarSign, 
  Send, Sparkles, Scale, AlertCircle, Phone, ArrowUpRight, Check,
  ChevronRight, RefreshCw, X
} from 'lucide-react';
import { JastipSession } from '../types';
import { RulesSection } from './RulesSection';

interface IncomingOrder {
  id: string;
  item: string;
  customerName: string;
  phone: string;
  destination: string;
  fee: number;
  totalPrice: number;
  status: 'PENDING' | 'ACCEPTED' | 'PICKED_UP' | 'COMPLETED';
  time: string;
  notes?: string;
}

interface JastiperWorkspaceProps {
  sessions?: JastipSession[];
  onAddNewSession?: (session: JastipSession) => void;
  onShowToast?: (msg: string) => void;
}

export const JastiperWorkspace: React.FC<JastiperWorkspaceProps> = ({
  sessions = [],
  onAddNewSession,
  onShowToast
}) => {
  // 1. State for Withdraw Saldo Modal
  const [walletBalance, setWalletBalance] = useState(150000);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('150000');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // 2. State for "Buka Sesi Jastip Baru" Form
  const [routeInput, setRouteInput] = useState('');
  const [closingTimeInput, setClosingTimeInput] = useState('');
  const [slotLimitInput, setSlotLimitInput] = useState('');
  const [isSubmittingSession, setIsSubmittingSession] = useState(false);

  // 3. State for "Daftar Pesanan Masuk (Siap Diambil)"
  const [incomingOrders, setIncomingOrders] = useState<IncomingOrder[]>([
    {
      id: 'TITIP-01',
      item: 'Nasi Kuning Kantin (2 Porsi)',
      customerName: 'Nurhaeni',
      phone: '0812-4455-8891',
      destination: 'R.302 Lt.3 Menara Iqra',
      fee: 6000,
      totalPrice: 32000,
      status: 'PENDING',
      time: '10:15 WITA',
      notes: 'Sambal dipisah, minta sendok 2 pasang'
    },
    {
      id: 'TITIP-02',
      item: 'Es Teh & Snack (1 Paket)',
      customerName: 'Rizki',
      phone: '0852-9911-3320',
      destination: 'Perpustakaan Lt.2 Unismuh',
      fee: 4000,
      totalPrice: 16000,
      status: 'PENDING',
      time: '10:20 WITA',
      notes: 'Es batu sedikit saja'
    },
    {
      id: 'TITIP-03',
      item: 'Ayam Geprek Sambal Matah (1 Porsi)',
      customerName: 'Fahmi Ahmad',
      phone: '0821-7733-1100',
      destination: 'Lab Komputer 3 Lt.4',
      fee: 5000,
      totalPrice: 20000,
      status: 'ACCEPTED',
      time: '09:55 WITA',
      notes: 'Level pedas 2'
    }
  ]);

  // Handler for Accepting / Updating Incoming Order
  const handleUpdateOrderStatus = (id: string, newStatus: IncomingOrder['status']) => {
    setIncomingOrders(prev => prev.map(order => {
      if (order.id === id) {
        return { ...order, status: newStatus };
      }
      return order;
    }));

    if (newStatus === 'ACCEPTED') {
      onShowToast?.('Titipan berhasil diterima! Notifikasi konfirmasi dikirim ke pemesan.');
    } else if (newStatus === 'COMPLETED') {
      setWalletBalance(prev => prev + 5000);
      onShowToast?.('Pesanan selesai! Ongkir Rp 5.000 otomatis masuk ke Dompet Jastiper.');
    }
  };

  // Handler for Submitting New Session
  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routeInput.trim()) {
      onShowToast?.('Harap masukkan rute tujuan sesi jastip!');
      return;
    }

    setIsSubmittingSession(true);
    setTimeout(() => {
      setIsSubmittingSession(false);
      const newSession: JastipSession = {
        id: `SES-CUSTOM-${Date.now()}`,
        jastiperName: 'Andi Muhammad Fikri',
        jastiperProdi: 'S1 Teknik Informatika Unismuh',
        jastiperAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        routeFrom: routeInput.includes('ke') ? routeInput.split('ke')[0].trim() : 'Kantin Menara Iqra',
        routeTo: routeInput.includes('ke') ? routeInput.split('ke')[1].trim() : 'Gedung FKIP Unismuh',
        meetingPoint: 'Lobby Menara Iqra Lt.1',
        departureTime: closingTimeInput || '13:00 WITA',
        closingTime: closingTimeInput || '12:30 WITA',
        closingTimestamp: Date.now() + 45 * 60 * 1000,
        maxCapacityKg: 5.0,
        currentCapacityKg: 0.8,
        maxOrders: parseInt(slotLimitInput) || 5,
        currentOrders: 0,
        status: 'OPEN',
        availableStores: ['Kantin Menara Iqra', 'Sentra Kuliner Alauddin']
      };

      if (onAddNewSession) {
        onAddNewSession(newSession);
      }
      
      setRouteInput('');
      setClosingTimeInput('');
      setSlotLimitInput('');
      onShowToast?.('Sesi Jastip baru berhasil dibuka! Mahasiswa lain kini dapat menitip belanjaan.');
    }, 600);
  };

  // Handler for Withdrawing Balance
  const handleConfirmWithdraw = () => {
    const amt = parseInt(withdrawAmount) || 0;
    if (amt <= 0 || amt > walletBalance) {
      onShowToast?.('Nominal penarikan tidak valid atau saldo tidak mencukupi!');
      return;
    }

    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      setWalletBalance(prev => prev - amt);
      setShowWithdrawModal(false);
      onShowToast?.(`Penarikan dana Rp ${amt.toLocaleString('id-ID')} berhasil diproses via Rekening/QRIS Bank Syariah Indonesia.`);
    }, 800);
  };

  const activeOrdersCount = incomingOrders.filter(o => o.status !== 'COMPLETED').length;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* 
        ========================================================================
        1. HEADER & BANNER UTAMA JASTIPER
        ========================================================================
      */}
      <div className="bg-gradient-to-r from-[#014732] via-[#025a40] to-[#013525] text-white rounded-3xl p-6 sm:p-8 border border-emerald-800 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#10b981]/15 rounded-full blur-3xl pointer-events-none -z-0"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#10b981]/20 border border-[#10b981]/40 text-[#a7f3d0] text-xs font-bold font-mono">
              <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
              <span>WORKSPACE JASTIPER UNISMUH</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Selamat Datang, Andi Muhammad Fikri
            </h1>
            
            {/* Banner details: Andi Muhammad Fikri | S1 Teknik Informatika | NIM: 105841103322 | Status: Terverifikasi Aktif */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-emerald-100/90 pt-1">
              <span className="font-semibold text-white">S1 Teknik Informatika</span>
              <span className="text-emerald-400">•</span>
              <span className="font-mono bg-[#013525] px-2.5 py-0.5 rounded-lg border border-emerald-700/60">
                NIM: 105841103322
              </span>
              <span className="text-emerald-400">•</span>
              <span className="inline-flex items-center gap-1 text-[#34d399] font-bold bg-[#10b981]/20 px-2.5 py-0.5 rounded-lg border border-[#10b981]/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Status: Terverifikasi Aktif</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-[#013525]/80 backdrop-blur-sm p-3.5 rounded-2xl border border-emerald-700/60 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-[#10b981] text-[#014732] flex items-center justify-center font-black shadow-md">
              <Bike className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] text-emerald-300 font-mono block">RUNNER ID</span>
              <span className="text-sm font-black text-white">RUNNER-UNISMUH-01</span>
              <span className="text-[10px] text-emerald-400 block font-medium">Auto-Sync GPS Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* 
        ========================================================================
        2. STATISTIK JASTIPER (Grid 4 Card UI Modern)
        ========================================================================
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Dompet Jastiper | Rp 150.000 + Tombol Aksen "Tarik Saldo" */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Dompet Jastiper
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#014732] flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
                <Wallet className="w-4.5 h-4.5 text-[#014732]" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#014732] tracking-tight">
              Rp {walletBalance.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>Siap ditarik ke Rekening / E-Wallet</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowWithdrawModal(true)}
            className="w-full py-2 px-3 bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <DollarSign className="w-4 h-4" />
            <span>Tarik Saldo</span>
          </button>
        </div>

        {/* Card 2: Pesanan Diambil | "3 Pesanan Aktif" + Badge Status */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Pesanan Diambil
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#014732] flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
                <Package className="w-4.5 h-4.5 text-[#014732]" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#014732] tracking-tight">
              {activeOrdersCount} Pesanan Aktif
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Dalam proses belanja & pengantaran
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
              <span>Dalam Pengantaran</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">100% On-Time</span>
          </div>
        </div>

        {/* Card 3: Sesi Rute Aktif | "Menara Iqra Lt.3 ➔ Kantin Pusat" */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Sesi Rute Aktif
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#014732] flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
                <MapPin className="w-4.5 h-4.5 text-[#014732]" />
              </div>
            </div>
            <div className="text-base sm:text-lg font-black text-[#014732] leading-snug tracking-tight">
              Menara Iqra Lt.3 ➔ Kantin Pusat
            </div>
            <p className="text-[11px] text-emerald-700 font-medium mt-1">
              Closing Time: 12:00 WITA (H-30 Menit)
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Sisa Slot: <strong className="text-[#014732]">2/5 Slot</strong></span>
            <span className="text-emerald-700 font-bold">Terbuka</span>
          </div>
        </div>

        {/* Card 4: Rating Jastiper | "4.9 / 5.0 ★" (28 Review) */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Rating Jastiper
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 group-hover:scale-105 transition-transform">
                <Star className="w-4.5 h-4.5 text-amber-500 fill-amber-500" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#014732] tracking-tight flex items-baseline gap-1">
              <span>4.9</span>
              <span className="text-base font-bold text-slate-400">/ 5.0</span>
              <span className="text-amber-500 text-xl ml-1">★</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Dari 28 Mahasiswa Pemesan
            </p>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-emerald-700 font-bold">Top Runner Unismuh</span>
            <span className="text-slate-400">Level: Gold</span>
          </div>
        </div>

      </div>

      {/* 
        ========================================================================
        3. PANEL "BUKA SESI JASTIP BARU" (Card Container Hijau Tua #014732)
        ========================================================================
      */}
      <div className="bg-[#014732] text-white rounded-3xl p-6 sm:p-8 border border-emerald-800 shadow-xl space-y-6">
        
        {/* Header Panel */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#10b981] text-[#014732] flex items-center justify-center font-bold shadow-md">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                Buka Sesi Jastip Baru
              </h2>
              <p className="text-xs text-emerald-200">
                Publikasikan rute perjalanan dan slot bagasi agar mahasiswa lain dapat menitip belanjaan
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#013525] border border-emerald-700 text-[11px] text-emerald-300 font-mono">
            <Clock className="w-3.5 h-3.5 text-[#10b981]" />
            <span>Auto-Closing H-30 Menit</span>
          </div>
        </div>

        {/* Form Input Sejajar (Grid 3 Kolom) */}
        <form onSubmit={handleCreateSession} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Input 1: Rute Tujuan */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
                1. Rute Tujuan & Lokasi Belanja
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={routeInput}
                  onChange={(e) => setRouteInput(e.target.value)}
                  placeholder="Kantin Menara Iqra ke Gedung FKIP"
                  className="w-full pl-10 pr-4 py-3 bg-[#013525] border border-emerald-700/80 focus:border-[#10b981] rounded-2xl text-xs sm:text-sm text-white placeholder-emerald-400/60 focus:outline-hidden focus:ring-2 focus:ring-[#10b981]/30 transition-all font-medium"
                />
              </div>
              <span className="text-[10px] text-emerald-300/80 block">
                Contoh: Warung Talasalapang ➔ Lab Teknik
              </span>
            </div>

            {/* Input 2: Waktu Closing Order */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
                2. Waktu Closing Order
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={closingTimeInput}
                  onChange={(e) => setClosingTimeInput(e.target.value)}
                  placeholder="12:30 WITA"
                  className="w-full pl-10 pr-4 py-3 bg-[#013525] border border-emerald-700/80 focus:border-[#10b981] rounded-2xl text-xs sm:text-sm text-white placeholder-emerald-400/60 focus:outline-hidden focus:ring-2 focus:ring-[#10b981]/30 transition-all font-medium"
                />
              </div>
              <span className="text-[10px] text-emerald-300/80 block">
                Order otomatis terkunci 30 menit sebelum berangkat
              </span>
            </div>

            {/* Input 3: Batas Slot Bagasi */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
                3. Batas Slot Bagasi
              </label>
              <div className="relative">
                <Scale className="w-4 h-4 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={slotLimitInput}
                  onChange={(e) => setSlotLimitInput(e.target.value)}
                  placeholder="5 Slot / Max 5kg"
                  className="w-full pl-10 pr-4 py-3 bg-[#013525] border border-emerald-700/80 focus:border-[#10b981] rounded-2xl text-xs sm:text-sm text-white placeholder-emerald-400/60 focus:outline-hidden focus:ring-2 focus:ring-[#10b981]/30 transition-all font-medium"
                />
              </div>
              <span className="text-[10px] text-emerald-300/80 block">
                Maksimal 5.0 kg demi keselamatan berkendara
              </span>
            </div>

          </div>

          {/* Tombol Submit Utama: "Buka Order Jastip Sekarang" (Solid Hijau Cerah/Mint dengan Teks Bold Dark Green) */}
          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmittingSession}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#10b981] hover:bg-[#34d399] text-[#014732] font-black text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 hover:scale-102"
            >
              {isSubmittingSession ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#014732]" />
                  <span>Membuka Sesi...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-[#014732]" />
                  <span>Buka Order Jastip Sekarang</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>

      {/* 
        ========================================================================
        4. DAFTAR PESANAN MASUK / ORDERS TO FULFILL (Card Interactive List)
        ========================================================================
      */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-emerald-100 text-[#014732] text-[10px] font-bold uppercase rounded-full border border-emerald-200">
                Order Management
              </span>
              <span className="text-xs text-slate-400">Escrow Secured</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#014732] tracking-tight mt-1">
              Daftar Titipan Mahasiswa (Siap Diambil)
            </h2>
            <p className="text-xs text-slate-500">
              Daftar pesanan aktif yang menunggu konfirmasi belanja dan pengantaran ke titik temu kampus
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-50 text-[#014732] text-xs font-bold px-3 py-1.5 rounded-xl border border-emerald-200">
              Total {incomingOrders.length} Pesanan
            </span>
          </div>
        </div>

        {/* List of Orders */}
        <div className="space-y-4">
          {incomingOrders.map((order) => (
            <div
              key={order.id}
              className={`rounded-2xl p-5 border transition-all duration-200 ${
                order.status === 'COMPLETED'
                  ? 'bg-slate-50 border-slate-200 opacity-75'
                  : order.status === 'ACCEPTED'
                  ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                  : 'bg-white border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Left info: Item, Customer, Destination */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                      {order.id}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-[#014732]">
                      {order.item}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      • {order.time}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-medium">Pemesan:</span>
                      <strong className="text-slate-900">{order.customerName}</strong>
                      <span className="text-[10px] text-emerald-700 font-mono">({order.phone})</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-slate-400 font-medium">Antar:</span>
                      <strong className="text-slate-900">{order.destination}</strong>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-slate-400 font-medium">Ongkir Jastiper:</span>
                      <strong className="text-emerald-700 font-black">
                        Rp {order.fee.toLocaleString('id-ID')}
                      </strong>
                    </div>
                  </div>

                  {order.notes && (
                    <div className="bg-amber-50/70 border border-amber-200 text-amber-900 text-xs px-3 py-1.5 rounded-xl inline-block">
                      <strong>Catatan:</strong> {order.notes}
                    </div>
                  )}
                </div>

                {/* Right Actions & Status */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-end lg:self-center">
                  
                  {order.status === 'PENDING' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateOrderStatus(order.id, 'ACCEPTED')}
                      className="px-5 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <Check className="w-4 h-4" />
                      <span>Terima Titipan</span>
                    </button>
                  )}

                  {order.status === 'ACCEPTED' && (
                    <button
                      type="button"
                      onClick={() => handleUpdateOrderStatus(order.id, 'COMPLETED')}
                      className="px-5 py-2.5 bg-[#014732] hover:bg-[#025a40] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
                      <span>Selesaikan & Terima Saldo</span>
                    </button>
                  )}

                  {order.status === 'COMPLETED' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl border border-emerald-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Selesai & Saldo Masuk</span>
                    </span>
                  )}

                  <a
                    href={`https://wa.me/62${order.phone.replace(/[^0-9]/g, '').slice(1)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl border border-emerald-200 transition-colors flex items-center gap-1 text-xs font-bold"
                    title="Chat WhatsApp Pemesan"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="hidden sm:inline">Hubungi</span>
                  </a>

                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* 
        ========================================================================
        5. ATURAN & STANDAR OPERASIONAL (SOP) DI POSISI PALING BAWAH
        ========================================================================
      */}
      <div className="pt-4">
        <RulesSection />
      </div>

      {/* 
        ========================================================================
        MODAL: TARIK SALDO DOMPET JASTIPER
        ========================================================================
      */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-emerald-200 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#014732] flex items-center justify-center border border-emerald-100">
                  <Wallet className="w-5 h-5 text-[#014732]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#014732]">Tarik Saldo Dompet</h3>
                  <p className="text-xs text-slate-500">Pencairan komisi & ongkir jastiper</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200 text-center space-y-1">
              <span className="text-xs text-slate-500 font-medium">Saldo Tersedia</span>
              <div className="text-2xl font-black text-[#014732]">
                Rp {walletBalance.toLocaleString('id-ID')}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Nominal Penarikan (Rp)
              </label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                max={walletBalance}
                min={10000}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#10b981] rounded-2xl text-sm font-bold text-slate-800 focus:outline-hidden"
              />
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Metode Pencairan:</span>
                <strong className="text-slate-800">QRIS / BSI (Bank Syariah Indonesia)</strong>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmWithdraw}
                disabled={isWithdrawing}
                className="w-1/2 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5"
              >
                {isWithdrawing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Konfirmasi Tarik</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
