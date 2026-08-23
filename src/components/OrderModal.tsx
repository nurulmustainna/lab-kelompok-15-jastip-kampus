import React, { useState } from 'react';
import { 
  X, ShoppingBag, Store, MapPin, ShieldCheck, 
  ArrowRight, Check, AlertCircle, Sparkles, Scale, Clock,
  QrCode, Wallet, Smartphone, Building2, User, CreditCard, ChevronRight, Banknote
} from 'lucide-react';
import { CatalogItem, JastipSession, JastipOrder, StudentAccount, PaymentMethodType } from '../types';
import { PAYMENT_METHODS_DATA } from '../data/mockData';

interface OrderModalProps {
  item: CatalogItem | null;
  session: JastipSession;
  isOpen: boolean;
  onClose: () => void;
  onSubmitOrder: (newOrder: JastipOrder) => void;
  currentStudent: StudentAccount;
  onOpenAuthModal?: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  item,
  session,
  isOpen,
  onClose,
  onSubmitOrder,
  currentStudent,
  onOpenAuthModal
}) => {
  if (!isOpen || !item) return null;

  const [quantity, setQuantity] = useState(1);
  const [negoOption, setNegoOption] = useState<'hemat' | 'standar' | 'prioritas'>('standar');
  const [customTip, setCustomTip] = useState(0);
  const [notes, setNotes] = useState('');
  const [meetingPoint, setMeetingPoint] = useState(session.meetingPoint);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>('QRIS_UNISMUH');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Negotiation price factors
  const baseJastipFee = item.jastipFee * quantity;
  const negoAdjustment = 
    negoOption === 'hemat' ? -1000 * quantity :
    negoOption === 'prioritas' ? 2000 * quantity : 0;

  const finalJastipFee = Math.max(2000, baseJastipFee + negoAdjustment + customTip);
  const totalItemPrice = item.price * quantity;
  const appFee = 1000;
  const grandTotal = totalItemPrice + finalJastipFee + appFee;

  const selectedPaymentInfo = PAYMENT_METHODS_DATA.find(p => p.id === selectedPaymentMethod) || PAYMENT_METHODS_DATA[0];
  const isWalletSufficient = currentStudent.balance >= grandTotal;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedPaymentMethod === 'WALLET_UNISMUH' && !isWalletSufficient) {
      alert(`Saldo Dompet Jastip Anda (Rp ${currentStudent.balance.toLocaleString('id-ID')}) tidak mencukupi untuk total Rp ${grandTotal.toLocaleString('id-ID')}. Silakan pilih metode lain (QRIS / Virtual Account) atau lakukan Top-Up.`);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WITA`;

      const newOrder: JastipOrder = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        orderCode: `JSTP-UNISMUH-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: `${currentStudent.name} (${currentStudent.nim})`,
        customerProdi: `${currentStudent.prodi} - ${currentStudent.faculty}`,
        sessionId: session.id,
        items: [{ item, qty: quantity }],
        totalItemPrice,
        totalJastipFee: finalJastipFee,
        appFee,
        grandTotal,
        paymentMethod: selectedPaymentMethod,
        paymentMethodLabel: selectedPaymentInfo.name,
        status: 'ESCROW_DITAMPUNG',
        meetingPoint,
        createdAt: timeStr,
        escrowStatus: 'HELD_IN_ESCROW',
        trackingHistory: [
          {
            step: '1. Buka Order & Titipan Dibuat',
            timestamp: timeStr,
            note: `Pesanan dibuat oleh ${currentStudent.name} (${currentStudent.nim}) untuk ${quantity}x ${item.name}. Ongkos jastip: Rp ${finalJastipFee.toLocaleString('id-ID')}.`,
            done: true
          },
          {
            step: '2. Bayar ke Rekening Bersama (Escrow)',
            timestamp: timeStr,
            note: selectedPaymentMethod === 'CASH_COD'
              ? `Metode Pembayaran: Tunai / COD di Titik Temu Kampus. Siapkan uang pas Rp ${grandTotal.toLocaleString('id-ID')} saat serah terima.`
              : `Pembayaran via ${selectedPaymentInfo.name}. Dana Rp ${grandTotal.toLocaleString('id-ID')} telah dikunci aman di Payment-Service Escrow Vault.`,
            done: true
          },
          {
            step: '3. Menunggu Closing Sesi Jastiper',
            timestamp: session.closingTime,
            note: `Sesi akan dikunci otomatis pada ${session.closingTime} sebelum keberangkatan kurir (${session.departureTime}).`,
            done: false
          },
          {
            step: '4. Pembelian di Warung/Toko',
            timestamp: 'Estimasi 11:45 WITA',
            note: `Jastiper ${session.jastiperName} membelikan barang di ${item.storeName}.`,
            done: false
          },
          {
            step: '5. Lacak Jastiper Menuju Kampus',
            timestamp: 'Estimasi 12:05 WITA',
            note: `Pengantaran ke titik temu ${meetingPoint}.`,
            done: false
          },
          {
            step: '6. Serah Terima & Scan QR',
            timestamp: 'Estimasi 12:15 WITA',
            note: 'Verifikasi fisik barang dan pencairan dana escrow ke dompet jastiper.',
            done: false
          }
        ]
      };

      setIsSubmitting(false);
      onSubmitOrder(newOrder);
      onClose();
    }, 800);
  };

  const getIconComponent = (iconType: string) => {
    switch (iconType) {
      case 'QrCode': return <QrCode className="w-4 h-4 text-emerald-600" />;
      case 'Wallet': return <Wallet className="w-4 h-4 text-emerald-600" />;
      case 'Banknote': return <Banknote className="w-4 h-4 text-emerald-600" />;
      case 'Smartphone': return <Smartphone className="w-4 h-4 text-emerald-600" />;
      case 'Building2': return <Building2 className="w-4 h-4 text-emerald-600" />;
      default: return <CreditCard className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-emerald-950/65 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-emerald-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-emerald-900 flex items-center justify-between bg-emerald-950 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 border border-emerald-400 flex items-center justify-center text-white shadow-sm">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Buka Order Titipan & Pembayaran</h3>
              <p className="text-xs text-emerald-300 font-mono">Microservice Order & Payment Escrow • Unismuh</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-900 hover:bg-emerald-800 text-emerald-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-grow">
          
          {/* User Account Banner */}
          <div className="flex items-center justify-between p-3 bg-emerald-50/90 border border-emerald-200 rounded-2xl">
            <div className="flex items-center gap-2.5">
              <img 
                src={currentStudent.avatar} 
                alt={currentStudent.name} 
                className="w-8 h-8 rounded-xl object-cover border border-emerald-300"
              />
              <div className="text-xs">
                <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <span>{currentStudent.name}</span>
                  <span className="font-mono text-[10px] text-emerald-700 bg-emerald-100 px-1 rounded">NIM {currentStudent.nim}</span>
                </div>
                <div className="text-[11px] text-emerald-700">
                  Saldo Dompet: <strong className="font-mono text-emerald-900">Rp {currentStudent.balance.toLocaleString('id-ID')}</strong>
                </div>
              </div>
            </div>
            {onOpenAuthModal && (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 bg-white border border-emerald-300 px-2.5 py-1 rounded-xl shadow-2xs hover:bg-emerald-100/50"
              >
                Ganti Akun
              </button>
            )}
          </div>

          {/* Selected Item Info Card */}
          <div className="flex gap-3.5 p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
            <img 
              src={item.image} 
              alt={item.name}
              referrerPolicy="no-referrer"
              className="w-18 h-18 rounded-xl object-cover border border-emerald-200 shrink-0" 
            />
            <div className="space-y-0.5 min-w-0">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-200 uppercase">
                {item.category}
              </span>
              <h4 className="text-sm font-bold text-emerald-950 truncate">{item.name}</h4>
              <p className="text-xs text-emerald-700 flex items-center gap-1">
                <Store className="w-3 h-3 text-emerald-600 shrink-0" />
                <span className="truncate">{item.storeName}</span>
              </p>
              <div className="flex items-center gap-3 text-xs pt-1">
                <span className="font-bold text-emerald-700">Rp {item.price.toLocaleString('id-ID')}</span>
                <span className="text-emerald-300">•</span>
                <span className="text-emerald-800 text-[11px]">Berat: ~{item.estimatedWeightKg} kg/item</span>
              </div>
            </div>
          </div>

          {/* Quantity selector */}
          <div className="flex items-center justify-between p-3 bg-white border border-emerald-100 rounded-xl">
            <span className="text-xs font-bold text-emerald-950">Jumlah Pesanan:</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 font-bold text-emerald-800 border border-emerald-200 flex items-center justify-center"
              >
                -
              </button>
              <span className="font-mono font-bold text-sm text-emerald-950 w-6 text-center">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(5, quantity + 1))}
                className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 font-bold text-emerald-800 border border-emerald-200 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Fitur Tawar Tarif Jastip */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-950 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Tawar Tarif Ongkos Jastip:</span>
              </label>
              <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Rp {finalJastipFee.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setNegoOption('hemat')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  negoOption === 'hemat'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500 font-bold'
                    : 'border-emerald-100 hover:bg-emerald-50/50 text-emerald-800'
                }`}
              >
                <div className="text-xs font-bold">Hemat</div>
                <div className="text-[10px] text-emerald-700">-Rp 1.000 (Standar)</div>
              </button>

              <button
                type="button"
                onClick={() => setNegoOption('standar')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  negoOption === 'standar'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500 font-bold'
                    : 'border-emerald-100 hover:bg-emerald-50/50 text-emerald-800'
                }`}
              >
                <div className="text-xs font-bold">Standar</div>
                <div className="text-[10px] text-emerald-700">Rekomendasi</div>
              </button>

              <button
                type="button"
                onClick={() => setNegoOption('prioritas')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  negoOption === 'prioritas'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500 font-bold'
                    : 'border-emerald-100 hover:bg-emerald-50/50 text-emerald-800'
                }`}
              >
                <div className="text-xs font-bold">Prioritas ⚡</div>
                <div className="text-[10px] text-emerald-700">+Rp 2.000 (Cepat)</div>
              </button>
            </div>
          </div>

          {/* Titik Temu di Kampus Unismuh */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-emerald-950 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>Titik Temu Serah Terima di Kampus:</span>
            </label>
            <select
              value={meetingPoint}
              onChange={(e) => setMeetingPoint(e.target.value)}
              className="w-full p-2.5 bg-emerald-50/40 border border-emerald-200 rounded-xl text-xs font-medium text-emerald-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="Lobby Menara Iqra Unismuh (Depan Pojok Baca)">Lobby Menara Iqra Unismuh (Depan Pojok Baca)</option>
              <option value="Lobby Gedung Laboratorium Terpadu Unismuh">Lobby Gedung Lab Terpadu Unismuh</option>
              <option value="Gazebo Utama Kampus Unismuh Makassar">Gazebo Utama Kampus Unismuh Makassar</option>
              <option value="Pelataran Masjid Subulussalam Unismuh">Pelataran Masjid Subulussalam Unismuh</option>
            </select>
          </div>

          {/* METODE PEMBAYARAN PILIHAN */}
          <div className="space-y-2 pt-1 border-t border-emerald-100">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pilih Metode Pembayaran:</span>
              </label>
              <span className="text-[10px] text-emerald-700 font-mono">100% Escrow Protection</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PAYMENT_METHODS_DATA.map((pm) => {
                const isSelected = selectedPaymentMethod === pm.id;
                const isWallet = pm.id === 'WALLET_UNISMUH';

                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setSelectedPaymentMethod(pm.id)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/90 text-emerald-950 ring-2 ring-emerald-500 shadow-xs'
                        : 'border-emerald-100 bg-white hover:bg-emerald-50/40 text-emerald-800'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {getIconComponent(pm.iconType)}
                      </div>
                      <div>
                        <div className="text-xs font-bold leading-tight">{pm.name}</div>
                        <div className="text-[10px] text-emerald-700 leading-normal line-clamp-1 mt-0.5">
                          {isWallet ? `Saldo: Rp ${currentStudent.balance.toLocaleString('id-ID')}` : pm.description}
                        </div>
                        {isWallet && !isWalletSufficient && (
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200 block mt-1">
                            Saldo Kurang (Butuh Rp {grandTotal.toLocaleString('id-ID')})
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 mt-0.5">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-emerald-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-2.5 h-2.5" />}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Catatan Khusus */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-emerald-950">Catatan Khusus Pesanan (Opsional):</label>
            <input
              type="text"
              placeholder="Contoh: Sambal dipisah, jangan terlalu pedas, titip struk pembelian."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2.5 bg-emerald-50/40 border border-emerald-200 rounded-xl text-xs text-emerald-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Price Breakdown */}
          <div className="p-4 bg-emerald-950 text-emerald-100 rounded-2xl space-y-2 text-xs border border-emerald-900">
            <div className="flex justify-between text-emerald-300">
              <span>Harga Barang ({quantity}x):</span>
              <span className="font-mono text-white">Rp {totalItemPrice.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-emerald-300">
              <span>Tarif Jastip Kesepakatan:</span>
              <span className="font-mono text-emerald-300">Rp {finalJastipFee.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-emerald-300">
              <span>Biaya Sistem & Escrow:</span>
              <span className="font-mono text-white">Rp {appFee.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between text-emerald-300 pt-1 border-t border-emerald-800/80">
              <span>Metode Pembayaran:</span>
              <span className="font-bold text-emerald-200">{selectedPaymentInfo.name}</span>
            </div>
            <div className="pt-2 border-t border-emerald-800 flex justify-between font-bold text-white text-sm">
              <span>Total yang Ditampung Escrow:</span>
              <span className="font-mono text-emerald-300">Rp {grandTotal.toLocaleString('id-ID')}</span>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-start gap-2 text-[11px] text-emerald-900 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              {selectedPaymentMethod === 'CASH_COD'
                ? 'Pembayaran Tunai (Cash on Delivery): Bayar langsung dengan uang pas saat serah terima barang di titik temu kampus. Jastiper akan melakukan konfirmasi penerimaan tunai di aplikasi.'
                : 'Dana Anda 100% aman di Payment-Service Rekber (Escrow). Saldo hanya akan dicairkan ke jastiper setelah Anda melakukan scan QR serah terima fisik di kampus Unismuh.'}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-60"
          >
            {isSubmitting ? (
              <span>Memproses Pesanan...</span>
            ) : selectedPaymentMethod === 'CASH_COD' ? (
              <>
                <Banknote className="w-4 h-4" />
                <span>Pesan Sekarang & Bayar Tunai di Kampus (Rp {grandTotal.toLocaleString('id-ID')})</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Bayar & Kunci Escrow (Rp {grandTotal.toLocaleString('id-ID')})</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
