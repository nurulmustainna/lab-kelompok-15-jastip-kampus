import React from 'react';
import { 
  BookOpen, Clock, ShieldCheck, Scale, AlertCircle, 
  CheckCircle2, Users, MapPin, Sparkles 
} from 'lucide-react';

export const RulesSection: React.FC = () => {
  const rules = [
    {
      number: '01',
      title: 'Aturan Penutupan Order Tepat Waktu (Closing Time H-30 Menit)',
      desc: 'Setiap sesi jastip memiliki batas penutupan otomatis (lock) tepat 30 menit sebelum jam keberangkatan jastiper. Setelah closing time tercapai, sistem mengunci order sehingga jastiper dapat fokus berbelanja di warung/toko tanpa ada tambahan pesanan mendadak.',
      icon: Clock,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    {
      number: '02',
      title: 'Batas Muatan Maksimal (Baggage Limit 5.0 kg / 6 Slot)',
      desc: 'Untuk menjaga keselamatan berkendara mahasiswa kurir dan keutuhan pesanan makanan/minuman, kapasitas total barang titipan dibatasi maksimal 5.0 kg per sesi. Order-Service secara otomatis menolak order yang melampaui batas muatan.',
      icon: Scale,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    {
      number: '03',
      title: 'Fitur Tawar Ongkir & Kesepakatan Tarif Terbuka',
      desc: 'Mahasiswa pemesan dapat menggunakan fitur tawar tarif jastip (Opsi Hemat, Standar, atau Prioritas Cepat). Tarif yang disepakati langsung dikunci dalam smart contract Payment-Service sebelum sesi dimulai.',
      icon: Sparkles,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    {
      number: '04',
      title: 'Proteksi Rekening Bersama (Escrow Vault) & Jaminan 100% Refund',
      desc: 'Dana titipan dan ongkir ditampung sementara di Payment-Service Escrow. Jastiper tidak dapat mengambil dana sebelum serah terima fisik diverifikasi. Jika barang di warung habis atau jastiper batal, dana 100% otomatis di-refund ke pembeli.',
      icon: ShieldCheck,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    {
      number: '05',
      title: 'Verifikasi Fisik Serah Terima dengan Scan QR di Titik Temu Kampus',
      desc: 'Penyerahan barang dilakukan di titik temu resmi Unismuh (Lobby Menara Iqra, Gazebo Utama, Lab). Pemesan menunjukkan QR Code untuk di-scan oleh jastiper sebagai bukti sah pelepasan saldo escrow.',
      icon: MapPin,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Pedoman & SLA Layanan
            </span>
            <span className="text-xs text-emerald-700 font-mono">Unismuh Makassar</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-950 mt-1">
            Aturan & Standar Operasional Jastip Kampus
          </h2>
          <p className="text-xs text-emerald-800">
            Ketentuan baku pengelolaan titip-beli mahasiswa untuk menjamin kepastian waktu, keamanan dana, dan keselamatan berkendara.
          </p>
        </div>
      </div>

      {/* Rules Cards List */}
      <div className="grid md:grid-cols-2 gap-5">
        {rules.map((r, idx) => {
          const Icon = r.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm space-y-3 flex flex-col justify-between hover:border-emerald-300 transition-colors"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-extrabold text-emerald-700">
                    RULE #{r.number}
                  </span>
                  <div className={`p-2 rounded-xl border ${r.color}`}>
                    <Icon className="w-4 h-4 text-emerald-700" />
                  </div>
                </div>

                <h3 className="text-sm font-bold text-emerald-950 leading-snug">
                  {r.title}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {r.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-emerald-50 flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Diawasi & Ditegakkan Otomatis oleh 4 Microservices</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
