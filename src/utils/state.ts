import { UCOffer, UserAccount, OrderItem, Promotion, NewsPost, SystemNotification, CartItem } from '../types';
import { UC_OFFERS, INITIAL_PROMOTIONS, INITIAL_NEWS } from '../data';

// Helper to generate IDs
export const generateId = () => Math.random().toString(36).substring(2, 11);

// Safe localStorage wrapper to support environments where storage is blocked (e.g. Safari inside an iframe / Private Mode)
const memoryStorage: Record<string, string> = {};

const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn(`localStorage.getItem failed for key "${key}", using memory fallback:`, e);
      return memoryStorage[key] || null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`localStorage.setItem failed for key "${key}", using memory fallback:`, e);
      memoryStorage[key] = value;
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`localStorage.removeItem failed for key "${key}", using memory fallback:`, e);
      delete memoryStorage[key];
    }
  }
};

// Standard Local Storage keys
const KEYS = {
  OFFERS: 'gb_uc_offers_v1',
  PROMOTIONS: 'gb_uc_promotions_v1',
  NEWS: 'gb_uc_news_v1',
  USERS: 'gb_uc_users_v1',
  CURRENT_USER: 'gb_uc_current_user_v1',
  ORDERS: 'gb_uc_orders_v1',
  NOTIFICATIONS: 'gb_uc_notifications_v1',
};

// 1. OFFERS MANAGEMENT
export const getStoredOffers = (): UCOffer[] => {
  const data = safeLocalStorage.getItem(KEYS.OFFERS);
  if (!data) {
    safeLocalStorage.setItem(KEYS.OFFERS, JSON.stringify(UC_OFFERS));
    return UC_OFFERS;
  }
  return JSON.parse(data);
};

export const saveOffers = (offers: UCOffer[]) => {
  safeLocalStorage.setItem(KEYS.OFFERS, JSON.stringify(offers));
};

// 2. PROMOTIONS MANAGEMENT
export const getStoredPromotions = (): Promotion[] => {
  const data = safeLocalStorage.getItem(KEYS.PROMOTIONS);
  if (!data) {
    safeLocalStorage.setItem(KEYS.PROMOTIONS, JSON.stringify(INITIAL_PROMOTIONS));
    return INITIAL_PROMOTIONS;
  }
  try {
    const list: Promotion[] = JSON.parse(data);
    let updated = false;
    const merged = [...list];
    for (const initial of INITIAL_PROMOTIONS) {
      if (!merged.some(item => item.id === initial.id)) {
        merged.unshift(initial);
        updated = true;
      }
    }
    if (updated) {
      safeLocalStorage.setItem(KEYS.PROMOTIONS, JSON.stringify(merged));
    }
    return merged;
  } catch (e) {
    return INITIAL_PROMOTIONS;
  }
};

export const savePromotions = (promotions: Promotion[]) => {
  safeLocalStorage.setItem(KEYS.PROMOTIONS, JSON.stringify(promotions));
};

// 3. NEWS POSTS MANAGEMENT
export const getStoredNews = (): NewsPost[] => {
  const data = safeLocalStorage.getItem(KEYS.NEWS);
  if (!data) {
    safeLocalStorage.setItem(KEYS.NEWS, JSON.stringify(INITIAL_NEWS));
    return INITIAL_NEWS;
  }
  try {
    const list: NewsPost[] = JSON.parse(data);
    let updated = false;
    const merged = [...list];
    for (const initial of INITIAL_NEWS) {
      if (!merged.some(item => item.id === initial.id)) {
        merged.unshift(initial);
        updated = true;
      }
    }
    if (updated) {
      safeLocalStorage.setItem(KEYS.NEWS, JSON.stringify(merged));
    }
    return merged;
  } catch (e) {
    return INITIAL_NEWS;
  }
};

export const saveNews = (news: NewsPost[]) => {
  safeLocalStorage.setItem(KEYS.NEWS, JSON.stringify(news));
};

// 4. USERS MANAGEMENT
export const getStoredUsers = (): UserAccount[] => {
  const data = safeLocalStorage.getItem(KEYS.USERS);
  if (!data) {
    const adminUser: UserAccount = {
      id: 'admin_user',
      name: 'Administrateur GB STORES',
      email: 'admin@gbstores.com',
      phone: '+22676549737',
      pubgId: '99999999',
      referralCode: 'GBADMIN',
      referrals: [],
      joinedDate: new Date().toLocaleDateString('fr-FR'),
      orders: [],
      isAdmin: true
    };
    const testReseller: UserAccount = {
      id: 'reseller_user',
      name: 'Revendeur Officiel GB',
      email: 'reseller@gbstores.com',
      phone: '+22670000000',
      pubgId: '12345678',
      referralCode: 'GBRES1',
      referrals: [],
      joinedDate: new Date().toLocaleDateString('fr-FR'),
      orders: [],
      isAdmin: false,
      resellerStatus: 'active',
      resellerCommissionRate: 8,
      resellerEarnings: 4500,
      resellerSalesCount: 12,
      resellerSales: [
        {
          id: 'sale_1',
          orderId: 'ORD-9A2E',
          buyerName: 'Adama Traoré',
          ucAmount: 325,
          totalPrice: 4500,
          commissionEarned: 360,
          date: '24/06/2026',
          status: 'completed'
        },
        {
          id: 'sale_2',
          orderId: 'ORD-5B4F',
          buyerName: 'Issouf Barry',
          ucAmount: 660,
          totalPrice: 9000,
          commissionEarned: 720,
          date: '25/06/2026',
          status: 'completed'
        }
      ]
    };
    safeLocalStorage.setItem(KEYS.USERS, JSON.stringify([adminUser, testReseller]));
    return [adminUser, testReseller];
  }
  return JSON.parse(data);
};

export const saveUsers = (users: UserAccount[]) => {
  safeLocalStorage.setItem(KEYS.USERS, JSON.stringify(users));
};

// 5. CURRENT LOGGED IN USER
export const getStoredCurrentUser = (): UserAccount | null => {
  const data = safeLocalStorage.getItem(KEYS.CURRENT_USER);
  if (!data) return null;
  return JSON.parse(data);
};

export const saveCurrentUser = (user: UserAccount | null) => {
  if (user) {
    safeLocalStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    // Synchronize in the global list
    const users = getStoredUsers();
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      users[idx] = user;
    } else {
      users.push(user);
    }
    saveUsers(users);
  } else {
    safeLocalStorage.removeItem(KEYS.CURRENT_USER);
  }
};

// 6. ORDERS MANAGEMENT
export const getStoredOrders = (): OrderItem[] => {
  const data = safeLocalStorage.getItem(KEYS.ORDERS);
  if (!data) return [];
  return JSON.parse(data);
};

export const saveOrders = (orders: OrderItem[]) => {
  safeLocalStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
};

// 7. SYSTEM NOTIFICATIONS
export const getStoredNotifications = (): SystemNotification[] => {
  const data = safeLocalStorage.getItem(KEYS.NOTIFICATIONS);
  if (!data) {
    const welcomeNotif: SystemNotification = {
      id: 'welcome_notif',
      title: 'Bienvenue sur GB STORES UC !',
      message: 'Rechargez vos UC PUBG MOBILE de manière rapide, fiable et 100% sécurisée au Burkina Faso.',
      date: new Date().toLocaleDateString('fr-FR'),
      read: false
    };
    safeLocalStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify([welcomeNotif]));
    return [welcomeNotif];
  }
  return JSON.parse(data);
};

export const saveNotifications = (notifications: SystemNotification[]) => {
  safeLocalStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifications));
};
