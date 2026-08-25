import React, { useState } from 'react';
import { 
  Bike, Clock, MapPin, Store, CheckCircle2, ShieldCheck, 
  ArrowRight, AlertCircle, ShoppingBag, Plus, Scale 
} from 'lucide-react';
import { JastipSession, StudentAccount } from '../types';
import { PortalTab } from './PortalNavbar';
import { UserRole } from './MainPortalHeader';

interface ActiveSessionsSectionProps {
  sessions: JastipSession[];
  onSelectSessionForOrder: (session: JastipSession) => void;
  onNavigateTab: (tab: PortalTab) => void;
  currentRole?: UserRole;
  currentStudent?: StudentAccount;
}

export const ActiveSessionsSection: React.FC<ActiveSessionsSectionProps> = ({
  sessions,
  onSelectSessionForOrder,
  onNavigateTab,
  currentRole = 'mahasiswa',
  currentStudent
}) => {
  const [sessionList, setSessionList] = useState(sessions);
  const [showCreateSessionModal, setShowCreateSessionModal] = useState(false);

  // New session state
  const [newJastiperName, setNewJastiperName] = useState('Ahmad Fauzan (105841104423)');
  const [newRouteFrom, setNewRouteFrom] = useState('Sentra Kuliner Pintu 1 & Jl. Sultan Alauddin');
  const [newMeetingPoint, setNewMeetingPoint] = useState('Lobby Menara Iqra Unismuh (Depan Pojok Baca)');
  const [newMaxWeight, setNewMaxWeight] = useState(5.0);

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    
    // PERMISSION CHECK: Only Jastiper can create sessions
    if (currentRole !== 'jastiper') {
      alert('Akses Ditolak: Hanya Jastiper yang dapat membuka sesi baru.');
      return;
    }

    // Use current student's data if available, otherwise use form input
    const jastiperName = currentStudent ? `${currentStudent.name} (${currentStudent.nim})` : newJastiperName;
    const jastiperProdi = currentStudent ? currentStudent.prodi : 'Mahasiswa Unismuh Makassar';
    const jastiperAvatar = currentStudent ? currentStudent.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

    const newSession: JastipSession = {
      id: `SES-UNISMUH-${Date.now().toString().slice(-4)}`,
      jastiperName: jastiperName,
      jastiperProdi: jastiperProdi,
      jastiperAvatar: jastiperAvatar,
      routeFrom: newRouteFrom,
      routeTo: 'Kampus Unismuh Makassar',
      meetingPoint: newMeetingPoint,
      departureTime: '13:00 WITA',
      closingTime: '12:30 WITA',
      closingTimestamp: Date.now() + 45 * 60 * 1000,
      maxCapacityKg: newMaxWeight,
      currentCapacityKg: 0,
      maxOrders: 8,
      currentOrders: 0,
      status: 'OPEN',
      availableStores: ['Ayam Geprek Master Alauddin', 'Kedai Kopi & Toast Talasalapang']
    };

    setSessionList([newSession, ...sessionList]);
    setShowCreateSessionModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Action Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-emerald-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Order-Service Orchestrator
            </span>
            <span className="text-xs text-emerald-700 font-mono">Closing Time: H-30 Menit</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-emerald-950 mt-1">
            Sesi Titipan & Rute Jastiper Kampus
          </h2>
          <p className="text-xs text-emerald-800">
            Jastiper membuka slot rute perjalanan dari luar kampus menuju Menara Iqra Unismuh.
          </p>
        </div>

        {currentRole === 'jastiper' && (
          <button
            onClick={() => setShowCreateSessionModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm self-start md:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Buka Sesi Jastip Baru</span>
          </button>
        )}
      </div>

      {/* Sessions Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessionList.map((ses) => {
          const capacityPercent = Math.min(100, Math.round((ses.currentCapacityKg / ses.maxCapacityKg) * 100));
          return (
            <div
              key={ses.id}
              className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                
                {/* Jastiper Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={ses.jastiperAvatar} 
                      alt={ses.jastiperName} 
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-xl object-cover border border-emerald-200"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-emerald-950">{ses.jastiperName}</h4>
                      <p className="text-[11px] text-emerald-700">{ses.jastiperProdi}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                    ses.status === 'OPEN' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                    ses.status === 'CLOSING_SOON' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {ses.status}
                  </span>
                </div>

                {/* Route info */}
                <div className="p-3 bg-emerald-50/50 rounded-xl space-y-1.5 text-xs text-slate-700 border border-emerald-100">
                  <div className="flex items-start gap-1.5">
                    <Store className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong className="text-emerald-950">Dari:</strong> {ses.routeFrom}</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                    <span><strong className="text-emerald-950">Titik Temu:</strong> {ses.meetingPoint}</span>
                  </div>
                </div>

                {/* Schedule & Closing Time */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-emerald-50/60 p-2 rounded-lg border border-emerald-100">
                    <span className="text-[10px] text-emerald-700 block">Jadwal Tiba Kampus:</span>
                    <span className="font-mono font-bold text-emerald-950">{ses.departureTime}</span>
                  </div>
                  <div className="bg-emerald-100/60 border border-emerald-200 p-2 rounded-lg">
                    <span className="text-[10px] text-emerald-800 font-bold block">Closing Order (H-30m):</span>
                    <span className="font-mono font-bold text-emerald-900">{ses.closingTime}</span>
                  </div>
                </div>

                {/* Baggage Capacity Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-emerald-800 font-medium">
                    <span className="flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Kapasitas Muatan Tas / Motor:</span>
                    </span>
                    <span className="font-mono font-bold text-emerald-950">
                      {ses.currentCapacityKg} / {ses.maxCapacityKg} kg ({capacityPercent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-emerald-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-emerald-600 transition-all"
                      style={{ width: `${capacityPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Available Stores */}
                <div className="pt-1">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">
                    Warung / Toko Langganan:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {ses.availableStores.map((st, i) => (
                      <span key={i} className="text-[10px] bg-emerald-50 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded font-medium">
                        {st}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  onSelectSessionForOrder(ses);
                  onNavigateTab('catalog');
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Titip Lewat Sesi Ini</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Modal Buka Sesi Baru */}
      {showCreateSessionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-emerald-200 space-y-4">
            <h3 className="text-base font-bold text-emerald-950">Buka Sesi Jastip Baru (Mahasiswa Kurir)</h3>
            <p className="text-xs text-emerald-700">
              Daftarkan rute perjalanan Anda dari rumah / kos menuju kampus untuk menerima titipan dari mahasiswa lain.
            </p>

            <form onSubmit={handleCreateSession} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-emerald-900 block mb-1">Nama Jastiper & NIM:</label>
                <input
                  type="text"
                  value={newJastiperName}
                  onChange={(e) => setNewJastiperName(e.target.value)}
                  className="w-full p-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-emerald-900 block mb-1">Rute Keberangkatan (Area Warung/Toko):</label>
                <input
                  type="text"
                  value={newRouteFrom}
                  onChange={(e) => setNewRouteFrom(e.target.value)}
                  className="w-full p-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-emerald-900 block mb-1">Titik Temu Serah Terima di Kampus:</label>
                <select
                  value={newMeetingPoint}
                  onChange={(e) => setNewMeetingPoint(e.target.value)}
                  className="w-full p-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs text-emerald-950 font-medium"
                >
                  <option value="Lobby Menara Iqra Unismuh (Depan Pojok Baca)">Lobby Menara Iqra Unismuh</option>
                  <option value="Lobby Gedung Laboratorium Terpadu Unismuh">Lobby Gedung Lab Terpadu Unismuh</option>
                  <option value="Gazebo Utama Kampus Unismuh Makassar">Gazebo Utama Kampus Unismuh Makassar</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-emerald-900 block mb-1">Batas Maks Muatan (kg):</label>
                  <input
                    type="number"
                    step="0.5"
                    value={newMaxWeight}
                    onChange={(e) => setNewMaxWeight(parseFloat(e.target.value))}
                    className="w-full p-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs"
                    min="1"
                    max="10"
                  />
                </div>
                <div>
                  <label className="font-bold text-emerald-900 block mb-1">Otomasi Closing:</label>
                  <div className="p-2.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-xl font-bold font-mono">
                    Tepat H-30 Menit
                  </div>
                </div>
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateSessionModal(false)}
                  className="w-1/2 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm"
                >
                  Publikasikan Sesi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
