import React, { useState } from 'react';
import { 
  FileText, ShieldCheck, QrCode, ArrowRight, CheckCircle2, 
  Clock, Sparkles, MapPin, Store, AlertCircle, RefreshCw, Layers, Trash2
} from 'lucide-react';
import { JastipOrder } from '../types';
import { PortalTab } from './PortalNavbar';

interface MyOrdersSectionProps {
  currentOrder: JastipOrder;
  onUpdateOrder: (order: JastipOrder) => void;
  onNavigateTab: (tab: PortalTab) => void;
  currentRole?: string;
  onShowToast?: (msg: string) => void;
  isOrderDeleted?: boolean;
  onDeleteOrder?: (orderId: string) => void;
}

export const MyOrdersSection: React.FC<MyOrdersSectionProps> = ({
  currentOrder,
  onUpdateOrder,
  onNavigateTab,
  currentRole,
  onShowToast,
  isOrderDeleted = false,
  onDeleteOrder
}) => {
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);
  const [showQrisModal, setShowQrisModal] = useState(false);

  const handleSimulatePayment = () => {
    setIsSimulatingPayment(true);
    setTimeout(() => {
      setIsSimulatingPayment(false);
      setShowQrisModal(false);
      
      const updated: JastipOrder = {
        ...currentOrder,
        status: 'ESCROW_DITAMPUNG',
        escrowStatus: 'HELD_IN_ESCROW',
        trackingHistory: currentOrder.trackingHistory.map((th, idx) => {
          if (idx === 1) return { ...th, done: true, note: 'Pembayaran QRIS Rp ' + currentOrder.grandTotal.toLocaleString('id-ID') + ' terverifikasi dan ditahan di Rekber Escrow.' };
          return th;
        })
      };
      onUpdateOrder(updated);
    }, 1200);
  };

  const handleAdvanceStep = () => {
    let nextStatus = currentOrder.status;
    let nextEscrow = currentOrder.escrowStatus;

    if (currentOrder.status === 'ESCROW_DITAMPUNG') {
      nextStatus = 'DIBELI_JASTIPER';
    } else if (currentOrder.status === 'DIBELI_JASTIPER') {
      nextStatus = 'MENUJU_KAMPUS';
    } else if (currentOrder.status === 'MENUJU_KAMPUS') {
      nextStatus = 'SAMPAI_DI_TITIK_TEMU';
    } else if (currentOrder.status === 'SAMPAI_DI_TITIK_TEMU') {
      nextStatus = 'SELESAI_DITERIMA';
      nextEscrow = 'RELEASED_TO_JASTIPER';
    }

    const updated: JastipOrder = {
      ...currentOrder,
      status: nextStatus,
      escrowStatus: nextEscrow,
      trackingHistory: currentOrder.trackingHistory.map((step, idx) => {
        if (nextStatus === 'DIBELI_JASTIPER' && idx <= 3) return { ...step, done: true };
        if (nextStatus === 'MENUJU_KAMPUS' && idx <= 4) return { ...step, done: true };
        if (nextStatus === 'SAMPAI_DI_TITIK_TEMU' && idx <= 4) return { ...step, done: true };
        if (nextStatus === 'SELESAI_DITERIMA') return { ...step, done: true };
        return step;
      })
    };

    onUpdateOrder(updated);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Pesanan Aktif Anda
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-950 mt-1">
            Order #{currentOrder.orderCode}
          </h2>
          <p className="text-xs text-emerald-700 font-mono">
            Dibuat pukul {currentOrder.createdAt} • Titik Temu: {currentOrder.meetingPoint}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('tracking')}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-200" />
            <span>Lihat Live Map Tracking</span>
          </button>
        </div>
      </div>

      {/* Main Order Details Grid */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Items List & Pricing Breakdown */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Order Items */}
          <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Daftar Barang Titipan ({currentOrder.items.length} Item)
            </h3>

            <div className="space-y-3">
              {currentOrder.items.map((it, idx) => (
                <div key={idx} className="flex gap-3.5 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={it.item.image} 
                      alt={it.item.name} 
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 rounded-lg object-cover border border-emerald-200"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase">{it.item.category}</span>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{it.item.name}</h4>
                      <p className="text-[11px] text-slate-500">{it.item.storeName} ({it.qty}x)</p>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <span className="font-bold text-emerald-950">
                      Rp {(it.item.price * it.qty).toLocaleString('id-ID')}
                    </span>
                    <span className="text-[10px] text-emerald-700 block font-sans">
                      Jastip: Rp {(it.item.jastipFee * it.qty).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing & Escrow Ledger Breakdown */}
          <div className="bg-emerald-800 text-white rounded-2xl p-5 border border-emerald-900 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-700/60 pb-3">
              <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>Rincian Pembayaran Escrow Vault</span>
              </span>
              <span className="text-[10px] bg-emerald-900 text-emerald-200 px-2 py-0.5 rounded font-mono font-bold border border-emerald-600">
                Double-Entry Ledger
              </span>
            </div>

            <div className="space-y-2 text-xs text-emerald-100">
              <div className="flex justify-between">
                <span>Subtotal Harga Barang:</span>
                <span className="font-mono text-white">Rp {currentOrder.totalItemPrice.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>Ongkos Jastip (Disepakati):</span>
                <span className="font-mono text-emerald-200">Rp {currentOrder.totalJastipFee.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Layanan & Rekber:</span>
                <span className="font-mono text-white">Rp {currentOrder.appFee.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-emerald-300 pt-1 border-t border-emerald-700/50">
                <span>Metode Pembayaran:</span>
                <span className="font-semibold text-white">{currentOrder.paymentMethodLabel || 'QRIS Unismuh Pay'}</span>
              </div>
              <div className="pt-2 border-t border-emerald-700/60 flex justify-between font-bold text-sm text-white">
                <span>Total Ditampung:</span>
                <span className="font-mono text-emerald-200 text-base">Rp {currentOrder.grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Status Card & Action Gate */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Escrow Status Card */}
          <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Status Escrow Vault</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                currentOrder.escrowStatus === 'HELD_IN_ESCROW' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                currentOrder.escrowStatus === 'RELEASED_TO_JASTIPER' ? 'bg-emerald-600 text-white shadow-sm' :
                'bg-emerald-50 text-emerald-800 border border-emerald-200'
              }`}>
                {currentOrder.escrowStatus === 'HELD_IN_ESCROW' ? '🔒 Dana Terkunci di Rekber' :
                 currentOrder.escrowStatus === 'RELEASED_TO_JASTIPER' ? '✓ Dana Dicairkan ke Jastiper' : 'Menunggu Pembayaran'}
              </span>
            </div>

            <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 text-xs text-slate-700 space-y-2">
              <div className="flex items-center gap-2 font-bold text-emerald-950">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Proteksi Pembeli 100% Kampus Unismuh</span>
              </div>
              <p className="leading-relaxed text-[11px] text-emerald-800">
                Uang Anda tetap aman di Payment-Service Rekber. Jastiper hanya akan menerima uangnya setelah Anda mengonfirmasi penerimaan barang di titik temu kampus.
              </p>
            </div>

            {/* Simulating QRIS Payment if pending */}
            {currentOrder.status === 'MENUNGGU_PEMBAYARAN' && (
              <button
                onClick={() => setShowQrisModal(true)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <QrCode className="w-4 h-4" />
                <span>Bayar Sekarang via QRIS (Rp {currentOrder.grandTotal.toLocaleString('id-ID')})</span>
              </button>
            )}

            {/* Step Simulator Progression button for demo */}
            <div className="pt-2 border-t border-emerald-50 space-y-2">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                Simulasi Alur Microservices Jastip:
              </span>
              
              <button
                onClick={handleAdvanceStep}
                className="w-full py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-emerald-200"
              >
                <RefreshCw className="w-3.5 h-3.5 text-emerald-700" />
                <span>
                  {currentOrder.status === 'ESCROW_DITAMPUNG' ? '1. Jastiper Belanja di Warung' :
                   currentOrder.status === 'DIBELI_JASTIPER' ? '2. Jastiper Menuju Kampus' :
                   currentOrder.status === 'MENUJU_KAMPUS' ? '3. Tiba di Menara Iqra (Titik Temu)' :
                   currentOrder.status === 'SAMPAI_DI_TITIK_TEMU' ? '4. Scan QR & Cairkan Escrow' : 'Selesai (Reset Sesi)'}
                </span>
              </button>
            </div>
          </div>

          {/* Quick Tracking Stepper */}
          <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Tahapan Penyerahan Barang
            </h3>
            
            <div className="space-y-2.5">
              {currentOrder.trackingHistory.slice(0, 4).map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    step.done ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {step.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <div>
                    <span className={`font-bold ${step.done ? 'text-slate-900' : 'text-slate-500'}`}>
                      {step.step}
                    </span>
                    <p className="text-[11px] text-slate-500">{step.note}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateTab('tracking')}
              className="w-full pt-2 text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center justify-center gap-1"
            >
              <span>Buka Timeline & Verifikasi QR Lengkap</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>

      </div>

      {/* QRIS Modal */}
      {showQrisModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-emerald-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 mx-auto flex items-center justify-center text-emerald-700">
              <QrCode className="w-6 h-6" />
            </div>
            
            <div>
              <h3 className="text-base font-bold text-emerald-950">Pembayaran QRIS Jastip Kampus</h3>
              <p className="text-xs text-emerald-700 font-mono">Order: {currentOrder.orderCode}</p>
            </div>

            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-2">
              <div className="w-48 h-48 bg-white border border-emerald-300 rounded-xl mx-auto flex items-center justify-center shadow-inner">
                {/* QR Pattern */}
                <div className="grid grid-cols-4 gap-2 p-4">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className={`w-8 h-8 rounded ${i % 2 === 0 ? 'bg-emerald-900' : 'bg-emerald-100'}`}></div>
                  ))}
                </div>
              </div>
              <p className="text-[10px] text-emerald-700 font-mono">Scan dengan BCA, BRImo, Dana, GoPay, ShopeePay</p>
            </div>

            <div className="text-sm font-bold text-emerald-950 font-mono">
              Total: Rp {currentOrder.grandTotal.toLocaleString('id-ID')}
            </div>

            <button
              onClick={handleSimulatePayment}
              disabled={isSimulatingPayment}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {isSimulatingPayment ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Memvalidasi Pembayaran...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simulasikan Pembayaran Berhasil</span>
                </>
              )}
            </button>

            <button
              onClick={() => setShowQrisModal(false)}
              className="text-xs text-slate-400 hover:text-slate-600 block mx-auto"
            >
              Batal
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
