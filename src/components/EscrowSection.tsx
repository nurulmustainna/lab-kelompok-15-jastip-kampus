import React, { useState } from 'react';
import { 
  ShieldCheck, Lock, ArrowRight, CheckCircle2, 
  AlertTriangle, DollarSign, Database, RefreshCw, Layers 
} from 'lucide-react';
import { JastipOrder } from '../types';

interface EscrowSectionProps {
  currentOrder: JastipOrder;
  onUpdateOrder: (order: JastipOrder) => void;
}

export const EscrowSection: React.FC<EscrowSectionProps> = ({
  currentOrder,
  onUpdateOrder
}) => {
  const [refundStatus, setRefundStatus] = useState<string | null>(null);

  const handleSimulateRefund = () => {
    setRefundStatus('REFUND_PROCESSING');
    setTimeout(() => {
      const updated: JastipOrder = {
        ...currentOrder,
        status: 'MENUNGGU_PEMBAYARAN',
        escrowStatus: 'REFUNDED',
        trackingHistory: currentOrder.trackingHistory.map((step, i) => {
          if (i === 1) return { ...step, note: '100% Saldo Escrow berhasil di-refund ke rekening mahasiswa karena pesanan dibatalkan/stok habis.' };
          return step;
        })
      };
      onUpdateOrder(updated);
      setRefundStatus('REFUND_SUCCESS');
      setTimeout(() => setRefundStatus(null), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Payment-Service: Port 8003
            </span>
            <span className="text-xs text-emerald-700 font-mono">Double-Entry Vault</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-950 mt-1">
            Sistem Rekening Bersama (Escrow Vault)
          </h2>
          <p className="text-xs text-emerald-800">
            Arsitektur keamanan finansial yang melindungi dana pembeli dan memastikan jastiper menerima pembayaran setelah verifikasi fisik QR.
          </p>
        </div>
      </div>

      {/* Escrow Status & Ledger Breakdown */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Escrow Vault Visualizer */}
        <div className="lg:col-span-6 bg-emerald-800 text-white rounded-3xl p-6 sm:p-8 border border-emerald-900 shadow-lg space-y-6">
          <div className="flex items-center justify-between border-b border-emerald-700/60 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-900 border border-emerald-600 flex items-center justify-center text-emerald-300">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Escrow Vault Aktif</h3>
                <p className="text-xs text-emerald-200 font-mono">ID: ESC-UNISMUH-9921</p>
              </div>
            </div>
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-600 text-xs font-mono font-bold px-2.5 py-1 rounded-full">
              Status: {currentOrder.escrowStatus}
            </span>
          </div>

          <div className="space-y-4">
            <div className="bg-emerald-900/90 p-4 rounded-2xl border border-emerald-700/80 space-y-2">
              <span className="text-[11px] text-emerald-200 block font-semibold uppercase tracking-wider">
                Total Dana Tertampung di Vault:
              </span>
              <div className="text-3xl font-mono font-extrabold text-white">
                Rp {currentOrder.grandTotal.toLocaleString('id-ID')}
              </div>
              <p className="text-[11px] text-emerald-200 font-mono">
                Order #{currentOrder.orderCode} • Pemesan: {currentOrder.customerName}
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-emerald-100">
                <span>Nilai Belanja Toko (Warung Alauddin):</span>
                <span className="font-mono text-white">Rp {currentOrder.totalItemPrice.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-emerald-100">
                <span>Tarif Jastip untuk Mahasiswa Kurir:</span>
                <span className="font-mono text-emerald-200">Rp {currentOrder.totalJastipFee.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-emerald-100">
                <span>Biaya Pemeliharaan Sistem (App Fee):</span>
                <span className="font-mono text-white">Rp {currentOrder.appFee.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-emerald-200 pt-1 border-t border-emerald-700/50">
                <span>Metode Pembayaran Rekber:</span>
                <span className="font-bold text-white">{currentOrder.paymentMethodLabel || 'QRIS Unismuh Pay'}</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-emerald-900/60 rounded-2xl border border-emerald-700/60 text-xs text-emerald-100 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Jaminan Keamanan 100%</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              Jika barang habis di warung atau jastiper berhalangan, Payment-Service mengeksekusi garansi refund 100% instan tanpa potongan biaya.
            </p>
          </div>
        </div>

        {/* Right Column: Ledger Rules & Refund Trigger */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wider">
              Mekanisme Kerja Rekber Jastip:
            </h3>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-start gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">1</div>
                <div>
                  <strong className="text-emerald-950 block">Dana Ditahan (Hold):</strong>
                  <span className="text-slate-600">Uang dari pemesan masuk ke rekening bersama Payment-Service saat checkout QRIS.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">2</div>
                <div>
                  <strong className="text-emerald-950 block">Jastiper Membeli Barang:</strong>
                  <span className="text-slate-600">Jastiper aman berbelanja karena dana pemesan sudah dijamin terkunci di vault sistem.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0">3</div>
                <div>
                  <strong className="text-emerald-950 block">Pencairan Dana Otomatis:</strong>
                  <span className="text-slate-600">Setelah serah terima fisik diverifikasi via QR scan di kampus, saldo langsung ditransfer ke jastiper.</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-emerald-50 space-y-3">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                Simulasi Kasus Darurat (Item Habis di Toko):
              </span>

              <button
                onClick={handleSimulateRefund}
                disabled={refundStatus === 'REFUND_PROCESSING'}
                className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {refundStatus === 'REFUND_PROCESSING' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-700" />
                    <span>Memproses Refund 100%...</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Uji Coba Pengembalian Dana (Refund 100%)</span>
                  </>
                )}
              </button>

              {refundStatus === 'REFUND_SUCCESS' && (
                <div className="p-3 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>Refund 100% berhasil dieksekusi oleh Payment-Service!</span>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
