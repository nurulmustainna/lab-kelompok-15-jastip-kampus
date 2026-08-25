export type MicroserviceId = 'order-service' | 'catalog-service' | 'payment-service' | 'tracking-service';

export interface ServiceEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description: string;
  requestExample?: Record<string, any>;
  responseExample: Record<string, any>;
}

export interface MicroserviceInfo {
  id: MicroserviceId;
  name: string;
  badge: string;
  color: string;
  iconName: string;
  port: number;
  database: string;
  techStack: string[];
  description: string;
  responsibilities: string[];
  publishedEvents: string[];
  subscribedEvents: string[];
  endpoints: ServiceEndpoint[];
  samplePayload: {
    event: string;
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'PATCH';
    body: Record<string, any>;
  };
}

export interface CatalogItem {
  id: string;
  name: string;
  category: 'Makanan' | 'Minuman' | 'Kue & Cemilan' | 'ATK & Buku' | 'ATK & Cetak' | 'Merchandise Unismuh' | 'Snack & Kebutuhan Kos' | 'Komponen & Alat Lab' | string;
  price: number;
  jastipFee: number;
  storeName: string;
  storeLocation?: string;
  location?: string;
  image: string;
  estimatedWeightKg?: number;
  available: boolean;
  rating?: number;
  soldCount?: number;
  description?: string;
}

export interface JastipSession {
  id: string;
  jastiperName: string;
  jastiperProdi: string;
  jastiperAvatar: string;
  routeFrom: string;
  routeTo: string;
  meetingPoint: string;
  departureTime: string;
  closingTime: string;
  closingTimestamp: number;
  maxCapacityKg: number;
  currentCapacityKg: number;
  maxOrders: number;
  currentOrders: number;
  status: 'OPEN' | 'CLOSING_SOON' | 'CLOSED' | 'ON_DELIVERY' | 'COMPLETED';
  availableStores: string[];
}

export type PaymentMethodType = 
  | 'QRIS_UNISMUH' 
  | 'WALLET_UNISMUH' 
  | 'CASH_COD'
  | 'GOPAY' 
  | 'SHOPEEPAY' 
  | 'OVO' 
  | 'DANA' 
  | 'VA_BSI' 
  | 'VA_BRI' 
  | 'VA_MANDIRI';

export interface PaymentMethodOption {
  id: PaymentMethodType;
  name: string;
  category: 'QRIS' | 'SALDO' | 'CASH' | 'E-WALLET' | 'VIRTUAL_ACCOUNT';
  description: string;
  badge?: string;
  iconType: string;
  accountNumber?: string;
}

export interface StudentAccount {
  id: string;
  nim: string;
  name: string;
  email: string;
  password: string;
  faculty: string;
  prodi: string;
  avatar: string;
  phone: string;
  role: 'mahasiswa' | 'jastiper' | 'admin';
  balance: number;
  verifiedStatus: 'TERVERIFIKASI_KAMPUS' | 'PENDING';
  totalOrders: number;
  rating?: number;
  joinedYear: string;
}

export interface JastipOrder {
  id: string;
  orderCode: string;
  customerName: string;
  customerProdi: string;
  sessionId: string;
  items: { item: CatalogItem; qty: number }[];
  totalItemPrice: number;
  totalJastipFee: number;
  appFee: number;
  grandTotal: number;
  paymentMethod?: PaymentMethodType;
  paymentMethodLabel?: string;
  status: 'MENUNGGU_PEMBAYARAN' | 'ESCROW_DITAMPUNG' | 'DIBELI_JASTIPER' | 'MENUJU_KAMPUS' | 'SAMPAI_DI_TITIK_TEMU' | 'SELESAI_DITERIMA';
  meetingPoint: string;
  createdAt: string;
  escrowStatus: 'PENDING' | 'HELD_IN_ESCROW' | 'RELEASED_TO_JASTIPER' | 'REFUNDED';
  assignedJastiperId?: string;
  assignedJastipername?: string;
  trackingHistory: {
    step: string;
    timestamp: string;
    note: string;
    done: boolean;
  }[];
}
