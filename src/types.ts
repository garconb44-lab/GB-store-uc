export interface UCOffer {
  id: string;
  ucAmount: number;
  bonusUc: number;
  priceFcfa: number;
  isPopular?: boolean;
  tag?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  displayName: string;
  number: string;
  recipientName: string;
  instructions: string;
  colorClass: string;
  iconName: 'orange' | 'moov' | 'wave';
}

export interface RecentTransaction {
  id: string;
  playerId: string;
  ucAmount: number;
  bonusUc: number;
  paymentMethod: string;
  timeAgo: string;
  status: 'completed' | 'processing';
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'payment' | 'delivery';
}

export interface CartItem {
  offer: UCOffer;
  quantity: number;
}

export interface ResellerSaleItem {
  id: string;
  orderId: string;
  buyerName: string;
  ucAmount: number;
  totalPrice: number;
  commissionEarned: number;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  pubgId: string;
  referralCode: string;
  referredBy?: string;
  referrals: string[]; // List of user IDs referred
  joinedDate: string;
  orders: OrderItem[];
  isAdmin?: boolean;
  // Reseller and Partner specifications
  resellerStatus?: 'none' | 'pending' | 'active' | 'rejected';
  resellerCommissionRate?: number; // e.g. 5 for 5%
  resellerEarnings?: number; // total FCFA earned
  resellerSalesCount?: number;
  partnerTypeRequested?: 'reseller' | 'partner' | 'team';
  partnerApplicationMessage?: string;
  resellerSales?: ResellerSaleItem[];
}

export interface OrderItem {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  pubgId: string;
  offer: UCOffer;
  quantity: number;
  priceTotal: number;
  paymentMethod: string;
  screenshotUrl?: string; // base64 or placeholder
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  badge: string;
  bonusText?: string;
  image?: string;
  active: boolean;
  date: string;
}

export interface NewsPost {
  id: string;
  title: string;
  description: string;
  image?: string;
  videoUrl?: string;
  type: 'announcement' | 'image' | 'video' | 'promo';
  date: string;
  active: boolean;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  userId?: string; // empty means all users
}

export interface LeaderboardUser {
  name: string;
  referralCode: string;
  referralCount: number;
  rewardCoins: number;
}

