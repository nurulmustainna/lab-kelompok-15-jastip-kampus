import React, { useState, useMemo } from 'react';
import { 
  Wallet, Bike, MapPin, Star, PlusCircle, Clock, Package, 
  CheckCircle2, DollarSign, Send, Scale, Phone, Check,
  RefreshCw, X, Zap, Flame, Store, ShoppingBag, 
  AlertCircle, ChevronRight, User, ArrowUpRight, Eye, Lock, Unlock
} from 'lucide-react';
import { JastipSession, JastipOrder, StudentAccount } from '../types';
import { RulesSection } from './RulesSection';

interface JastiperWorkspaceProps {
  sessions?: JastipSession[];
  onAddNewSession?: (session: JastipSession) => void;
  onShowToast?: (msg: string) => void;
  currentOrder?: JastipOrder;
  onUpdateOrder?: (order: JastipOrder) => void;
  allStudentOrders?: Record<string, JastipOrder[]>;
  onUpdateStudentOrder?: (studentNim: string, order: JastipOrder) => void;
  currentStudent?: StudentAccount;
}

export const JastiperWorkspace: React.FC<JastiperWorkspaceProps> = ({
  sessions = [],
  onAddNewSession,
  onShowToast,
  currentOrder: _currentOrder,
  onUpdateOrder: _onUpdateOrder,
  allStudentOrders = {},
  onUpdateStudentOrder,
  currentStudent
}) => {
  // === STATE MANAGEMENT ===
  
  // Wallet & Financial
  const [settledBalance, setSettledBalance] = useState(150000); // Dana yang sudah cairkan
  const [pendingEscrow, setPendingEscrow] = useState(65000); // Dana dalam pending escrow
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('150000');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // New Session Form
  const [routeInput, setRouteInput] = useState('');
  const [closingTimeInput, setClosingTimeInput] = useState('');
  const [slotLimitInput, setSlotLimitInput] = useState('');
  const [isSubmittingSession, setIsSubmittingSession] = useState(false);

  // Order Management
  const [orderFilterTab, setOrderFilterTab] = useState<'ALL' | 'PENDING_CLAIM' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');
  const [claimedItemsMap, setClaimedItemsMap] = useState<Record<string, string[]>>({});
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<{studentNim: string, order: JastipOrder} | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState<{studentNim: string, order: JastipOrder} | null>(null);
  const [verificationPin, setVerificationPin] = useState('');

  // Convert allStudentOrders into array
  // Handle both formats: Record<string, JastipOrder> and Record<string, JastipOrder[]>
  const studentOrdersList = useMemo(() => {
    return Object.entries(allStudentOrders || {}).flatMap(([nim, orders]) => {
      // Handle case where orders is a single JastipOrder (not array)
      const orderArray = Array.isArray(orders) ? orders : (orders ? [orders] : []);
      return orderArray.map((order) => ({
        studentNim: nim,
        order
      }));
    });
  }, [allStudentOrders]);

  // === METRICS CALCULATIONS ===
  
  const activeOrdersCount = useMemo(() => {
    return studentOrdersList.filter(({ order }) => 
      order.status === 'DIBELI_JASTIPER' || order.status === 'MENUJU_KAMPUS' || order.status === 'SAMPAI_DI_TITIK_TEMU'
    ).length;
  }, [studentOrdersList]);

  const pendingClaimsCount = useMemo(() => {
    return studentOrdersList.filter(({ order }) => order.status === 'ESCROW_DITAMPUNG').length;
  }, [studentOrdersList]);

  const completedCount = useMemo(() => {
    return studentOrdersList.filter(({ order }) => order.status === 'SELESAI_DITERIMA').length;
  }, [studentOrdersList]);

  const totalEarningsThisWeek = useMemo(() => {
    return studentOrdersList
      .filter(({ order }) => order.status === 'SELESAI_DITERIMA')
      .reduce((sum, { order }) => sum + order.totalJastipFee, 0);
  }, [studentOrdersList]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return studentOrdersList.filter(({ order }) => {
      if (orderFilterTab === 'PENDING_CLAIM') return order.status === 'ESCROW_DITAMPUNG';
      if (orderFilterTab === 'IN_PROGRESS') return order.status === 'DIBELI_JASTIPER' || order.status === 'MENUJU_KAMPUS' || order.status === 'SAMPAI_DI_TITIK_TEMU';
      if (orderFilterTab === 'COMPLETED') return order.status === 'SELESAI_DITERIMA';
      return true;
    });
  }, [studentOrdersList, orderFilterTab]);

  // === VALIDATION FUNCTIONS ===

  const isValidStatusTransition = (currentStatus: JastipOrder['status'], nextStatus: JastipOrder['status']): boolean => {
    const validTransitions: Record<JastipOrder['status'], JastipOrder['status'][]> = {
      'MENUNGGU_PEMBAYARAN': ['ESCROW_DITAMPUNG'],
      'ESCROW_DITAMPUNG': ['DIBELI_JASTIPER'],
      'DIBELI_JASTIPER': ['MENUJU_KAMPUS'],
      'MENUJU_KAMPUS': ['SAMPAI_DI_TITIK_TEMU'],
      'SAMPAI_DI_TITIK_TEMU': ['SELESAI_DITERIMA'],
      'SELESAI_DITERIMA': [],
    };
    
    return validTransitions[currentStatus]?.includes(nextStatus) ?? false;
  };

  // === EVENT HANDLERS ===

  const handleClaimEntireOrder = (studentNim: string, order: JastipOrder) => {
    if (order.status !== 'ESCROW_DITAMPUNG') {
      onShowToast?.('❌ Pesanan ini sudah diklaim atau tidak valid untuk diklaim!');
      return;
    }

    const updatedOrder: JastipOrder = {
      ...order,
      status: 'DIBELI_JASTIPER',
      escrowStatus: 'HELD_IN_ESCROW',
      trackingHistory: order.trackingHistory.map((step, idx) => {
        if (idx === 2) {
          return {
            ...step,
            done: true,
            note: 'Pesanan resmi diklaim oleh Jastiper Andi M. Fikri (Siapa Cepat Dia Dapat).'
          };
        }
        return step;
      })
    };

    const allItemIds = order.items.map(it => it.item.id);
    setClaimedItemsMap(prev => ({
      ...prev,
      [order.id]: allItemIds
    }));

    // Tambahkan ke pending escrow
    setPendingEscrow(prev => prev + order.grandTotal);

    if (onUpdateStudentOrder) {
      onUpdateStudentOrder(studentNim, updatedOrder);
    }
    onShowToast?.(`⚡ Berhasil mengklaim pesanan ${order.orderCode}! Rp ${order.totalJastipFee.toLocaleString('id-ID')} ditambahkan ke pending escrow.`);
  };

  const handleClaimSingleItem = (studentNim: string, order: JastipOrder, itemId: string, itemName: string, fee: number) => {
    if (order.status !== 'ESCROW_DITAMPUNG') {
      onShowToast?.('❌ Tidak dapat mengklaim item dari pesanan yang sudah diklaim!');
      return;
    }

    const currentClaimed = claimedItemsMap[order.id] || [];
    if (currentClaimed.includes(itemId)) return;

    const newClaimed = [...currentClaimed, itemId];
    setClaimedItemsMap(prev => ({
      ...prev,
      [order.id]: newClaimed
    }));

    const updatedOrder: JastipOrder = {
      ...order,
      status: 'DIBELI_JASTIPER',
      escrowStatus: 'HELD_IN_ESCROW',
      trackingHistory: order.trackingHistory.map((step, idx) => {
        if (idx === 2) {
          return {
            ...step,
            done: true,
            note: `Menu "${itemName}" diklaim oleh Jastiper Andi M. Fikri (+Rp ${fee.toLocaleString('id-ID')}).`
          };
        }
        return step;
      })
    };

    setPendingEscrow(prev => prev + order.grandTotal);

    if (onUpdateStudentOrder) {
      onUpdateStudentOrder(studentNim, updatedOrder);
    }
    onShowToast?.(`⚡ Menu "${itemName}" berhasil diklaim! (+Rp ${fee.toLocaleString('id-ID')})`);
  };

  const handleAdvanceOrderStatus = (studentNim: string, order: JastipOrder) => {
    let nextStatus: JastipOrder['status'] = order.status;

    if (order.status === 'DIBELI_JASTIPER') {
      nextStatus = 'MENUJU_KAMPUS';
    } else if (order.status === 'MENUJU_KAMPUS') {
      nextStatus = 'SAMPAI_DI_TITIK_TEMU';
    } else if (order.status === 'SAMPAI_DI_TITIK_TEMU') {
      // Require verification before transition
      setShowVerificationModal({ studentNim, order });
      return;
    }

    if (!isValidStatusTransition(order.status, nextStatus)) {
      onShowToast?.(`❌ Transisi status tidak valid: ${order.status} → ${nextStatus}`);
      return;
    }

    const toastMsg = 
      nextStatus === 'MENUJU_KAMPUS' ? `🏍️ Pesanan ${order.orderCode} telah dibeli! Menuju kampus...` :
      nextStatus === 'SAMPAI_DI_TITIK_TEMU' ? `📍 Anda tiba di titik temu (${order.meetingPoint})` :
      'Pesanan diproses';

    const updatedOrder: JastipOrder = {
      ...order,
      status: nextStatus,
      trackingHistory: order.trackingHistory.map((step, idx) => {
        if (nextStatus === 'MENUJU_KAMPUS' && idx === 3) return { ...step, done: true };
        if (nextStatus === 'SAMPAI_DI_TITIK_TEMU' && (idx === 4)) return { ...step, done: true };
        return step;
      })
    };

    if (onUpdateStudentOrder) {
      onUpdateStudentOrder(studentNim, updatedOrder);
    }
    onShowToast?.(toastMsg);
  };

  const handleCompleteWithVerification = (studentNim: string, order: JastipOrder) => {
    // Validasi PIN (dalam real scenario ini dari backend)
    if (verificationPin !== '1234') {
      onShowToast?.('❌ PIN verifikasi salah! Silakan coba lagi.');
      return;
    }

    if (!isValidStatusTransition(order.status, 'SELESAI_DITERIMA')) {
      onShowToast?.(`❌ Pesanan tidak dapat diselesaikan dari status ${order.status}`);
      return;
    }

    // Pindahkan dari pending escrow ke settled balance
    setPendingEscrow(prev => Math.max(0, prev - order.grandTotal));
    setSettledBalance(prev => prev + order.totalJastipFee);

    const updatedOrder: JastipOrder = {
      ...order,
      status: 'SELESAI_DITERIMA',
      escrowStatus: 'RELEASED_TO_JASTIPER',
      trackingHistory: order.trackingHistory.map((step) => ({ ...step, done: true }))
    };

    if (onUpdateStudentOrder) {
      onUpdateStudentOrder(studentNim, updatedOrder);
    }

    setShowVerificationModal(null);
    setVerificationPin('');
    onShowToast?.(`🎉 Pesanan selesai! +Rp ${order.totalJastipFee.toLocaleString('id-ID')} ditransfer ke saldo.`);
  };

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
        jastiperName: currentStudent?.name || 'Andi Muhammad Fikri',
        jastiperProdi: currentStudent?.prodi || 'S1 Teknik Informatika Unismuh',
        jastiperAvatar: currentStudent?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        routeFrom: routeInput.includes('ke') ? routeInput.split('ke')[0].trim() : 'Kantin Menara Iqra',
        routeTo: routeInput.includes('ke') ? routeInput.split('ke')[1].trim() : 'Gedung FKIP Unismuh',
        meetingPoint: 'Lobby Menara Iqra Lt.1',
        departureTime: closingTimeInput || '13:00 WITA',
        closingTime: closingTimeInput || '12:30 WITA',
        closingTimestamp: Date.now() + 45 * 60 * 1000,
        maxCapacityKg: 5.0,
        currentCapacityKg: 0.0,
        maxOrders: parseInt(slotLimitInput) || 5,
        currentOrders: 0,
        status: 'OPEN',
        availableStores: ['Kantin Menara Iqra', 'Kantin FKIP', 'Warung Talasalapang']
      };

      if (onAddNewSession) {
        onAddNewSession(newSession);
      }
      onShowToast?.('✅ Sesi Jastip baru berhasil dipublikasikan!');
      setRouteInput('');
      setClosingTimeInput('');
      setSlotLimitInput('');
    }, 800);
  };

  const handleConfirmWithdraw = () => {
    const amount = parseInt(withdrawAmount);
    if (isNaN(amount) || amount <= 0 || amount > settledBalance) {
      onShowToast?.('❌ Nominal tidak valid atau melebihi saldo!');
      return;
    }

    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      setSettledBalance(prev => prev - amount);
      setShowWithdrawModal(false);
      onShowToast?.(`✅ Pencairan Rp ${amount.toLocaleString('id-ID')} berhasil!`);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* HEADER BANNER */}
      <div className="bg-[#014732] text-white p-6 sm:p-8 rounded-3xl border border-emerald-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-start sm:items-center gap-4 z-10">
          <div className="relative">
            <img 
              src={currentStudent?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'} 
              alt="Avatar Jastiper" 
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#10b981] shadow-md"
            />
            <span className="absolute -bottom-1 -right-1 bg-[#10b981] text-[#014732] text-[10px] font-black px-1.5 py-0.5 rounded-full border border-white flex items-center gap-0.5 shadow-xs">
              <Check className="w-2.5 h-2.5" />
              <span>Aktif</span>
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 bg-[#10b981] text-[#014732] text-[10px] font-black uppercase rounded-full tracking-wider shadow-xs">
                Mitra Resmi Jastip Kampus
              </span>
              <span className="text-[10px] bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded-md font-mono border border-emerald-700">
                NIM: {currentStudent?.nim || '105841104423'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Workspace Mitra Jasa Titip (Jastiper)
            </h1>
            <p className="text-xs text-emerald-200">
              Selamat bertugas, <strong>{currentStudent?.name || 'Andi Muhammad Fikri'}</strong> ({currentStudent?.prodi || 'Teknik Informatika'}). Kelola pesanan dengan sistem escrow aman!
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <div className="bg-[#013525] border border-emerald-700/80 px-4 py-2.5 rounded-2xl space-y-0.5 text-right">
            <span className="text-[10px] text-emerald-300 uppercase tracking-wider block font-bold">
              Total Pending Escrow
            </span>
            <div className="text-lg sm:text-xl font-black text-amber-400 font-mono">
              Rp {pendingEscrow.toLocaleString('id-ID')}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowWithdrawModal(true)}
            className="px-4 py-3 bg-[#10b981] hover:bg-[#34d399] text-[#014732] font-black text-xs rounded-2xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 hover:scale-102"
          >
            <DollarSign className="w-4 h-4" />
            <span>Tarik Saldo</span>
          </button>
        </div>
      </div>

      {/* METRICS GRID - IMPROVED */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Settled Balance */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Saldo Selesai
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#014732] flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
                <Unlock className="w-4.5 h-4.5 text-emerald-600" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600 tracking-tight">
              Rp {settledBalance.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Dana yang sudah cairkan</p>
          </div>
          <button
            type="button"
            onClick={() => setShowWithdrawModal(true)}
            className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <DollarSign className="w-4 h-4" />
            <span>Tarik</span>
          </button>
        </div>

        {/* Pending Escrow */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200 bg-amber-50/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                Escrow Tertahan
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-200 group-hover:scale-105 transition-transform">
                <Lock className="w-4.5 h-4.5 text-amber-600" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">
              Rp {pendingEscrow.toLocaleString('id-ID')}
            </div>
            <p className="text-[11px] text-amber-800 mt-0.5 font-medium">Menunggu verifikasi serah</p>
          </div>
          <div className="text-[11px] text-amber-800 px-2.5 py-1.5 bg-amber-100 rounded-lg border border-amber-200 text-center font-semibold">
            Aman di Rekber Escrow
          </div>
        </div>

        {/* Active Orders */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Pesanan Aktif
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#014732] flex items-center justify-center border border-emerald-100 group-hover:scale-105 transition-transform">
                <Package className="w-4.5 h-4.5 text-[#014732]" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#014732] tracking-tight">
              {activeOrdersCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Sedang diproses</p>
          </div>
          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping"></span>
            <span>Live</span>
          </div>
        </div>

        {/* Pending Claims */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200 bg-amber-50/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                Siap Diklaim
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-200 group-hover:scale-105 transition-transform">
                <Flame className="w-4.5 h-4.5 text-amber-600" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-950 tracking-tight">
              {pendingClaimsCount}
            </div>
            <p className="text-[11px] text-amber-800 mt-0.5 font-medium">Cepat! Klaim sekarang</p>
          </div>
          <div className="text-[11px] font-bold text-amber-800 text-center">
            Siapa Cepat Dia Dapat
          </div>
        </div>

        {/* Rating */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Rating Anda
              </span>
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200 group-hover:scale-105 transition-transform">
                <Star className="w-4.5 h-4.5 text-amber-500 fill-amber-500" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#014732] tracking-tight flex items-baseline gap-1">
              <span>4.9</span>
              <span className="text-amber-500 text-xl ml-1">★</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">28 Rating</p>
          </div>
          <div className="text-[11px] font-bold text-emerald-700 text-center">
            Top Runner Level Gold
          </div>
        </div>
      </div>

      {/* BUKA SESI JASTIP BARU */}
      <div className="bg-[#014732] text-white rounded-3xl p-6 sm:p-8 border border-emerald-800 shadow-xl space-y-6">
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
                Publikasikan rute & slot untuk mahasiswa yang ingin menitip belanjaan
              </p>
            </div>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#013525] border border-emerald-700 text-[11px] text-emerald-300 font-mono">
            <Clock className="w-3.5 h-3.5 text-[#10b981]" />
            <span>Auto-Lock H-30 Menit</span>
          </div>
        </div>

        <form onSubmit={handleCreateSession} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
                1. Rute Tujuan
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
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
                2. Waktu Closing
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
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-emerald-200 uppercase tracking-wider">
                3. Max Slot Bagasi
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
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={isSubmittingSession}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#10b981] hover:bg-[#34d399] text-[#014732] font-black text-sm rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 hover:scale-102"
            >
              {isSubmittingSession ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-[#014732]" />
                  <span>Membuka...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-[#014732]" />
                  <span>Buka Sesi Sekarang</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* DAFTAR PESANAN */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 bg-emerald-100 text-[#014732] text-[10px] font-black uppercase rounded-full border border-emerald-200">
                Live Order Pool
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                <Zap className="w-3 h-3 text-amber-600" />
                <span>Siapa Cepat Dia Dapat</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#014732] tracking-tight mt-1">
              Pesanan Masuk (Status Transisi Berlapis)
            </h2>
            <p className="text-xs text-slate-500">
              Status harus melalui urutan yang benar. Serah terima memerlukan verifikasi PIN sebelum cairkan dana.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl self-start md:self-auto overflow-x-auto max-w-full">
            {(['ALL', 'PENDING_CLAIM', 'IN_PROGRESS', 'COMPLETED'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setOrderFilterTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  orderFilterTab === tab
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab === 'ALL' && `Semua (${studentOrdersList.length})`}
                {tab === 'PENDING_CLAIM' && `Siap Klaim (${pendingClaimsCount})`}
                {tab === 'IN_PROGRESS' && `Proses (${activeOrdersCount})`}
                {tab === 'COMPLETED' && `Selesai (${completedCount})`}
              </button>
            ))}
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-3xl space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Tidak ada pesanan dalam kategori ini</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Pesanan mahasiswa akan muncul di sini untuk Anda klaim dan proses.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map(({ studentNim, order }) => {
              const isPendingClaim = order.status === 'ESCROW_DITAMPUNG';
              const isInProgress = order.status === 'DIBELI_JASTIPER' || order.status === 'MENUJU_KAMPUS' || order.status === 'SAMPAI_DI_TITIK_TEMU';
              const isCompleted = order.status === 'SELESAI_DITERIMA';
              const claimedItemsForThisOrder = claimedItemsMap[order.id] || [];

              return (
                <div
                  key={order.id}
                  className={`rounded-3xl border transition-all overflow-hidden ${
                    isPendingClaim
                      ? 'bg-gradient-to-b from-amber-50/40 via-white to-white border-amber-200 shadow-md hover:border-amber-300'
                      : isInProgress
                      ? 'bg-gradient-to-b from-emerald-50/40 via-white to-white border-emerald-200 shadow-sm'
                      : 'bg-slate-50 border-slate-200 opacity-80'
                  }`}
                >
                  {/* Order Header */}
                  <div className={`p-4 sm:p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isPendingClaim ? 'bg-amber-100/40 border-amber-200' : isInProgress ? 'bg-emerald-100/40 border-emerald-200' : 'bg-slate-100 border-slate-200'
                  }`}>
                    <div className="flex items-start sm:items-center gap-3 flex-1">
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-xs ${
                        isPendingClaim ? 'bg-amber-500 text-white' : isInProgress ? 'bg-[#014732] text-white' : 'bg-slate-400 text-white'
                      }`}>
                        {order.customerName.charAt(0)}
                      </div>

                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm sm:text-base font-black text-emerald-950">
                            {order.customerName}
                          </h3>
                          <span className="text-xs font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                            NIM: {studentNim}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
                          <span className="font-mono text-[11px] font-bold text-emerald-800">
                            #{order.orderCode}
                          </span>
                          <span className="flex items-center gap-1 text-slate-500 text-[11px]">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{order.createdAt}</span>
                          </span>
                          <span className="flex items-center gap-1 text-emerald-700 text-[11px] font-semibold">
                            <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>{order.meetingPoint}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2 flex-wrap sm:self-center">
                      {isPendingClaim ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-white text-xs font-black rounded-full shadow-xs animate-pulse">
                          <Zap className="w-3.5 h-3.5" />
                          <span>Menunggu Klaim</span>
                        </span>
                      ) : isInProgress ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white text-xs font-bold rounded-full shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                          <span>
                            {order.status === 'DIBELI_JASTIPER' ? 'Dibelikan' :
                             order.status === 'MENUJU_KAMPUS' ? 'OTW' : 'Tiba'}
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-200 text-slate-700 text-xs font-bold rounded-full">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Selesai</span>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOrderDetail({ studentNim, order });
                          setShowDetailModal(true);
                        }}
                        className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer text-slate-500 hover:text-slate-700"
                        title="Lihat detail pesanan"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 sm:p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <ShoppingBag className="w-4 h-4 text-emerald-600" />
                        <span>Menu ({order.items.length} item)</span>
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        Total: Rp {order.totalItemPrice.toLocaleString('id-ID')} | Ongkir: +Rp {order.totalJastipFee.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {order.items.map((it, idx) => {
                        const itemTotal = it.item.price * it.qty;
                        const jastipEarnings = it.item.jastipFee * it.qty;
                        const isThisItemClaimed = claimedItemsForThisOrder.includes(it.item.id) || !isPendingClaim;

                        return (
                          <div 
                            key={idx}
                            className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                              isThisItemClaimed
                                ? 'bg-emerald-50/70 border-emerald-200'
                                : 'bg-white border-slate-200 hover:border-amber-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative shrink-0">
                                <img 
                                  src={it.item.image} 
                                  alt={it.item.name} 
                                  referrerPolicy="no-referrer"
                                  className="w-12 h-12 rounded-xl object-cover border border-emerald-100"
                                />
                                <span className="absolute -top-1.5 -left-1.5 bg-emerald-700 text-white font-mono font-bold text-[9px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                                  {it.qty}x
                                </span>
                              </div>

                              <div className="space-y-0.5">
                                <span className="text-[9px] font-bold text-emerald-800 uppercase bg-emerald-100 px-1.5 py-0.5 rounded">
                                  {it.item.storeName}
                                </span>
                                <h4 className="text-xs font-bold text-slate-900 leading-tight">
                                  {it.item.name}
                                </h4>
                                <div className="flex items-center gap-2 text-[11px]">
                                  <span className="text-slate-500 font-mono">
                                    Rp {itemTotal.toLocaleString('id-ID')}
                                  </span>
                                  <span className="text-emerald-700 font-mono font-bold">
                                    +Rp {jastipEarnings.toLocaleString('id-ID')}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="shrink-0">
                              {isThisItemClaimed ? (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-xl border border-emerald-300">
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span>Klaim</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleClaimSingleItem(studentNim, order, it.item.id, it.item.name, jastipEarnings)}
                                  className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-[11px] rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95 group"
                                >
                                  <Zap className="w-3 h-3 text-yellow-200 group-hover:scale-110 transition-transform" />
                                  <span>Klaim</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>Dana Rp <strong>{order.grandTotal.toLocaleString('id-ID')}</strong> dalam Escrow</span>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        {isPendingClaim && (
                          <button
                            type="button"
                            onClick={() => handleClaimEntireOrder(studentNim, order)}
                            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <Zap className="w-3.5 h-3.5 text-amber-300" />
                            <span>Klaim Semua</span>
                          </button>
                        )}

                        {order.status === 'DIBELI_JASTIPER' && (
                          <button
                            type="button"
                            onClick={() => handleAdvanceOrderStatus(studentNim, order)}
                            className="px-4 py-2 bg-[#014732] hover:bg-[#025a40] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <Bike className="w-3.5 h-3.5 text-[#10b981]" />
                            <span>Belanja Selesai → OTW</span>
                          </button>
                        )}

                        {order.status === 'MENUJU_KAMPUS' && (
                          <button
                            type="button"
                            onClick={() => handleAdvanceOrderStatus(studentNim, order)}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <MapPin className="w-3.5 h-3.5" />
                            <span>Tiba di Titik Temu</span>
                          </button>
                        )}

                        {order.status === 'SAMPAI_DI_TITIK_TEMU' && (
                          <button
                            type="button"
                            onClick={() => setShowVerificationModal({ studentNim, order })}
                            className="px-5 py-2.5 bg-[#10b981] hover:bg-[#059669] text-emerald-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                          >
                            <CheckCircle2 className="w-4 h-4 text-emerald-900" />
                            <span>Verifikasi Serah Terima</span>
                          </button>
                        )}

                        {!isPendingClaim && (
                          <a
                            href={`https://wa.me/6281244558891?text=Halo%20${encodeURIComponent(order.customerName)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Hubungi</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RULES SECTION */}
      <div className="pt-4">
        <RulesSection />
      </div>

      {/* ========== MODALS ========== */}

      {/* Order Detail Modal */}
      {showDetailModal && selectedOrderDetail && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl border border-emerald-200 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-xl font-black text-[#014732]">Detail Pesanan</h3>
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-black text-slate-700 uppercase">Timeline Pesanan</h4>
              <div className="space-y-2">
                {selectedOrderDetail.order.trackingHistory.map((step, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      step.done ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'
                    }`}>
                      {step.done ? <Check className="w-3.5 h-3.5" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold text-slate-800">{step.step}</div>
                      <div className="text-[11px] text-slate-500">{step.note}</div>
                      <div className="text-[10px] text-slate-400">{step.timestamp}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-3">
              <h4 className="text-xs font-black text-slate-700 uppercase">Informasi Pembayaran & Escrow</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[11px] text-slate-500 font-medium">Total Harga Barang</span>
                  <div className="text-lg font-bold text-slate-900">Rp {selectedOrderDetail.order.totalItemPrice.toLocaleString('id-ID')}</div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-medium">Fee Jastiper</span>
                  <div className="text-lg font-bold text-emerald-600">+Rp {selectedOrderDetail.order.totalJastipFee.toLocaleString('id-ID')}</div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-medium">App Fee</span>
                  <div className="text-lg font-bold text-slate-900">Rp {selectedOrderDetail.order.appFee.toLocaleString('id-ID')}</div>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 font-medium">Total Grand</span>
                  <div className="text-lg font-bold text-amber-600">Rp {selectedOrderDetail.order.grandTotal.toLocaleString('id-ID')}</div>
                </div>
              </div>
              <div className="pt-2 border-t border-emerald-200 text-[11px]">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full border border-amber-300 font-semibold">
                  <Lock className="w-3 h-3" />
                  Status: {selectedOrderDetail.order.escrowStatus}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowDetailModal(false)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Verification Modal for Serah Terima */}
      {showVerificationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-emerald-200 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#014732]">Verifikasi Serah Terima</h3>
                  <p className="text-xs text-slate-500">Masukkan PIN untuk menyelesaikan pesanan</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowVerificationModal(null);
                  setVerificationPin('');
                }}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-center space-y-2">
              <span className="text-xs text-slate-600 font-medium block">Dana di Escrow</span>
              <div className="text-2xl font-black text-amber-700">
                Rp {showVerificationModal.order.grandTotal.toLocaleString('id-ID')}
              </div>
              <span className="text-[11px] text-amber-800 font-semibold block">
                Akan ditransfer setelah verifikasi berhasil
              </span>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                PIN Verifikasi (Demo: 1234)
              </label>
              <input
                type="password"
                value={verificationPin}
                onChange={(e) => setVerificationPin(e.target.value)}
                placeholder="••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#10b981] rounded-2xl text-sm font-bold text-slate-800 focus:outline-hidden text-center tracking-widest"
              />
              <p className="text-[10px] text-slate-500 text-center">
                (Dalam produksi, PIN akan dikirim via SMS/Email)
              </p>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowVerificationModal(null);
                  setVerificationPin('');
                }}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => handleCompleteWithVerification(showVerificationModal.studentNim, showVerificationModal.order)}
                className="w-1/2 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Verifikasi & Selesai</span>
              </button>
            </div>

            <div className="bg-blue-50 p-3 rounded-2xl border border-blue-200 text-xs text-blue-800 font-semibold">
              ℹ️ Pesanan akan berubah ke SELESAI_DITERIMA dan dana akan dicairkan ke saldo Anda.
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal - IMPROVED */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-emerald-200 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#014732] flex items-center justify-center border border-emerald-100">
                  <Wallet className="w-5 h-5 text-[#014732]" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#014732]">Tarik Saldo</h3>
                  <p className="text-xs text-slate-500">Pencairan dana yang sudah selesai</p>
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
                Rp {settledBalance.toLocaleString('id-ID')}
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
                max={settledBalance}
                min={10000}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#10b981] rounded-2xl text-sm font-bold text-slate-800 focus:outline-hidden"
              />
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Metode:</span>
                <strong className="text-slate-800">QRIS / BSI Syariah</strong>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowWithdrawModal(false)}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmWithdraw}
                disabled={isWithdrawing}
                className="w-1/2 py-2.5 bg-[#10b981] hover:bg-[#059669] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isWithdrawing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Proses...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Tarik Sekarang</span>
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
