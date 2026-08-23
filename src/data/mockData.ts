import { CatalogItem, JastipSession, MicroserviceInfo, JastipOrder, StudentAccount, PaymentMethodOption } from '../types';

import imgCotoMakassar from '../assets/images/coto_makassar_1787289509492.jpg';
import imgNasiKuning from '../assets/images/nasi_kuning_makassar_1787289633265.jpg';
import imgPallubasa from '../assets/images/pallubasa_telur_1787289576738.jpg';
import imgMieTiti from '../assets/images/mie_titi_makassar_1787289554656.jpg';
import imgNasiGorengMerah from '../assets/images/nasi_goreng_merah_1787289541800.jpg';
import imgSongkolo from '../assets/images/songkolo_bagadang_1787289591838.jpg';
import imgNasiPadang from '../assets/images/nasi_padang_rendang_1787290110046.jpg';
import imgAyamBakarMadu from '../assets/images/ayam_bakar_madu_1787290085010.jpg';
import imgBebekKremes from '../assets/images/bebek_kremes_ijo_1787290066979.jpg';
import imgBaksoUrat from '../assets/images/bakso_urat_jumbo_1787290045363.jpg';
import imgEsPisangIjo from '../assets/images/es_pisang_ijo_1787289605984.jpg';
import imgJusAlpukat from '../assets/images/jus_alpukat_kental_1787290024848.jpg';
import imgBrownSugarBoba from '../assets/images/brown_sugar_boba_1787290000095.jpg';
import imgJalangkote from '../assets/images/jalangkote_makassar_1787289618535.jpg';
import imgSolderListrik from '../assets/images/solder_listrik_set_1787289977327.jpg';
import imgPulpenGel from '../assets/images/pulpen_gel_hitam_box_1787290707377.jpg';

export const MICROSERVICES_DATA: MicroserviceInfo[] = [
  {
    id: 'order-service',
    name: 'Order-Service',
    badge: 'Core Orchestrator',
    color: 'emerald',
    iconName: 'CalendarCheck',
    port: 8001,
    database: 'PostgreSQL 16 (Relational ACID DB for Sessions & Orders)',
    techStack: ['Node.js / Express', 'Prisma ORM', 'RabbitMQ', 'PostgreSQL', 'Redis Cache'],
    description: 'Mengelola siklus hidup sesi jastip, pembuatan order titipan, kalkulasi batas muatan (baggage weight limit), kesepakatan fitur tawar ongkir, serta otomasi penutupan order (closing time lock tepat H-30 menit).',
    responsibilities: [
      'Buka Order: Pembuatan dan validasi sesi rute jastiper (misal: Jl. Sultan Alauddin -> Kampus Unismuh)',
      'Fitur Tawar Jastip: Kalkulasi penyesuaian tarif ongkos titip (Hemat, Standar, Prioritas)',
      'Validasi Kapasitas Muatan: Mencegah over-capacity tas/motor jastiper (maks 5.0 kg / 6 slot order)',
      'Otomatisasi Closing Time: Scheduler cron-job mengunci sesi tepat 30 menit sebelum jadwal keberangkatan',
      'Event Dispatcher: Memancarkan event SESSION_LOCKED dan ORDER_CREATED ke message broker'
    ],
    publishedEvents: [
      'session.created (Sesi jastip baru dibuka)',
      'order.placed (Pesanan baru dibuat pemesan)',
      'order.price_negotiated (Tarif jastip disepakati via fitur tawar)',
      'session.locked_closing_time (Sesi ditutup otomatis oleh timer H-30 menit)'
    ],
    subscribedEvents: [
      'payment.escrow_held (Status order berubah ke Escrow Ditampung)',
      'tracking.delivery_completed (Order selesai & sesi ditutup final)'
    ],
    endpoints: [
      {
        method: 'POST',
        path: '/api/v1/sessions/create',
        description: 'Membuka sesi titipan baru oleh jastiper di sekitar kampus',
        requestExample: { jastiperNim: '105841104423', routeFrom: 'Jl. Sultan Alauddin', maxWeightKg: 5.0, departureTime: '12:00' },
        responseExample: { sessionId: 'SES-UNISMUH-01', status: 'OPEN', closingTime: '11:30', maxOrders: 6 }
      },
      {
        method: 'POST',
        path: '/api/v1/orders/create',
        description: 'Membuat pesanan titipan baru oleh mahasiswa pemesan',
        requestExample: { sessionId: 'SES-UNISMUH-01', buyerNim: '105841108822', items: [{ id: 'CAT-001', qty: 1 }], tawarOption: 'standar' },
        responseExample: { orderId: 'ORD-20260821-009', grandTotal: 25000, status: 'MENUNGGU_PEMBAYARAN' }
      },
      {
        method: 'POST',
        path: '/api/v1/orders/session/:sessionId/lock',
        description: 'Mengunci sesi secara otomatis saat waktu closing H-30 menit tercapai',
        requestExample: { trigger: 'SCHEDULER_CRON' },
        responseExample: { sessionId: 'SES-UNISMUH-01', status: 'LOCKED_BY_TIMER', totalOrders: 4, totalWeightKg: 3.2 }
      },
      {
        method: 'GET',
        path: '/api/v1/sessions/:sessionId/summary',
        description: 'Mengambil ringkasan muatan dan daftar belanja valid jastiper',
        responseExample: { sessionId: 'SES-UNISMUH-01', itemsToBuy: 4, remainingCapacityKg: 1.8 }
      }
    ],
    samplePayload: {
      event: 'SESSION_LOCKED',
      endpoint: '/api/v1/orders/session/SES-UNISMUH-01/lock',
      method: 'POST',
      body: {
        sessionId: 'SES-UNISMUH-01',
        jastiperId: '105841104423',
        departureTime: '2026-08-21T12:00:00+08:00',
        closingTime: '2026-08-21T11:30:00+08:00',
        lockReason: 'AUTOMATIC_H30_SCHEDULER',
        totalOrdersConfirmed: 4,
        totalWeightAllocatedKg: 3.2,
        maxCapacityKg: 5.0,
        status: 'LOCKED_BY_TIMER'
      }
    }
  },
  {
    id: 'catalog-service',
    name: 'Catalog-Service',
    badge: 'Merchant & Menu Catalog',
    color: 'emerald',
    iconName: 'Store',
    port: 8002,
    database: 'MongoDB Cluster (Flexible Document Store for Menus & Stores)',
    techStack: ['Node.js / Express', 'Mongoose', 'MongoDB Atlas', 'Elasticsearch', 'Redis'],
    description: 'Menyediakan direktori warung makan, kedai kopi, fotocopy/percetakan, dan toko ATK/elektronika di sekitar Jl. Sultan Alauddin, Talasalapang, dan Pettarani Makassar dengan estimasi bobot.',
    responsibilities: [
      'Manajemen Katalog Toko & Item (Makanan, Minuman, Cetak Tugas, Komponen Lab)',
      'Estimasi Bobot Barang (Gram/Kg) untuk kalkulasi beban bawaan kurir',
      'Pencarian Cepat & Filter Multi-Kategori berbasis lokasi sekitar Unismuh',
      'Update Status Ketersediaan (In-Stock / Out-of-Stock) merchant sekitar'
    ],
    publishedEvents: [
      'catalog.item_updated (Perubahan harga/ketersediaan menu)',
      'catalog.stock_depleted (Menu warung habis, memicu alert ke pemesan)'
    ],
    subscribedEvents: [],
    endpoints: [
      {
        method: 'GET',
        path: '/api/v1/catalog/items',
        description: 'Mendapatkan 50 item katalog titipan aktif sekitar Unismuh',
        responseExample: { total: 50, items: [{ id: 'CAT-001', name: 'Paket Ayam Geprek' }] }
      },
      {
        method: 'GET',
        path: '/api/v1/catalog/stores/nearby',
        description: 'Mencari warung/toko terdekat dengan rute jastiper',
        responseExample: { stores: ['Ayam Geprek Master', 'Coto Daeng Alauddin'] }
      }
    ],
    samplePayload: {
      event: 'CATALOG_FETCH_SUCCESS',
      endpoint: '/api/v1/catalog/items?category=Makanan',
      method: 'GET',
      body: {
        category: 'Makanan',
        totalAvailable: 20,
        area: 'Jl. Sultan Alauddin - Unismuh Makassar',
        sampleItem: {
          id: 'CAT-001',
          name: 'Paket Ayam Geprek Sambal Korek + Nasi Hangat',
          price: 20000,
          jastipFee: 4000,
          estimatedWeightKg: 0.45,
          storeName: 'Ayam Geprek Master Alauddin'
        }
      }
    }
  },
  {
    id: 'payment-service',
    name: 'Payment-Service',
    badge: 'Escrow Ledger & QRIS',
    color: 'emerald',
    iconName: 'ShieldCheck',
    port: 8003,
    database: 'PostgreSQL (Double-Entry Bookkeeping Ledger)',
    techStack: ['Node.js / Express', 'PostgreSQL', 'QRIS Payment Gateway', 'Stripe/Midtrans', 'Redis Lock'],
    description: 'Menjamin keamanan transaksi dengan sistem Rekening Bersama (Escrow Vault). Dana pemesan ditahan aman dan hanya dicairkan ke jastiper setelah verifikasi scan QR saat serah terima di kampus.',
    responsibilities: [
      'Pembuatan QRIS Dynamic untuk pembayaran instan order titipan',
      'Penguncian Dana di Rekening Bersama (Escrow Hold) saat pesanan dikonfirmasi',
      'Pencairan Otomatis (Escrow Release) ke dompet jastiper setelah scan QR serah terima',
      'Eksekusi Refund Otomatis 100% jika pesanan dibatalkan atau stok warung habis'
    ],
    publishedEvents: [
      'payment.escrow_held (Dana order berhasil ditampung di escrow vault)',
      'payment.escrow_released (Dana berhasil ditransfer ke saldo jastiper)',
      'payment.refund_executed (100% dana dikembalikan ke pemesan)'
    ],
    subscribedEvents: [
      'order.placed (Membuat invoice pembayaran QRIS)',
      'tracking.delivery_completed (Memicu pelepasan dana escrow)'
    ],
    endpoints: [
      {
        method: 'POST',
        path: '/api/v1/payments/escrow/hold',
        description: 'Menampung dana pesanan ke rekening bersama (Escrow)',
        requestExample: { orderId: 'ORD-20260821-009', grandTotal: 43000, paymentMethod: 'QRIS' },
        responseExample: { escrowId: 'ESC-9921', status: 'HELD_IN_ESCROW' }
      },
      {
        method: 'POST',
        path: '/api/v1/payments/escrow/release',
        description: 'Mencairkan dana escrow ke jastiper pasca verifikasi serah terima',
        requestExample: { orderId: 'ORD-20260821-009', qrAuthToken: 'JSTP-UNISMUH-8841-VERIF' },
        responseExample: { payoutAmount: 42000, jastiperNim: '105841104423', status: 'RELEASED' }
      }
    ],
    samplePayload: {
      event: 'ESCROW_FUNDS_LOCKED',
      endpoint: '/api/v1/payments/escrow/hold',
      method: 'POST',
      body: {
        escrowVaultId: 'ESC-UNISMUH-9921',
        orderId: 'ORD-20260821-009',
        totalItemPrice: 35000,
        totalJastipFee: 7000,
        appFee: 1000,
        grandTotalLocked: 43000,
        status: 'HELD_IN_ESCROW',
        protectionGuarantee: '100% Money-Back Guarantee'
      }
    }
  },
  {
    id: 'tracking-service',
    name: 'Tracking-Service',
    badge: 'Real-Time ETA & QR Auth',
    color: 'emerald',
    iconName: 'MapPin',
    port: 8004,
    database: 'Redis Geo + TimescaleDB (Time-series Location History)',
    techStack: ['Node.js / Express', 'Socket.IO (WebSockets)', 'Redis Geo', 'TimescaleDB'],
    description: 'Menyediakan pembaruan status real-time perjalanan kurir dari warung hingga tiba di titik temu kampus (Menara Iqra / Lab Terpadu) serta validasi QR Serah Terima fisik.',
    responsibilities: [
      'Pembaruan Status 6-Tahap Pesanan secara Live via WebSocket',
      'Perhitungan ETA (Estimasi Waktu Tiba) menuju titik temu kampus Unismuh',
      'Verifikasi Kriptografis QR Code Serah Terima antara pemesan dan jastiper',
      'Pencatatan Audit Trail / Riwayat Perjalanan Serah Terima Barang'
    ],
    publishedEvents: [
      'tracking.status_updated (Status tahapan pengantaran berubah)',
      'tracking.delivery_completed (Serah terima sukses diverifikasi)'
    ],
    subscribedEvents: [
      'order.session_locked (Mulai pelacakan keberangkatan jastiper)'
    ],
    endpoints: [
      {
        method: 'PATCH',
        path: '/api/v1/tracking/orders/:orderId/status',
        description: 'Memperbarui tahapan status pengantaran kurir',
        requestExample: { currentState: 'EN_ROUTE_TO_CAMPUS', etaMinutes: 3 },
        responseExample: { success: true, updatedStatus: 'MENUJU_KAMPUS' }
      },
      {
        method: 'POST',
        path: '/api/v1/tracking/orders/:orderId/verify-qr',
        description: 'Verifikasi serah terima fisik via scan QR token di titik temu kampus',
        requestExample: { orderId: 'ORD-20260821-009', token: 'JSTP-UNISMUH-8841-VERIF' },
        responseExample: { verified: true, handoverCompletedAt: '2026-08-21T12:15:00+08:00' }
      }
    ],
    samplePayload: {
      event: 'ORDER_STATUS_UPDATED',
      endpoint: '/api/v1/tracking/orders/ORD-20260821-009/status',
      method: 'PATCH',
      body: {
        orderId: 'ORD-20260821-009',
        previousState: 'PURCHASED_AT_STORE',
        currentState: 'EN_ROUTE_TO_CAMPUS',
        currentLocation: 'Jl. Sultan Alauddin Depan Pintu 1 Kampus Unismuh',
        etaMinutes: 3,
        targetMeetingPoint: 'Lobby Gedung Menara Iqra Unismuh Makassar',
        updatedAt: '2026-08-21T12:12:00+08:00'
      }
    }
  }
];

export const MOCK_CATALOG_ITEMS: CatalogItem[] = [
  // --- KATEGORI MAKANAN (1 - 20) ---
  {
    id: 'CAT-001',
    name: 'Paket Ayam Geprek Sambal Korek + Nasi Hangat',
    category: 'Makanan',
    price: 20000,
    jastipFee: 4000,
    storeName: 'Ayam Geprek Master Alauddin',
    storeLocation: 'Jl. Sultan Alauddin No. 128 (Dekat Pintu 1 Unismuh)',
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.45,
    available: true
  },
  {
    id: 'CAT-002',
    name: 'Coto Makassar Daging Spesial + 2 Ketupat Daun',
    category: 'Makanan',
    price: 28000,
    jastipFee: 5000,
    storeName: 'Coto Daeng Alauddin Pintu 1',
    storeLocation: 'Jl. Sultan Alauddin (Seberang Kampus Unismuh)',
    image: imgCotoMakassar,
    estimatedWeightKg: 0.65,
    available: true
  },
  {
    id: 'CAT-003',
    name: 'Paket Nasi Kuning Begadang Telur + Abon Alauddin',
    category: 'Makanan',
    price: 16000,
    jastipFee: 3500,
    storeName: 'Warung Nasi Kuning Begadang Alauddin',
    storeLocation: 'Jl. Sultan Alauddin Simpang Minasa Upa',
    image: imgNasiKuning,
    estimatedWeightKg: 0.4,
    available: true
  },
  {
    id: 'CAT-004',
    name: 'Pallubasa Daging Sapi + Kuning Telur Alas',
    category: 'Makanan',
    price: 30000,
    jastipFee: 5000,
    storeName: 'Pallubasa Khas Serigala Alauddin',
    storeLocation: 'Jl. Sultan Alauddin No. 45',
    image: imgPallubasa,
    estimatedWeightKg: 0.6,
    available: true
  },
  {
    id: 'CAT-005',
    name: 'Konro Bakar Saus Kacang Khas Makassar',
    category: 'Makanan',
    price: 38000,
    jastipFee: 6000,
    storeName: 'Rumah Makan Konro Karebosi Cab. Alauddin',
    storeLocation: 'Jl. Sultan Alauddin Dekat Minasa Upa',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.7,
    available: true
  },
  {
    id: 'CAT-006',
    name: 'Mie Titi Khas Makassar Porsi Kenyang',
    category: 'Makanan',
    price: 26000,
    jastipFee: 4500,
    storeName: 'Mie Titi Talasalapang',
    storeLocation: 'Jl. Talasalapang No. 8 (Dekat Unismuh)',
    image: imgMieTiti,
    estimatedWeightKg: 0.5,
    available: true
  },
  {
    id: 'CAT-007',
    name: 'Nasi Goreng Merah Makassar Spesial Seafood',
    category: 'Makanan',
    price: 24000,
    jastipFee: 4000,
    storeName: 'Kedai Nasi Goreng Merah Alauddin',
    storeLocation: 'Jl. Sultan Alauddin Depan Pintu 2',
    image: imgNasiGorengMerah,
    estimatedWeightKg: 0.45,
    available: true
  },
  {
    id: 'CAT-008',
    name: 'Songkolo Bagadang Ikan Teri & Serundeng Gurih',
    category: 'Makanan',
    price: 15000,
    jastipFee: 3000,
    storeName: 'Songkolo Bagadang 24 Jam Talasalapang',
    storeLocation: 'Jl. Talasalapang Blok C No. 2',
    image: imgSongkolo,
    estimatedWeightKg: 0.35,
    available: true
  },
  {
    id: 'CAT-009',
    name: 'Nasi Padang Rendang Daging Sapi Komplit',
    category: 'Makanan',
    price: 25000,
    jastipFee: 4000,
    storeName: 'RM Padang Salero Bundo Alauddin',
    storeLocation: 'Jl. Sultan Alauddin No. 92',
    image: imgNasiPadang,
    estimatedWeightKg: 0.5,
    available: true
  },
  {
    id: 'CAT-010',
    name: 'Ayam Bakar Madu Pedas Manis + Lalapan Sambal',
    category: 'Makanan',
    price: 22000,
    jastipFee: 4000,
    storeName: 'Ayam Bakar Wong Solo Alauddin',
    storeLocation: 'Jl. Sultan Alauddin Dekat SPBU',
    image: imgAyamBakarMadu,
    estimatedWeightKg: 0.45,
    available: true
  },
  {
    id: 'CAT-011',
    name: 'Bebek Goreng Kremes Renyah + Sambal Korek Ijo',
    category: 'Makanan',
    price: 29000,
    jastipFee: 4500,
    storeName: 'Bebek Kremes Mas Budi Alauddin',
    storeLocation: 'Jl. Sultan Alauddin No. 110',
    image: imgBebekKremes,
    estimatedWeightKg: 0.5,
    available: true
  },
  {
    id: 'CAT-012',
    name: 'Bakso Urat Jumbo & Tahu Bakso Kuah Gurih',
    category: 'Makanan',
    price: 18000,
    jastipFee: 3500,
    storeName: 'Bakso Urat Mas Bro Talasalapang',
    storeLocation: 'Jl. Talasalapang Depan Kos Pelangi',
    image: imgBaksoUrat,
    estimatedWeightKg: 0.55,
    available: true
  },
  {
    id: 'CAT-013',
    name: 'Mie Goreng Spesial Telur & Sayur Segar',
    category: 'Makanan',
    price: 17000,
    jastipFee: 3000,
    storeName: 'Warung Mie & Nasi Goreng Barokah',
    storeLocation: 'Jl. Sultan Alauddin Lorong 3',
    image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.4,
    available: true
  },
  {
    id: 'CAT-014',
    name: 'Rice Bowl Chicken Teriyaki Mayo + Nasi',
    category: 'Makanan',
    price: 23000,
    jastipFee: 3500,
    storeName: 'Katsu & Bowl Corner Alauddin',
    storeLocation: 'Jl. Sultan Alauddin Samping Kampus Unismuh',
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.38,
    available: true
  },
  {
    id: 'CAT-015',
    name: 'Burger Daging Sapi Keju Double Patty Melt',
    category: 'Makanan',
    price: 25000,
    jastipFee: 3500,
    storeName: 'Burger Corner Talasalapang',
    storeLocation: 'Jl. Talasalapang No. 24',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.35,
    available: true
  },
  {
    id: 'CAT-016',
    name: 'Kebab Turki Daging Sapi Komplit Keju Mayo',
    category: 'Makanan',
    price: 20000,
    jastipFee: 3000,
    storeName: 'Kebab Baba Rafi Alauddin',
    storeLocation: 'Jl. Sultan Alauddin Pintu 1 Unismuh',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.3,
    available: true
  },
  {
    id: 'CAT-017',
    name: 'Martabak Telur Spesial Daging Sapi Cincang',
    category: 'Makanan',
    price: 32000,
    jastipFee: 4500,
    storeName: 'Martabak & Terang Bulan Bangka Alauddin',
    storeLocation: 'Jl. Sultan Alauddin No. 78',
    image: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.6,
    available: true
  },
  {
    id: 'CAT-018',
    name: 'Dimsum Mentai Panggang Saus Mayo (Isi 6 Pcs)',
    category: 'Makanan',
    price: 24000,
    jastipFee: 3500,
    storeName: 'Dimsum House Talasalapang',
    storeLocation: 'Jl. Talasalapang No. 12',
    image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.32,
    available: true
  },
  {
    id: 'CAT-019',
    name: 'Nasi Kulit Ayam Krispi Gurih Sambal Bawang',
    category: 'Makanan',
    price: 18000,
    jastipFee: 3000,
    storeName: 'Warung Kulit Syahdu Alauddin',
    storeLocation: 'Jl. Sultan Alauddin Pintu 2',
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.35,
    available: true
  },
  {
    id: 'CAT-020',
    name: 'Sate Ayam Madura Bumbu Kacang Kental (10 Tusuk)',
    category: 'Makanan',
    price: 22000,
    jastipFee: 3500,
    storeName: 'Sate Madura Cak Sholeh Alauddin',
    storeLocation: 'Jl. Sultan Alauddin Dekat Pojok Kuliner',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.4,
    available: true
  },

  // --- KATEGORI MINUMAN (21 - 30) ---
  {
    id: 'CAT-021',
    name: 'Es Kopi Susu Gula Aren Racik Kampus (Ice)',
    category: 'Minuman',
    price: 15000,
    jastipFee: 3000,
    storeName: 'Kedai Kopi & Toast Talasalapang',
    storeLocation: 'Jl. Talasalapang No. 15 (Dekat Unismuh)',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.35,
    available: true
  },
  {
    id: 'CAT-022',
    name: 'Es Pisang Ijo Khas Makassar Manis Segar',
    category: 'Minuman',
    price: 14000,
    jastipFee: 3000,
    storeName: 'Pisang Ijo & Aneka Jus Alauddin',
    storeLocation: 'Jl. Sultan Alauddin Pintu 2 Unismuh',
    image: imgEsPisangIjo,
    estimatedWeightKg: 0.45,
    available: true
  },
  {
    id: 'CAT-023',
    name: 'Es Teh Manis Jumbo Segar Dingin (Cup 22oz)',
    category: 'Minuman',
    price: 5000,
    jastipFee: 2000,
    storeName: 'Es Teh Indonesia Stand Pintu 1',
    storeLocation: 'Jl. Sultan Alauddin Gerbang Pintu 1',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.5,
    available: true
  },
  {
    id: 'CAT-024',
    name: 'Jus Alpukat Kental Coklat Creamy (500ml)',
    category: 'Minuman',
    price: 15000,
    jastipFee: 3000,
    storeName: 'Aneka Jus Segar Buah Sehat Talasalapang',
    storeLocation: 'Jl. Talasalapang No. 3',
    image: imgJusAlpukat,
    estimatedWeightKg: 0.5,
    available: true
  },
  {
    id: 'CAT-025',
    name: 'Brown Sugar Boba Fresh Milk Dingin',
    category: 'Minuman',
    price: 18000,
    jastipFee: 3000,
    storeName: 'Boba Time Alauddin',
    storeLocation: 'Jl. Sultan Alauddin No. 132',
    image: imgBrownSugarBoba,
    estimatedWeightKg: 0.4,
    available: true
  },
  {
    id: 'CAT-026',
    name: 'Matcha Green Tea Latte Creamy Ice',
    category: 'Minuman',
    price: 18000,
    jastipFee: 3000,
    storeName: 'Kopi & Matcha Bar Talasalapang',
    storeLocation: 'Jl. Talasalapang Blok B',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.38,
    available: true
  },
  {
    id: 'CAT-027',
    name: 'Thai Tea Original Susu Kental Manis Segar',
    category: 'Minuman',
    price: 12000,
    jastipFee: 2500,
    storeName: 'Thai Tea Corner Pintu 2 Unismuh',
    storeLocation: 'Jl. Sultan Alauddin Pintu 2',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.4,
    available: true
  },
  {
    id: 'CAT-028',
    name: 'Minuman Sarabba Jahe Hangat Susu Khas Bugis',
    category: 'Minuman',
    price: 13000,
    jastipFee: 3000,
    storeName: 'Warung Sarabba & Pisang Goreng Alauddin',
    storeLocation: 'Jl. Sultan Alauddin No. 65',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.35,
    available: true
  },
  {
    id: 'CAT-029',
    name: 'Air Mineral Botol 1500ml (Dingin / Normal)',
    category: 'Minuman',
    price: 6000,
    jastipFee: 2000,
    storeName: 'Minimarket Barokah Alauddin',
    storeLocation: 'Jl. Sultan Alauddin Seberang Unismuh',
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 1.5,
    available: true
  },
  {
    id: 'CAT-030',
    name: 'Es Teler Spesial Nangka, Kelapa Muda & Alpukat',
    category: 'Minuman',
    price: 16000,
    jastipFee: 3000,
    storeName: 'Es Teler 77 Cabang Talasalapang',
    storeLocation: 'Jl. Talasalapang No. 19',
    image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.45,
    available: true
  },

  // --- KATEGORI ATK & CETAK (31 - 38) ---
  {
    id: 'CAT-031',
    name: 'Cetak Print Tugas / Jilid Skripsi & Kertas A4',
    category: 'ATK & Cetak',
    price: 18000,
    jastipFee: 3000,
    storeName: 'Percetakan & Fotocopy Amanah Unismuh',
    storeLocation: 'Jl. Sultan Alauddin Samping Kampus Unismuh',
    image: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.3,
    available: true
  },
  {
    id: 'CAT-032',
    name: 'Jilid Hardcover Skripsi / Tesis Emboss Emas',
    category: 'ATK & Cetak',
    price: 35000,
    jastipFee: 5000,
    storeName: 'Percetakan Prima Offset Alauddin',
    storeLocation: 'Jl. Sultan Alauddin No. 102',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.65,
    available: true
  },
  {
    id: 'CAT-033',
    name: 'Buku Catatan Grid / Binder Kuliah B5 & Pulpen Gel',
    category: 'ATK & Cetak',
    price: 22000,
    jastipFee: 3000,
    storeName: 'Toko ATK & Alat Tulis Mahasiswa Alauddin',
    storeLocation: 'Jl. Sultan Alauddin No. 89 (Dekat Unismuh)',
    image: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.25,
    available: true
  },
  {
    id: 'CAT-034',
    name: 'Kertas HVS A4 75gsm 1 Rim (500 Lembar)',
    category: 'ATK & Cetak',
    price: 52000,
    jastipFee: 6000,
    storeName: 'Grosir Kertas & ATK Alauddin',
    storeLocation: 'Jl. Sultan Alauddin No. 140',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 2.1,
    available: true
  },
  {
    id: 'CAT-035',
    name: 'Box Pulpen Gel Hitam 0.5mm (Isi 12 Pcs)',
    category: 'ATK & Cetak',
    price: 24000,
    jastipFee: 3000,
    storeName: 'Toko ATK & Alat Tulis Mahasiswa Alauddin',
    storeLocation: 'Jl. Sultan Alauddin No. 89',
    image: imgPulpenGel,
    estimatedWeightKg: 0.15,
    available: true
  },
  {
    id: 'CAT-036',
    name: 'Flashdisk Sandisk 32GB USB 3.0 Original',
    category: 'ATK & Cetak',
    price: 48000,
    jastipFee: 4000,
    storeName: 'Mitra Komputer & Aksesoris Alauddin',
    storeLocation: 'Jl. Sultan Alauddin No. 115',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.05,
    available: true
  },
  {
    id: 'CAT-037',
    name: 'Kalkulator Saintifik FX-991EX Mahasiswa',
    category: 'ATK & Cetak',
    price: 135000,
    jastipFee: 7000,
    storeName: 'Toko ATK & Elektronik Talasalapang',
    storeLocation: 'Jl. Talasalapang No. 4',
    image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.2,
    available: true
  },
  {
    id: 'CAT-038',
    name: 'Set Sticky Notes Pastel & 5 Warna Highlighter',
    category: 'ATK & Cetak',
    price: 19000,
    jastipFee: 2500,
    storeName: 'Stationery Corner Unismuh',
    storeLocation: 'Jl. Sultan Alauddin Gerbang Pintu 2',
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.15,
    available: true
  },

  // --- KATEGORI SNACK & KEBUTUHAN KOS (39 - 44) ---
  {
    id: 'CAT-039',
    name: 'Jalangkote Renyah Sambal Lombok Pedas (5 Pcs)',
    category: 'Snack & Kebutuhan Kos',
    price: 15000,
    jastipFee: 3000,
    storeName: 'Jalangkote & Lumpia Lasinrang Cab. Alauddin',
    storeLocation: 'Jl. Sultan Alauddin No. 55',
    image: imgJalangkote,
    estimatedWeightKg: 0.35,
    available: true
  },
  {
    id: 'CAT-040',
    name: 'Roti Maryam Coklat Keju Lumer (Isi 3 Pcs)',
    category: 'Snack & Kebutuhan Kos',
    price: 16000,
    jastipFee: 3000,
    storeName: 'Roti Maryam & Canai Talasalapang',
    storeLocation: 'Jl. Talasalapang No. 22',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.3,
    available: true
  },
  {
    id: 'CAT-041',
    name: 'Keripik Singkong Pedas Gurih Morang Moreng (250g)',
    category: 'Snack & Kebutuhan Kos',
    price: 14000,
    jastipFee: 2500,
    storeName: 'Toko Oleh-oleh & Snack Alauddin',
    storeLocation: 'Jl. Sultan Alauddin Pintu 1',
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.28,
    available: true
  },
  {
    id: 'CAT-042',
    name: 'Sabun Mandi & Shampo Refill Kebutuhan Kos',
    category: 'Snack & Kebutuhan Kos',
    price: 28000,
    jastipFee: 3500,
    storeName: 'Minimarket 24 Jam Alauddin',
    storeLocation: 'Jl. Sultan Alauddin Dekat Unismuh',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.6,
    available: true
  },
  {
    id: 'CAT-043',
    name: 'Paket Mi Instan Aneka Rasa Goreng/Kuah (5 Bungkus)',
    category: 'Snack & Kebutuhan Kos',
    price: 16000,
    jastipFee: 3000,
    storeName: 'Toko Kelontong Berkah Talasalapang',
    storeLocation: 'Jl. Talasalapang Blok A',
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.45,
    available: true
  },
  {
    id: 'CAT-044',
    name: 'Minyak Kayu Putih 120ml & Tolak Angin Box',
    category: 'Snack & Kebutuhan Kos',
    price: 32000,
    jastipFee: 3500,
    storeName: 'Apotek Sehat Alauddin',
    storeLocation: 'Jl. Sultan Alauddin No. 70',
    image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.25,
    available: true
  },

  // --- KATEGORI KOMPONEN & ALAT LAB (45 - 50) ---
  {
    id: 'CAT-045',
    name: 'Modul Praktikum / Sensor Kit & Kabel Jumper Lab',
    category: 'Komponen & Alat Lab',
    price: 45000,
    jastipFee: 5000,
    storeName: 'Toko Komponen & Modul Dekat Kampus',
    storeLocation: 'Jl. Talasalapang Blok A (Sekitar Unismuh)',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.3,
    available: true
  },
  {
    id: 'CAT-046',
    name: 'Mikrokontroler NodeMCU ESP32 Wi-Fi Bluetooth',
    category: 'Komponen & Alat Lab',
    price: 58000,
    jastipFee: 5000,
    storeName: 'Robotika & Elektro Store Alauddin',
    storeLocation: 'Jl. Sultan Alauddin No. 136',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.1,
    available: true
  },
  {
    id: 'CAT-047',
    name: 'Multimeter Digital Auto-Ranging DT-9205A',
    category: 'Komponen & Alat Lab',
    price: 75000,
    jastipFee: 6000,
    storeName: 'Toko Alat Teknik & Instrumentasi Alauddin',
    storeLocation: 'Jl. Sultan Alauddin No. 142',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.4,
    available: true
  },
  {
    id: 'CAT-048',
    name: 'Solder Listrik 60W Adjustable + Timah Gulung 10m',
    category: 'Komponen & Alat Lab',
    price: 42000,
    jastipFee: 4500,
    storeName: 'Toko Komponen & Modul Dekat Kampus',
    storeLocation: 'Jl. Talasalapang Blok A',
    image: imgSolderListrik,
    estimatedWeightKg: 0.35,
    available: true
  },
  {
    id: 'CAT-049',
    name: 'Breadboard 830 Titik + 65 Pcs Kabel Jumper Male',
    category: 'Komponen & Alat Lab',
    price: 32000,
    jastipFee: 4000,
    storeName: 'Robotika & Elektro Store Alauddin',
    storeLocation: 'Jl. Sultan Alauddin No. 136',
    image: 'https://images.unsplash.com/photo-1517055729445-fa7d27394b48?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.2,
    available: true
  },
  {
    id: 'CAT-050',
    name: 'Tang Kupas Kabel & Set Obeng Presisi Lab Mahasiswa',
    category: 'Komponen & Alat Lab',
    price: 38000,
    jastipFee: 4500,
    storeName: 'Toko Perkakas & Lab Alauddin',
    storeLocation: 'Jl. Sultan Alauddin No. 85',
    image: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=600&auto=format&fit=crop&q=80',
    estimatedWeightKg: 0.35,
    available: true
  }
];

export const MOCK_SESSIONS: JastipSession[] = [
  {
    id: 'SES-UNISMUH-01',
    jastiperName: 'Andi Muhammad Fikri',
    jastiperProdi: 'Mahasiswa Unismuh (Angkatan 2023)',
    jastiperAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    routeFrom: 'Sentra Kuliner Pintu 1 & Jl. Sultan Alauddin',
    routeTo: 'Gedung Menara Iqra & Kampus Unismuh',
    meetingPoint: 'Lobby Menara Iqra Unismuh (Depan Pojok Baca)',
    departureTime: '12:00 WITA',
    closingTime: '11:30 WITA',
    closingTimestamp: Date.now() + 28 * 60 * 1000,
    maxCapacityKg: 5.0,
    currentCapacityKg: 3.1,
    maxOrders: 8,
    currentOrders: 5,
    status: 'OPEN',
    availableStores: ['Ayam Geprek Master Alauddin', 'Coto Daeng Alauddin Pintu 1', 'Pisang Ijo & Aneka Jus Alauddin']
  },
  {
    id: 'SES-UNISMUH-02',
    jastiperName: 'Nurul Mutmainnah',
    jastiperProdi: 'Mahasiswa Unismuh (Angkatan 2022)',
    jastiperAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    routeFrom: 'Kawasan Talasalapang & Minasa Upa (Sekitar Unismuh)',
    routeTo: 'Gedung Kuliah & Gazebo Utama Unismuh',
    meetingPoint: 'Gazebo Utama Kampus Unismuh Makassar',
    departureTime: '13:00 WITA',
    closingTime: '12:30 WITA',
    closingTimestamp: Date.now() + 85 * 60 * 1000,
    maxCapacityKg: 6.0,
    currentCapacityKg: 2.1,
    maxOrders: 10,
    currentOrders: 3,
    status: 'OPEN',
    availableStores: ['Kedai Kopi & Toast Talasalapang', 'Warung Nasi Kuning Begadang Alauddin', 'Toko Komponen & Modul Dekat Kampus']
  },
  {
    id: 'SES-UNISMUH-03',
    jastiperName: 'Fajar Pratama',
    jastiperProdi: 'Mahasiswa Unismuh (Angkatan 2021)',
    jastiperAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    routeFrom: 'Sentra Percetakan & Fotocopy Jl. Sultan Alauddin',
    routeTo: 'Gedung Menara Iqra & Ruang Belajar Unismuh',
    meetingPoint: 'Lobby Gedung Lab Terpadu Unismuh Makassar',
    departureTime: '14:30 WITA',
    closingTime: '14:00 WITA',
    closingTimestamp: Date.now() + 175 * 60 * 1000,
    maxCapacityKg: 4.5,
    currentCapacityKg: 3.8,
    maxOrders: 6,
    currentOrders: 4,
    status: 'CLOSING_SOON',
    availableStores: ['Percetakan & Fotocopy Amanah Unismuh', 'Toko ATK & Alat Tulis Mahasiswa Alauddin']
  }
];

export const MOCK_STUDENT_ACCOUNTS: StudentAccount[] = [
  {
    id: 'MHS-01',
    nim: '105841104423',
    name: 'Ahmad Fauzan',
    email: '105841104423@student.unismuh.ac.id',
    faculty: 'Fakultas Teknik',
    prodi: 'S1 Teknik Elektro',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '0812-9888-8801',
    role: 'mahasiswa',
    balance: 150000,
    verifiedStatus: 'TERVERIFIKASI_KAMPUS',
    totalOrders: 12,
    rating: 5.0,
    joinedYear: '2023'
  },
  {
    id: 'MHS-02',
    nim: '105841103322',
    name: 'Andi Muhammad Fikri',
    email: '105841103322@student.unismuh.ac.id',
    faculty: 'Fakultas Teknik',
    prodi: 'S1 Teknik Informatika',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    phone: '0852-4411-3322',
    role: 'jastiper',
    balance: 285000,
    verifiedStatus: 'TERVERIFIKASI_KAMPUS',
    totalOrders: 38,
    rating: 4.9,
    joinedYear: '2023'
  },
  {
    id: 'MHS-03',
    nim: '105841102211',
    name: 'Nurul Mutmainnah',
    email: '105841102211@student.unismuh.ac.id',
    faculty: 'Fakultas Kedokteran & Ilmu Kesehatan',
    prodi: 'S1 Farmasi',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    phone: '0821-5522-1100',
    role: 'jastiper',
    balance: 195000,
    verifiedStatus: 'TERVERIFIKASI_KAMPUS',
    totalOrders: 29,
    rating: 4.8,
    joinedYear: '2022'
  }
];

export const PAYMENT_METHODS_DATA: PaymentMethodOption[] = [
  {
    id: 'QRIS_UNISMUH',
    name: 'QRIS Unismuh Pay (Instan)',
    category: 'QRIS',
    description: 'Scan QRIS otomatis dari semua M-Banking (BSI, BRI, BCA, Mandiri) & E-Wallet.',
    badge: 'Paling Populer & Otomatis',
    iconType: 'QrCode'
  },
  {
    id: 'CASH_COD',
    name: 'Tunai / Cash on Delivery (COD)',
    category: 'CASH',
    description: 'Bayar tunai dengan uang pas saat serah terima barang langsung dengan jastiper di kampus.',
    badge: 'Bayar Langsung di Tempat',
    iconType: 'Banknote'
  },
  {
    id: 'WALLET_UNISMUH',
    name: 'Saldo Dompet Jastip Unismuh',
    category: 'SALDO',
    description: 'Bayar instan 1-klik langsung dari saldo akun terverifikasi kampus Anda.',
    badge: 'Bebas Admin & Instan',
    iconType: 'Wallet'
  },
  {
    id: 'GOPAY',
    name: 'GoPay / GoPay Coins',
    category: 'E-WALLET',
    description: 'Pembayaran digital cepat via GoPay app.',
    badge: 'E-Wallet',
    iconType: 'Smartphone'
  },
  {
    id: 'SHOPEEPAY',
    name: 'ShopeePay',
    category: 'E-WALLET',
    description: 'Pembayaran digital via saldo ShopeePay.',
    badge: 'E-Wallet',
    iconType: 'Smartphone'
  },
  {
    id: 'OVO',
    name: 'OVO Cash',
    category: 'E-WALLET',
    description: 'Pembayaran praktis dengan nomor HP OVO terdaftar.',
    badge: 'E-Wallet',
    iconType: 'Smartphone'
  },
  {
    id: 'DANA',
    name: 'DANA Dompet Digital',
    category: 'E-WALLET',
    description: 'Transaksi aman lewat akun DANA Indonesia.',
    badge: 'E-Wallet',
    iconType: 'Smartphone'
  },
  {
    id: 'VA_BSI',
    name: 'Virtual Account Bank BSI (Bank Syariah Indonesia)',
    category: 'VIRTUAL_ACCOUNT',
    description: 'Mitra Perbankan Utama Kampus Unismuh Makassar. Nomor VA: 9888 + NIM Mahasiswa.',
    badge: 'Mitra Resmi Unismuh',
    iconType: 'Building2',
    accountNumber: '9888105841104423'
  },
  {
    id: 'VA_BRI',
    name: 'Virtual Account Bank BRI (BRIVA)',
    category: 'VIRTUAL_ACCOUNT',
    description: 'Transfer otomatis via ATM BRI, Agen BRILink, atau BRImo.',
    badge: 'Virtual Account',
    iconType: 'Building2',
    accountNumber: '7001210584110442'
  },
  {
    id: 'VA_MANDIRI',
    name: 'Virtual Account Bank Mandiri (Livin)',
    category: 'VIRTUAL_ACCOUNT',
    description: 'Transfer via aplikasi Livin by Mandiri atau ATM Mandiri.',
    badge: 'Virtual Account',
    iconType: 'Building2',
    accountNumber: '8870810584110442'
  }
];

export const INITIAL_DEMO_ORDER: JastipOrder = {
  id: 'ORD-20260821-009',
  orderCode: 'JSTP-UNISMUH-8841',
  customerName: 'Ahmad Fauzan',
  customerProdi: 'S1 Teknik Elektro (105841104423)',
  sessionId: 'SES-UNISMUH-01',
  items: [
    { item: MOCK_CATALOG_ITEMS[0], qty: 1 }, // Ayam Geprek
    { item: MOCK_CATALOG_ITEMS[20], qty: 1 }  // Es Kopi Susu
  ],
  totalItemPrice: 35000,
  totalJastipFee: 7000,
  appFee: 1000,
  grandTotal: 43000,
  paymentMethod: 'QRIS_UNISMUH',
  paymentMethodLabel: 'QRIS Unismuh Pay (Instan)',
  status: 'MENUJU_KAMPUS',
  meetingPoint: 'Lobby Menara Iqra Unismuh Makassar',
  createdAt: '11:15 WITA',
  escrowStatus: 'HELD_IN_ESCROW',
  trackingHistory: [
    {
      step: '1. Buka Order & Titipan Dibuat',
      timestamp: '11:15 WITA',
      note: 'Mahasiswa memilih item di warung sekitar Unismuh dan menyepakati ongkos jastip.',
      done: true
    },
    {
      step: '2. Bayar ke Rekening Bersama (Escrow)',
      timestamp: '11:18 WITA',
      note: 'Payment-Service mengamankan dana Rp 43.000 via QRIS Unismuh Pay dalam rekening bersama (Escrow).',
      done: true
    },
    {
      step: '3. Order Dikunci (Closing Time Locked)',
      timestamp: '11:30 WITA',
      note: 'Order-Service mengunci slot sesi Jastiper Andi M. Fikri (Maksimal 5.0 kg).',
      done: true
    },
    {
      step: '4. Barang Selesai Dibelikan di Toko/Warung',
      timestamp: '11:50 WITA',
      note: 'Jastiper membelikan pesanan di warung sekitar Jl. Sultan Alauddin sesuai pesanan.',
      done: true
    },
    {
      step: '5. Lacak: Jastiper Menuju Kampus',
      timestamp: '12:05 WITA',
      note: 'Tracking-Service mencatat posisi jastiper di depan Gerbang Pintu 1 Unismuh (ETA 3 menit).',
      done: true
    },
    {
      step: '6. Serah Terima & Saldo Dicairkan',
      timestamp: '12:15 WITA (Estimasi)',
      note: 'Pemesan scan QR fisik di titik temu kampus untuk verifikasi dan pelepasan saldo ke jastiper.',
      done: false
    }
  ]
};
