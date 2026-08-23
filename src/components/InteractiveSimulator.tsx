import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Plus, Minus, CheckCircle, Package, ArrowRight, ShieldCheck, 
  MapPin, Clock, AlertTriangle, QrCode, RefreshCw, Send, Check, Sparkles, X, 
  Store
} from 'lucide-react';
import { CatalogItem, JastipOrder, JastipSession } from '../types';

interface InteractiveSimulatorProps {
  sessions: JastipSession[];
  catalogItems: CatalogItem[];
  currentOrder: JastipOrder;
  onUpdateOrder: (order: JastipOrder) => void;
  selectedSession: JastipSession;
  onSelectSession: (session: JastipSession) => void;
}

export const InteractiveSimulator: React.FC<InteractiveSimulatorProps> = ({
  sessions,
  catalogItems,
  currentOrder,
  onUpdateOrder,
  selectedSession,
  onSelectSession
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [cart, setCart] = useState<{ item: CatalogItem; qty: number }[]>([
    { item: catalogItems[0], qty: 1 },
    { item: catalogItems[2], qty: 1 }
  ]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [customerName, setCustomerName] = useState('Ahmad Fauzan');
  const [customerProdi, setCustomerProdi] = useState('Teknik Informatika (2024)');
  const [meetingPoint, setMeetingPoint] = useState('Lobby Menara Iqra Unismuh');
  const [tawarOption, setTawarOption] = useState<'standar' | 'hemat' | 'prioritas'>('standar');
  const [showQrModal, setShowQrModal] = useState(false);
  const [trackingActiveStep, setTrackingActiveStep] = useState(3); // 0 to 4
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(28 * 60); // 28 minutes

  // Countdown timer for closing time simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Filter items based on selected category & session's available stores
  const categories = ['Semua', 'Makanan', 'Minuman', 'ATK & Cetak', 'Komponen & Alat Lab'];
  
  const filteredCatalog = catalogItems.filter(item => {
    if (selectedCategory !== 'Semua' && item.category !== selectedCategory) return false;
    return true;
  });

  const baseItemPrice = cart.reduce((acc, curr) => acc + curr.item.price * curr.qty, 0);
  const baseJastipFee = cart.reduce((acc, curr) => acc + curr.item.jastipFee * curr.qty, 0);
  
  // Tawar adjustment multiplier
  const tawarMultiplier = tawarOption === 'hemat' ? 0.8 : tawarOption === 'prioritas' ? 1.4 : 1.0;
  const totalItemPrice = baseItemPrice;
  const totalJastipFee = Math.round(baseJastipFee * tawarMultiplier);
  const totalWeightKg = parseFloat(cart.reduce((acc, curr) => acc + (curr.item.estimatedWeightKg * curr.qty), 0).toFixed(2));
  const appFee = 1000;
  const grandTotal = totalItemPrice + totalJastipFee + appFee;

  const currentTotalWeightSession = parseFloat((selectedSession.currentCapacityKg + totalWeightKg).toFixed(2));
  const isWeightOverload = currentTotalWeightSession > selectedSession.maxCapacityKg;

  const handleAddToCart = (item: CatalogItem) => {
    setCart(prev => {
      const existing = prev.find(p => p.item.id === item.id);
      if (existing) {
        return prev.map(p => p.item.id === item.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { item, qty: 1 }];
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(prev => {
      const existing = prev.find(p => p.item.id === itemId);
      if (existing && existing.qty > 1) {
        return prev.map(p => p.item.id === itemId ? { ...p, qty: p.qty - 1 } : p);
      }
      return prev.filter(p => p.item.id !== itemId);
    });
  };

  const handleCreateOrder = () => {
    if (cart.length === 0) return;
    setIsCheckingOut(true);

    setTimeout(() => {
      const newOrder: JastipOrder = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        orderCode: `JSTP-UNISMUH-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName,
        customerProdi,
        sessionId: selectedSession.id,
        items: [...cart],
        totalItemPrice,
        totalJastipFee,
        appFee,
        grandTotal,
        status: 'ESCROW_DITAMPUNG',
        meetingPoint,
        createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WITA',
        escrowStatus: 'HELD_IN_ESCROW',
        trackingHistory: [
          {
            step: 'Pemesanan Dibuat & Escrow Diamankan',
            timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WITA',
            note: `Payment-Service berhasil menampung dana Rp ${grandTotal.toLocaleString('id-ID')} ke rekening bersama.`,
            done: true
          },
          {
            step: 'Order Ditutup (Closing Time Locked)',
            timestamp: selectedSession.closingTime,
            note: `Order-Service mengunci slot sesi Jastiper ${selectedSession.jastiperName}.`,
            done: true
          },
          {
            step: 'Barang Selesai Dibelikan di Toko',
            timestamp: 'Dalam Proses',
            note: 'Jastiper sedang membeli item di merchant.',
            done: false
          },
          {
            step: 'Jastiper Menuju Kampus FT Unismuh',
            timestamp: 'Estimasi 12:10 WITA',
            note: 'Tracking-Service mencatat perjalanan menuju Lobby FT.',
            done: false
          },
          {
            step: 'Barang Diterima & Saldo Dicairkan',
            timestamp: 'Titik Temu FT',
            note: 'Scan QR di Lobby FT untuk konfirmasi terima barang.',
            done: false
          }
        ]
      };

      onUpdateOrder(newOrder);
      setTrackingActiveStep(1);
      setIsCheckingOut(false);
      setShowQrModal(true);
    }, 800);
  };

  const handleAdvanceTracking = () => {
    if (trackingActiveStep < 4) {
      const nextStep = trackingActiveStep + 1;
      setTrackingActiveStep(nextStep);
      
      const updatedHistory = [...currentOrder.trackingHistory];
      if (updatedHistory[nextStep]) {
        updatedHistory[nextStep].done = true;
        updatedHistory[nextStep].timestamp = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WITA';
      }

      let updatedStatus: JastipOrder['status'] = currentOrder.status;
      let updatedEscrow = currentOrder.escrowStatus;

      if (nextStep === 1) updatedStatus = 'ESCROW_DITAMPUNG';
      if (nextStep === 2) updatedStatus = 'DIBELI_JASTIPER';
      if (nextStep === 3) updatedStatus = 'MENUJU_KAMPUS';
      if (nextStep === 4) {
        updatedStatus = 'SELESAI_DITERIMA';
        updatedEscrow = 'RELEASED_TO_JASTIPER';
      }

      onUpdateOrder({
        ...currentOrder,
        status: updatedStatus,
        escrowStatus: updatedEscrow,
        trackingHistory: updatedHistory
      });
    }
  };

  return (
    <section id="simulator" className="py-16 sm:py-24 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Simulasi Alur Interaktif</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Uji Coba Langsung Alur Jastip & Escrow
          </h2>
          <div className="h-1 w-20 bg-blue-600 mx-auto rounded-full"></div>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Pilih sesi jastiper aktif, pilih menu atau kebutuhan lab dari katalog, cek batas kapasitas berat muatan, lalu saksikan bagaimana 4 microservices berkoordinasi menampung dana dan melacak status pesanan.
          </p>
        </div>

        {/* Top Session Selector */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Pilih Jastiper & Rute Keberangkatan</span>
              <h3 className="text-base font-bold text-slate-900">Sesi Jastip Aktif Fakultas Teknik</h3>
            </div>
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700">
              <Clock className="w-4 h-4 text-rose-600 animate-pulse" />
              <span>Hitung Mundur Closing Time: <span className="font-mono text-sm">{formatCountdown(timeLeftSeconds)}</span></span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-3.5">
            {sessions.map((sess) => {
              const isSelected = sess.id === selectedSession.id;
              return (
                <div
                  key={sess.id}
                  onClick={() => onSelectSession(sess)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-blue-50/80 border-blue-600 shadow-sm ring-1 ring-blue-500/30' 
                      : 'bg-white border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <img src={sess.jastiperAvatar} alt={sess.jastiperName} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{sess.jastiperName}</h4>
                        <p className="text-[10px] text-slate-500">{sess.jastiperProdi}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                      Tutup {sess.closingTime}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 space-y-1">
                    <p className="truncate"><strong>Dari:</strong> {sess.routeFrom}</p>
                    <p className="truncate"><strong>Titik Temu:</strong> {sess.meetingPoint}</p>
                    <div className="pt-1.5 flex justify-between text-[10px] text-slate-500">
                      <span>Kapasitas Bagasi:</span>
                      <span className="font-bold text-slate-800">{sess.currentCapacityKg} / {sess.maxCapacityKg} kg</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Grid: Catalog Left, Cart & Live Tracking Right */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Catalog Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Category Pills */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                      selectedCategory === cat 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <span className="text-xs text-slate-400 font-medium">
                Catalog-Service v1.2
              </span>
            </div>

            {/* Catalog Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {filteredCatalog.map((item) => {
                const inCart = cart.find(c => c.item.id === item.id);
                return (
                  <div 
                    key={item.id}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-36 relative overflow-hidden bg-slate-100">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          {item.category}
                        </span>
                        <span className="absolute bottom-2 right-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                          Est. {item.estimatedWeightKg} kg
                        </span>
                      </div>

                      <div className="p-4 space-y-2">
                        <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                          {item.name}
                        </h4>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Store className="w-3 h-3 text-slate-400" />
                          <span className="truncate">{item.storeName}</span>
                        </div>
                        
                        <div className="flex items-baseline justify-between pt-1">
                          <div>
                            <span className="text-xs text-slate-400 font-medium block text-[10px]">Harga Barang:</span>
                            <span className="text-sm font-extrabold text-blue-700">Rp {item.price.toLocaleString('id-ID')}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-slate-400 font-medium block text-[10px]">Jasa Titip:</span>
                            <span className="text-xs font-bold text-emerald-600">+Rp {item.jastipFee.toLocaleString('id-ID')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border-t border-slate-100">
                      {inCart ? (
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700">Dalam Keranjang:</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:bg-slate-100 font-bold"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-xs font-bold text-blue-700 w-4 text-center">{inCart.qty}</span>
                            <button
                              onClick={() => handleAddToCart(item)}
                              className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 font-bold"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambahkan Titipan</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Checkout & Order Tracking Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Cart & Escrow Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                  <h3 className="font-bold text-slate-900 text-base">Keranjang & Proteksi Escrow</h3>
                </div>
                <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-0.5 rounded-full">
                  {cart.reduce((a, c) => a + c.qty, 0)} Item
                </span>
              </div>

              {/* Items List */}
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center italic">
                    Keranjang kosong. Pilih barang dari katalog di sebelah kiri.
                  </p>
                ) : (
                  cart.map(({ item, qty }) => (
                    <div key={item.id} className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                      <div className="flex-1 pr-2">
                        <p className="font-bold text-slate-800 line-clamp-1">{item.name}</p>
                        <span className="text-[10px] text-slate-500">
                          {qty} x Rp {item.price.toLocaleString('id-ID')} + Jastip Rp {(item.jastipFee * qty).toLocaleString('id-ID')}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => handleRemoveFromCart(item.id)}
                          className="w-6 h-6 rounded bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-blue-700 w-4 text-center">{qty}</span>
                        <button 
                          onClick={() => handleAddToCart(item)}
                          className="w-6 h-6 rounded bg-blue-100 hover:bg-blue-200 flex items-center justify-center text-blue-700"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Capacity Checker Alert (Order-Service validation) */}
              <div className={`p-3 rounded-xl text-xs space-y-1 border ${
                isWeightOverload 
                  ? 'bg-rose-50 border-rose-300 text-rose-800' 
                  : 'bg-blue-50/80 border-blue-200 text-blue-900'
              }`}>
                <div className="flex items-center justify-between font-bold">
                  <span className="flex items-center gap-1">
                    <Package className="w-3.5 h-3.5 text-blue-600" />
                    Validasi Muatan (Order-Service)
                  </span>
                  <span>{currentTotalWeightSession} / {selectedSession.maxCapacityKg} kg</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${isWeightOverload ? 'bg-rose-600' : 'bg-blue-600'}`}
                    style={{ width: `${Math.min((currentTotalWeightSession / selectedSession.maxCapacityKg) * 100, 100)}%` }}
                  ></div>
                </div>
                {isWeightOverload ? (
                  <p className="text-[10px] text-rose-700 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Kapasitas bagasi jastiper terlampaui! Kurangi jumlah item.
                  </p>
                ) : (
                  <p className="text-[10px] text-blue-700">
                    Muatan aman. Sesuai batas kapasitas motor/tas jastiper.
                  </p>
                )}
              </div>

              {/* Customer & Meeting Point inputs */}
              <div className="space-y-3 pt-1 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Mahasiswa Pemesan:</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nama lengkap"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Program Studi / Fakultas:</label>
                  <input
                    type="text"
                    value={customerProdi}
                    onChange={(e) => setCustomerProdi(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Teknik Informatika / FEB / FKIP / Kedokteran"
                  />
                </div>

                {/* Tawar / Kesepakatan Biaya Jastip */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                    <span>Fitur Tawar Jastip:</span>
                    <span className="text-[10px] text-blue-600 font-semibold uppercase">Negosiasi Fleksibel</span>
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setTawarOption('hemat')}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all text-center ${
                        tawarOption === 'hemat'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>Hemat (-20%)</span>
                      <span className="block text-[9px] font-normal text-slate-500">Antre santai</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTawarOption('standar')}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all text-center ${
                        tawarOption === 'standar'
                          ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>Standar (Normal)</span>
                      <span className="block text-[9px] font-normal text-slate-500">Tarif wajar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setTawarOption('prioritas')}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-bold border transition-all text-center ${
                        tawarOption === 'prioritas'
                          ? 'bg-amber-50 border-amber-500 text-amber-800 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>Prioritas (+40%)</span>
                      <span className="block text-[9px] font-normal text-slate-500">Antar cepat</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Titik Temu Kampus Unismuh:</label>
                  <select
                    value={meetingPoint}
                    onChange={(e) => setMeetingPoint(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Lobby Menara Iqra Unismuh">Lobby Menara Iqra (Lantai 1 / Resepsionis)</option>
                    <option value="Lobby Gedung Laboratorium Terpadu FT">Lobby Gedung Lab Terpadu FT Unismuh</option>
                    <option value="Gazebo Utama Kampus Unismuh">Gazebo Utama / Taman Kampus Unismuh</option>
                    <option value="Perpustakaan Pusat Unismuh Lt. 2">Perpustakaan Pusat Unismuh Lt. 2</option>
                    <option value="Kantin Kampus Dekat Pintu 2 Alauddin">Kantin Kampus Dekat Pintu 2 Alauddin</option>
                  </select>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal Belanja:</span>
                  <span>Rp {totalItemPrice.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-slate-600 items-center">
                  <span>Jasa Titip ({tawarOption === 'hemat' ? 'Tawar Hemat' : tawarOption === 'prioritas' ? 'Tawar Prioritas' : 'Tarif Standar'}):</span>
                  <span className="text-emerald-600 font-semibold">+Rp {totalJastipFee.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Biaya Proteksi Escrow:</span>
                  <span>Rp {appFee.toLocaleString('id-ID')}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-slate-900 text-sm">
                  <span>Total Escrow Ditampung:</span>
                  <span className="text-blue-700">Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Submit / Lock Button */}
              <button
                onClick={handleCreateOrder}
                disabled={cart.length === 0 || isWeightOverload || isCheckingOut}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isCheckingOut ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Mengunci Order & Menerbitkan Escrow...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-300" />
                    <span>Kunci Pesanan & Simpan di Escrow</span>
                  </>
                )}
              </button>
            </div>

            {/* Live Tracking Service Simulation Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 space-y-5 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h3 className="font-bold text-white text-sm">Tracking-Service Real-Time</h3>
                    <p className="text-[10px] text-slate-400">Order: {currentOrder.orderCode}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  currentOrder.escrowStatus === 'RELEASED_TO_JASTIPER' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}>
                  {currentOrder.escrowStatus === 'RELEASED_TO_JASTIPER' ? 'Saldo Selesai Cair' : 'Dana di Rekening Bersama'}
                </span>
              </div>

              {/* Progress Steps Visualizer */}
              <div className="space-y-4">
                {currentOrder.trackingHistory.map((hist, idx) => {
                  const isCurrent = idx === trackingActiveStep;
                  const isCompleted = idx <= trackingActiveStep;

                  return (
                    <div key={idx} className="flex items-start gap-3 relative">
                      {/* Vertical line connecting steps */}
                      {idx < currentOrder.trackingHistory.length - 1 && (
                        <div className={`absolute left-3 top-6 bottom-0 w-0.5 ${
                          idx < trackingActiveStep ? 'bg-emerald-500' : 'bg-slate-800'
                        }`}></div>
                      )}

                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 z-10 ${
                        isCompleted 
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30' 
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}>
                        {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                      </div>

                      <div className="flex-1 pb-3">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-xs font-bold ${isCurrent ? 'text-blue-300 font-mono' : isCompleted ? 'text-white' : 'text-slate-500'}`}>
                            {hist.step}
                          </h4>
                          <span className="text-[10px] font-mono text-slate-400">{hist.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                          {hist.note}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Step Simulation Controls */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400 font-mono">
                  Tahap: {trackingActiveStep + 1} / 5
                </span>

                <button
                  onClick={handleAdvanceTracking}
                  disabled={trackingActiveStep >= 4}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 shadow"
                >
                  {trackingActiveStep === 3 ? (
                    <>
                      <QrCode className="w-3.5 h-3.5 text-white" />
                      <span>Scan Serah Terima & Lepas Escrow</span>
                    </>
                  ) : trackingActiveStep >= 4 ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Transaksi Selesai</span>
                    </>
                  ) : (
                    <>
                      <span>Simulasi Status Berikutnya</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>

      {/* QRIS / Escrow Success Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl relative animate-scale-in">
            <button 
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Dana Escrow Berhasil Dikunci!</h3>
              <p className="text-xs text-slate-600">
                Payment-Service menahan saldo Rp {grandTotal.toLocaleString('id-ID')} hingga Anda memindai konfirmasi terima barang di Lobby FT Unismuh.
              </p>
            </div>

            {/* QR Simulation Box */}
            <div className="bg-slate-50 border-2 border-dashed border-blue-300 rounded-2xl p-5 text-center space-y-3">
              <div className="w-32 h-32 bg-white border border-slate-200 rounded-xl mx-auto flex items-center justify-center p-2 shadow-sm">
                <QrCode className="w-28 h-28 text-slate-900" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Kode Verifikasi QR FT:</span>
                <span className="font-mono font-bold text-blue-700 text-sm tracking-wider">{currentOrder.orderCode}</span>
              </div>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors"
            >
              Tutup & Lacak Pesanan Real-Time
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
