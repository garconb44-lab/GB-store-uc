import React, { useState, useEffect } from 'react';
import { 
  UCOffer, CartItem, UserAccount, OrderItem, Promotion, NewsPost, 
  SystemNotification 
} from './types';
import { 
  getStoredOffers, saveOffers,
  getStoredPromotions, savePromotions,
  getStoredNews, saveNews,
  getStoredUsers, saveUsers,
  getStoredCurrentUser, saveCurrentUser,
  getStoredOrders, saveOrders,
  getStoredNotifications, saveNotifications,
  generateId
} from './utils/state';
import { PAYMENT_METHODS } from './data';

// Component Imports
import Navigation from './components/Navigation';
import HomeView from './components/HomeView';
import OffersView from './components/OffersView';
import PromotionsView from './components/PromotionsView';
import NewsView from './components/NewsView';
import CartView from './components/CartView';
import AccountView from './components/AccountView';
import ReferralView from './components/ReferralView';
import ContactView from './components/ContactView';
import FaqView from './components/FaqView';
import AboutView from './components/AboutView';
import AdminPanel from './components/AdminPanel';
import PartnerView from './components/PartnerView';
import Footer from './components/Footer';

import { motion, AnimatePresence } from 'motion/react';
import { Check, ShieldAlert } from 'lucide-react';

export default function App() {
  // Global synchronized states
  const [offers, setOffers] = useState<UCOffer[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [news, setNews] = useState<NewsPost[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  
  // Local state
  const [activeTab, setActiveTab] = useState<string>('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // PWA installation states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  // Hydrate states on load
  useEffect(() => {
    setOffers(getStoredOffers());
    setPromotions(getStoredPromotions());
    setNews(getStoredNews());
    setUsers(getStoredUsers());
    setCurrentUser(getStoredCurrentUser());
    setOrders(getStoredOrders());
    setNotifications(getStoredNotifications());

    // Register PWA installation listeners
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      triggerToast("🎉 Application installée avec succès ! Retrouvez-la sur votre écran d'accueil.");
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check if running as PWA (standalone display mode)
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) {
      triggerToast("ℹ️ Ouvrez l'application sur Google Chrome, Edge ou Safari sur votre mobile pour l'installer.");
      return;
    }
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`PWA user choice outcome: ${outcome}`);
      setDeferredPrompt(null);
      setIsInstallable(false);
    } catch (err) {
      console.error("Installation prompt failed:", err);
    }
  };

  // Sync state modifications back to local storage
  const handleUpdateOffers = (newOffers: UCOffer[]) => {
    setOffers(newOffers);
    saveOffers(newOffers);
  };

  const handleUpdatePromotions = (newPromotions: Promotion[]) => {
    setPromotions(newPromotions);
    savePromotions(newPromotions);
  };

  const handleUpdateNews = (newNews: NewsPost[]) => {
    setNews(newNews);
    saveNews(newNews);
  };

  const handleUpdateUsers = (newUsers: UserAccount[]) => {
    setUsers(newUsers);
    saveUsers(newUsers);
  };

  const handleUpdateOrders = (newOrders: OrderItem[]) => {
    setOrders(newOrders);
    saveOrders(newOrders);
  };

  const handleUpdateNotifications = (newNotifications: SystemNotification[]) => {
    setNotifications(newNotifications);
    saveNotifications(newNotifications);
  };

  // --- CART WORKFLOWS ---
  const handleAddToCart = (offer: UCOffer) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.offer.id === offer.id);
      if (existing) {
        return prev.map(item => item.offer.id === offer.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { offer, quantity: 1 }];
    });
    triggerToast(`🛒 Pack ${offer.ucAmount} UC ajouté au panier !`);
  };

  const handleQuickBuy = (offer: UCOffer) => {
    // Clear cart and add single item, then go directly to cart view
    setCartItems([{ offer, quantity: 1 }]);
    setActiveTab('cart');
  };

  const handleRemoveItem = (offerId: string) => {
    setCartItems(prev => prev.filter(item => item.offer.id !== offerId));
  };

  const handleUpdateQuantity = (offerId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(offerId);
      return;
    }
    setCartItems(prev => prev.map(item => item.offer.id === offerId ? { ...item, quantity } : item));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // --- ORDER SUBMISSION & WHATSAPP INTERPRETATION ---
  const handleSubmitOrder = (orderData: {
    pubgId: string;
    userName: string;
    userPhone: string;
    paymentMethodId: string;
    screenshot: string | null;
  }) => {
    const paymentName = PAYMENT_METHODS.find(p => p.id === orderData.paymentMethodId)?.name || 'Orange Money';
    
    // 1. Create native orders for each cart item
    const newOrders: OrderItem[] = cartItems.map(item => {
      const orderId = generateId().toUpperCase().substring(0, 8);
      return {
        id: orderId,
        userId: currentUser?.id || 'guest_user',
        pubgId: orderData.pubgId,
        userName: orderData.userName,
        userPhone: orderData.userPhone,
        offer: item.offer,
        quantity: item.quantity,
        priceTotal: item.offer.priceFcfa * item.quantity,
        paymentMethod: paymentName,
        screenshot: orderData.screenshot,
        status: 'pending',
        date: new Date().toLocaleDateString('fr-FR'),
      };
    });

    // 2. Append to general system orders
    const updatedSystemOrders = [...newOrders, ...orders];
    handleUpdateOrders(updatedSystemOrders);

    // 3. Append to user's order history if logged in
    if (currentUser) {
      const updatedUser: UserAccount = {
        ...currentUser,
        orders: [...newOrders, ...currentUser.orders]
      };
      setCurrentUser(updatedUser);
      saveCurrentUser(updatedUser);
    }

    // 4. Generate beautiful WhatsApp Message
    const totalUC = cartItems.reduce((acc, item) => acc + ((item.offer.ucAmount + item.offer.bonusUc) * item.quantity), 0);
    const totalPrice = cartItems.reduce((acc, item) => acc + (item.offer.priceFcfa * item.quantity), 0);
    
    let orderDetails = '';
    cartItems.forEach(item => {
      orderDetails += `- ${item.offer.ucAmount} UC (x${item.quantity}) : ${item.offer.priceFcfa * item.quantity} FCFA\n`;
    });

    const waMessage = `Bonjour GB STORES UC,\n\n` +
      `🔥 Je souhaite valider ma recharge de UC PUBG MOBILE :\n\n` +
      `🛒 DÉTAILS DE LA COMMANDE :\n` +
      `${orderDetails}\n` +
      `🪙 Total UC à recevoir : ${totalUC.toLocaleString('fr-FR')} UC\n` +
      `💵 Montant Total : ${totalPrice.toLocaleString('fr-FR')} FCFA\n\n` +
      `👤 INFORMATIONS DU JOUEUR :\n` +
      `- ID PUBG Mobile : ${orderData.pubgId}\n` +
      `- Nom du joueur : ${orderData.userName}\n` +
      `- N° de téléphone : ${orderData.userPhone}\n\n` +
      `💳 PAIEMENT EFFECTUÉ :\n` +
      `- Méthode : ${paymentName}\n\n` +
      `⚠️ (Ma preuve de paiement est jointe en pièce jointe/capture d'écran)`;

    // 5. Open WhatsApp direct url
    const whatsappUrl = `https://wa.me/22676549737?text=${encodeURIComponent(waMessage)}`;
    window.open(whatsappUrl, '_blank');

    // 6. Clear state & notify
    setCartItems([]);
    triggerToast("🚀 Commande générée ! Redirection vers WhatsApp pour envoyer la preuve de paiement...");
    
    // Redirect to home or account order history
    setActiveTab(currentUser ? 'account' : 'home');
  };

  // --- AUTHENTICATION ---
  const handleLogin = (email: string, phone: string): boolean => {
    const existingUsers = getStoredUsers();
    const matched = existingUsers.find(u => u.email === email && u.phone === phone);
    if (matched) {
      setCurrentUser(matched);
      saveCurrentUser(matched);
      triggerToast(`👋 Heureux de vous revoir, ${matched.name} !`);
      return true;
    }
    return false;
  };

  const handleRegister = (data: { 
    name: string; 
    email: string; 
    phone: string; 
    pubgId: string; 
    referredByCode?: string 
  }) => {
    const existingUsers = getStoredUsers();
    
    // Generate unique referral code
    const uniqueRefCode = `GB-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const newUser: UserAccount = {
      id: `usr_${generateId()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      pubgId: data.pubgId,
      referralCode: uniqueRefCode,
      referredBy: data.referredByCode,
      referrals: [],
      joinedDate: new Date().toLocaleDateString('fr-FR'),
      orders: [],
      isAdmin: false
    };

    // Handle Referral logic
    if (data.referredByCode) {
      const updatedUsers = existingUsers.map(u => {
        if (u.referralCode === data.referredByCode) {
          return {
            ...u,
            referrals: [...u.referrals, newUser.id]
          };
        }
        return u;
      });
      // Save updated users
      handleUpdateUsers([...updatedUsers, newUser]);
    } else {
      handleUpdateUsers([...existingUsers, newUser]);
    }

    setCurrentUser(newUser);
    saveCurrentUser(newUser);
    triggerToast(`🎉 Compte créé avec succès ! Bienvenue ${data.name}.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    saveCurrentUser(null);
    triggerToast("🔒 Déconnexion réussie.");
    setActiveTab('home');
  };

  const handleUpdateProfile = (name: string, phone: string, pubgId: string) => {
    if (!currentUser) return;
    const updated: UserAccount = {
      ...currentUser,
      name,
      phone,
      pubgId
    };
    setCurrentUser(updated);
    saveCurrentUser(updated);
    triggerToast("✏️ Profil mis à jour avec succès !");
  };

  // --- HELPERS ---
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4500);
  };

  const handleShare = () => {
    let shareUrl = window.location.origin;
    if (currentUser) {
      shareUrl += `/?ref=${currentUser.referralCode}`;
    }
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      triggerToast("🔗 Lien de partage copié dans le presse-papier !");
    }).catch(() => {
      // Fallback
      const textArea = document.createElement("textarea");
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        triggerToast("🔗 Lien de partage copié dans le presse-papier !");
      } catch (err) {
        console.error("Failed to copy", err);
      }
      document.body.removeChild(textArea);
    });
  };

  // Render correct view inside main grid
  const renderActiveView = () => {
    switch (activeTab) {
      case 'offers':
        return (
          <OffersView 
            offers={offers}
            onAddToCart={handleAddToCart}
            onQuickBuy={handleQuickBuy}
            cartItems={cartItems}
          />
        );
      case 'promotions':
        return (
          <PromotionsView 
            promotions={promotions}
            onNavigateToOffers={() => setActiveTab('offers')}
          />
        );
      case 'news':
        return <NewsView news={news} />;
      case 'cart':
        return (
          <CartView 
            cartItems={cartItems}
            onRemoveItem={handleRemoveItem}
            onUpdateQuantity={handleUpdateQuantity}
            onClearCart={handleClearCart}
            onSubmitOrder={handleSubmitOrder}
            currentUser={currentUser}
          />
        );
      case 'account':
        return (
          <AccountView 
            currentUser={currentUser}
            onLogin={handleLogin}
            onRegister={handleRegister}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      case 'partner':
        return (
          <PartnerView 
            currentUser={currentUser}
            offers={offers}
            users={users}
            onUpdateUsers={handleUpdateUsers}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            triggerToast={triggerToast}
          />
        );
      case 'referral':
        return (
          <ReferralView 
            currentUser={currentUser}
            onShareLink={handleShare}
            onCopyText={(txt, msg) => {
              navigator.clipboard.writeText(txt);
              triggerToast(msg);
            }}
          />
        );
      case 'contact':
        return <ContactView />;
      case 'faq':
        return <FaqView />;
      case 'about':
        return <AboutView />;
      case 'admin':
        return currentUser?.isAdmin ? (
          <AdminPanel 
            offers={offers}
            onUpdateOffers={handleUpdateOffers}
            promotions={promotions}
            onUpdatePromotions={handleUpdatePromotions}
            news={news}
            onUpdateNews={handleUpdateNews}
            users={users}
            onUpdateUsers={handleUpdateUsers}
            orders={orders}
            onUpdateOrders={handleUpdateOrders}
            notifications={notifications}
            onUpdateNotifications={handleUpdateNotifications}
          />
        ) : (
          <div className="text-center py-12 space-y-4">
            <ShieldAlert className="h-12 w-12 text-red-500 mx-auto" />
            <h3 className="text-white font-bold text-lg">Accès Interdit</h3>
            <p className="text-gray-500 text-xs">Seuls les administrateurs système ont accès à cette console.</p>
          </div>
        );
      default:
        return (
          <HomeView 
            onNavigate={(tab) => setActiveTab(tab)}
            onShare={handleShare}
            isInstallable={isInstallable}
            isInstalled={isInstalled}
            onInstall={handleInstallApp}
          />
        );
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#020205] text-gray-100 font-sans selection:bg-yellow-400 selection:text-black flex flex-col md:flex-row">
      
      {/* Dynamic Sidebar / Menu Panel */}
      <Navigation 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cartCount}
        currentUser={currentUser}
        onLogout={handleLogout}
        onShare={handleShare}
      />

      {/* Main Panel Content container */}
      <div className="flex-1 min-w-0 md:pl-64 flex flex-col min-h-screen">
        <main className="flex-1 p-4 md:p-8 max-w-6xl w-full mx-auto pb-20">
          
          {/* Header Banner Inside Content Area (For notifications / updates) */}
          {notifications.length > 0 && (
            <div className="mb-6 bg-yellow-400/5 border border-yellow-400/20 rounded-2xl p-3.5 flex items-start space-x-3 shadow-inner">
              <span className="w-2 h-2 bg-yellow-400 rounded-full mt-1.5 animate-ping flex-shrink-0"></span>
              <div className="text-xs">
                <span className="font-bold text-yellow-400 uppercase tracking-wider mr-1.5">ALERTE DIRECTE :</span>
                <span className="text-gray-300">{notifications[0].message}</span>
              </div>
            </div>
          )}

          {/* Dynamic tabs render wrapper */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Global bottom footer containing the installation button and quick links */}
        <Footer 
          isInstallable={isInstallable}
          isInstalled={isInstalled}
          onInstall={handleInstallApp}
          onNavigate={(tab) => setActiveTab(tab)}
        />
      </div>

      {/* Global Success/Copy Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[9999] max-w-sm bg-gray-950/95 text-white border border-yellow-400/40 rounded-2xl p-4 shadow-2xl backdrop-blur-xl flex items-start space-x-3.5"
          >
            <div className="bg-yellow-400/10 text-yellow-400 p-2 rounded-xl border border-yellow-400/20 flex-shrink-0">
              <Check className="h-5 w-5" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-display font-black text-sm text-white tracking-wide">Confirmation</h4>
              <p className="text-xs text-gray-400 leading-relaxed">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
