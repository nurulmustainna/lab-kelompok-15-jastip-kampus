import React, { useState } from 'react';
import { 
  Search, Filter, Store, ArrowRight, 
  ShoppingBag, CheckCircle2, Sparkles, Layers
} from 'lucide-react';
import { CatalogItem, JastipSession } from '../types';

interface CatalogGridSectionProps {
  items: CatalogItem[];
  sessions: JastipSession[];
  onOpenOrderModal: (item: CatalogItem, session: JastipSession) => void;
}

export const CatalogGridSection: React.FC<CatalogGridSectionProps> = ({
  items,
  sessions,
  onOpenOrderModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSessionId, setSelectedSessionId] = useState<string>(sessions[0]?.id || 'SES-UNISMUH-01');

  const currentSession = sessions.find(s => s.id === selectedSessionId) || sessions[0];

  const categories = [
    'All',
    'Makanan',
    'Minuman',
    'ATK & Cetak',
    'Snack & Kebutuhan Kos',
    'Komponen & Alat Lab'
  ];

  // Filtering
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.storeLocation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = 
      selectedCategory === 'All' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      
      {/* Search Bar & Filter Chips */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-emerald-100 shadow-sm">
        
        {/* Left: Search Input Box */}
        <div className="relative w-full md:w-80 lg:w-96">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Cari 50 barang titipan, kode, atau warung..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-emerald-700 hover:text-emerald-950"
            >
              Clear
            </button>
          )}
        </div>

        {/* Right: Filter Category Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <div className="flex items-center gap-1 text-emerald-700 pl-1 mr-1">
            <Filter className="w-3.5 h-3.5" />
          </div>
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-sm font-extrabold'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 hover:text-emerald-950'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

      </div>

      {/* Active Jastiper Session Strip Selector */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
            🛵
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-950 text-sm">
                Sesi Titipan: {currentSession.jastiperName}
              </span>
              <span className="bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-mono font-bold text-[10px] border border-emerald-300">
                {currentSession.status}
              </span>
            </div>
            <p className="text-emerald-800 text-[11px] mt-0.5">
              Rute: {currentSession.routeFrom} ➔ {currentSession.meetingPoint}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-center">
          <div className="text-right hidden md:block">
            <span className="text-[10px] text-emerald-700 font-semibold block">Closing Time (H-30m):</span>
            <span className="font-mono font-bold text-emerald-900">{currentSession.closingTime}</span>
          </div>

          <select
            value={selectedSessionId}
            onChange={(e) => setSelectedSessionId(e.target.value)}
            className="p-2 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm cursor-pointer"
          >
            {sessions.map(s => (
              <option key={s.id} value={s.id}>
                {s.jastiperName} ({s.departureTime}) - Kapasitas {s.currentCapacityKg}/{s.maxCapacityKg}kg
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Catalog Count Indicator */}
      <div className="flex items-center justify-between text-xs text-emerald-800 px-1 font-medium">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Menampilkan <strong className="text-emerald-950 font-bold">{filteredItems.length} dari {items.length}</strong> barang titipan siap dipesan</span>
        </span>
        <span className="text-[11px] bg-white px-2 py-0.5 rounded-md border border-emerald-200 font-mono text-emerald-700">
          50 Barang Siap Dititipkan
        </span>
      </div>

      {/* Products & Titipan Cards Grid (Green-White Design) */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item, index) => {
          const codeTag = `JST-${item.category.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(2, '0')}`;
          
          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-emerald-100 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-400 transition-all flex flex-col justify-between group"
            >
              {/* Card Thumbnail with Overlay Badges */}
              <div className="relative h-44 sm:h-48 w-full bg-emerald-50 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-black/40"></div>

                {/* Top-Left Code Pill */}
                <div className="absolute top-3 left-3">
                  <span className="bg-emerald-900/90 backdrop-blur-md text-emerald-100 border border-emerald-700/60 text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow">
                    {codeTag}
                  </span>
                </div>

                {/* Top-Right Category Pill */}
                <div className="absolute top-3 right-3">
                  <span className="bg-white/95 backdrop-blur-md text-emerald-900 text-[10px] font-bold px-2.5 py-0.5 rounded shadow border border-emerald-200">
                    {item.category}
                  </span>
                </div>

                {/* Bottom Bar inside image */}
                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-[11px] font-medium">
                  <span className="bg-emerald-950/80 px-2 py-0.5 rounded backdrop-blur-sm border border-emerald-800/60">
                    Est. ~{item.estimatedWeightKg} kg
                  </span>
                  <span className="bg-emerald-600 text-white font-bold px-2.5 py-0.5 rounded shadow-sm">
                    Rp {item.price.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5 space-y-3 flex-grow flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    Pesanan titipan dari merchant sekitar Kampus Unismuh Makassar. Dibelikan langsung oleh jastiper terpercaya.
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                    <span className="flex items-center gap-1 truncate max-w-[65%] text-emerald-800">
                      <Store className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{item.storeName}</span>
                    </span>
                    <span className="text-emerald-700 font-mono text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Kondisi: Siap Titip
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-emerald-50">
                    <span className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tersedia ({currentSession.currentCapacityKg}/{currentSession.maxCapacityKg} kg)</span>
                    </span>
                    <span className="text-[11px] text-emerald-900 font-bold font-mono">
                      Jastip: Rp {item.jastipFee.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onOpenOrderModal(item, currentSession)}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-emerald-700/20 group/btn"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Ajukan Penitipan / Buka Order</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-emerald-200 space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-50 mx-auto flex items-center justify-center text-emerald-600">
            <Search className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-slate-800">Tidak ada barang titipan yang cocok</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Coba kata kunci lain atau ubah filter kategori untuk menemukan menu dan barang di sekitar Unismuh Makassar.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
          >
            Reset Pencarian (Tampilkan 50 Barang)
          </button>
        </div>
      )}

    </div>
  );
};
