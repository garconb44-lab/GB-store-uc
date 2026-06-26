import React, { useState } from 'react';
import { 
  UCOffer, UserAccount, OrderItem, Promotion, NewsPost, 
  SystemNotification 
} from '../types';
import { 
  Settings, Users, ShoppingCart, TrendingUp, Flame, 
  Newspaper, Plus, Trash2, Edit2, Coins, Bell, Check, Save,
  Briefcase, X, Percent
} from 'lucide-react';

interface AdminPanelProps {
  offers: UCOffer[];
  onUpdateOffers: (offers: UCOffer[]) => void;
  promotions: Promotion[];
  onUpdatePromotions: (promotions: Promotion[]) => void;
  news: NewsPost[];
  onUpdateNews: (news: NewsPost[]) => void;
  users: UserAccount[];
  onUpdateUsers: (users: UserAccount[]) => void;
  orders: OrderItem[];
  onUpdateOrders: (orders: OrderItem[]) => void;
  notifications: SystemNotification[];
  onUpdateNotifications: (notifications: SystemNotification[]) => void;
}

export default function AdminPanel({
  offers, onUpdateOffers,
  promotions, onUpdatePromotions,
  news, onUpdateNews,
  users, onUpdateUsers,
  orders, onUpdateOrders,
  notifications, onUpdateNotifications
}: AdminPanelProps) {

  // Current sub-menu inside admin console
  const [adminMenu, setAdminMenu] = useState<'stats' | 'offers' | 'promotions' | 'news' | 'orders' | 'users' | 'notifications' | 'resellers'>('stats');

  // --- FORM STATES ---
  // 1. Offer Add/Edit
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [offerUc, setOfferUc] = useState(60);
  const [offerBonus, setOfferBonus] = useState(4);
  const [offerPrice, setOfferPrice] = useState(850);
  const [offerTag, setOfferTag] = useState('');

  // 2. Promotion Add/Edit
  const [promoTitle, setPromoTitle] = useState('');
  const [promoDesc, setPromoDesc] = useState('');
  const [promoBadge, setPromoBadge] = useState('Offre Limitée');
  const [promoBonusText, setPromoBonusText] = useState('');
  
  // 3. News Add/Edit
  const [newsTitle, setNewsTitle] = useState('');
  const [newsDesc, setNewsDesc] = useState('');
  const [newsType, setNewsType] = useState<'announcement' | 'image' | 'video' | 'promo'>('announcement');
  const [newsVideoUrl, setNewsVideoUrl] = useState('');

  // 4. Notification Add
  const [notifTitle, setNotifTitle] = useState('');
  const [notifMsg, setNotifMsg] = useState('');

  // --- COMPUTE STATISTICS ---
  const totalSalesFcfa = orders.reduce((acc, o) => o.status === 'completed' ? acc + o.priceTotal : acc, 0);
  const totalUcDelivered = orders.reduce((acc, o) => o.status === 'completed' ? acc + ((o.offer.ucAmount + o.offer.bonusUc) * o.quantity) : acc, 0);
  const totalActiveUsers = users.length;
  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

  // --- OFFERS CRUD ---
  const handleSaveOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOfferId) {
      const updated = offers.map(o => o.id === editingOfferId ? {
        ...o,
        ucAmount: offerUc,
        bonusUc: offerBonus,
        priceFcfa: offerPrice,
        tag: offerTag || undefined
      } : o);
      onUpdateOffers(updated);
      setEditingOfferId(null);
    } else {
      const newOffer: UCOffer = {
        id: `uc_${Math.random().toString(36).substring(2, 9)}`,
        ucAmount: offerUc,
        bonusUc: offerBonus,
        priceFcfa: offerPrice,
        tag: offerTag || undefined
      };
      onUpdateOffers([...offers, newOffer]);
    }
    // reset
    setOfferUc(60); setOfferBonus(4); setOfferPrice(850); setOfferTag('');
  };

  const handleDeleteOffer = (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer ce pack UC ?")) {
      onUpdateOffers(offers.filter(o => o.id !== id));
    }
  };

  // --- PROMOTIONS CRUD ---
  const handleAddPromotion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoTitle.trim()) return;
    const newPromo: Promotion = {
      id: `promo_${Math.random().toString(36).substring(2, 9)}`,
      title: promoTitle.trim(),
      description: promoDesc.trim(),
      badge: promoBadge,
      bonusText: promoBonusText.trim() || undefined,
      active: true,
      date: new Date().toLocaleDateString('fr-FR')
    };
    onUpdatePromotions([newPromo, ...promotions]);
    setPromoTitle(''); setPromoDesc(''); setPromoBadge('Offre Limitée'); setPromoBonusText('');
  };

  const handleTogglePromo = (id: string) => {
    const updated = promotions.map(p => p.id === id ? { ...p, active: !p.active } : p);
    onUpdatePromotions(updated);
  };

  const handleDeletePromo = (id: string) => {
    if (confirm("Voulez-vous supprimer cette promotion ?")) {
      onUpdatePromotions(promotions.filter(p => p.id !== id));
    }
  };

  // --- NEWS CRUD ---
  const handleAddNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle.trim()) return;
    const newPost: NewsPost = {
      id: `news_${Math.random().toString(36).substring(2, 9)}`,
      title: newsTitle.trim(),
      description: newsDesc.trim(),
      type: newsType,
      videoUrl: newsVideoUrl.trim() || undefined,
      active: true,
      date: new Date().toLocaleDateString('fr-FR')
    };
    onUpdateNews([newPost, ...news]);
    setNewsTitle(''); setNewsDesc(''); setNewsType('announcement'); setNewsVideoUrl('');
  };

  const handleToggleNews = (id: string) => {
    const updated = news.map(n => n.id === id ? { ...n, active: !n.active } : n);
    onUpdateNews(updated);
  };

  const handleDeleteNews = (id: string) => {
    if (confirm("Voulez-vous supprimer cette actualité ?")) {
      onUpdateNews(news.filter(n => n.id !== id));
    }
  };

  // --- ORDERS WORKFLOW ---
  const handleUpdateOrderStatus = (orderId: string, status: 'completed' | 'cancelled' | 'pending') => {
    let commissionCredited = false;
    let resellerRefCode = '';
    let commissionAmount = 0;

    const targetOrder = orders.find(o => o.id === orderId);
    if (!targetOrder) return;

    const oldStatus = targetOrder.status;

    // We only credit the reseller if the order status transitions TO 'completed' from something else
    const shouldCreditReseller = status === 'completed' && oldStatus !== 'completed';

    const updatedUsers = users.map(u => {
      let userUpdated = { ...u };

      // 1. If this is the buyer, update their order history status
      if (u.id === targetOrder.userId) {
        userUpdated.orders = u.orders.map(uo => uo.id === orderId ? { ...uo, status } : uo);
      }

      // 2. Check if this user is the parrain/reseller of the buyer
      const buyer = users.find(usr => usr.id === targetOrder.userId);
      if (buyer && buyer.referredBy && u.referralCode === buyer.referredBy && u.resellerStatus === 'active') {
        if (shouldCreditReseller) {
          const rate = u.resellerCommissionRate || 8;
          const comm = Math.round(targetOrder.priceTotal * (rate / 100));
          commissionAmount = comm;
          resellerRefCode = u.referralCode;

          const newSale = {
            id: `sale_${Math.random().toString(36).substring(2, 9)}`,
            orderId: targetOrder.id,
            buyerName: buyer.name,
            ucAmount: targetOrder.offer.ucAmount + targetOrder.offer.bonusUc,
            totalPrice: targetOrder.priceTotal,
            commissionEarned: comm,
            date: new Date().toLocaleDateString('fr-FR'),
            status: 'completed' as const
          };

          userUpdated.resellerEarnings = (userUpdated.resellerEarnings || 0) + comm;
          userUpdated.resellerSalesCount = (userUpdated.resellerSalesCount || 0) + 1;
          userUpdated.resellerSales = [newSale, ...(userUpdated.resellerSales || [])];
          commissionCredited = true;
        }
      }

      return userUpdated;
    });

    onUpdateUsers(updatedUsers);

    const updatedOrders = orders.map(o => o.id === orderId ? { ...o, status } : o);
    onUpdateOrders(updatedOrders);

    if (commissionCredited) {
      alert(`✓ Commande validée ! Une commission de ${commissionAmount} FCFA a été automatiquement créditée au revendeur (Code: ${resellerRefCode}).`);
    }
  };

  // --- NOTIFICATIONS CRUD ---
  const handleSendNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifMsg.trim()) return;
    const newNotif: SystemNotification = {
      id: `notif_${Math.random().toString(36).substring(2, 9)}`,
      title: notifTitle.trim(),
      message: notifMsg.trim(),
      date: new Date().toLocaleDateString('fr-FR'),
      read: false
    };
    onUpdateNotifications([newNotif, ...notifications]);
    setNotifTitle(''); setNotifMsg('');
    alert("Notification envoyée à tous les utilisateurs !");
  };

  return (
    <div className="space-y-8 animate-fade-in py-4">
      
      {/* Admin Title Block */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-900 pb-5">
        <div>
          <h2 className="font-display text-3xl font-black text-white tracking-wide">
            CONSOLE <span className="text-amber-400">ADMINISTRATEUR</span>
          </h2>
          <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mt-1">
            GB STORES UC • Gestion en temps réel
          </p>
        </div>

        {/* Console Menu Sub-Tabs */}
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          {[
            { id: 'stats', label: 'Stats & Tableau', icon: TrendingUp },
            { id: 'orders', label: 'Commandes', icon: ShoppingCart, badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined },
            { id: 'offers', label: 'Tarifs & Packs', icon: Coins },
            { id: 'promotions', label: 'Promotions', icon: Flame },
            { id: 'news', label: 'Actualités', icon: Newspaper },
            { id: 'users', label: 'Utilisateurs', icon: Users },
            { id: 'resellers', label: 'Revendeurs', icon: Briefcase, badge: users.filter(u => u.resellerStatus === 'pending').length > 0 ? users.filter(u => u.resellerStatus === 'pending').length : undefined },
            { id: 'notifications', label: 'Notifications', icon: Bell },
          ].map((item) => {
            const Icon = item.icon;
            const active = adminMenu === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setAdminMenu(item.id as any)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  active 
                    ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/10' 
                    : 'bg-gray-950 text-gray-400 hover:text-white border border-gray-850'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="bg-red-500 text-white text-[9px] font-mono h-4 px-1 rounded-full flex items-center justify-center font-black">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ADMIN VIEWS ROUTING */}
      {adminMenu === 'stats' && (
        <div className="space-y-6">
          {/* Bento Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Sales Card */}
            <div className="bg-[#050508] border border-gray-850 p-5 rounded-2xl">
              <span className="text-[10px] font-mono text-gray-500 tracking-wider block uppercase">VENTES LIVRÉES (FCFA)</span>
              <p className="text-3xl font-display font-black text-amber-400 mt-2 font-mono">
                {totalSalesFcfa.toLocaleString('fr-FR')} FCFA
              </p>
              <span className="text-[10px] text-green-500 font-mono mt-1 block">✓ Commandes payées</span>
            </div>

            {/* UC Delivered Card */}
            <div className="bg-[#050508] border border-gray-850 p-5 rounded-2xl">
              <span className="text-[10px] font-mono text-gray-500 tracking-wider block uppercase">TOTAL UC RECHARGÉS</span>
              <p className="text-3xl font-display font-black text-white mt-2 font-mono">
                {totalUcDelivered.toLocaleString('fr-FR')} UC
              </p>
              <span className="text-[10px] text-gray-500 font-mono mt-1 block">Via l'API Officielle</span>
            </div>

            {/* Active Accounts Card */}
            <div className="bg-[#050508] border border-gray-850 p-5 rounded-2xl">
              <span className="text-[10px] font-mono text-gray-500 tracking-wider block uppercase">COMPTES CLIENTS</span>
              <p className="text-3xl font-display font-black text-white mt-2 font-mono">
                {totalActiveUsers}
              </p>
              <span className="text-[10px] text-yellow-400/80 font-mono mt-1 block">Sauvegardés en cache</span>
            </div>

            {/* Pending Orders Card */}
            <div className="bg-[#050508] border border-gray-850 p-5 rounded-2xl">
              <span className="text-[10px] font-mono text-gray-500 tracking-wider block uppercase">COMMANDES EN ATTENTE</span>
              <p className={`text-3xl font-display font-black mt-2 font-mono ${pendingOrdersCount > 0 ? 'text-red-400' : 'text-gray-400'}`}>
                {pendingOrdersCount}
              </p>
              <span className="text-[10px] text-gray-500 font-mono mt-1 block">À valider ou livrer</span>
            </div>
          </div>

          {/* Quick Guidance Alert */}
          <div className="bg-amber-400/5 border border-amber-400/10 p-4 rounded-xl text-xs text-gray-400 leading-relaxed">
            <b>INFO D'ADMINISTRATION :</b> Toutes les modifications effectuées dans cet onglet (prix des packs, nouvelles promotions, actualités et statut des commandes) sont sauvegardées de manière dynamique dans votre navigateur (<i>localStorage</i>). Les utilisateurs y ont accès immédiatement sans avoir besoin de recréer ou republier l'application !
          </div>
        </div>
      )}

      {adminMenu === 'orders' && (
        <div className="bg-gray-950/60 rounded-2xl border border-gray-900 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">GESTION DES COMMANDES CLIENTS</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-900 text-gray-500 uppercase tracking-widest font-mono text-[9px]">
                  <th className="pb-3 font-bold">Code Order</th>
                  <th className="pb-3 font-bold">Client & ID PUBG</th>
                  <th className="pb-3 font-bold">Recharge UC</th>
                  <th className="pb-3 font-bold">Prix Total</th>
                  <th className="pb-3 font-bold">Méthode</th>
                  <th className="pb-3 font-bold">Statut</th>
                  <th className="pb-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900/60">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-600 font-mono">Aucune commande enregistrée pour le moment.</td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-950/40">
                      <td className="py-3.5 font-mono text-amber-400">#{order.id}</td>
                      <td className="py-3.5">
                        <p className="font-bold text-white">{order.userName}</p>
                        <p className="text-[10px] text-gray-500 font-mono">ID: {order.pubgId} • {order.userPhone}</p>
                      </td>
                      <td className="py-3.5 font-bold text-white font-mono">
                        {(order.offer.ucAmount + order.offer.bonusUc).toLocaleString('fr-FR')} UC
                        <span className="text-[10px] text-gray-500 font-normal block">({order.quantity} pack(s))</span>
                      </td>
                      <td className="py-3.5 text-yellow-400 font-bold font-mono">{order.priceTotal.toLocaleString('fr-FR')} FCFA</td>
                      <td className="py-3.5 text-gray-400 font-mono uppercase">{order.paymentMethod}</td>
                      <td className="py-3.5">
                        {order.status === 'completed' && <span className="bg-green-500/10 text-green-400 text-[9px] font-bold px-2 py-0.5 rounded border border-green-500/20">LIVRÉ ✓</span>}
                        {order.status === 'cancelled' && <span className="bg-red-500/10 text-red-400 text-[9px] font-bold px-2 py-0.5 rounded border border-red-500/20">ANNULÉ</span>}
                        {order.status === 'pending' && <span className="bg-yellow-500/10 text-yellow-400 text-[9px] font-bold px-2 py-0.5 rounded border border-yellow-500/20">EN ATTENTE</span>}
                      </td>
                      <td className="py-3.5 text-right space-x-1.5">
                        {order.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'completed')}
                              className="px-2 py-1 bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20 rounded font-black text-[10px] transition-all cursor-pointer"
                            >
                              Valider (Livrer)
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                              className="px-2 py-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded font-black text-[10px] transition-all cursor-pointer"
                            >
                              Annuler
                            </button>
                          </>
                        )}
                        {order.status !== 'pending' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.id, 'pending')}
                            className="px-2 py-1 bg-gray-900 text-gray-500 hover:text-white border border-gray-800 rounded font-bold text-[10px] transition-all cursor-pointer"
                          >
                            Réinitialiser
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {adminMenu === 'offers' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Add/Edit Offer Form */}
          <form onSubmit={handleSaveOffer} className="md:col-span-4 bg-gray-950/60 border border-gray-900 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider pb-2 border-b border-gray-900">
              {editingOfferId ? 'MODIFIER LE PACK' : 'AJOUTER UN PACK'}
            </h3>

            <div>
              <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1">Montant UC Principal</label>
              <input
                type="number"
                required
                value={offerUc}
                onChange={(e) => setOfferUc(parseInt(e.target.value) || 0)}
                className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-lg py-2 px-3 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1">Bonus d'UC Offert</label>
              <input
                type="number"
                required
                value={offerBonus}
                onChange={(e) => setOfferBonus(parseInt(e.target.value) || 0)}
                className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-lg py-2 px-3 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1">Prix de Vente (FCFA)</label>
              <input
                type="number"
                required
                value={offerPrice}
                onChange={(e) => setOfferPrice(parseInt(e.target.value) || 0)}
                className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-lg py-2 px-3 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1">Tag / Badge du Pack</label>
              <input
                type="text"
                placeholder="Ex: Populaire, Offre Spéciale"
                value={offerTag}
                onChange={(e) => setOfferTag(e.target.value)}
                className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-lg py-2 px-3 text-xs text-white"
              />
            </div>

            <div className="flex gap-2 pt-2">
              {editingOfferId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingOfferId(null);
                    setOfferUc(60); setOfferBonus(4); setOfferPrice(850); setOfferTag('');
                  }}
                  className="flex-1 py-2 bg-gray-900 text-gray-400 rounded-xl text-xs font-bold border border-gray-800"
                >
                  Annuler
                </button>
              )}
              <button
                type="submit"
                className="flex-1 py-2 bg-amber-400 hover:bg-amber-500 text-black rounded-xl text-xs font-black transition-colors"
              >
                {editingOfferId ? 'METTRE À JOUR' : 'CRÉER LE PACK'}
              </button>
            </div>
          </form>

          {/* Offers List */}
          <div className="md:col-span-8 bg-gray-950/60 border border-gray-900 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">LISTE DES PACKS ET GRILLE TARIFAIRE</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {offers.map((offer) => (
                <div key={offer.id} className="bg-[#050508] p-4 rounded-xl border border-gray-800 flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-black text-white text-sm">
                      {offer.ucAmount} {offer.bonusUc > 0 ? `+ ${offer.bonusUc}` : ''} UC
                    </h4>
                    <p className="text-yellow-400 text-xs font-bold font-mono mt-0.5">
                      {offer.priceFcfa.toLocaleString('fr-FR')} FCFA
                    </p>
                    {offer.tag && (
                      <span className="inline-block bg-gray-900 text-[9px] font-bold text-gray-400 px-1.5 py-0.5 rounded mt-1 font-mono uppercase tracking-wider">
                        {offer.tag}
                      </span>
                    )}
                  </div>

                  <div className="flex space-x-1">
                    <button
                      onClick={() => {
                        setEditingOfferId(offer.id);
                        setOfferUc(offer.ucAmount);
                        setOfferBonus(offer.bonusUc);
                        setOfferPrice(offer.priceFcfa);
                        setOfferTag(offer.tag || '');
                      }}
                      className="p-1.5 bg-gray-900 hover:bg-gray-800 text-gray-400 hover:text-white rounded border border-gray-850"
                      title="Modifier"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteOffer(offer.id)}
                      className="p-1.5 bg-gray-900 hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded border border-gray-850"
                      title="Supprimer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {adminMenu === 'promotions' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Add Promotion Form */}
          <form onSubmit={handleAddPromotion} className="md:col-span-5 bg-gray-950/60 border border-gray-900 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider pb-2 border-b border-gray-900">PUBLIER UNE PROMOTION</h3>

            <div>
              <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1">Titre de la Promotion</label>
              <input
                type="text"
                required
                placeholder="Ex: Super Bonus d'Été !"
                value={promoTitle}
                onChange={(e) => setPromoTitle(e.target.value)}
                className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-lg py-2 px-3 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1">Badge descriptif (Gauche)</label>
              <input
                type="text"
                required
                placeholder="Ex: Baisse de prix, +15% d'UC"
                value={promoBadge}
                onChange={(e) => setPromoBadge(e.target.value)}
                className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-lg py-2 px-3 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1">Texte Fort de Réduction (Droite)</label>
              <input
                type="text"
                placeholder="Ex: -50 FCFA, Cadeau"
                value={promoBonusText}
                onChange={(e) => setPromoBonusText(e.target.value)}
                className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-lg py-2 px-3 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1">Description explicative</label>
              <textarea
                required
                rows={3}
                placeholder="Détails de l'offre spéciale..."
                value={promoDesc}
                onChange={(e) => setPromoDesc(e.target.value)}
                className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-lg py-2 px-3 text-xs text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-red-500 to-amber-500 text-black font-black rounded-xl text-xs transition-colors"
            >
              PUBLIER LA PROMOTION
            </button>
          </form>

          {/* Promotions list */}
          <div className="md:col-span-7 bg-gray-950/60 border border-gray-900 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">PROMOTIONS ACTIVES</h3>
            
            <div className="space-y-4">
              {promotions.map((p) => (
                <div key={p.id} className="bg-[#050508] p-4 rounded-xl border border-gray-850 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-sm">{p.title}</span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded font-mono ${p.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                        {p.active ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed max-w-md">{p.description}</p>
                    <span className="text-[10px] text-gray-500 font-mono mt-0.5 block">Créé le {p.date}</span>
                  </div>

                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleTogglePromo(p.id)}
                      className={`p-1.5 rounded border text-xs font-bold font-mono transition-all cursor-pointer ${
                        p.active 
                          ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                          : 'bg-gray-900 text-gray-500 border-gray-800'
                      }`}
                    >
                      {p.active ? 'Désactiver' : 'Activer'}
                    </button>
                    <button
                      onClick={() => handleDeletePromo(p.id)}
                      className="p-1.5 bg-gray-900 hover:bg-red-500/15 text-gray-500 hover:text-red-400 rounded border border-gray-850"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {adminMenu === 'news' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Add News Form */}
          <form onSubmit={handleAddNews} className="md:col-span-5 bg-gray-950/60 border border-gray-900 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider pb-2 border-b border-gray-900">PUBLIER UNE ACTUALITÉ</h3>

            <div>
              <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1">Titre de l'Annonce</label>
              <input
                type="text"
                required
                placeholder="Ex: Arrivée de la nouvelle saison M25 !"
                value={newsTitle}
                onChange={(e) => setNewsTitle(e.target.value)}
                className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-lg py-2 px-3 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1">Type d'Actualité</label>
              <select
                value={newsType}
                onChange={(e) => setNewsType(e.target.value as any)}
                className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-lg py-2 px-3 text-xs text-white focus:outline-none"
              >
                <option value="announcement">Message / Communiqué</option>
                <option value="image">Affiche Publicitaire (Image)</option>
                <option value="video">Vidéo Explicative (Tutoriel)</option>
              </select>
            </div>

            {newsType === 'video' && (
              <div>
                <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1">Lien de la Vidéo (YouTube/TikTok)</label>
                <input
                  type="text"
                  placeholder="Ex: https://youtube.com/watch?v=..."
                  value={newsVideoUrl}
                  onChange={(e) => setNewsVideoUrl(e.target.value)}
                  className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-lg py-2 px-3 text-xs text-white font-mono"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1">Texte descriptif</label>
              <textarea
                required
                rows={4}
                placeholder="Insérer les informations détaillées importantes..."
                value={newsDesc}
                onChange={(e) => setNewsDesc(e.target.value)}
                className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-lg py-2 px-3 text-xs text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black rounded-xl text-xs transition-colors"
            >
              PUBLIER L'ANNONCE
            </button>
          </form>

          {/* News List */}
          <div className="md:col-span-7 bg-gray-950/60 border border-gray-900 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">ANNONCES PUBLIÉES</h3>
            
            <div className="space-y-4">
              {news.map((n) => (
                <div key={n.id} className="bg-[#050508] p-4 rounded-xl border border-gray-850 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-white text-sm">{n.title}</span>
                      <span className="bg-gray-900 border border-gray-800 text-[8px] text-gray-400 px-1.5 py-0.5 rounded font-mono uppercase font-bold">
                        {n.type}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed max-w-md">{n.description}</p>
                    <span className="text-[10px] text-gray-500 font-mono mt-0.5 block">Publié le {n.date}</span>
                  </div>

                  <div className="flex space-x-1">
                    <button
                      onClick={() => handleToggleNews(n.id)}
                      className={`p-1.5 rounded border text-xs font-bold font-mono transition-all cursor-pointer ${
                        n.active 
                          ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20' 
                          : 'bg-gray-900 text-gray-500 border-gray-800'
                      }`}
                    >
                      {n.active ? 'Masquer' : 'Afficher'}
                    </button>
                    <button
                      onClick={() => handleDeleteNews(n.id)}
                      className="p-1.5 bg-gray-900 hover:bg-red-500/15 text-gray-500 hover:text-red-400 rounded border border-gray-850"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {adminMenu === 'users' && (
        <div className="bg-gray-950/60 rounded-2xl border border-gray-900 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">COMPTES UTILISATEURS ENREGISTRÉS</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-900 text-gray-500 uppercase tracking-widest font-mono text-[9px] pb-2">
                  <th className="pb-3">Client</th>
                  <th className="pb-3">ID PUBG Mobile</th>
                  <th className="pb-3">Code Parrain</th>
                  <th className="pb-3">Inscrits Parrainés</th>
                  <th className="pb-3">Date d'inscription</th>
                  <th className="pb-3 text-right">Rôle / Privilèges</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900/60">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-950/40">
                    <td className="py-3">
                      <p className="font-bold text-white">{user.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono">{user.email} • {user.phone}</p>
                    </td>
                    <td className="py-3 font-mono font-bold text-yellow-400">{user.pubgId}</td>
                    <td className="py-3 font-mono font-bold text-amber-500">{user.referralCode}</td>
                    <td className="py-3 font-mono font-bold text-white">
                      {user.referrals.length} filleul(s)
                    </td>
                    <td className="py-3 text-gray-400 font-mono">{user.joinedDate}</td>
                    <td className="py-3 text-right">
                      {user.isAdmin ? (
                        <span className="bg-amber-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded">ADMINISTRATEUR</span>
                      ) : (
                        <span className="bg-gray-900 text-gray-400 border border-gray-850 text-[9px] font-bold px-1.5 py-0.5 rounded">CLIENT</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {adminMenu === 'notifications' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Send Notification form */}
          <form onSubmit={handleSendNotification} className="md:col-span-5 bg-gray-950/60 border border-gray-900 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider pb-2 border-b border-gray-900">ENVOYER UN REGROUPEMENT / COMMUNIQUÉ</h3>
            
            <div>
              <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1">Titre du Message</label>
              <input
                type="text"
                required
                placeholder="Ex: Alerte Maintenance API ou Offre flash !"
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-lg py-2 px-3 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1">Message d'alerte (Court)</label>
              <textarea
                required
                rows={4}
                placeholder="Saisissez le message d'alerte..."
                value={notifMsg}
                onChange={(e) => setNotifMsg(e.target.value)}
                className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-lg py-2 px-3 text-xs text-white focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-amber-400 hover:bg-amber-500 text-black font-black rounded-xl text-xs transition-colors"
            >
              DIFFUSER LA NOTIFICATION EN DIRECT
            </button>
          </form>

          {/* Notifications history */}
          <div className="md:col-span-7 bg-gray-950/60 border border-gray-900 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">HISTORIQUE DES ALERTES ENVOYÉES</h3>
            
            <div className="space-y-3">
              {notifications.map((n) => (
                <div key={n.id} className="bg-[#050508] p-3 rounded-xl border border-gray-850">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-white text-xs">{n.title}</span>
                    <span className="text-[9px] text-gray-500 font-mono">{n.date}</span>
                  </div>
                  <p className="text-gray-400 text-[11px] mt-1 leading-relaxed">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {adminMenu === 'resellers' && (
        <div className="space-y-8">
          
          {/* Pending Applications section */}
          <div className="bg-gray-950/60 rounded-3xl border border-gray-900 p-6 space-y-4">
            <h3 className="font-display font-black text-lg text-white uppercase tracking-wider pb-3 border-b border-gray-900 flex items-center justify-between">
              <span>CANDIDATURES EN ATTENTE DE VALIDATION</span>
              <span className="bg-yellow-400 text-black text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                {users.filter(u => u.resellerStatus === 'pending').length} Demande(s)
              </span>
            </h3>

            {users.filter(u => u.resellerStatus === 'pending').length === 0 ? (
              <p className="text-xs text-gray-500 font-mono text-center py-4">Aucune candidature de partenariat en attente actuellement.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {users.filter(u => u.resellerStatus === 'pending').map((u) => (
                  <div key={u.id} className="bg-[#050508] p-4 rounded-xl border border-yellow-400/20 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-xs text-white">{u.name}</h4>
                        <span className="text-[10px] text-gray-500 font-mono block">Tel: {u.phone} • Email: {u.email}</span>
                      </div>
                      <span className="bg-yellow-400/10 text-yellow-400 text-[9px] font-black uppercase px-2 py-0.5 rounded border border-yellow-400/20">
                        {u.partnerTypeRequested === 'reseller' ? 'REVENDEUR' : u.partnerTypeRequested === 'partner' ? 'PARTENAIRE' : 'REJOINDRE TEAM'}
                      </span>
                    </div>

                    <div className="bg-black/40 p-3 rounded-lg border border-gray-900 text-[11px] text-gray-400 leading-relaxed font-mono">
                      {u.partnerApplicationMessage}
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          const updated = users.map(usr => {
                            if (usr.id === u.id) {
                              return {
                                ...usr,
                                resellerStatus: 'active' as const,
                                resellerCommissionRate: 8,
                                resellerEarnings: 0,
                                resellerSalesCount: 0,
                                resellerSales: []
                              };
                            }
                            return usr;
                          });
                          onUpdateUsers(updated);
                          alert(`✓ ${u.name} a été approuvé en tant que partenaire revendeur officiel !`);
                        }}
                        className="bg-green-500 hover:bg-green-600 text-black px-3 py-1.5 rounded-lg text-[10px] font-black transition-colors cursor-pointer"
                      >
                        Accepter la Demande
                      </button>
                      <button
                        onClick={() => {
                          const updated = users.map(usr => {
                            if (usr.id === u.id) {
                              return {
                                ...usr,
                                resellerStatus: 'rejected' as const
                              };
                            }
                            return usr;
                          });
                          onUpdateUsers(updated);
                          alert(`✗ Demande de ${u.name} rejetée.`);
                        }}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded-lg text-[10px] font-black transition-colors cursor-pointer"
                      >
                        Refuser
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Active Resellers list */}
          <div className="bg-gray-950/60 rounded-3xl border border-gray-900 p-6 space-y-4">
            <h3 className="font-display font-black text-lg text-white uppercase tracking-wider pb-3 border-b border-gray-900 flex items-center justify-between">
              <span>LISTE DES PARTENAIRES & REVENDEURS AGRÉÉS</span>
              <span className="bg-green-400 text-black text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                {users.filter(u => u.resellerStatus === 'active').length} Actif(s)
              </span>
            </h3>

            {users.filter(u => u.resellerStatus === 'active').length === 0 ? (
              <p className="text-xs text-gray-500 font-mono text-center py-4">Aucun revendeur actif pour le moment.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-900 text-gray-500 uppercase tracking-widest font-mono text-[9px] pb-2">
                      <th className="pb-3">Nom</th>
                      <th className="pb-3">Code unique</th>
                      <th className="pb-3">Numéro / Contact</th>
                      <th className="pb-3 text-yellow-400 font-bold">Commission %</th>
                      <th className="pb-3 text-green-400">Revenus Cumulés</th>
                      <th className="pb-3">Ventes</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-900/60 font-mono">
                    {users.filter(u => u.resellerStatus === 'active').map((u) => {
                      return (
                        <tr key={u.id} className="hover:bg-gray-950/40 text-gray-300">
                          <td className="py-3.5 font-bold text-white">{u.name}</td>
                          <td className="py-3.5 text-yellow-400 font-bold">{u.referralCode}</td>
                          <td className="py-3.5">{u.phone}</td>
                          <td className="py-3.5">
                            <div className="flex items-center space-x-1.5">
                              <input
                                type="number"
                                min={1}
                                max={50}
                                defaultValue={u.resellerCommissionRate || 8}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (isNaN(val) || val < 1 || val > 50) return;
                                  const updated = users.map(usr => {
                                    if (usr.id === u.id) {
                                      return { ...usr, resellerCommissionRate: val };
                                    }
                                    return usr;
                                  });
                                  onUpdateUsers(updated);
                                }}
                                className="w-12 bg-black border border-gray-800 text-center text-xs text-white rounded p-1"
                              />
                              <span className="text-gray-500">%</span>
                            </div>
                          </td>
                          <td className="py-3.5 text-green-400 font-bold">
                            {(u.resellerEarnings || 0).toLocaleString('fr-FR')} FCFA
                          </td>
                          <td className="py-3.5 text-white">{u.resellerSalesCount || 0} ventes</td>
                          <td className="py-3.5 text-right">
                            <button
                              onClick={() => {
                                if (confirm(`Êtes-vous sûr de vouloir révoquer le statut revendeur de ${u.name} ?`)) {
                                  const updated = users.map(usr => {
                                    if (usr.id === u.id) {
                                      return {
                                        ...usr,
                                        resellerStatus: 'none' as const
                                      };
                                    }
                                    return usr;
                                  });
                                  onUpdateUsers(updated);
                                  alert(`✓ Statut revendeur de ${u.name} révoqué.`);
                                }
                              }}
                              className="text-red-400 hover:text-red-300 border border-red-500/25 hover:bg-red-500/5 px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors"
                            >
                              Révoquer
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
