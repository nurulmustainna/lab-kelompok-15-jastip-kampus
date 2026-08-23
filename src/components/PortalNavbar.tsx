import React from 'react';
import { 
  ShoppingBag, FileText, Bike, ShieldCheck, MapPin, 
  BookOpen
} from 'lucide-react';

export type PortalTab = 
  | 'catalog' 
  | 'my-orders' 
  | 'sessions' 
  | 'escrow' 
  | 'tracking' 
  | 'rules';

interface PortalNavbarProps {
  activeTab: PortalTab;
  onSelectTab: (tab: PortalTab) => void;
  orderCount?: number;
}

export const PortalNavbar: React.FC<PortalNavbarProps> = ({
  activeTab,
  onSelectTab,
  orderCount = 1
}) => {
  const tabs = [
    { id: 'catalog' as const, label: 'Katalog Jastip (Buka Order)', icon: ShoppingBag, badge: '50 Item' },
    { id: 'my-orders' as const, label: 'Pesanan Saya (Tawar & Bayar)', icon: FileText, badge: orderCount > 0 ? `${orderCount} Aktif` : undefined },
    { id: 'sessions' as const, label: 'Sesi Titipan (Rute & Bagasi)', icon: Bike, badge: '3 Sesi' },
    { id: 'escrow' as const, label: 'Rekening Bersama (Escrow)', icon: ShieldCheck, badge: 'Vault' },
    { id: 'tracking' as const, label: 'Lacak Real-Time & Titik Temu', icon: MapPin, badge: 'Live' },
    { id: 'rules' as const, label: 'Aturan & Closing Time', icon: BookOpen },
  ];

  return (
    <nav className="bg-emerald-800 text-white border-b border-emerald-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-1.5 overflow-x-auto py-2 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all select-none ${
                  isActive
                    ? 'bg-white text-emerald-800 shadow-md font-extrabold'
                    : 'text-emerald-100 hover:text-white hover:bg-emerald-700/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-700' : 'text-emerald-200'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                    isActive 
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                      : 'bg-emerald-900/80 text-emerald-200 border border-emerald-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
