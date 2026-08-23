import React, { useState } from 'react';
import { 
  MapPin, CheckCircle2, QrCode, ArrowRight, ShieldCheck, 
  Bike, Clock, Store, RefreshCw, AlertCircle 
} from 'lucide-react';
import { JastipOrder } from '../types';

interface LiveTrackingSectionProps {
  currentOrder: JastipOrder;
  onUpdateOrder: (order: JastipOrder) => void;
}

export const LiveTrackingSection: React.FC<LiveTrackingSectionProps> = ({
  currentOrder,
  onUpdateOrder
}) => {
  const [isVerifyingQr, setIsVerifyingQr] = useState(false);

  const handleVerifyQr = () => {
    setIsVerifyingQr(true);
    setTimeout(() => {
      setIsVerifyingQr(false);

      const updated: JastipOrder = {
        ...currentOrder,
        status: 'SELESAI_DITERIMA',
        escrowStatus: 'RELEASED_TO_JASTIPER',
        trackingHistory: currentOrder.trackingHistory.map((step, idx) => {
          if (idx === 5) return { ...step, done: true, note: 'Verifikasi scan QR berhasil di Menara Iqra. Dana escrow Rp ' + currentOrder.grandTotal.toLocaleString('id-ID') + ' telah dicairkan ke jastiper.' };
          return { ...step, done: true };
        })
      };
      onUpdateOrder(updated);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Header */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Tracking-Service: Port 8004
            </span>
            <span className="text-xs text-emerald-700 font-mono">Live WebSocket Updates</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-950 mt-1">
            Pelacakan Status & Titik Temu Unismuh
          </h2>
          <p className="text-xs text-emerald-800">
            Pemantauan transisi posisi jastiper secara real-time dari toko sekitar Alauddin menuju kampus.
          </p>
        </div>
      </div>

      {/* Main Tracking Grid */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Map & Location Visualizer */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Peta Rute Perjalanan Jastiper
            </span>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
              ETA: 3 Menit Menuju Menara Iqra
            </span>
          </div>

          {/* Interactive Visual Map Card */}
          <div className="relative bg-emerald-800 rounded-2xl p-6 text-white overflow-hidden border border-emerald-900 space-y-4">
            
            {/* Background Grid Accent */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]"></div>

            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              
              {/* Point A: Origin Store */}
              <div className="flex items-center gap-3 bg-emerald-900/90 p-3 rounded-xl border border-emerald-700 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-lg bg-emerald-800 border border-emerald-600 flex items-center justify-center text-emerald-200">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-emerald-200 block font-semibold">Toko Asal:</span>
                  <p className="text-xs font-bold text-white">Sentra Kuliner Alauddin</p>
                </div>
              </div>

              {/* Transit Indicator */}
              <div className="flex items-center gap-2 text-emerald-200 font-mono text-xs font-bold">
                <Bike className="w-5 h-5 text-emerald-300 animate-bounce" />
                <span>----------➔</span>
              </div>

              {/* Point B: Destination Campus */}
              <div className="flex items-center gap-3 bg-emerald-900/90 p-3 rounded-xl border border-emerald-700 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-lg bg-emerald-800 border border-emerald-600 flex items-center justify-center text-emerald-200">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-emerald-200 block font-semibold">Titik Temu:</span>
                  <p className="text-xs font-bold text-white">{currentOrder.meetingPoint}</p>
                </div>
              </div>

            </div>

            <div className="relative z-10 p-3 bg-emerald-900/95 rounded-xl border border-emerald-700 text-xs text-emerald-100 flex items-center justify-between">
              <span className="text-[11px] text-emerald-200">Posisi Saat Ini: Depan Pintu 1 Jl. Sultan Alauddin</span>
              <span className="font-mono text-emerald-300 font-bold">Latency: 24ms</span>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
              Timeline Status Pesanan (Tracking-Service):
            </h4>

            <div className="space-y-3">
              {currentOrder.trackingHistory.map((step, idx) => (
                <div 
                  key={idx} 
                  className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3.5 ${
                    step.done ? 'bg-emerald-50/70 border-emerald-200' : 'bg-slate-50 border-emerald-100 opacity-60'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-xs ${
                    step.done ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {step.done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <div className="space-y-0.5 flex-grow">
                    <div className="flex items-center justify-between">
                      <h5 className="text-xs font-bold text-emerald-950">{step.step}</h5>
                      <span className="text-[10px] font-mono text-emerald-700">{step.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{step.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right: QR Code Handover Verification */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
            <div className="flex items-center gap-3 border-b border-emerald-50 pb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-950">Verifikasi QR Serah Terima Fisik</h3>
                <p className="text-xs text-emerald-700 font-mono">Handover Protocol</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Tunjukkan QR Code ini kepada jastiper saat bertemu di titik temu kampus. Scan QR ini memicu pelepasan saldo escrow secara otomatis ke dompet jastiper.
            </p>

            {/* QR Pattern Card */}
            <div className="bg-emerald-800 p-5 rounded-2xl text-center space-y-3 text-white border border-emerald-900">
              <div className="w-40 h-40 bg-white border-2 border-emerald-700 rounded-xl mx-auto flex items-center justify-center p-3 shadow-md">
                <div className="grid grid-cols-5 gap-1.5 w-full h-full">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`rounded-sm ${
                        (i % 3 === 0 || i % 7 === 0) ? 'bg-emerald-900' : 'bg-emerald-100'
                      }`}
                    ></div>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-mono text-emerald-200 font-bold block">
                  AUTH_TOKEN: JSTP-{currentOrder.orderCode}-VERIF
                </span>
                <span className="text-[10px] text-emerald-100">Scan via kamera aplikasi jastiper</span>
              </div>
            </div>

            {/* Action Trigger */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleVerifyQr}
                disabled={isVerifyingQr || currentOrder.status === 'SELESAI_DITERIMA'}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-200 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {isVerifyingQr ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Memverifikasi QR & Melepas Escrow...</span>
                  </>
                ) : currentOrder.status === 'SELESAI_DITERIMA' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Pesanan Sudah Selesai Diterima</span>
                  </>
                ) : (
                  <>
                    <QrCode className="w-4 h-4" />
                    <span>Simulasikan Scan QR Sukses (Serah Terima)</span>
                  </>
                )}
              </button>

              {currentOrder.status === 'SELESAI_DITERIMA' && (
                <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Transaksi selesai! Saldo jastip telah berhasil diteruskan ke dompet digital jastiper.</span>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
