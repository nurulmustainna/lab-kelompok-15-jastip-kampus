import React, { useState, useEffect } from 'react';
import { TopAcademicBanner } from './components/TopAcademicBanner';
import { MainPortalHeader, UserRole } from './components/MainPortalHeader';
import { PortalNavbar, PortalTab } from './components/PortalNavbar';
import { MetricCardsRow } from './components/MetricCardsRow';
import { CatalogGridSection } from './components/CatalogGridSection';
import { MyOrdersSection } from './components/MyOrdersSection';
import { ActiveSessionsSection } from './components/ActiveSessionsSection';
import { EscrowSection } from './components/EscrowSection';
import { LiveTrackingSection } from './components/LiveTrackingSection';
import { MicroservicesSection } from './components/MicroservicesSection';
import { DataExplorerSection } from './components/DataExplorerSection';
import { RulesSection } from './components/RulesSection';
import { AdminDashboard } from './components/AdminDashboard';
import { JastiperWorkspace } from './components/JastiperWorkspace';
import { OrderModal } from './components/OrderModal';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './components/LandingPage';
import { Footer } from './components/Footer';
import { MOCK_SESSIONS, MOCK_CATALOG_ITEMS, INITIAL_DEMO_ORDER, MOCK_STUDENT_ACCOUNTS, MOCK_STUDENT_ORDERS } from './data/mockData';
import { CatalogItem, JastipOrder, JastipSession, StudentAccount } from './types';

export default function App() {
  // Page mode: 'LANDING' (Halaman Depan Modern Dark Mode) or 'PORTAL' (Dashboard Sistem Akademik Unismuh)
  const [viewMode, setViewMode] = useState<'LANDING' | 'PORTAL'>('LANDING');
  const [activeTab, setActiveTab] = useState<PortalTab>('sessions');
  const [userRole, setUserRole] = useState<UserRole>('mahasiswa');
  const [sessions, setSessions] = useState<JastipSession[]>(MOCK_SESSIONS);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>(MOCK_CATALOG_ITEMS);
  
  // Student Account state (Active Logged-In Student)
  // Initialize from localStorage if available, otherwise use MOCK_STUDENT_ACCOUNTS
  const [studentAccounts, setStudentAccounts] = useState<StudentAccount[]>(() => {
    try {
      const stored = localStorage.getItem('jastip_users');
      if (stored) {
        return JSON.parse(stored) as StudentAccount[];
      }
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
    }
    return MOCK_STUDENT_ACCOUNTS;
  });
  const [currentStudent, setCurrentStudent] = useState<StudentAccount>(MOCK_STUDENT_ACCOUNTS[0]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialView, setAuthModalInitialView] = useState<'LOGIN_FORM' | 'REGISTER' | 'TOP_UP'>('LOGIN_FORM');

  const handleOpenAuth = (view: 'LOGIN_FORM' | 'REGISTER' | 'TOP_UP' = 'LOGIN_FORM') => {
    setAuthModalInitialView(view);
    setIsAuthModalOpen(true);
  };

  // Distinct Student Orders map
  // Initialize from localStorage if available, otherwise use MOCK_STUDENT_ORDERS
  const [studentOrders, setStudentOrders] = useState<Record<string, JastipOrder>>(() => {
    try {
      const stored = localStorage.getItem('jastip_orders');
      if (stored) {
        return JSON.parse(stored) as Record<string, JastipOrder>;
      }
    } catch (e) {
      console.error('Failed to load orders from localStorage:', e);
    }
    return MOCK_STUDENT_ORDERS;
  });
  const [currentOrder, setCurrentOrder] = useState<JastipOrder>(
    MOCK_STUDENT_ORDERS[MOCK_STUDENT_ACCOUNTS[0].nim] || INITIAL_DEMO_ORDER
  );

  // Persist studentOrders to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('jastip_orders', JSON.stringify(studentOrders));
    } catch (e) {
      console.error('Failed to save orders to localStorage:', e);
    }
  }, [studentOrders]);

  // Track deleted orders per student (nim -> Set of deleted order IDs)
  const [deletedOrderIds, setDeletedOrderIds] = useState<Record<string, Set<string>>>(() => {
    try {
      const stored = localStorage.getItem('jastip_deleted_orders');
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, string[]>;
        // Convert arrays back to Sets
        const result: Record<string, Set<string>> = {};
        for (const [nim, ids] of Object.entries(parsed)) {
          result[nim] = new Set(ids);
        }
        return result;
      }
    } catch (e) {
      console.error('Failed to load deleted orders from localStorage:', e);
    }
    return {};
  });

  // Persist deleted orders to localStorage
  useEffect(() => {
    try {
      const toSave: Record<string, string[]> = {};
      for (const [nim, ids] of Object.entries(deletedOrderIds)) {
        toSave[nim] = Array.from(ids);
      }
      localStorage.setItem('jastip_deleted_orders', JSON.stringify(toSave));
    } catch (e) {
      console.error('Failed to save deleted orders to localStorage:', e);
    }
  }, [deletedOrderIds]);
  
  // Update order handler that synchronizes to studentOrders state
  const handleUpdateCurrentOrder = (updated: JastipOrder) => {
    setCurrentOrder(updated);
    setStudentOrders(prev => ({
      ...prev,
      [currentStudent.nim]: updated
    }));
  };

  const handleUpdateStudentOrderByNim = (nim: string, updated: JastipOrder) => {
    setStudentOrders(prev => ({
      ...prev,
      [nim]: updated
    }));
    if (currentStudent.nim === nim) {
      setCurrentOrder(updated);
    }
  };

  // Order Modal state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<CatalogItem | null>(null);
  const [selectedSessionForOrder, setSelectedSessionForOrder] = useState<JastipSession>(MOCK_SESSIONS[0]);

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenOrderModal = (item: CatalogItem, session: JastipSession) => {
    setSelectedCatalogItem(item);
    setSelectedSessionForOrder(session);
    setIsOrderModalOpen(true);
  };

  // Handler to add a newly registered student account
  const handleAddStudent = (newStudent: StudentAccount) => {
    setStudentAccounts(prev => {
      const updated = [...prev, newStudent];
      // Persist to localStorage
      try {
        localStorage.setItem('jastip_users', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      }
      return updated;
    });
  };

  const handleSubmitNewOrder = (newOrder: JastipOrder) => {
    // If paid via student wallet, deduct balance
    if (newOrder.paymentMethod === 'WALLET_UNISMUH') {
      setCurrentStudent(prev => ({
        ...prev,
        balance: Math.max(0, prev.balance - newOrder.grandTotal)
      }));
    }

    setCurrentOrder(newOrder);
    setStudentOrders(prev => ({
      ...prev,
      [currentStudent.nim]: newOrder
    }));
    showToast(`Order #${newOrder.orderCode} berhasil dibuat via ${newOrder.paymentMethodLabel || 'QRIS Unismuh'} & dana Rp ${newOrder.grandTotal.toLocaleString('id-ID')} terkunci di Rekber Escrow!`);
    setActiveTab('my-orders');
  };

  const handleSelectStudent = (student: StudentAccount) => {
    setCurrentStudent(student);
    setUserRole(student.role);

    // Load distinct order for this student
    if (studentOrders[student.nim]) {
      setCurrentOrder(studentOrders[student.nim]);
    } else {
      // If new student without previous order, create a personalized pending order
      const newPersonalOrder: JastipOrder = {
        id: `ORD-${Date.now().toString().slice(-6)}`,
        orderCode: `JSTP-UNISMUH-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: student.name,
        customerProdi: `${student.prodi} (${student.nim})`,
        sessionId: 'SES-UNISMUH-01',
        items: [
          { item: catalogItems[Math.floor(Math.random() * catalogItems.length)], qty: 1 }
        ],
        totalItemPrice: 25000,
        totalJastipFee: 5000,
        appFee: 1000,
        grandTotal: 31000,
        paymentMethod: 'QRIS_UNISMUH',
        paymentMethodLabel: 'QRIS Unismuh Pay (Instan)',
        status: 'ESCROW_DITAMPUNG',
        meetingPoint: `Lobby Gedung ${student.faculty || 'Unismuh'}`,
        createdAt: 'Baru saja',
        escrowStatus: 'HELD_IN_ESCROW',
        trackingHistory: [
          {
            step: '1. Buka Order & Titipan Dibuat',
            timestamp: 'Baru saja',
            note: `Pesanan dibuat oleh ${student.name} (${student.nim}).`,
            done: true
          },
          {
            step: '2. Bayar ke Rekening Bersama (Escrow)',
            timestamp: 'Baru saja',
            note: 'Dana diamankan di Rekber Escrow Unismuh.',
            done: true
          },
          {
            step: '3. Menunggu Klaim Jastiper',
            timestamp: 'Baru saja',
            note: 'Pesanan tersedia di Workspace Jastiper.',
            done: false
          }
        ]
      };
      setStudentOrders(prev => ({
        ...prev,
        [student.nim]: newPersonalOrder
      }));
      setCurrentOrder(newPersonalOrder);
    }

    showToast(`Berhasil masuk sebagai ${student.name} (${student.nim}) - ${student.prodi}`);
    setViewMode('PORTAL'); // Automatically enter portal dashboard upon login
  };

  const handleTopUpBalance = (amount: number) => {
    setCurrentStudent(prev => ({
      ...prev,
      balance: prev.balance + amount
    }));
    showToast(`Top-Up Berhasil! Saldo dompet jastip bertambah Rp ${amount.toLocaleString('id-ID')}`);
  };

  // Handle buyer deleting a completed order
  const handleDeleteOrder = (orderId: string) => {
    setDeletedOrderIds(prev => {
      const updated = { ...prev };
      if (!updated[currentStudent.nim]) {
        updated[currentStudent.nim] = new Set();
      }
      updated[currentStudent.nim].add(orderId);
      return updated;
    });
    showToast(`Pesanan #${currentOrder.orderCode} telah dihapus dari daftar Pesanan Saya.`);
  };

  // Check if current order is deleted by buyer
  const isOrderDeletedByBuyer = () => {
    return deletedOrderIds[currentStudent.nim]?.has(currentOrder.id) ?? false;
  };

  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-emerald-600 selection:text-white">
      
      {/* Toast Alert (Global) */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 p-4 bg-emerald-800 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-2xl border border-emerald-500 flex items-center justify-between gap-3 animate-fade-in max-w-md">
          <span>{toastMessage}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-emerald-200 hover:text-white font-bold ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {viewMode === 'LANDING' ? (
        /* 
          ========================================================================
          VIEW 1: HALAMAN LANDING PAGE (SEBELUM LOGIN) - MODERN DARK MODE
          ========================================================================
        */
        <LandingPage 
          onOpenAuthModal={handleOpenAuth}
          onEnterDashboard={() => setViewMode('PORTAL')}
          onSelectCatalogItem={(itemName) => {
            setViewMode('PORTAL');
            setActiveTab('catalog');
            const found = catalogItems.find(c => c.name.toLowerCase().includes(itemName.toLowerCase()));
            if (found) {
              handleOpenOrderModal(found, sessions[0]);
            }
          }}
        />
      ) : userRole === 'admin' ? (
        /* 
          ========================================================================
          VIEW 2B: DASHBOARD ADMIN (DARK EMERALD GREEN THEME)
          ========================================================================
        */
        <AdminDashboard 
          onReturnToPortal={() => {
            setUserRole('mahasiswa');
            setActiveTab('catalog');
            showToast('Beralih ke Portal Mahasiswa & Jastip.');
          }}
          onLogoutToLanding={() => {
            setViewMode('LANDING');
            setUserRole('mahasiswa');
            showToast('Berhasil keluar dari Dashboard Admin. Kembali ke Halaman Depan.');
          }}
          catalogItems={catalogItems}
          sessions={sessions}
          currentOrder={currentOrder}
          studentAccounts={studentAccounts}
          onUpdateCatalogItem={(updatedItem) => {
            setCatalogItems(prev => prev.map(item => item.id === updatedItem.id ? updatedItem : item));
            showToast(`Katalog "${updatedItem.name}" berhasil diperbarui.`);
          }}
          onAddCatalogItem={(newItem) => {
            setCatalogItems(prev => [newItem, ...prev]);
            showToast(`Menu "${newItem.name}" berhasil ditambahkan.`);
          }}
          onDeleteCatalogItem={(itemId) => {
            setCatalogItems(prev => prev.filter(item => item.id !== itemId));
            showToast('Item berhasil dihapus dari katalog.');
          }}
        />
      ) : (
        /* 
          ========================================================================
          VIEW 2A: DASHBOARD PORTAL MAHASISWA & JASTIPER (UNISMUH)
          ========================================================================
        */
        <div className="min-h-screen bg-emerald-50/20 text-slate-900 flex flex-col">
          {/* 1. Academic Header Strip (Unismuh Makassar) with link to return to Landing */}
          <TopAcademicBanner onReturnToLanding={() => setViewMode('LANDING')} />

          {/* 2. Main Portal Header (Green/White Navbar with Logo & Profile Box & Logout Button) */}
          <MainPortalHeader 
            currentRole={userRole}
            onRoleChange={(role) => {
              if (role === 'jastiper') {
                if (currentStudent.role !== 'jastiper') {
                  showToast('Akses Dibatasi: Masuk menggunakan akun Mitra Jasa Titip (jasatitip@gmail.com).');
                  handleOpenAuth('LOGIN_FORM');
                  return;
                }
                setUserRole('jastiper');
                setActiveTab('sessions');
                showToast(`Mode Jastiper Aktif: Selamat datang ${currentStudent.name}, Anda dapat menerima pesanan.`);
                return;
              }

              if (role === 'admin') {
                if (currentStudent.role !== 'admin') {
                  showToast('Akses Dibatasi: Masuk menggunakan akun Super Admin SRE (kelompok15@gmail.com).');
                  handleOpenAuth('LOGIN_FORM');
                  return;
                }
                setUserRole('admin');
                showToast('Masuk ke Dashboard Admin SRE Cluster Unismuh.');
                return;
              }

              setUserRole('mahasiswa');
              setActiveTab('sessions');
            }}
            activeOrderCount={1}
            currentStudent={currentStudent}
            onOpenAuthModal={() => handleOpenAuth('LOGIN_FORM')}
            onLogout={() => {
              setViewMode('LANDING');
              showToast('Berhasil keluar. Kembali ke halaman utama jastip.');
            }}
          />

          {/* 3. Horizontal Navigation Bar */}
          <PortalNavbar 
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            orderCount={1}
            currentRole={userRole}
          />

          {/* Main Container */}
          <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">

            {/* 4. Top 6 Metric Cards Row (Dashboard Banner + Quick Access + 6 Stat Counters for Mahasiswa) */}
            {userRole === 'mahasiswa' && (
              <MetricCardsRow 
                onNavigateTab={setActiveTab} 
                currentStudent={currentStudent}
                currentRole={userRole}
                onOpenAuthModal={handleOpenAuth}
              />
            )}

            {/* 5. Dynamic Tab View Content */}
            <div className="mt-6">
              {activeTab === 'catalog' && (
                <CatalogGridSection 
                  items={catalogItems}
                  sessions={sessions}
                  onOpenOrderModal={handleOpenOrderModal}
                />
              )}

              {activeTab === 'my-orders' && (
                <MyOrdersSection 
                  currentOrder={currentOrder}
                  onUpdateOrder={handleUpdateCurrentOrder}
                  onNavigateTab={setActiveTab}
                  currentRole={userRole}
                  onShowToast={showToast}
                  isOrderDeleted={isOrderDeletedByBuyer()}
                  onDeleteOrder={handleDeleteOrder}
                />
              )}

              {activeTab === 'sessions' && (
                userRole === 'jastiper' ? (
                  <JastiperWorkspace 
                    sessions={sessions}
                    onAddNewSession={(newSes) => {
                      setSessions([newSes, ...sessions]);
                    }}
                    onShowToast={showToast}
                    currentOrder={currentOrder}
                    onUpdateOrder={handleUpdateCurrentOrder}
                    allStudentOrders={studentOrders}
                    onUpdateStudentOrder={handleUpdateStudentOrderByNim}
                    currentStudent={currentStudent}
                  />
                ) : (
                  <ActiveSessionsSection 
                    sessions={sessions}
                    onSelectSessionForOrder={(ses) => {
                      setSelectedSessionForOrder(ses);
                      setActiveTab('catalog');
                    }}
                    onNavigateTab={setActiveTab}
                  />
                )
              )}

              {activeTab === 'escrow' && (
                <EscrowSection 
                  currentOrder={currentOrder}
                  onUpdateOrder={handleUpdateCurrentOrder}
                />
              )}

              {activeTab === 'tracking' && (
                <LiveTrackingSection 
                  currentOrder={currentOrder}
                  onUpdateOrder={handleUpdateCurrentOrder}
                />
              )}

              {activeTab === 'microservices' && (
                <MicroservicesSection />
              )}

              {activeTab === 'data-explorer' && (
                <DataExplorerSection />
              )}

              {activeTab === 'rules' && (
                <RulesSection />
              )}
            </div>

          </main>

          {/* Footer */}
          <Footer />
        </div>
      )}

      {/* Order Modal (Universal) */}
      <OrderModal 
        isOpen={isOrderModalOpen}
        item={selectedCatalogItem}
        session={selectedSessionForOrder}
        onClose={() => setIsOrderModalOpen(false)}
        onSubmitOrder={handleSubmitNewOrder}
        currentStudent={currentStudent}
        onOpenAuthModal={() => {
          setIsOrderModalOpen(false);
          setIsAuthModalOpen(true);
        }}
      />

      {/* Auth & Student Switcher Modal (Universal for both views) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentStudent={currentStudent}
        onSelectStudent={handleSelectStudent}
        onTopUpBalance={handleTopUpBalance}
        initialView={authModalInitialView}
        studentAccounts={studentAccounts}
        onAddStudent={handleAddStudent}
      />

    </div>
  );
}

