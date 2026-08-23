import React from 'react';
import { Building2, Sparkles, Home } from 'lucide-react';

interface TopAcademicBannerProps {
  onReturnToLanding?: () => void;
}

export const TopAcademicBanner: React.FC<TopAcademicBannerProps> = ({ onReturnToLanding }) => {
  return (
    <div className="bg-emerald-800 text-white text-[11px] sm:text-xs py-1.5 px-4 font-medium border-b border-emerald-900 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
        {/* Left: Campus Identity */}
        <div className="flex items-center gap-2 text-center sm:text-left">
          <Sparkles className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
          <span className="font-bold tracking-wider uppercase text-emerald-50">
            UNIVERSITAS MUHAMMADIYAH MAKASSAR
          </span>
        </div>

        {/* Right: Location & Campus Facility & Landing Button */}
        <div className="flex items-center gap-2 text-emerald-100 text-[10px] sm:text-xs">
          {onReturnToLanding && (
            <button
              onClick={onReturnToLanding}
              className="bg-emerald-900/80 hover:bg-emerald-950 px-2.5 py-0.5 rounded-full text-emerald-200 hover:text-white font-bold border border-emerald-700 flex items-center gap-1 transition-colors"
            >
              <Home className="w-3 h-3" />
              <span>Halaman Depan (Landing)</span>
            </button>
          )}
          <span className="bg-emerald-700/80 px-2.5 py-0.5 rounded-full text-white font-medium border border-emerald-600 flex items-center gap-1">
            <Building2 className="w-3 h-3 text-emerald-300" />
            <span>Gedung Menara Iqra Lt. 3</span>
          </span>
        </div>
      </div>
    </div>
  );
};
