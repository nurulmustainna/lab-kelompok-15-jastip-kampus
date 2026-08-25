import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Network, ShoppingBag, Store, Users, CreditCard, 
  Bell, Activity, RefreshCw, Box, Shield, CheckCircle2, AlertTriangle, 
  Terminal, ArrowUpRight, Play, Pause, Trash2, Copy, Check, ExternalLink, 
  Layers, Database, Cpu, Search, Filter, ShieldCheck, Zap, LogOut, ChevronRight,
  TrendingUp, Clock, MapPin, Radio, Lock, Server, Sparkles, UserCheck, X
} from 'lucide-react';
import { CatalogItem, JastipOrder, JastipSession, StudentAccount } from '../types';

export type AdminSidebarNav = 
  | 'dashboard' 
  | 'ddd-architecture' 
  | 'orders' 
  | 'catalog' 
  | 'users' 
  | 'escrow' 
  | 'notifications' 
  | 'monitoring';

interface AdminDashboardProps {
  onReturnToPortal?: () => void;
  onLogoutToLanding?: () => void;
  catalogItems?: CatalogItem[];
  sessions?: JastipSession[];
  currentOrder?: JastipOrder;
  studentAccounts?: StudentAccount[];
  studentOrders?: Record<string, JastipOrder[]>;
  onUpdateCatalogItem?: (item: CatalogItem) => void;
  onAddCatalogItem?: (item: CatalogItem) => void;
  onDeleteCatalogItem?: (itemId: string) => void;
}

interface LogEntry {
  id: string;
  timestamp: string;
  service: 'order-service' | 'catalog-service' | 'payment-service' | 'tracking-service' | 'gateway';
  level: 'SUCCESS' | 'INFO' | 'WARN' | 'TRACE';
  message: string;
  traceId: string;
  latencyMs: number;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onReturnToPortal,
  onLogoutToLanding,
  catalogItems = [],
  sessions = [],
  currentOrder,
  studentAccounts = [],
  studentOrders = {},
  onUpdateCatalogItem,
  onAddCatalogItem,
  onDeleteCatalogItem
}) => {
  const [activeNav, setActiveNav] = useState<AdminSidebarNav>('dashboard');
  const [isStressTesting, setIsStressTesting] = useState(false);
  const [stressTestProgress, setStressTestProgress] = useState(0);
  const [isLogStreaming, setIsLogStreaming] = useState(true);
  const [selectedServiceFilter, setSelectedServiceFilter] = useState<string>('ALL');
  const [copiedLogId, setCopiedLogId] = useState<string | null>(null);
  const [showDddModal, setShowDddModal] = useState(false);
  const [systemTpsMultiplier, setSystemTpsMultiplier] = useState(1);
  const [catalogSearch, setCatalogSearch] = useState<string>('');
  const [catalogCategoryFilter, setCatalogCategoryFilter] = useState<string>('SEMUA');
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [isAddingNewItem, setIsAddingNewItem] = useState<boolean>(false);
  const [editSuccessMsg, setEditSuccessMsg] = useState<string | null>(null);
  const [newItemForm, setNewItemForm] = useState<Partial<CatalogItem>>({
    category: 'Makanan',
    available: true,
    storeName: 'Kantin Menara Iqra',
    jastipFee: 5000,
    rating: 4.8,
    soldCount: 0
  });

  // Initial audit log items specified in prompt + real-time buffer
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'log-1',
      timestamp: '13:59:15.447',
      service: 'order-service',
      level: 'SUCCESS',
      message: 'POST /v1/orders/session/SES-001/checkout - Order #ORD-8821 created & payload dispatched to event-bus',
      traceId: 'tr-7f89b1c2',
      latencyMs: 4
    },
    {
      id: 'log-2',
      timestamp: '12:47:38.102',
      service: 'payment-service',
      level: 'SUCCESS',
      message: 'POST /v1/escrow/vault/lock - Amount Rp 33.000 locked in Escrow Contract #ESC-8821 (QRIS Unismuh)',
      traceId: 'tr-99e2a441',
      latencyMs: 12
    },
    {
      id: 'log-3',
      timestamp: '12:47:35.844',
      service: 'catalog-service',
      level: 'INFO',
      message: 'GET /v1/items/search?query=ayam+geprek&location=talasalapang - Cache HIT Redis (1.2ms)',
      traceId: 'tr-33c10b78',
      latencyMs: 2
    },
    {
      id: 'log-4',
      timestamp: '12:46:10.512',
      service: 'tracking-service',
      level: 'SUCCESS',
      message: 'WS /v1/telemetry/runner/ANDI-01 - GPS Lat -5.1788 Lon 119.4322 Broadcasted to Client Subscribers',
      traceId: 'tr-110bb89a',
      latencyMs: 8
    },
    {
      id: 'log-5',
      timestamp: '12:45:00.015',
      service: 'order-service',
      level: 'INFO',
      message: 'CRON /v1/orders/auto-closing - Evaluated 3 active sessions. 0 sessions reached H-30m deadline',
      traceId: 'tr-aa543b12',
      latencyMs: 5
    }
  ]);

  const logEndRef = useRef<HTMLDivElement>(null);

  // Live real-time log simulator
  useEffect(() => {
    if (!isLogStreaming) return;

    const interval = setInterval(() => {
      const services: ('order-service' | 'catalog-service' | 'payment-service' | 'tracking-service')[] = [
        'order-service', 'catalog-service', 'payment-service', 'tracking-service'
      ];
      const randomService = services[Math.floor(Math.random() * services.length)];
      
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;

      let msg = '';
      let lvl: 'SUCCESS' | 'INFO' | 'WARN' = 'SUCCESS';
      let lat = Math.floor(Math.random() * 10) + 2;

      switch (randomService) {
        case 'order-service':
          msg = `GET /v1/sessions/active - Health OK (Payload sync with Menara Iqra runner cluster)`;
          lvl = 'INFO';
          break;
        case 'catalog-service':
          msg = `GET /v1/catalog/categories - Fetched 50 items from SQLite/PostgreSQL cluster with read-replica`;
          lvl = 'INFO';
          lat = 2;
          break;
        case 'payment-service':
          msg = `POST /v1/escrow/verify-signature - SHA256 HMAC Signature valid for Payment Gateway Unismuh`;
          lvl = 'SUCCESS';
          lat = 11;
          break;
        case 'tracking-service':
          msg = `PUB/SUB /events/runner.position_updated - Broadcasted coordinates to 42 active web clients`;
          lvl = 'SUCCESS';
          lat = 7;
          break;
      }

      const newLog: LogEntry = {
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: timeStr,
        service: randomService,
        level: lvl,
        message: msg,
        traceId: `tr-${Math.random().toString(36).substr(2, 8)}`,
        latencyMs: lat
      };

      setLogs(prev => [newLog, ...prev.slice(0, 79)]);
    }, 4500);

    return () => clearInterval(interval);
  }, [isLogStreaming]);

  // Handle Trigger Stress Test (10k TPS)
  const handleTriggerStressTest = () => {
    if (isStressTesting) return;
    setIsStressTesting(true);
    setStressTestProgress(0);
    setSystemTpsMultiplier(4.2);

    // Rapidly inject burst logs
    const burstInterval = setInterval(() => {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
      
      const burstLog: LogEntry = {
        id: `stress-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: timeStr,
        service: 'order-service',
        level: 'SUCCESS',
        message: `[STRESS-TEST 10,000 TPS] Distributed load test worker #${Math.floor(Math.random() * 200)} - 200 OK (0 packet drop)`,
        traceId: `stress-${Math.random().toString(36).substr(2, 6)}`,
        latencyMs: Math.floor(Math.random() * 8) + 3
      };
      setLogs(prev => [burstLog, ...prev.slice(0, 85)]);
    }, 200);

    const progressInterval = setInterval(() => {
      setStressTestProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(burstInterval);
          setIsStressTesting(false);
          setSystemTpsMultiplier(1);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleCopyLog = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLogId(id);
    setTimeout(() => setCopiedLogId(null), 2000);
  };

  const filteredLogs = selectedServiceFilter === 'ALL' 
    ? logs 
    : logs.filter(l => l.service === selectedServiceFilter);

  // Microservices Status Data
  const microservices = [
    {
      id: 'order-service',
      name: 'Order-Service',
      port: ':8001',
      status: 'ONLINE',
      desc: 'Kelola Sesi Buka Order & Aturan Closing',
      latency: `${4}ms`,
      tps: Math.round(2450 * systemTpsMultiplier).toLocaleString('id-ID'),
      health: '100%',
      icon: ShoppingBag,
      color: '#10B981',
      bgGradient: 'from-emerald-950/60 to-[#0F2D24]'
    },
    {
      id: 'catalog-service',
      name: 'Catalog-Service',
      port: ':8002',
      status: 'ONLINE',
      desc: 'Daftar Toko, Harga Barang & Stok Kantin',
      latency: `${2}ms`,
      tps: Math.round(8820 * systemTpsMultiplier).toLocaleString('id-ID'),
      health: '100%',
      icon: Store,
      color: '#34D399',
      bgGradient: 'from-emerald-950/60 to-[#0F2D24]'
    },
    {
      id: 'payment-service',
      name: 'Payment-Service',
      port: ':8003',
      status: 'ONLINE',
      desc: 'Escrow/Penampungan & Verifikasi Bayar',
      latency: `${12}ms`,
      tps: Math.round(1150 * systemTpsMultiplier).toLocaleString('id-ID'),
      health: '100%',
      icon: CreditCard,
      color: '#10B981',
      bgGradient: 'from-emerald-950/60 to-[#0F2D24]'
    },
    {
      id: 'tracking-service',
      name: 'Tracking-Service',
      port: ':8004',
      status: 'ONLINE',
      desc: 'Status Pesanan, Runner & Notifikasi',
      latency: `${8}ms`,
      tps: Math.round(3400 * systemTpsMultiplier).toLocaleString('id-ID'),
      health: '100%',
      icon: Activity,
      color: '#34D399',
      bgGradient: 'from-emerald-950/60 to-[#0F2D24]'
    }
  ];

  return (
    <div className="min-h-screen bg-[#061A14] text-slate-100 font-sans selection:bg-[#10B981] selection:text-white flex flex-col md:flex-row relative overflow-x-hidden">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-64 w-96 h-96 bg-[#10B981]/10 rounded-full blur-[140px] pointer-events-none -z-0"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#004D40]/25 rounded-full blur-[160px] pointer-events-none -z-0"></div>

      {/* 
        ========================================================================
        2. SIDEBAR NAVIGASI KIRI
        ========================================================================
      */}
      <aside className="w-full md:w-72 bg-[#081F18] border-r border-[#1B4D3E] flex flex-col justify-between shrink-0 z-30">
        <div>
          
          {/* Header: Logo "Sistem Jastip Kampus" (Ikon Hijau + Teks Putih) */}
          <div className="p-5 border-b border-[#1B4D3E]/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0F2D24] border border-[#10B981]/40 flex items-center justify-center text-[#10B981] shadow-lg shadow-black/40">
                <ShoppingBag className="w-5 h-5 text-[#10B981]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black tracking-tight text-white">
                    Sistem Jastip <span className="text-[#10B981]">Kampus</span>
                  </span>
                </div>
                <span className="text-[10px] font-mono text-[#A7F3D0]/70 font-semibold">
                  UNISMUH SRE PORTAL
                </span>
              </div>
            </div>
            <span className="bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40 text-[9px] font-mono font-bold px-2 py-0.5 rounded-md">
              ADMIN
            </span>
          </div>

          {/* Admin Badge Card: Card terverifikasi "Admin Terverifikasi: Kelompok 15 - JASTIP KAMPUS ADMIN (Super Admin)" */}
          <div className="p-4">
            <div className="bg-[#0F2D24] border border-[#1B4D3E] rounded-2xl p-3.5 space-y-2 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#A7F3D0]">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  <span>Admin Terverifikasi</span>
                </div>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
                </span>
              </div>
              <div>
                <h4 className="text-xs font-black text-white leading-snug">
                  Kelompok 15 - JASTIP KAMPUS ADMIN
                </h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="bg-[#10B981] text-[#061A14] text-[9px] font-black uppercase px-2 py-0.5 rounded-full font-mono">
                    Super Admin
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    NIM: 105841104423
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 space-y-1 mt-1">
            
            {/* 1. Dashboard (Active State: Hijau Solid #10B981 dengan teks gelap) */}
            <button
              type="button"
              onClick={() => setActiveNav('dashboard')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeNav === 'dashboard'
                  ? 'bg-[#10B981] text-[#061A14] shadow-md shadow-emerald-950 font-black'
                  : 'text-slate-300 hover:bg-[#0F2D24] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </div>
              {activeNav === 'dashboard' && <div className="w-1.5 h-1.5 rounded-full bg-[#061A14]"></div>}
            </button>

            {/* 2. Diagram Arsitektur DDD [Badge PRO] */}
            <button
              type="button"
              onClick={() => {
                setActiveNav('ddd-architecture');
                setShowDddModal(true);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeNav === 'ddd-architecture'
                  ? 'bg-[#10B981] text-[#061A14] font-black'
                  : 'text-slate-300 hover:bg-[#0F2D24] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Network className="w-4 h-4 text-[#34D399]" />
                <span>Diagram Arsitektur DDD</span>
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider font-mono ${
                activeNav === 'ddd-architecture' ? 'bg-[#061A14] text-[#10B981]' : 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
              }`}>
                PRO
              </span>
            </button>

            {/* 3. Kelola Order Jastip */}
            <button
              type="button"
              onClick={() => setActiveNav('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeNav === 'orders'
                  ? 'bg-[#10B981] text-[#061A14] font-black'
                  : 'text-slate-300 hover:bg-[#0F2D24] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Kelola Order Jastip</span>
              </div>
              <span className="text-[10px] bg-[#0F2D24] text-[#A7F3D0] px-2 py-0.5 rounded-md border border-[#1B4D3E]">
                3 Aktif
              </span>
            </button>

            {/* 4. Kelola Catalog / Toko */}
            <button
              type="button"
              onClick={() => setActiveNav('catalog')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeNav === 'catalog'
                  ? 'bg-[#10B981] text-[#061A14] font-black'
                  : 'text-slate-300 hover:bg-[#0F2D24] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Store className="w-4 h-4" />
                <span>Kelola Catalog / Toko</span>
              </div>
              <span className="text-[10px] bg-[#0F2D24] text-[#A7F3D0] px-2 py-0.5 rounded-md border border-[#1B4D3E]">
                50 Item
              </span>
            </button>

            {/* 5. User Management */}
            <button
              type="button"
              onClick={() => setActiveNav('users')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeNav === 'users'
                  ? 'bg-[#10B981] text-[#061A14] font-black'
                  : 'text-slate-300 hover:bg-[#0F2D24] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>User Management</span>
              </div>
              <span className="text-[10px] bg-[#0F2D24] text-[#A7F3D0] px-2 py-0.5 rounded-md border border-[#1B4D3E]">
                1.25k
              </span>
            </button>

            {/* 6. Transaction & Escrow */}
            <button
              type="button"
              onClick={() => setActiveNav('escrow')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeNav === 'escrow'
                  ? 'bg-[#10B981] text-[#061A14] font-black'
                  : 'text-slate-300 hover:bg-[#0F2D24] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-4 h-4" />
                <span>Transaction & Escrow</span>
              </div>
              <span className="text-[10px] bg-[#0F2D24] text-[#A7F3D0] px-2 py-0.5 rounded-md border border-[#1B4D3E]">
                Vault
              </span>
            </button>

            {/* 7. Notification Service */}
            <button
              type="button"
              onClick={() => setActiveNav('notifications')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeNav === 'notifications'
                  ? 'bg-[#10B981] text-[#061A14] font-black'
                  : 'text-slate-300 hover:bg-[#0F2D24] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4" />
                <span>Notification Service</span>
              </div>
              <span className="text-[10px] bg-[#0F2D24] text-[#A7F3D0] px-2 py-0.5 rounded-md border border-[#1B4D3E]">
                Active
              </span>
            </button>

            {/* 8. Monitoring Microservice */}
            <button
              type="button"
              onClick={() => setActiveNav('monitoring')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeNav === 'monitoring'
                  ? 'bg-[#10B981] text-[#061A14] font-black'
                  : 'text-slate-300 hover:bg-[#0F2D24] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4" />
                <span>Monitoring Microservice</span>
              </div>
              <span className="text-[10px] bg-emerald-500/20 text-[#34D399] px-2 py-0.5 rounded-md border border-emerald-500/30">
                4 Ports
              </span>
            </button>

          </nav>
        </div>

        {/* Sidebar Footer Actions */}
        <div className="p-4 border-t border-[#1B4D3E]/80 space-y-2">
          {onReturnToPortal && (
            <button
              type="button"
              onClick={onReturnToPortal}
              className="w-full py-2 px-3 bg-[#0F2D24] hover:bg-[#13382D] text-[#A7F3D0] text-xs font-bold rounded-xl border border-[#1B4D3E] flex items-center justify-center gap-2 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Portal Mahasiswa</span>
            </button>
          )}

          {onLogoutToLanding && (
            <button
              type="button"
              onClick={onLogoutToLanding}
              className="w-full py-2 px-3 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-bold rounded-xl border border-rose-900/50 flex items-center justify-center gap-2 transition-all"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-400" />
              <span>Keluar (Halaman Depan)</span>
            </button>
          )}
        </div>
      </aside>

      {/* 
        ========================================================================
        MAIN CONTENT AREA (RIGHT)
        ========================================================================
      */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* 
          ========================================================================
          3. TOP HEADER DASHBOARD
          ========================================================================
        */}
        <header className="bg-[#081F18]/90 backdrop-blur-md border-b border-[#1B4D3E] px-4 sm:px-8 py-5 sticky top-0 z-20">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            
            {/* Title & Subtitle */}
            <div>
              <div className="text-[11px] font-mono font-bold tracking-widest text-[#34D399] uppercase flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-[#10B981]" />
                <span>
                  {activeNav === 'dashboard' && 'SRE CONTROL PANEL & MICROSERVICES MONITORING'}
                  {activeNav === 'orders' && 'ORDER-SERVICE :8001 • DAFTAR PESANAN JASTIP'}
                  {activeNav === 'catalog' && 'CATALOG-SERVICE :8002 • INVENTARIS TOKO & KANTIN'}
                  {activeNav === 'users' && 'USER & IDENTITY • 1.25K MAHASISWA & RUNNER TERDAFTAR'}
                  {activeNav === 'escrow' && 'PAYMENT-SERVICE :8003 • REKENING BERSAMA & VAULT'}
                  {activeNav === 'notifications' && 'NOTIFICATION-SERVICE • BROADCAST & TELEMETRY'}
                  {activeNav === 'monitoring' && 'KUBERNETES POD TOPOLOGY • METRICS & HEALTH'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-0.5">
                {activeNav === 'dashboard' && 'Dashboard Admin SRE'}
                {activeNav === 'orders' && 'Kelola Order Jastip Kampus'}
                {activeNav === 'catalog' && 'Kelola Catalog & Toko Kampus'}
                {activeNav === 'users' && 'User Management (SSO SIMAK)'}
                {activeNav === 'escrow' && 'Transaction & Escrow Vault'}
                {activeNav === 'notifications' && 'Notification & Broadcast Service'}
                {activeNav === 'monitoring' && 'Monitoring Cluster Microservices'}
              </h1>
            </div>

            {/* Right Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Tombol Hijau Mint Outline: [Icon Box] Diagram DDD */}
              <button
                type="button"
                onClick={() => setShowDddModal(true)}
                className="px-4 py-2.5 bg-transparent hover:bg-[#0F2D24] text-[#34D399] border border-[#34D399]/60 hover:border-[#34D399] font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all active:scale-95 shadow-sm"
              >
                <Box className="w-4 h-4 text-[#34D399]" />
                <span>Diagram DDD</span>
              </button>

              {/* Tombol Hijau Solid: [Icon Refresh] Trigger Stress Test (10k TPS) */}
              <button
                type="button"
                onClick={handleTriggerStressTest}
                disabled={isStressTesting}
                className={`px-4.5 py-2.5 font-black text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all shadow-lg active:scale-95 ${
                  isStressTesting
                    ? 'bg-[#10B981]/70 text-[#061A14] cursor-not-allowed'
                    : 'bg-[#10B981] hover:bg-[#059669] text-[#061A14] shadow-emerald-950/70 hover:scale-102'
                }`}
              >
                <RefreshCw className={`w-4 h-4 text-[#061A14] ${isStressTesting ? 'animate-spin' : ''}`} />
                <span>{isStressTesting ? `Stress Testing (${stressTestProgress}%)` : 'Trigger Stress Test (10k TPS)'}</span>
              </button>

              {/* Badge Status Hijau Muda: SYSTEM HEALTH: 100% */}
              <div className="px-3.5 py-2 bg-[#0F2D24] text-[#34D399] border border-[#10B981]/50 rounded-xl text-xs font-mono font-bold flex items-center gap-2 shadow-inner">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
                <span>SYSTEM HEALTH: 100%</span>
              </div>

            </div>

          </div>

          {/* Stress test progress bar indicator */}
          {isStressTesting && (
            <div className="w-full bg-[#0F2D24] h-1.5 rounded-full mt-3 overflow-hidden border border-[#1B4D3E]">
              <div 
                className="bg-gradient-to-r from-[#10B981] to-[#34D399] h-full transition-all duration-300"
                style={{ width: `${stressTestProgress}%` }}
              ></div>
            </div>
          )}
        </header>

        {/* Dashboard Main Body */}
        <main className="p-4 sm:p-8 space-y-8 flex-1">
          {activeNav === 'dashboard' && (
            <>
          {/* 
            ========================================================================
            4. STATISTICAL CARDS GRID (4 METRIK UTAMA)
            ========================================================================
          */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#A7F3D0] uppercase tracking-wider font-mono">
                Ringkasan Ekosistem & Volume Transaksi
              </h2>
              <span className="text-[11px] text-slate-400">Update Tiap Detik</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Card 1: Total Catalog Jastip | Value: Dynamic from catalogItems */}
              <div className="bg-[#0F2D24] hover:bg-[#13382D] border border-[#1B4D3E] hover:border-[#10B981]/40 rounded-2xl p-5 transition-all shadow-md group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-300">Total Catalog Jastip</span>
                  <div className="w-9 h-9 rounded-xl bg-[#061A14] text-[#10B981] border border-[#1B4D3E] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Store className="w-4.5 h-4.5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white tracking-tight">
                  {catalogItems.length} Item
                </div>
                <p className="text-xs text-[#A7F3D0]/80 mt-1 flex items-center gap-1">
                  <span>Aktif di Kantin & Toko Unismuh</span>
                </p>
                <div className="mt-3 pt-3 border-t border-[#1B4D3E]/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="text-[#34D399] font-bold">12 Warung Kampus</span>
                  <span>Sync Catalog-Service</span>
                </div>
              </div>

              {/* Card 2: Total User / Mahasiswa | Value: Dynamic from studentAccounts */}
              <div className="bg-[#0F2D24] hover:bg-[#13382D] border border-[#1B4D3E] hover:border-[#10B981]/40 rounded-2xl p-5 transition-all shadow-md group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-300">Total User / Mahasiswa</span>
                  <div className="w-9 h-9 rounded-xl bg-[#061A14] text-[#10B981] border border-[#1B4D3E] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users className="w-4.5 h-4.5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white tracking-tight">
                  {studentAccounts.length > 0 ? studentAccounts.length : '—'}
                </div>
                <p className="text-xs text-[#A7F3D0]/80 mt-1 flex items-center gap-1">
                  <span>Akun pembeli & runner terverifikasi</span>
                </p>
                <div className="mt-3 pt-3 border-t border-[#1B4D3E]/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="text-[#34D399] font-bold">SSO SIMAK Unismuh</span>
                  <span>100% KTM Valid</span>
                </div>
              </div>

              {/* Card 3: Pesanan Jastip Terjual | Value: Dynamic count from studentOrders */}
              <div className="bg-[#0F2D24] hover:bg-[#13382D] border border-[#1B4D3E] hover:border-[#10B981]/40 rounded-2xl p-5 transition-all shadow-md group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-slate-300">Pesanan Jastip Terjual</span>
                  <div className="w-9 h-9 rounded-xl bg-[#061A14] text-[#10B981] border border-[#1B4D3E] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-4.5 h-4.5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-white tracking-tight">
                  {Object.values(studentOrders || {}).reduce((sum, orders) => sum + (orders?.length || 0), 0)}
                </div>
                <p className="text-xs text-[#A7F3D0]/80 mt-1 flex items-center gap-1">
                  <span>Transaksi jastip berhasil</span>
                </p>
                <div className="mt-3 pt-3 border-t border-[#1B4D3E]/60 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="text-[#34D399] font-bold">0% Dispute</span>
                  <span>Serah Terima Aman</span>
                </div>
              </div>

              {/* Card 4: Pendapatan Komisi (Aksen Hijau Terang) | Value: Dynamic calculated from studentOrders */}
              <div className="bg-gradient-to-br from-[#0F2D24] via-[#13382D] to-[#0A3D2E] border border-[#10B981]/50 hover:border-[#10B981] rounded-2xl p-5 transition-all shadow-lg group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#10B981]/15 rounded-full blur-xl pointer-events-none"></div>
                <div className="flex items-center justify-between mb-3 relative z-10">
                  <span className="text-xs font-bold text-[#A7F3D0]">Pendapatan Komisi</span>
                  <div className="w-9 h-9 rounded-xl bg-[#10B981] text-[#061A14] flex items-center justify-center shadow-md font-black">
                    <TrendingUp className="w-4.5 h-4.5" />
                  </div>
                </div>
                <div className="text-3xl font-black text-[#34D399] tracking-tight relative z-10">
                  {(() => {
                    const totalRevenue = Object.values(studentOrders).reduce((sum, order) => {
                      const grandTotal = order.grandTotal || 0;
                      const commission = Math.round(grandTotal * 0.05); // 5% commission
                      return sum + commission;
                    }, 0);
                    if (totalRevenue === 0) return 'Rp —';
                    return new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    }).format(totalRevenue);
                  })()}
                </div>
                <p className="text-xs text-emerald-200 mt-1 relative z-10">
                  Settlement gateway 100% OK
                </p>
                <div className="mt-3 pt-3 border-t border-[#10B981]/20 flex items-center justify-between text-[10px] relative z-10">
                  <span className="text-white font-mono font-bold">Rekber Unismuh Vault</span>
                  <span className="text-[#34D399] font-bold">Instant Payout</span>
                </div>
              </div>

            </div>
          </section>

          {/* 
            ========================================================================
            5. MONITORING STATUS MICROSERVICES GRID (4 LAYANAN UTAMA)
            ========================================================================
          */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#10B981]" />
                  <span>Monitoring Status Microservices</span>
                </h2>
                <p className="text-xs text-[#A7F3D0]/70">
                  Cluster Kubernetes / Cloud Run (Isolated Pods with Service Mesh)
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#34D399]">
                <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping"></span>
                <span>4 / 4 Nodes Active</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {microservices.map((svc) => {
                const Icon = svc.icon;
                return (
                  <div
                    key={svc.id}
                    className="bg-[#0F2D24] border border-[#1B4D3E] hover:border-[#10B981]/50 rounded-2xl p-5 space-y-3 transition-all duration-300 hover:-translate-y-1 shadow-md flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Header of Service Card */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-[#061A14] text-[#10B981] border border-[#1B4D3E] flex items-center justify-center">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-sm font-black text-white">
                              {svc.name}
                            </h3>
                            <span className="text-[10px] font-mono text-slate-400">
                              Port {svc.port}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge (Hijau) */}
                        <span className="bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span>
                          <span>{svc.status}</span>
                        </span>
                      </div>

                      {/* Service Description */}
                      <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                        {svc.desc}
                      </p>
                    </div>

                    {/* Service Metrics Row (Latency & TPS) */}
                    <div className="pt-3 border-t border-[#1B4D3E] grid grid-cols-2 gap-2 text-center bg-[#061A14]/60 rounded-xl p-2.5">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Latency</span>
                        <span className="text-sm font-black text-[#34D399] font-mono">{svc.latency}</span>
                      </div>
                      <div className="border-l border-[#1B4D3E]">
                        <span className="text-[10px] font-mono text-slate-400 block uppercase">Throughput</span>
                        <span className="text-sm font-black text-white font-mono">{svc.tps} <span className="text-[9px] text-slate-400 font-normal">req/s</span></span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </section>

          {/* 
            ========================================================================
            6. AUDIT LOGS & DISTRIBUTED TRACING REAL-TIME PANEL
            ========================================================================
          */}
          <section className="space-y-3">
            
            {/* Header with Title & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0F2D24] border border-[#1B4D3E] p-4 rounded-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#061A14] text-[#10B981] border border-[#1B4D3E] flex items-center justify-center">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white tracking-tight flex items-center gap-2">
                    <span>Audit Logs & Distributed Tracing Real-Time</span>
                    <span className="bg-[#10B981]/20 text-[#34D399] text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border border-[#10B981]/30">
                      LIVE
                    </span>
                  </h3>
                  <p className="text-[11px] text-[#A7F3D0]/70">
                    Structured event stream with trace IDs & microservices latency audit
                  </p>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                
                {/* Service Filter Dropdown */}
                <div className="flex items-center gap-1.5 bg-[#061A14] px-2.5 py-1.5 rounded-xl border border-[#1B4D3E] text-xs">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={selectedServiceFilter}
                    onChange={(e) => setSelectedServiceFilter(e.target.value)}
                    className="bg-transparent text-slate-200 text-xs font-mono font-bold outline-hidden cursor-pointer"
                  >
                    <option value="ALL" className="bg-[#081F18] text-white">Semua Service</option>
                    <option value="order-service" className="bg-[#081F18] text-white">order-service:8001</option>
                    <option value="catalog-service" className="bg-[#081F18] text-white">catalog-service:8002</option>
                    <option value="payment-service" className="bg-[#081F18] text-white">payment-service:8003</option>
                    <option value="tracking-service" className="bg-[#081F18] text-white">tracking-service:8004</option>
                  </select>
                </div>

                {/* Pause/Resume Live Streaming */}
                <button
                  type="button"
                  onClick={() => setIsLogStreaming(!isLogStreaming)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all ${
                    isLogStreaming
                      ? 'bg-[#10B981]/20 text-[#34D399] border-[#10B981]/40 hover:bg-[#10B981]/30'
                      : 'bg-amber-950/40 text-amber-300 border-amber-800 hover:bg-amber-900/50'
                  }`}
                  title={isLogStreaming ? 'Jeda Stream' : 'Lanjutkan Stream'}
                >
                  {isLogStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isLogStreaming ? 'Streaming Active' : 'Paused'}</span>
                </button>

                {/* Clear logs */}
                <button
                  type="button"
                  onClick={() => setLogs([])}
                  className="p-1.5 bg-[#061A14] hover:bg-[#13382D] text-slate-400 hover:text-white rounded-xl border border-[#1B4D3E] transition-all"
                  title="Bersihkan Log"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

              </div>
            </div>

            {/* Terminal Container: Box Hitam-Pekat (#030E0B) dengan Scrollbar */}
            <div className="bg-[#030E0B] border border-[#1B4D3E] rounded-2xl overflow-hidden shadow-2xl">
              
              {/* Terminal Window Header Bar */}
              <div className="bg-[#081F18] px-4 py-2.5 border-b border-[#1B4D3E] flex items-center justify-between text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                  </div>
                  <span className="text-[11px] text-slate-300 font-bold ml-2">
                    console@unismuh-microservices-cluster:~$ tail -f /var/log/audit.log
                  </span>
                </div>
                <div className="text-[11px] text-[#34D399]">
                  {filteredLogs.length} events buffered
                </div>
              </div>

              {/* Terminal Content Body */}
              <div className="p-4 font-mono text-xs max-h-[380px] overflow-y-auto space-y-2 select-text scrollbar-thin scrollbar-thumb-[#1B4D3E] scrollbar-track-[#030E0B]">
                {filteredLogs.length === 0 ? (
                  <div className="text-slate-500 py-8 text-center italic">
                    Log kosong atau telah dibersihkan. Menunggu incoming request event...
                  </div>
                ) : (
                  filteredLogs.map((log) => (
                    <div 
                      key={log.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors group border-b border-white/5"
                    >
                      <div className="flex flex-wrap items-center gap-2 text-slate-300 leading-relaxed break-all">
                        
                        {/* Emerald Timestamp */}
                        <span className="text-[#10B981] font-bold shrink-0">
                          [{log.timestamp}]
                        </span>

                        {/* Mint Service Name */}
                        <span className="bg-[#0F2D24] text-[#34D399] px-2 py-0.5 rounded text-[11px] font-bold border border-[#1B4D3E] shrink-0">
                          {log.service}
                        </span>

                        {/* Trace ID */}
                        <span className="text-slate-500 text-[10px] shrink-0">
                          {log.traceId}
                        </span>

                        {/* Log Text */}
                        <span className="text-slate-200">
                          {log.message}
                        </span>

                      </div>

                      {/* Right Badges & Action */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                        <span className="text-[10px] text-slate-400">
                          {log.latencyMs}ms
                        </span>

                        {/* Badge Level: SUCCESS / INFO / WARN */}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          log.level === 'SUCCESS' 
                            ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40' 
                            : log.level === 'WARN'
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        }`}>
                          {log.level}
                        </span>

                        {/* Copy button */}
                        <button
                          type="button"
                          onClick={() => handleCopyLog(`[${log.timestamp}] [${log.service}] ${log.message}`, log.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:text-white text-slate-400"
                          title="Salin Log"
                        >
                          {copiedLogId === log.id ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  ))
                )}
                <div ref={logEndRef} />
              </div>

            </div>

          </section>
            </>
          )}

          {/* VIEW 2: KELOLA ORDER JASTIP */}
          {activeNav === 'orders' && (
            <div className="space-y-6">
              <div className="bg-[#0F2D24] border border-[#1B4D3E] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2.5">
                    <ShoppingBag className="w-6 h-6 text-[#10B981]" />
                    <span>Manajemen Order Jastip Kampus</span>
                  </h2>
                  <p className="text-xs text-[#A7F3D0]/80 mt-1">
                    Kelola dan pantau seluruh transaksi titip-beli mahasiswa Unismuh Makassar secara tersentralisasi
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-[#061A14] text-[#34D399] px-3.5 py-1.5 rounded-xl border border-[#1B4D3E] text-xs font-mono font-bold">
                    Total: 3 Pesanan Aktif
                  </span>
                </div>
              </div>

              {/* Order List Table */}
              <div className="bg-[#0F2D24] border border-[#1B4D3E] rounded-2xl overflow-hidden shadow-xl">
                <div className="p-4 border-b border-[#1B4D3E] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Cari ID Order / Mahasiswa..."
                      className="w-full bg-[#061A14] border border-[#1B4D3E] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#10B981]"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-400">Filter Status:</span>
                    <span className="bg-[#10B981]/20 text-[#34D399] px-2.5 py-1 rounded-lg border border-[#10B981]/30 font-bold">Semua Order</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#061A14] text-slate-400 border-b border-[#1B4D3E] font-mono uppercase text-[10px]">
                      <tr>
                        <th className="p-3.5">Order ID</th>
                        <th className="p-3.5">Pemesan (NIM)</th>
                        <th className="p-3.5">Item Belanja</th>
                        <th className="p-3.5">Total & Ongkir</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Aksi SRE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1B4D3E]/60 text-slate-200">
                      {Object.entries(studentOrders).length > 0 ? (
                        Object.entries(studentOrders).map(([nim, order]) => {
                          const statusColors: Record<string, { bg: string; text: string; border: string }> = {
                            'MENUNGGU_PEMBAYARAN': { bg: 'bg-yellow-950', text: 'text-yellow-300', border: 'border-yellow-800' },
                            'ESCROW_DITAMPUNG': { bg: 'bg-blue-950', text: 'text-blue-300', border: 'border-blue-800' },
                            'DIBELI_JASTIPER': { bg: 'bg-purple-950', text: 'text-purple-300', border: 'border-purple-800' },
                            'MENUJU_KAMPUS': { bg: 'bg-orange-950', text: 'text-orange-300', border: 'border-orange-800' },
                            'SAMPAI_DI_TITIK_TEMU': { bg: 'bg-cyan-950', text: 'text-cyan-300', border: 'border-cyan-800' },
                            'SELESAI_DITERIMA': { bg: 'bg-emerald-900/60', text: 'text-[#10B981]', border: 'border-emerald-700' }
                          };
                          const colors = statusColors[order.status] || { bg: 'bg-slate-900', text: 'text-slate-300', border: 'border-slate-700' };
                          
                          return (
                            <tr key={nim} className="hover:bg-[#13382D] transition-colors">
                              <td className="p-3.5 font-mono font-bold text-[#10B981]">#{order.id || `ORD-${nim.slice(-4)}`}</td>
                              <td className="p-3.5">
                                <div className="font-bold text-white">{order.buyerName || 'Unknown'}</div>
                                <span className="text-[10px] text-slate-400 font-mono">{nim}</span>
                              </td>
                              <td className="p-3.5 font-medium">{order.itemName || 'No items'}</td>
                              <td className="p-3.5">
                                <div className="font-bold text-white">
                                  Rp {(order.total || 0).toLocaleString('id-ID')}
                                </div>
                                <span className="text-[10px] text-[#34D399]">
                                  Ongkir Rp {(order.shippingCost || 0).toLocaleString('id-ID')}
                                </span>
                              </td>
                              <td className="p-3.5">
                                <span className={`${colors.bg} ${colors.text} border ${colors.border} px-2 py-0.5 rounded-full text-[10px] font-bold`}>
                                  {order.status?.replace(/_/g, ' ') || 'UNKNOWN'}
                                </span>
                              </td>
                              <td className="p-3.5 text-right">
                                <button type="button" className="px-2.5 py-1 bg-[#10B981] hover:bg-[#059669] text-[#061A14] font-black rounded-lg text-[10px] transition-all">
                                  Audit Trace
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-3.5 text-center text-slate-400">
                            Tidak ada pesanan sampai saat ini
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Search & Filter (if needed for future) */}
              </div>
            </div>
          )}

          {/* VIEW 3: KELOLA CATALOG / TOKO */}
          {activeNav === 'catalog' && (
            <div className="space-y-6">
              <div className="bg-[#0F2D24] border border-[#1B4D3E] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2.5">
                    <Store className="w-6 h-6 text-[#10B981]" />
                    <span>Catalog-Service Management ({catalogItems.length > 0 ? catalogItems.length : 50} Items Terdaftar)</span>
                  </h2>
                  <p className="text-xs text-[#A7F3D0]/80 mt-1">
                    Sinkronisasi database Catalog-Service (Port :8002): Kelola menu, harga warung, ongkir jastip, dan ketersediaan stok
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsAddingNewItem(true)}
                    className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-[#061A14] font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>+ Tambah Menu / Toko</span>
                  </button>
                  <span className="bg-[#061A14] text-[#34D399] px-3.5 py-2 rounded-xl border border-[#1B4D3E] text-xs font-mono font-bold">
                    Total: {catalogItems.length} Items
                  </span>
                </div>
              </div>

              {editSuccessMsg && (
                <div className="bg-emerald-950/80 border border-[#10B981] text-[#A7F3D0] p-3.5 rounded-2xl flex items-center justify-between text-xs font-bold shadow-lg animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    <span>{editSuccessMsg}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setEditSuccessMsg(null)}
                    className="text-slate-400 hover:text-white px-2 py-0.5 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* Filter and Search Bar for Catalog */}
              <div className="bg-[#0F2D24] border border-[#1B4D3E] rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    value={catalogSearch}
                    onChange={(e) => setCatalogSearch(e.target.value)}
                    placeholder="Cari nama item, menu, atau warung..."
                    className="w-full bg-[#061A14] border border-[#1B4D3E] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#10B981]"
                  />
                </div>
                
                {/* Category Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  {['SEMUA', 'Makanan', 'Minuman', 'Kue & Cemilan', 'ATK & Buku', 'Merchandise Unismuh', 'Snack & Kebutuhan Kos', 'Komponen & Alat Lab'].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCatalogCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        catalogCategoryFilter === cat
                          ? 'bg-[#10B981] text-[#061A14] shadow-sm'
                          : 'bg-[#061A14] text-slate-300 hover:text-white border border-[#1B4D3E]'
                      }`}
                    >
                      {cat === 'SEMUA' ? `Semua (${catalogItems.length})` : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Catalog Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(catalogItems.length > 0 ? catalogItems : []).filter((item) => {
                  const matchesSearch = item.name.toLowerCase().includes(catalogSearch.toLowerCase()) || 
                                        item.storeName.toLowerCase().includes(catalogSearch.toLowerCase()) ||
                                        item.id.toLowerCase().includes(catalogSearch.toLowerCase());
                  const matchesCat = catalogCategoryFilter === 'SEMUA' || item.category === catalogCategoryFilter;
                  return matchesSearch && matchesCat;
                }).map((item) => (
                  <div key={item.id} className="bg-[#0F2D24] border border-[#1B4D3E] rounded-2xl p-4 space-y-3 hover:border-[#10B981]/50 transition-all shadow-md flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] font-mono text-[#34D399] uppercase bg-[#061A14] px-2 py-0.5 rounded border border-[#1B4D3E]">
                          {item.id} • {item.category}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                          item.available 
                            ? 'bg-[#061A14] text-[#10B981] border-[#1B4D3E]' 
                            : 'bg-rose-950/60 text-rose-300 border-rose-900'
                        }`}>
                          {item.available ? 'Tersedia' : 'Habis'}
                        </span>
                      </div>
                      
                      <div className="flex gap-3 items-center">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-12 h-12 rounded-xl object-cover border border-[#1B4D3E] shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white leading-tight line-clamp-2">{item.name}</h4>
                          <span className="text-[11px] text-slate-400 block truncate mt-0.5">{item.storeName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#1B4D3E] flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black text-white font-mono block">Rp {item.price.toLocaleString('id-ID')}</span>
                        <span className="text-[10px] text-[#34D399] font-mono">Ongkir Jastip Rp {item.jastipFee.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button 
                          type="button" 
                          onClick={() => setEditingItem({ ...item })}
                          className="px-3 py-1.5 bg-[#10B981]/20 hover:bg-[#10B981] text-[#34D399] hover:text-[#061A14] rounded-lg text-xs font-bold transition-all border border-[#10B981]/30 cursor-pointer"
                        >
                          Edit
                        </button>
                        {onDeleteCatalogItem && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Hapus item ${item.name} dari database catalog?`)) {
                                onDeleteCatalogItem(item.id);
                                setEditSuccessMsg(`Item "${item.name}" berhasil dihapus dari catalog.`);
                              }
                            }}
                            className="px-2 py-1.5 bg-rose-950/40 hover:bg-rose-900 text-rose-300 rounded-lg text-xs font-bold transition-all border border-rose-900/50 cursor-pointer"
                            title="Hapus item"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* MODAL EDIT ITEM CATALOG */}
              {editingItem && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-[#0F2D24] border border-[#10B981]/60 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-150">
                    <div className="flex items-center justify-between border-b border-[#1B4D3E] pb-3">
                      <div>
                        <span className="text-[10px] font-mono text-[#34D399] uppercase">CATALOG-SERVICE :8002</span>
                        <h3 className="text-lg font-black text-white">Edit Menu / Item ({editingItem.id})</h3>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setEditingItem(null)}
                        className="text-slate-400 hover:text-white text-xl font-bold px-2 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Nama Menu / Produk</label>
                        <input 
                          type="text" 
                          value={editingItem.name} 
                          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                          className="w-full bg-[#061A14] border border-[#1B4D3E] rounded-xl px-3.5 py-2.5 text-white font-medium focus:border-[#10B981] focus:outline-hidden"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Kategori</label>
                          <select 
                            value={editingItem.category}
                            onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as any })}
                            className="w-full bg-[#061A14] border border-[#1B4D3E] rounded-xl px-3 py-2.5 text-white font-medium focus:border-[#10B981] focus:outline-hidden"
                          >
                            {['Makanan', 'Minuman', 'Kue & Cemilan', 'ATK & Buku', 'Merchandise Unismuh', 'Snack & Kebutuhan Kos', 'Komponen & Alat Lab'].map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Nama Toko / Warung</label>
                          <input 
                            type="text" 
                            value={editingItem.storeName} 
                            onChange={(e) => setEditingItem({ ...editingItem, storeName: e.target.value })}
                            className="w-full bg-[#061A14] border border-[#1B4D3E] rounded-xl px-3 py-2.5 text-white font-medium focus:border-[#10B981] focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Harga Toko (Rp)</label>
                          <input 
                            type="number" 
                            value={editingItem.price} 
                            onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) || 0 })}
                            className="w-full bg-[#061A14] border border-[#1B4D3E] rounded-xl px-3 py-2.5 text-white font-mono font-bold focus:border-[#10B981] focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Tarif Ongkir Jastip (Rp)</label>
                          <input 
                            type="number" 
                            value={editingItem.jastipFee} 
                            onChange={(e) => setEditingItem({ ...editingItem, jastipFee: Number(e.target.value) || 0 })}
                            className="w-full bg-[#061A14] border border-[#1B4D3E] rounded-xl px-3 py-2.5 text-white font-mono font-bold focus:border-[#10B981] focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Status Ketersediaan Stok</label>
                        <div className="flex gap-4 items-center bg-[#061A14] p-3 rounded-xl border border-[#1B4D3E]">
                          <label className="inline-flex items-center gap-2 cursor-pointer text-white">
                            <input 
                              type="radio" 
                              name="available-status"
                              checked={editingItem.available === true} 
                              onChange={() => setEditingItem({ ...editingItem, available: true })}
                              className="text-[#10B981]"
                            />
                            <span className="font-bold text-[#34D399]">Tersedia di Toko</span>
                          </label>
                          <label className="inline-flex items-center gap-2 cursor-pointer text-slate-300">
                            <input 
                              type="radio" 
                              name="available-status"
                              checked={editingItem.available === false} 
                              onChange={() => setEditingItem({ ...editingItem, available: false })}
                              className="text-[#10B981]"
                            />
                            <span>Stok Habis / Tutup</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#1B4D3E] flex gap-3">
                      <button 
                        type="button" 
                        onClick={() => setEditingItem(null)}
                        className="w-1/2 py-2.5 bg-[#061A14] hover:bg-[#1B4D3E] text-slate-300 font-bold text-xs rounded-xl border border-[#1B4D3E] transition-all cursor-pointer"
                      >
                        Batal
                      </button>
                      <button 
                        type="button" 
                        onClick={() => {
                          if (onUpdateCatalogItem && editingItem) {
                            onUpdateCatalogItem(editingItem);
                            setEditSuccessMsg(`Menu "${editingItem.name}" berhasil diperbarui.`);
                          }
                          setEditingItem(null);
                        }}
                        className="w-1/2 py-2.5 bg-[#10B981] hover:bg-[#059669] text-[#061A14] font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
                      >
                        Simpan Perubahan
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* MODAL TAMBAH ITEM BARU */}
              {isAddingNewItem && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-[#0F2D24] border border-[#10B981]/60 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-150">
                    <div className="flex items-center justify-between border-b border-[#1B4D3E] pb-3">
                      <div>
                        <span className="text-[10px] font-mono text-[#34D399] uppercase">CATALOG-SERVICE :8002</span>
                        <h3 className="text-lg font-black text-white">+ Tambah Menu / Toko Baru</h3>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setIsAddingNewItem(false)}
                        className="text-slate-400 hover:text-white text-xl font-bold px-2 cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-4 text-xs">
                      <div>
                        <label className="block text-slate-300 font-bold mb-1">Nama Item / Makanan</label>
                        <input 
                          type="text" 
                          placeholder="Cth: Nasi Goreng Spesial Kampus"
                          value={newItemForm.name || ''} 
                          onChange={(e) => setNewItemForm({ ...newItemForm, name: e.target.value })}
                          className="w-full bg-[#061A14] border border-[#1B4D3E] rounded-xl px-3.5 py-2.5 text-white font-medium focus:border-[#10B981] focus:outline-hidden"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Kategori</label>
                          <select 
                            value={newItemForm.category || 'Makanan'}
                            onChange={(e) => setNewItemForm({ ...newItemForm, category: e.target.value as any })}
                            className="w-full bg-[#061A14] border border-[#1B4D3E] rounded-xl px-3 py-2.5 text-white font-medium focus:border-[#10B981] focus:outline-hidden"
                          >
                            {['Makanan', 'Minuman', 'Kue & Cemilan', 'ATK & Buku', 'Merchandise Unismuh', 'Snack & Kebutuhan Kos', 'Komponen & Alat Lab'].map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Nama Warung / Toko</label>
                          <input 
                            type="text" 
                            placeholder="Kantin Menara Iqra"
                            value={newItemForm.storeName || ''} 
                            onChange={(e) => setNewItemForm({ ...newItemForm, storeName: e.target.value })}
                            className="w-full bg-[#061A14] border border-[#1B4D3E] rounded-xl px-3 py-2.5 text-white font-medium focus:border-[#10B981] focus:outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Harga Toko (Rp)</label>
                          <input 
                            type="number" 
                            placeholder="15000"
                            value={newItemForm.price || ''} 
                            onChange={(e) => setNewItemForm({ ...newItemForm, price: Number(e.target.value) || 0 })}
                            className="w-full bg-[#061A14] border border-[#1B4D3E] rounded-xl px-3 py-2.5 text-white font-mono font-bold focus:border-[#10B981] focus:outline-hidden"
                          />
                        </div>

                        <div>
                          <label className="block text-slate-300 font-bold mb-1">Tarif Ongkir Jastip (Rp)</label>
                          <input 
                            type="number" 
                            placeholder="5000"
                            value={newItemForm.jastipFee || ''} 
                            onChange={(e) => setNewItemForm({ ...newItemForm, jastipFee: Number(e.target.value) || 0 })}
                            className="w-full bg-[#061A14] border border-[#1B4D3E] rounded-xl px-3 py-2.5 text-white font-mono font-bold focus:border-[#10B981] focus:outline-hidden"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-[#1B4D3E] flex gap-3">
                      <button 
                        type="button" 
                        onClick={() => setIsAddingNewItem(false)}
                        className="w-1/2 py-2.5 bg-[#061A14] hover:bg-[#1B4D3E] text-slate-300 font-bold text-xs rounded-xl border border-[#1B4D3E] transition-all cursor-pointer"
                      >
                        Batal
                      </button>
                      <button 
                        type="button" 
                        onClick={() => {
                          if (newItemForm.name && newItemForm.price && onAddCatalogItem) {
                            const newItem: CatalogItem = {
                              id: `CAT-0${catalogItems.length + 1}`,
                              name: newItemForm.name,
                              category: newItemForm.category || 'Makanan',
                              price: Number(newItemForm.price),
                              storeName: newItemForm.storeName || 'Kantin Unismuh',
                              location: 'Kampus Unismuh',
                              available: true,
                              jastipFee: Number(newItemForm.jastipFee) || 5000,
                              rating: 4.9,
                              soldCount: 0,
                              image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80',
                              description: 'Menu favorit mahasiswa di sekitar kampus Unismuh Makassar'
                            };
                            onAddCatalogItem(newItem);
                            setIsAddingNewItem(false);
                            setEditSuccessMsg(`Menu "${newItem.name}" berhasil ditambahkan ke catalog!`);
                            setNewItemForm({
                              category: 'Makanan',
                              available: true,
                              storeName: 'Kantin Menara Iqra',
                              jastipFee: 5000
                            });
                          }
                        }}
                        className="w-1/2 py-2.5 bg-[#10B981] hover:bg-[#059669] text-[#061A14] font-black text-xs rounded-xl shadow-md transition-all cursor-pointer"
                      >
                        Simpan Menu Baru
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* VIEW 4: USER MANAGEMENT */}
          {activeNav === 'users' && (
            <div className="space-y-6">
              <div className="bg-[#0F2D24] border border-[#1B4D3E] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2.5">
                    <Users className="w-6 h-6 text-[#10B981]" />
                    <span>User Management (1.250 Mahasiswa Terdaftar)</span>
                  </h2>
                  <p className="text-xs text-[#A7F3D0]/80 mt-1">
                    Basis data mahasiswa aktif dan kurir terverifikasi via Single Sign-On (SSO) SIMAK Unismuh
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40 px-3 py-1.5 rounded-xl text-xs font-mono font-bold">
                    100% KTM Terverifikasi
                  </span>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-[#0F2D24] border border-[#1B4D3E] rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#061A14] text-slate-400 border-b border-[#1B4D3E] font-mono uppercase text-[10px]">
                      <tr>
                        <th className="p-3.5">NIM & Mahasiswa</th>
                        <th className="p-3.5">Program Studi</th>
                        <th className="p-3.5">Role Sistem</th>
                        <th className="p-3.5">Status SIMAK</th>
                        <th className="p-3.5">Total Transaksi</th>
                        <th className="p-3.5 text-right">Aksi Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1B4D3E]/60 text-slate-200">
                      {(studentAccounts.length > 0 ? studentAccounts : [
                        { id: 'MHS-00', nim: '105841108319', name: 'NUNU', email: '105841108319@student.unismuh.ac.id', password: '831912', faculty: 'Fakultas Teknik', prodi: 'S1 Teknik Informatika', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', phone: '0812-4411-8319', role: 'mahasiswa' as const, balance: 200000, verifiedStatus: 'TERVERIFIKASI_KAMPUS' as const, totalOrders: 8, rating: 5.0, joinedYear: '2023' },
                        { id: 'MHS-01', nim: '105841104423', name: 'Ahmad Fauzan', email: '105841104423@student.unismuh.ac.id', password: '442312', faculty: 'Fakultas Teknik', prodi: 'S1 Teknik Elektro', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', phone: '0812-9888-8801', role: 'mahasiswa' as const, balance: 150000, verifiedStatus: 'TERVERIFIKASI_KAMPUS' as const, totalOrders: 12, rating: 5.0, joinedYear: '2023' },
                        { id: 'MHS-02', nim: '105841103322', name: 'Andi Muhammad Fikri', email: '105841103322@student.unismuh.ac.id', password: '332212', faculty: 'Fakultas Teknik', prodi: 'S1 Teknik Informatika', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', phone: '0852-4411-3322', role: 'jastiper' as const, balance: 285000, verifiedStatus: 'TERVERIFIKASI_KAMPUS' as const, totalOrders: 38, rating: 4.9, joinedYear: '2023' },
                        { id: 'MHS-03', nim: '105841102211', name: 'Nurul Mutmainnah', email: '105841102211@student.unismuh.ac.id', password: '221112', faculty: 'Fakultas Kedokteran & Ilmu Kesehatan', prodi: 'S1 Farmasi', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', phone: '0821-5522-1100', role: 'mahasiswa' as const, balance: 195000, verifiedStatus: 'TERVERIFIKASI_KAMPUS' as const, totalOrders: 29, rating: 4.8, joinedYear: '2022' },
                      ]).map((u, i) => (
                        <tr key={i} className="hover:bg-[#13382D] transition-colors">
                          <td className="p-3.5">
                            <div className="font-bold text-white">{u.name}</div>
                            <span className="text-[10px] text-slate-400 font-mono">NIM: {u.nim}</span>
                          </td>
                          <td className="p-3.5 font-medium">{u.prodi}</td>
                          <td className="p-3.5">
                            <span className="bg-[#061A14] text-[#A7F3D0] border border-[#1B4D3E] px-2 py-0.5 rounded-md text-[10px] font-bold">
                              {u.role === 'jastiper' ? 'Jastiper / Runner' : 'Mahasiswa / Pemesan'}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 text-[#34D399] font-bold text-[10px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>{u.verifiedStatus === 'TERVERIFIKASI_KAMPUS' ? 'VERIFIED' : 'PENDING'}</span>
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-white">{u.totalOrders} Order</td>
                          <td className="p-3.5 text-right">
                            <button type="button" className="px-2.5 py-1 bg-[#061A14] hover:bg-[#1B4D3E] text-slate-300 rounded-lg text-[10px] font-bold border border-[#1B4D3E] transition-all">
                              Detail Akun
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 5: TRANSACTION & ESCROW */}
          {activeNav === 'escrow' && (
            <div className="space-y-6">
              <div className="bg-[#0F2D24] border border-[#1B4D3E] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2.5">
                    <CreditCard className="w-6 h-6 text-[#10B981]" />
                    <span>Rekening Bersama & Escrow Vault (Payment-Service: 8003)</span>
                  </h2>
                  <p className="text-xs text-[#A7F3D0]/80 mt-1">
                    Dana diamankan di Rekber Vault terenkripsi dan otomatis cair ke runner setelah verifikasi serah terima fisik QR
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-mono">TOTAL VAULT SETTLED</span>
                  <span className="text-2xl font-black text-[#34D399] font-mono">Rp 8.500.000.000</span>
                </div>
              </div>

              {/* Escrow Active Ledger */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#0F2D24] border border-[#1B4D3E] rounded-2xl p-5 space-y-4 shadow-md">
                  <div className="flex items-center justify-between border-b border-[#1B4D3E] pb-3">
                    <div className="flex items-center gap-2 text-white font-bold text-sm">
                      <Lock className="w-4 h-4 text-[#10B981]" />
                      <span>Escrow Active Contract #ESC-8821</span>
                    </div>
                    <span className="bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono">
                      FUNDS LOCKED
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Nilai Belanja Warung:</span>
                      <strong className="text-white">Rp 35.000</strong>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Tarif Ongkir Jastiper:</span>
                      <strong className="text-[#34D399]">Rp 7.000</strong>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>Biaya Platform (App Fee):</span>
                      <strong className="text-white">Rp 1.000</strong>
                    </div>
                    <div className="pt-2 border-t border-[#1B4D3E] flex justify-between text-sm font-bold">
                      <span className="text-white">Total Tertampung:</span>
                      <span className="text-[#34D399] font-mono font-black">Rp 43.000</span>
                    </div>
                  </div>
                  <div className="pt-2 flex gap-2">
                    <button type="button" className="w-full py-2 bg-[#10B981] hover:bg-[#059669] text-[#061A14] font-black text-xs rounded-xl transition-all">
                      Manual Release to Runner
                    </button>
                    <button type="button" className="w-full py-2 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 font-bold text-xs rounded-xl transition-all">
                      Force Refund
                    </button>
                  </div>
                </div>

                <div className="bg-[#0F2D24] border border-[#1B4D3E] rounded-2xl p-5 space-y-3 shadow-md">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                    <span>Audit Ketentuan Rekber & Settlement</span>
                  </h4>
                  <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                    <li>• <strong>Double-Entry Bookkeeping</strong>: Setiap mutasi debit & kredit tercatat dengan SHA256 integrity hash.</li>
                    <li>• <strong>Garansi Refund 100%</strong>: Dana otomatis dikembalikan ke pemesan tanpa potongan bila warung tutup.</li>
                    <li>• <strong>QR Verification Lock</strong>: Saldo tidak dapat dicairkan sebelum scan QR mahasiswa pemesan tervalidasi.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 6: NOTIFICATION SERVICE */}
          {activeNav === 'notifications' && (
            <div className="space-y-6">
              <div className="bg-[#0F2D24] border border-[#1B4D3E] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2.5">
                    <Bell className="w-6 h-6 text-[#10B981]" />
                    <span>Notification & Broadcast Service</span>
                  </h2>
                  <p className="text-xs text-[#A7F3D0]/80 mt-1">
                    Kirim pengumuman rute jastip, broadcast WA order closing, dan push notification ke mahasiswa
                  </p>
                </div>
                <span className="bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40 px-3 py-1.5 rounded-xl text-xs font-mono font-bold">
                  Gateway: WA & WebPush Active
                </span>
              </div>

              {/* Broadcast Form */}
              <div className="bg-[#0F2D24] border border-[#1B4D3E] rounded-2xl p-5 space-y-4 shadow-md">
                <h3 className="text-sm font-bold text-white">Broadcast Notifikasi Kampus Baru</h3>
                <div className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="Judul Broadcast (cth: Sesi Jastip Kantin Menara Buka Slot Baru)"
                    className="w-full bg-[#061A14] border border-[#1B4D3E] rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#10B981]"
                  />
                  <textarea 
                    rows={3} 
                    placeholder="Isi pesan notifikasi ke seluruh runner dan pemesan di Unismuh..."
                    className="w-full bg-[#061A14] border border-[#1B4D3E] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-[#10B981]"
                  />
                  <button type="button" className="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-[#061A14] font-black text-xs rounded-xl shadow-md transition-all">
                    Kirim Broadcast Sekarang
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 7: MONITORING MICROSERVICE */}
          {activeNav === 'monitoring' && (
            <div className="space-y-6">
              <div className="bg-[#0F2D24] border border-[#1B4D3E] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
                <div>
                  <h2 className="text-xl font-black text-white flex items-center gap-2.5">
                    <Activity className="w-6 h-6 text-[#10B981]" />
                    <span>Microservice Cluster Topology & Health</span>
                  </h2>
                  <p className="text-xs text-[#A7F3D0]/80 mt-1">
                    Detail metrik pod, resource consumption (CPU/RAM), dan distributed trace mesh
                  </p>
                </div>
                <span className="bg-[#061A14] text-[#34D399] border border-[#1B4D3E] px-3 py-1.5 rounded-xl text-xs font-mono font-bold">
                  Cluster: Unismuh-K8s-v1.28
                </span>
              </div>

              {/* 4 Services Deep Dive */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {microservices.map((svc) => (
                  <div key={svc.id} className="bg-[#0F2D24] border border-[#1B4D3E] rounded-2xl p-5 space-y-3 shadow-md">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#061A14] text-[#10B981] flex items-center justify-center border border-[#1B4D3E]">
                          <svc.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white">{svc.name}</h4>
                          <span className="text-[10px] font-mono text-[#34D399]">Port :{svc.port}</span>
                        </div>
                      </div>
                      <span className="bg-[#10B981]/20 text-[#34D399] px-2 py-0.5 rounded text-[10px] font-bold font-mono">
                        POD RUNNING
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center bg-[#061A14] p-3 rounded-xl border border-[#1B4D3E] font-mono text-xs">
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">CPU Usage</span>
                        <strong className="text-white">12% (0.24 Core)</strong>
                      </div>
                      <div className="border-x border-[#1B4D3E]">
                        <span className="text-[9px] text-slate-400 block uppercase">Memory</span>
                        <strong className="text-white">142 MB</strong>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 block uppercase">Error Rate</span>
                        <strong className="text-[#34D399]">0.00%</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      {/* 
        ========================================================================
        MODAL: DIAGRAM ARSITEKTUR DDD (DOMAIN-DRIVEN DESIGN)
        ========================================================================
      */}
      {showDddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#081F18] border border-[#1B4D3E] rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative animate-scale-in">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[#1B4D3E] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0F2D24] text-[#10B981] border border-[#10B981]/40 flex items-center justify-center">
                  <Network className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-white">
                    Diagram Arsitektur DDD (Domain-Driven Design)
                  </h3>
                  <p className="text-xs text-[#A7F3D0]/80">
                    Bounded Contexts & Event-Driven Architecture Platform Jastip Kampus
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDddModal(false)}
                className="p-2 text-slate-400 hover:text-white bg-[#0F2D24] hover:bg-[#13382D] rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Visual DDD Bounded Contexts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Context 1: Order Bounded Context */}
              <div className="bg-[#0F2D24] border border-[#1B4D3E] rounded-2xl p-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#34D399] uppercase">Bounded Context 01</span>
                  <span className="text-[10px] bg-[#061A14] text-[#10B981] px-2 py-0.5 rounded font-mono font-bold">Port 8001</span>
                </div>
                <h4 className="text-base font-bold text-white">Order & Session Context</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Mengelola agregat <code>Order</code>, sesi keberangkatan kurir, penawaran ongkir mahasiswa, serta aturan auto-closing H-30 menit.
                </p>
                <div className="pt-2 text-[11px] font-mono text-[#A7F3D0] space-y-1">
                  <div>• Aggregates: OrderAggregate, SessionSchedule</div>
                  <div>• Domain Events: <code>OrderCreated</code>, <code>OrderClosed</code></div>
                </div>
              </div>

              {/* Context 2: Catalog Bounded Context */}
              <div className="bg-[#0F2D24] border border-[#1B4D3E] rounded-2xl p-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#34D399] uppercase">Bounded Context 02</span>
                  <span className="text-[10px] bg-[#061A14] text-[#10B981] px-2 py-0.5 rounded font-mono font-bold">Port 8002</span>
                </div>
                <h4 className="text-base font-bold text-white">Campus Catalog Context</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Menyimpan item warung kantin, ATK, kosmetik kampus, rating, harga grosir, dan ketersediaan stok aktual.
                </p>
                <div className="pt-2 text-[11px] font-mono text-[#A7F3D0] space-y-1">
                  <div>• Aggregates: ProductItem, VendorShop</div>
                  <div>• Domain Events: <code>ItemPriceUpdated</code>, <code>StockSynced</code></div>
                </div>
              </div>

              {/* Context 3: Escrow & Payment Context */}
              <div className="bg-[#0F2D24] border border-[#1B4D3E] rounded-2xl p-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#34D399] uppercase">Bounded Context 03</span>
                  <span className="text-[10px] bg-[#061A14] text-[#10B981] px-2 py-0.5 rounded font-mono font-bold">Port 8003</span>
                </div>
                <h4 className="text-base font-bold text-white">Payment & Escrow Vault Context</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Sistem rekening bersama otomatis. Mengunci dana QRIS/Wallet hingga konfirmasi serah terima barang selesai.
                </p>
                <div className="pt-2 text-[11px] font-mono text-[#A7F3D0] space-y-1">
                  <div>• Aggregates: EscrowVault, TransactionLedger</div>
                  <div>• Domain Events: <code>FundLocked</code>, <code>FundReleasedToRunner</code></div>
                </div>
              </div>

              {/* Context 4: Telemetry & Tracking Context */}
              <div className="bg-[#0F2D24] border border-[#1B4D3E] rounded-2xl p-5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#34D399] uppercase">Bounded Context 04</span>
                  <span className="text-[10px] bg-[#061A14] text-[#10B981] px-2 py-0.5 rounded font-mono font-bold">Port 8004</span>
                </div>
                <h4 className="text-base font-bold text-white">Delivery & Telemetry Context</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Koordinat GPS runner di Menara Iqra/Lab Terpadu via WebSocket broadcast, ETA kalkulator, dan notifikasi SMS/WA.
                </p>
                <div className="pt-2 text-[11px] font-mono text-[#A7F3D0] space-y-1">
                  <div>• Aggregates: CourierTelemetry, DropPoint</div>
                  <div>• Domain Events: <code>RunnerArrivedAtMeetingPoint</code></div>
                </div>
              </div>

            </div>

            {/* Event Bus Integration Banner */}
            <div className="bg-[#061A14] border border-[#10B981]/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <Zap className="w-5 h-5 text-[#10B981]" />
                <div>
                  <span className="text-white font-bold block">Event Bus & Service Mesh: Active</span>
                  <span className="text-slate-400 text-[11px]">Semua Bounded Contexts terhubung asinkron dengan zero data loss</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDddModal(false)}
                className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-[#061A14] font-black rounded-xl transition-all"
              >
                Tutup Diagram
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
