import React, { useState } from 'react';
import { 
  CalendarCheck, Store, ShieldCheck, MapPin, Cpu, Check, Copy, ArrowRight, 
  Play, Terminal, RefreshCw, Layers, Database, Radio, Code2, X, ExternalLink, 
  CheckCircle2, Activity, Server, Zap, Package, Bike, Clock, Users, ArrowUpRight, Shield
} from 'lucide-react';
import { MICROSERVICES_DATA } from '../data/mockData';
import { MicroserviceId, MicroserviceInfo } from '../types';

export const MicroservicesSection: React.FC = () => {
  const [selectedServiceId, setSelectedServiceId] = useState<MicroserviceId>('order-service');
  const [activeTab, setActiveTab] = useState<'overview' | 'api' | 'events' | 'simulator'>('overview');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [simulatingEvent, setSimulatingEvent] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<{ time: string; text: string; type: 'info' | 'success' | 'event' }[]>([]);
  const [selectedEndpointIndex, setSelectedEndpointIndex] = useState(0);
  
  // Modal detailed inspection state
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [modalServiceId, setModalServiceId] = useState<MicroserviceId>('order-service');
  const [modalTab, setModalTab] = useState<'overview' | 'api' | 'events' | 'simulator'>('overview');

  const currentService = MICROSERVICES_DATA.find(s => s.id === selectedServiceId) || MICROSERVICES_DATA[0];
  const modalService = MICROSERVICES_DATA.find(s => s.id === modalServiceId) || MICROSERVICES_DATA[0];

  // 6 Stat Counters for Admin Dashboard
  const adminMetrics = [
    {
      id: 'katalog',
      icon: Package,
      iconBg: 'bg-[#E8F5E9] text-[#004D40] border-[#C8E6C9]',
      label: 'Katalog Jastip',
      value: '50 Item',
      sublabel: 'Warung Sekitar Kampus',
      subColor: 'text-[#004D40] font-semibold'
    },
    {
      id: 'sesi',
      icon: Bike,
      iconBg: 'bg-[#E8F5E9] text-[#004D40] border-[#C8E6C9]',
      label: 'Sesi Buka Order',
      value: '3 Sesi',
      sublabel: 'Aktif Berangkat',
      subColor: 'text-[#004D40] font-semibold'
    },
    {
      id: 'order',
      icon: Clock,
      iconBg: 'bg-[#E8F5E9] text-[#004D40] border-[#C8E6C9]',
      label: 'Order Jastip',
      value: '2 Order',
      sublabel: 'Tawar Tarif Ongkir',
      subColor: 'text-[#004D40] font-semibold'
    },
    {
      id: 'omset',
      icon: ShieldCheck,
      iconBg: 'bg-[#E8F5E9] text-[#004D40] border-[#C8E6C9]',
      label: 'Omset Jastip',
      value: 'Rp 450rb',
      sublabel: 'Aman di Rekber Escrow',
      subColor: 'text-[#004D40] font-semibold'
    },
    {
      id: 'akun',
      icon: Users,
      iconBg: 'bg-[#E8F5E9] text-[#004D40] border-[#C8E6C9]',
      label: 'Akun Jastip',
      value: '3 Akun',
      sublabel: 'Terverifikasi Kampus',
      subColor: 'text-[#004D40] font-semibold'
    },
    {
      id: 'online',
      icon: Activity,
      iconBg: 'bg-[#E8F5E9] text-[#004D40] border-[#C8E6C9]',
      label: 'Online Jastip',
      value: '4 Online',
      sublabel: '4 Microservices Active',
      subColor: 'text-[#004D40] font-semibold'
    },
  ];

  const getServiceIcon = (id: MicroserviceId, sizeClass = "w-6 h-6") => {
    switch (id) {
      case 'order-service':
        return <CalendarCheck className={`${sizeClass} text-emerald-700`} />;
      case 'catalog-service':
        return <Store className={`${sizeClass} text-emerald-700`} />;
      case 'payment-service':
        return <ShieldCheck className={`${sizeClass} text-emerald-700`} />;
      case 'tracking-service':
        return <MapPin className={`${sizeClass} text-emerald-700`} />;
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleTriggerSimulatedEvent = (service: MicroserviceInfo) => {
    setSimulatingEvent(true);
    const now = new Date().toLocaleTimeString('id-ID');
    
    setSimulationLogs([
      { time: now, text: `[INIT] Memulai pemanggilan endpoint ${service.samplePayload.method} ${service.samplePayload.endpoint}...`, type: 'info' }
    ]);
    
    setTimeout(() => {
      const time2 = new Date().toLocaleTimeString('id-ID');
      setSimulationLogs(prev => [
        ...prev,
        { time: time2, text: `[EVENT DISPATCHED] Memancarkan event broker '${service.samplePayload.event}' ke RabbitMQ Exchange...`, type: 'event' }
      ]);
    }, 400);

    setTimeout(() => {
      const time3 = new Date().toLocaleTimeString('id-ID');
      setSimulationLogs(prev => [
        ...prev,
        { time: time3, text: `[200 OK] Response diterima dari ${service.name} (Port ${service.port}). Latency: 28ms. State transaksi berhasil disinkronkan.`, type: 'success' }
      ]);
      setSimulatingEvent(false);
    }, 950);
  };

  const openServiceModal = (id: MicroserviceId, tab: 'overview' | 'api' | 'events' | 'simulator' = 'overview') => {
    setModalServiceId(id);
    setModalTab(tab);
    setIsDetailModalOpen(true);
  };

  return (
    <section id="microservices" className="py-8 sm:py-12 bg-white border-y border-emerald-100 rounded-3xl p-6 sm:p-8 my-6 space-y-10">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* 1. Admin System Metrics: 6 Kartu Statistik Ringkasan Sistem */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#004D40] text-[#C8E6C9] flex items-center justify-center font-bold">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                  Ringkasan & Metrik Monitoring Admin
                </h3>
                <p className="text-xs text-slate-500">
                  Data real-time ekosistem jastip kampus Universitas Muhammadiyah Makassar
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>All Systems Operational</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {adminMetrics.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.id}
                  className="bg-white rounded-2xl p-4 border border-[#E8F5E9] shadow-xs hover:shadow-md hover:border-[#A5D6A7] transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${m.iconBg}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-emerald-300" />
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-600 block tracking-tight">
                      {m.label}
                    </span>
                    <h4 className="text-base sm:text-lg font-black text-[#004D40] tracking-tight mt-0.5">
                      {m.value}
                    </h4>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 font-medium truncate">{m.sublabel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Section Header: 4 Komponen Microservices */}
        <div className="max-w-3xl mx-auto text-center space-y-3 pt-4 border-t border-slate-100">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-bold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5 text-emerald-700" />
            <span>Arsitektur Sistem Terdistribusi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-emerald-950 tracking-tight">
            4 Komponen Microservices Jastip Kampus
          </h2>
          <div className="h-1 w-16 bg-emerald-600 mx-auto rounded-full"></div>
          <p className="text-emerald-800 text-xs sm:text-sm leading-relaxed">
            Klik pada salah satu dari 4 microservices di bawah ini untuk melihat detail lengkap arsitektur, daftar endpoint REST API, skema database, dan alur event-driven message broker.
          </p>
        </div>

        {/* 4 Cards Grid - Interactive & Clickable */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {MICROSERVICES_DATA.map((service) => {
            const isSelected = service.id === selectedServiceId;
            return (
              <div
                key={service.id}
                onClick={() => {
                  setSelectedServiceId(service.id);
                  setSimulationLogs([]);
                }}
                className={`bg-white rounded-2xl p-5 border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between shadow-sm group ${
                  isSelected 
                    ? 'border-emerald-600 shadow-md ring-2 ring-emerald-500/20 translate-y-[-2px]' 
                    : 'border-emerald-100 hover:border-emerald-400 hover:shadow-sm'
                }`}
              >
                {/* Active Indicator Top Tag */}
                {isSelected && (
                  <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden pointer-events-none">
                    <div className="bg-emerald-600 text-white text-[9px] font-black py-0.5 text-center transform rotate-45 translate-x-5 translate-y-3 uppercase tracking-wider shadow-sm">
                      Aktif
                    </div>
                  </div>
                )}

                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 group-hover:bg-emerald-100 transition-colors flex items-center justify-center">
                      {getServiceIcon(service.id, "w-5 h-5")}
                    </div>
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      :{service.port}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest block mb-1">
                      {service.badge}
                    </span>
                    <h3 className="text-base font-bold text-emerald-950 group-hover:text-emerald-700 transition-colors flex items-center gap-1.5">
                      {service.name}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {service.description}
                  </p>

                  <div className="flex flex-wrap gap-1 pt-1">
                    <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded font-medium">
                      {service.endpoints.length} Endpoints
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-200 px-2 py-0.5 rounded font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      Online
                    </span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-emerald-50 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openServiceModal(service.id);
                    }}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 group/btn"
                  >
                    <span>Lihat Detail Modal</span>
                    <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                  <span className={`text-xs font-bold ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {isSelected ? 'Sedang Dibuka' : 'Klik Panel'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Embedded Deep Dive & Interactive Inspector */}
        <div className="bg-emerald-50/30 border border-emerald-100 rounded-3xl p-6 sm:p-8 shadow-sm">
          
          {/* Header of Active Service */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-emerald-100">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-200 flex items-center justify-center shrink-0 shadow-sm">
                {getServiceIcon(currentService.id, "w-6 h-6")}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold text-emerald-950">{currentService.name}</h3>
                  <span className="font-mono text-xs font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-200">
                    PORT {currentService.port}
                  </span>
                </div>
                <p className="text-xs font-semibold text-emerald-800">{currentService.badge} • Ekosistem Jastip Kampus Unismuh</p>
              </div>
            </div>

            {/* Modal Launch Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => openServiceModal(currentService.id)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-200" />
                <span>Buka Detail Lengkap Modal</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs for Active Microservice */}
          <div className="flex overflow-x-auto gap-2 border-b border-emerald-100 py-3 mb-6 scrollbar-none">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>1. Tanggung Jawab & Arsitektur</span>
            </button>

            <button
              onClick={() => setActiveTab('api')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'api'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>2. Kontrak REST API ({currentService.endpoints.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'events'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>3. Event Message Broker</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeTab === 'simulator'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-emerald-900 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>4. Live API Simulator</span>
            </button>
          </div>

          {/* Tab Content 1: Overview & Responsibilities */}
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-12 gap-6 items-start animate-fade-in">
              <div className="lg:col-span-7 space-y-5">
                <div>
                  <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">Deskripsi & Peran</h4>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">
                    {currentService.description}
                  </p>
                </div>

                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                    Tanggung Jawab Utama Service:
                  </h4>
                  <ul className="space-y-2">
                    {currentService.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="font-medium">{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-4">
                <div className="bg-emerald-950 text-white p-5 rounded-2xl space-y-3.5 border border-emerald-900">
                  <div className="flex items-center gap-2 border-b border-emerald-800 pb-2.5">
                    <Database className="w-4 h-4 text-emerald-300" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Data Persistence & Tech Stack</span>
                  </div>
                  
                  <div className="space-y-1.5">
                    <span className="text-[11px] text-emerald-200 block font-semibold">Database Engine:</span>
                    <p className="text-xs font-mono text-emerald-300 bg-emerald-900/80 p-2.5 rounded-lg border border-emerald-800">
                      {currentService.database}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[11px] text-emerald-200 block font-semibold">Teknologi & Framework:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentService.techStack.map((tech, idx) => (
                        <span key={idx} className="bg-emerald-900 text-emerald-200 border border-emerald-700 px-2 py-0.5 rounded text-xs font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick CTA to Simulator */}
                <div className="bg-white border border-emerald-200 rounded-2xl p-5 space-y-3 shadow-sm">
                  <div className="flex items-center gap-2 text-emerald-950 font-bold text-sm">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    <span>Uji Operasional Service</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Lihat bagaimana microservice ini berinteraksi langsung dalam simulasi pesanan jastip mahasiswa Unismuh Makassar.
                  </p>
                  <button
                    onClick={() => setActiveTab('simulator')}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Jalankan Live API Simulator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 2: API Endpoints & Contract */}
          {activeTab === 'api' && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                  Daftar Kontrak Endpoint REST API ({currentService.name})
                </span>
                <span className="text-xs text-emerald-700 font-semibold font-mono">
                  Base URL: http://localhost:{currentService.port}
                </span>
              </div>

              <div className="grid lg:grid-cols-12 gap-6 items-start">
                {/* Left list of endpoints */}
                <div className="lg:col-span-5 space-y-2">
                  {currentService.endpoints.map((ep, idx) => {
                    const isSelectedEp = idx === selectedEndpointIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedEndpointIndex(idx)}
                        className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                          isSelectedEp 
                            ? 'bg-emerald-50 border-emerald-600 shadow-sm ring-1 ring-emerald-500' 
                            : 'bg-white border-emerald-100 hover:border-emerald-300'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                            ep.method === 'GET' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                            ep.method === 'POST' ? 'bg-emerald-600 text-white' :
                            ep.method === 'PATCH' ? 'bg-amber-100 text-amber-900 border border-amber-200' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {ep.method}
                          </span>
                          <span className="text-xs font-mono font-bold text-emerald-950 truncate">{ep.path}</span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">{ep.description}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Right Endpoint Details Viewer */}
                <div className="lg:col-span-7 bg-emerald-950 text-emerald-100 rounded-2xl p-5 border border-emerald-900 space-y-4">
                  {(() => {
                    const ep = currentService.endpoints[selectedEndpointIndex] || currentService.endpoints[0];
                    return (
                      <>
                        <div className="flex items-center justify-between border-b border-emerald-800 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-emerald-600 text-white">
                              {ep.method}
                            </span>
                            <span className="font-mono text-sm font-bold text-white">{ep.path}</span>
                          </div>
                          <button
                            onClick={() => handleCopy(JSON.stringify(ep.responseExample, null, 2), 'ep-resp')}
                            className="text-xs font-semibold text-emerald-300 hover:text-white flex items-center gap-1 bg-emerald-900 border border-emerald-700 px-2.5 py-1 rounded"
                          >
                            {copiedText === 'ep-resp' ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedText === 'ep-resp' ? 'Disalin' : 'Salin Respon'}</span>
                          </button>
                        </div>

                        <p className="text-xs text-emerald-200/80">{ep.description}</p>

                        {ep.requestExample && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold block">
                              Request Body Payload (JSON):
                            </span>
                            <pre className="bg-emerald-900/80 p-3 rounded-xl text-xs font-mono text-emerald-200 overflow-x-auto border border-emerald-800">
                              {JSON.stringify(ep.requestExample, null, 2)}
                            </pre>
                          </div>
                        )}

                        <div className="space-y-1.5">
                          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold block">
                            200 OK Response Schema (JSON):
                          </span>
                          <pre className="bg-emerald-900/80 p-3 rounded-xl text-xs font-mono text-emerald-200 overflow-x-auto max-h-56 border border-emerald-800">
                            {JSON.stringify(ep.responseExample, null, 2)}
                          </pre>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 3: Event Message Broker */}
          {activeTab === 'events' && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-emerald-100/70 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-950 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-950">
                  <Radio className="w-4 h-4 text-emerald-700" />
                  <span>Arsitektur Asynchronous Message Broker (RabbitMQ / Kafka)</span>
                </div>
                <p className="leading-relaxed text-slate-700">
                  Microservices dalam ekosistem Jastip Kampus berkomunikasi secara non-blocking melalui event-driven architecture. Saat suatu kondisi terjadi (seperti penutupan order otomatis atau pembayaran escrow berhasil), service memancarkan event ke topic exchange.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                {/* Published Events */}
                <div className="bg-white border border-emerald-100 rounded-2xl p-5 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                      Published Events (Dipancarkan):
                    </span>
                    <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                      Emitter
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {currentService.publishedEvents.map((event, idx) => (
                      <li key={idx} className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-xs font-mono text-emerald-950 flex items-start gap-2">
                        <span className="text-emerald-700 font-bold">📤</span>
                        <span>{event}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Subscribed Events */}
                <div className="bg-white border border-emerald-100 rounded-2xl p-5 space-y-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                      Subscribed Events (Didengarkan):
                    </span>
                    <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                      Consumer
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {currentService.subscribedEvents.map((event, idx) => (
                      <li key={idx} className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 text-xs font-mono text-emerald-950 flex items-start gap-2">
                        <span className="text-emerald-700 font-bold">📥</span>
                        <span>{event}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content 4: Live Simulator */}
          {activeTab === 'simulator' && (
            <div className="space-y-5 animate-fade-in">
              <div className="grid lg:grid-cols-12 gap-6 items-start">
                
                {/* Left: Code Payload & Action */}
                <div className="lg:col-span-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                      Sample Execution Payload:
                    </span>
                    <button
                      onClick={() => handleCopy(JSON.stringify(currentService.samplePayload.body, null, 2), 'sim-payload')}
                      className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 bg-white border border-emerald-200 px-2.5 py-1 rounded"
                    >
                      {copiedText === 'sim-payload' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedText === 'sim-payload' ? 'Disalin' : 'Salin JSON'}</span>
                    </button>
                  </div>

                  <div className="bg-emerald-950 text-white rounded-t-xl p-3 flex items-center justify-between font-mono text-xs border-b border-emerald-800">
                    <div className="flex items-center gap-2 overflow-x-auto">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-emerald-600 text-white">
                        {currentService.samplePayload.method}
                      </span>
                      <span className="text-emerald-200 truncate">{currentService.samplePayload.endpoint}</span>
                    </div>
                    <span className="text-[11px] text-emerald-300 font-sans font-semibold shrink-0 ml-2">
                      {currentService.samplePayload.event}
                    </span>
                  </div>

                  <div className="bg-emerald-900/90 text-emerald-100 p-4 rounded-b-xl font-mono text-xs overflow-x-auto max-h-60 border border-emerald-800 leading-relaxed shadow-inner">
                    <pre>{JSON.stringify(currentService.samplePayload.body, null, 2)}</pre>
                  </div>

                  <button
                    onClick={() => handleTriggerSimulatedEvent(currentService)}
                    disabled={simulatingEvent}
                    className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60"
                  >
                    {simulatingEvent ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                        <span>Mengeksekusi Microservice...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current text-white" />
                        <span>Kirim Uji Coba: {currentService.samplePayload.event}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Right: Live Console Terminal Output */}
                <div className="lg:col-span-6 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-950 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Console & Network Logs</span>
                    </span>
                    <span className="font-mono text-[10px] text-emerald-700 font-semibold">Status: Listening (RabbitMQ)</span>
                  </div>

                  <div className="bg-emerald-950 border border-emerald-900 rounded-2xl p-4 font-mono text-xs text-emerald-100 min-h-[260px] max-h-[300px] overflow-y-auto space-y-2.5 shadow-inner">
                    {simulationLogs.length === 0 ? (
                      <div className="text-emerald-400/60 italic flex flex-col items-center justify-center py-16 text-center space-y-2">
                        <Server className="w-8 h-8 text-emerald-600 animate-pulse" />
                        <p>Klik tombol "Kirim Uji Coba" di sebelah kiri untuk melihat live trace log eksekusi microservice ini.</p>
                      </div>
                    ) : (
                      simulationLogs.map((log, i) => (
                        <div 
                          key={i} 
                          className={`p-2 rounded-lg leading-relaxed ${
                            log.type === 'success' ? 'bg-emerald-900 text-emerald-200 border border-emerald-700' :
                            log.type === 'event' ? 'bg-emerald-800 text-white border border-emerald-600' : 'text-emerald-100'
                          }`}
                        >
                          <span className="text-emerald-400 text-[10px] font-sans mr-2">[{log.time}]</span>
                          <span>{log.text}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>

      {/* ========================================================================= */}
      {/* DETAILED INSPECTION MODAL */}
      {/* ========================================================================= */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-emerald-950/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-emerald-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-emerald-100 flex items-center justify-between bg-emerald-50/60">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-white border border-emerald-200 shadow-sm flex items-center justify-center">
                  {getServiceIcon(modalService.id, "w-6 h-6")}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-emerald-950">{modalService.name}</h3>
                    <span className="bg-emerald-100 text-emerald-900 text-[11px] font-bold px-2 py-0.5 rounded font-mono border border-emerald-200">
                      PORT {modalService.port}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-700 font-semibold">{modalService.badge} • Microservices Engine Unismuh</p>
                </div>
              </div>

              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="w-9 h-9 rounded-full bg-emerald-100 hover:bg-emerald-200 flex items-center justify-center text-emerald-900 transition-colors"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-emerald-100 px-6 bg-white gap-2 pt-3">
              {(['overview', 'api', 'events', 'simulator'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setModalTab(tab)}
                  className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 capitalize ${
                    modalTab === tab
                      ? 'border-emerald-600 text-emerald-700'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab === 'overview' ? 'Ringkasan & Skema DB' :
                   tab === 'api' ? `Kontrak API (${modalService.endpoints.length})` :
                   tab === 'events' ? 'Message Broker Events' : 'Simulator'}
                </button>
              ))}
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow">
              
              {modalTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">Deskripsi Layanan</h4>
                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                      {modalService.description}
                    </p>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-3">Tanggung Jawab Utama:</h4>
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      {modalService.responsibilities.map((resp, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-white p-3 rounded-xl border border-emerald-100 shadow-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{resp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-emerald-950 text-white p-5 rounded-2xl space-y-3 border border-emerald-900">
                    <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                      <Database className="w-4 h-4" />
                      <span>Database & Runtime</span>
                    </div>
                    <p className="font-mono text-xs text-emerald-300">{modalService.database}</p>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {modalService.techStack.map((tech, idx) => (
                        <span key={idx} className="bg-emerald-900 text-emerald-200 border border-emerald-700 px-2 py-0.5 rounded text-xs font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {modalTab === 'api' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                    Daftar Endpoint REST API:
                  </h4>
                  <div className="space-y-3">
                    {modalService.endpoints.map((ep, idx) => (
                      <div key={idx} className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                            ep.method === 'GET' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                            ep.method === 'POST' ? 'bg-emerald-600 text-white' : 'bg-amber-100 text-amber-900 border border-amber-200'
                          }`}>
                            {ep.method}
                          </span>
                          <span className="font-mono text-sm font-bold text-emerald-950">{ep.path}</span>
                        </div>
                        <p className="text-xs text-slate-600">{ep.description}</p>
                        <div className="bg-emerald-950 text-emerald-100 p-3 rounded-xl font-mono text-[11px] overflow-x-auto border border-emerald-900">
                          <pre>{JSON.stringify(ep.responseExample, null, 2)}</pre>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {modalTab === 'events' && (
                <div className="space-y-5">
                  <div className="bg-emerald-100 border border-emerald-200 p-4 rounded-xl text-xs text-emerald-950">
                    <strong>Message Broker:</strong> Service ini menggunakan RabbitMQ AMQP untuk pertukaran pesan secara real-time dengan latency rendah antar node.
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">Events Published:</h5>
                    {modalService.publishedEvents.map((ev, i) => (
                      <div key={i} className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 font-mono text-xs text-emerald-950 flex items-center gap-2">
                        <span>📤</span>
                        <span>{ev}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">Events Subscribed:</h5>
                    {modalService.subscribedEvents.map((ev, i) => (
                      <div key={i} className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 font-mono text-xs text-emerald-950 flex items-center gap-2">
                        <span>📥</span>
                        <span>{ev}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {modalTab === 'simulator' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600">
                    Jalankan event uji coba untuk memicu pemrosesan data internal pada {modalService.name}.
                  </p>

                  <div className="bg-emerald-950 p-4 rounded-2xl text-emerald-100 font-mono text-xs space-y-3 border border-emerald-900">
                    <div className="flex justify-between items-center text-emerald-300">
                      <span>{modalService.samplePayload.method} {modalService.samplePayload.endpoint}</span>
                      <span>{modalService.samplePayload.event}</span>
                    </div>
                    <pre className="text-emerald-200 max-h-48 overflow-y-auto">
                      {JSON.stringify(modalService.samplePayload.body, null, 2)}
                    </pre>
                  </div>

                  <button
                    onClick={() => {
                      setIsDetailModalOpen(false);
                      setSelectedServiceId(modalService.id);
                      setActiveTab('simulator');
                      handleTriggerSimulatedEvent(modalService);
                    }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Lanjutkan ke Live Console Simulator</span>
                  </button>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-emerald-50/60 border-t border-emerald-100 flex items-center justify-between text-xs text-emerald-800">
              <span>Port: {modalService.port} • Status: Active & Protected</span>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
