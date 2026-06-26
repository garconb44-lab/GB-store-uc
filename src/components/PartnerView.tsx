import React, { useState } from 'react';
import { 
  Users, Coins, Award, Zap, MessageCircle, Share2, 
  Facebook, Clipboard, Check, TrendingUp, Send, 
  Briefcase, ChevronRight, UserPlus, Shield, Info, Sparkles
} from 'lucide-react';
import { UserAccount, UCOffer } from '../types';
import ucVoucher from '../assets/images/pubg_uc_voucher_1782296939373.jpg';

interface PartnerViewProps {
  currentUser: UserAccount | null;
  offers: UCOffer[];
  users: UserAccount[];
  onUpdateUsers: (newUsers: UserAccount[]) => void;
  onNavigateToTab: (tab: string) => void;
  triggerToast: (msg: string) => void;
}

export default function PartnerView({
  currentUser,
  offers,
  users,
  onUpdateUsers,
  onNavigateToTab,
  triggerToast
}: PartnerViewProps) {
  // Application Form State
  const [partnerType, setPartnerType] = useState<'reseller' | 'partner' | 'team'>('reseller');
  const [message, setMessage] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('Burkina Faso');
  const [whatsapp, setWhatsapp] = useState(currentUser?.phone || '');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // TikTok Copy/Share Guide Modal or Area
  const [showTikTokGuide, setShowTikTokGuide] = useState(false);

  // Referral Link Generator
  const referralLink = currentUser 
    ? `${window.location.origin}/?ref=${currentUser.referralCode}` 
    : `${window.location.origin}/`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    triggerToast("🔗 Lien de parrainage copié dans le presse-papier !");
  };

  const handleCopyCode = () => {
    if (currentUser) {
      navigator.clipboard.writeText(currentUser.referralCode);
      triggerToast(`📋 Code parrain ${currentUser.referralCode} copié !`);
    }
  };

  // Submit Application Flow
  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      triggerToast("⚠️ Vous devez d'abord vous connecter ou créer un compte !");
      onNavigateToTab('account');
      return;
    }

    if (!city.trim() || !whatsapp.trim()) {
      triggerToast("⚠️ Veuillez remplir tous les champs obligatoires.");
      return;
    }

    // Update the currentUser in users registry
    const updatedUsers = users.map(u => {
      if (u.id === currentUser.id) {
        return {
          ...u,
          resellerStatus: 'pending' as const,
          partnerTypeRequested: partnerType,
          partnerApplicationMessage: `[Pays: ${country} | Ville: ${city} | WhatsApp: ${whatsapp}] - ${message}`
        };
      }
      return u;
    });

    onUpdateUsers(updatedUsers);
    setIsSubmitted(true);
    triggerToast("🚀 Votre candidature a été transmise à l'administrateur !");
  };

  // Reseller-only special pricing calculation (displays 8% default discount for active resellers)
  const getResellerPrice = (originalPrice: number, rate: number = 8) => {
    const discount = originalPrice * (rate / 100);
    return Math.round(originalPrice - discount);
  };

  // Current reseller stats
  const resellerStatus = currentUser?.resellerStatus || 'none';
  const commissionRate = currentUser?.resellerCommissionRate || 8;
  const resellerEarnings = currentUser?.resellerEarnings || 0;
  const resellerSalesCount = currentUser?.resellerSalesCount || 0;
  const resellerSales = currentUser?.resellerSales || [];

  return (
    <div className="space-y-10 animate-fade-in py-4">
      {/* Visual Header Block */}
      <div className="relative rounded-3xl bg-gradient-to-r from-gray-950 via-[#0d091a] to-gray-950 border border-yellow-400/15 p-6 md:p-10 overflow-hidden shadow-2xl">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-green-500/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center space-x-2 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-3 py-1.5 rounded-full text-xs font-bold font-display uppercase tracking-wider">
              <Award className="h-4 w-4 text-yellow-400" />
              <span>Gagnez de l'argent avec GB STORES UC</span>
            </div>
            
            <h1 className="font-display text-3xl md:text-5xl font-black text-white leading-tight">
              PROGRAMME <span className="text-yellow-400">PARTENAIRES</span> & <span className="text-green-400">REVENDEURS</span>
            </h1>
            
            <p className="text-gray-300 text-sm leading-relaxed">
              Développez votre propre activité de vente d'UC PUBG Mobile dans votre ville ou pays. Profitez de tarifs d'achat ultra-compétitifs et gagnez des commissions automatiques sur chaque vente effectuée via vos recommandations.
            </p>
          </div>

          {/* Graphic Banner */}
          <div className="w-48 h-36 rounded-2xl overflow-hidden border border-gray-800 shadow-2xl flex-shrink-0 group relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
            <img 
              src={ucVoucher} 
              alt="PUBG UC Packs" 
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute bottom-2.5 left-2.5 z-20">
              <span className="text-[10px] font-mono font-black text-yellow-400 bg-black/85 px-2 py-1 rounded border border-yellow-400/30 uppercase tracking-widest">
                TARIFS RÉDUITS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RENDER VIEW ACCORDING TO USER PARTNERSHIP STATUS */}

      {/* 1. STATUS IS ACTIVE: Full Reseller / Partner Dashboard */}
      {resellerStatus === 'active' && (
        <div className="space-y-10">
          
          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Total Earnings */}
            <div className="bg-[#050508] border border-gray-850 p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl group-hover:bg-green-500/10 transition-all"></div>
              <span className="text-[10px] font-mono text-gray-500 tracking-wider block uppercase">Mes Revenus Totaux</span>
              <p className="text-3xl font-display font-black text-green-400 mt-2 font-mono">
                {resellerEarnings.toLocaleString('fr-FR')} FCFA
              </p>
              <div className="mt-4 pt-3 border-t border-gray-900/60 flex items-center justify-between text-[11px] text-gray-400">
                <span>Solde disponible</span>
                <span className="font-bold text-white">Retrait Direct ✓</span>
              </div>
            </div>

            {/* Sales Count */}
            <div className="bg-[#050508] border border-gray-850 p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/5 rounded-full blur-2xl group-hover:bg-yellow-400/10 transition-all"></div>
              <span className="text-[10px] font-mono text-gray-500 tracking-wider block uppercase font-bold">Ventes Réalisées</span>
              <p className="text-3xl font-display font-black text-white mt-2 font-mono">
                {resellerSalesCount}
              </p>
              <div className="mt-4 pt-3 border-t border-gray-900/60 flex items-center justify-between text-[11px] text-gray-400">
                <span>Volume total</span>
                <span className="text-yellow-400 font-bold font-mono">+{resellerSalesCount * 325} UC</span>
              </div>
            </div>

            {/* Commission Rate */}
            <div className="bg-[#050508] border border-gray-850 p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"></div>
              <span className="text-[10px] font-mono text-gray-500 tracking-wider block uppercase">Ma Commission</span>
              <p className="text-3xl font-display font-black text-yellow-400 mt-2 font-mono">
                {commissionRate}%
              </p>
              <div className="mt-4 pt-3 border-t border-gray-900/60 flex items-center justify-between text-[11px] text-gray-400">
                <span>Sur chaque recharge</span>
                <span className="text-gray-500 font-mono">Fixé par Admin</span>
              </div>
            </div>

            {/* Referrals */}
            <div className="bg-[#050508] border border-gray-850 p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl"></div>
              <span className="text-[10px] font-mono text-gray-500 tracking-wider block uppercase">Mes Filleuls Actifs</span>
              <p className="text-3xl font-display font-black text-white mt-2 font-mono">
                {currentUser?.referrals.length || 0}
              </p>
              <div className="mt-4 pt-3 border-t border-gray-900/60 flex items-center justify-between text-[11px] text-gray-400">
                <span>Inscriptions</span>
                <span className="text-green-400 font-bold">Actifs ✓</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left/Middle block: Tarifs Revendeurs & Multi-Sharing (8 columns) */}
            <div className="lg:col-span-8 space-y-8">
              
              {/* Tarifs Spéciaux */}
              <div className="bg-gray-950/60 rounded-3xl border border-gray-900 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-900 pb-4">
                  <div className="flex items-center space-x-2.5">
                    <Coins className="h-5 w-5 text-yellow-400" />
                    <div>
                      <h3 className="font-display font-black text-sm text-white uppercase">VOS TARIFS D'ACHAT REVENDEUR ({commissionRate}% de réduction d'achat)</h3>
                      <p className="text-[11px] text-gray-500">En tant que revendeur agréé, vous achetez ces packs à prix réduit pour les revendre au tarif normal !</p>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-gray-900 text-gray-500 uppercase tracking-widest font-mono text-[9px] pb-2">
                        <th className="pb-3">Pack UC PUBG Mobile</th>
                        <th className="pb-3">Tarif Normal</th>
                        <th className="pb-3 text-green-400">Votre Tarif Achat</th>
                        <th className="pb-3 text-yellow-400 font-bold">Bénéfice Net Revente</th>
                        <th className="pb-3 text-right">Action Directe</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-900/60 font-mono">
                      {offers.map((offer) => {
                        const resellerPrice = getResellerPrice(offer.priceFcfa, commissionRate);
                        const profit = offer.priceFcfa - resellerPrice;
                        return (
                          <tr key={offer.id} className="hover:bg-gray-950/40">
                            <td className="py-3.5 font-bold text-white">
                              {offer.ucAmount} {offer.bonusUc > 0 ? `+ ${offer.bonusUc}` : ''} UC
                            </td>
                            <td className="py-3.5 text-gray-500 line-through">
                              {offer.priceFcfa.toLocaleString('fr-FR')} FCFA
                            </td>
                            <td className="py-3.5 text-green-400 font-bold">
                              {resellerPrice.toLocaleString('fr-FR')} FCFA
                            </td>
                            <td className="py-3.5 text-yellow-400 font-black">
                              +{profit.toLocaleString('fr-FR')} FCFA / pack
                            </td>
                            <td className="py-3.5 text-right">
                              <button
                                onClick={() => onNavigateToTab('offers')}
                                className="px-2.5 py-1 bg-yellow-400 hover:bg-yellow-500 text-black font-black text-[10px] rounded-lg transition-all uppercase tracking-wider cursor-pointer"
                              >
                                Commander
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Système d'Invitation & Partage */}
              <div className="bg-[#050508] rounded-3xl border border-gray-850 p-6 space-y-6">
                <div className="border-b border-gray-900 pb-4">
                  <h4 className="font-display font-black text-sm text-white flex items-center space-x-2">
                    <Share2 className="h-4.5 w-4.5 text-yellow-400" />
                    <span>OUTILS DE PARTAGE & SYSTÈME D'INVITATION</span>
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">Invitez vos amis de jeu PUBG, vos clients ou votre communauté et enregistrez chaque vente validée !</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Share code */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">Votre Code Revendeur Unique</label>
                    <div className="flex bg-gray-950 border border-gray-850 rounded-xl p-2 items-center justify-between">
                      <span className="font-mono font-black text-lg text-yellow-400 pl-2">{currentUser.referralCode}</span>
                      <button
                        onClick={handleCopyCode}
                        className="bg-gray-900 hover:bg-gray-850 text-gray-300 border border-gray-800 p-2 rounded-lg text-xs font-bold transition-all"
                      >
                        <Clipboard className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed">Les clients qui saisissent ce code lors de leur inscription bénéficient d'un traitement prioritaire et vous rapportent des commissions.</p>
                  </div>

                  {/* Share Link */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">Lien de Partage Personnalisé</label>
                    <div className="flex bg-gray-950 border border-gray-850 rounded-xl p-2 items-center justify-between">
                      <span className="font-mono text-xs text-gray-400 truncate max-w-[150px] pl-2">{referralLink}</span>
                      <button
                        onClick={handleCopyLink}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1.5 rounded-lg text-[10px] font-black transition-all"
                      >
                        Copier
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-relaxed">Redirige automatiquement l'utilisateur vers notre application tout en pré-remplissant votre code de parrainage.</p>
                  </div>
                </div>

                {/* Social Buttons */}
                <div className="space-y-3 pt-3 border-t border-gray-900/60">
                  <span className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">Partager directement sur les réseaux :</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* WhatsApp */}
                    <a
                      href={`https://wa.me/?text=Salut%20!%20Je%20suis%20revendeur%20agr%C3%A9%C3%A9%20GB%20STORES%20UC.%20Recharge%20tes%20UC%20PUBG%20MOBILE%20rapidement%20et%20de%20mani%C3%A8re%20s%C3%A9curis%C3%A9e%20avec%20mon%20code%20%3A%20${currentUser.referralCode}%20en%20cliquant%20sur%20ce%20lien%20%3A%20${encodeURIComponent(referralLink)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>WhatsApp</span>
                    </a>

                    {/* Facebook */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] border border-[#1877F2]/20 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all"
                    >
                      <Facebook className="h-4 w-4" />
                      <span>Facebook</span>
                    </a>

                    {/* TikTok Copy Guide */}
                    <button
                      onClick={() => setShowTikTokGuide(!showTikTokGuide)}
                      className="bg-pink-500/10 hover:bg-pink-500/20 text-pink-500 border border-pink-500/20 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>Partager sur TikTok</span>
                    </button>
                  </div>

                  {/* TikTok Overlay Box */}
                  {showTikTokGuide && (
                    <div className="bg-gray-950 p-4 rounded-xl border border-pink-500/20 text-xs space-y-2.5 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-pink-500">Modèle de script Vidéo / TikTok :</span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(`Recharge tes UC PUBG MOBILE en moins de 10 minutes au Burkina Faso avec GB STORES UC ! Entre le code parrain : ${currentUser.referralCode} pour avoir des bonus d'UC gratuits ou passe ta commande directement sur WhatsApp ! Lien dans ma bio : ${referralLink}`);
                            triggerToast("📋 Texte TikTok copié !");
                          }}
                          className="text-[10px] bg-pink-500/25 text-pink-400 font-bold px-2 py-1 rounded"
                        >
                          Copier le script
                        </button>
                      </div>
                      <p className="text-gray-400 leading-relaxed bg-[#050508] p-3 rounded border border-gray-900 font-mono text-[11px]">
                        "Recharge tes UC PUBG MOBILE en moins de 10 minutes au Burkina Faso avec GB STORES UC ! Entre le code parrain : <b className="text-yellow-400">{currentUser.referralCode}</b> pour avoir des bonus d'UC gratuits ou passe ta commande directement sur WhatsApp ! Lien dans ma bio : {referralLink}"
                      </p>
                      <p className="text-[10px] text-gray-500">💡 <i>Astuce : Créez une courte vidéo de gameplay de PUBG Mobile, affichez votre code revendeur à l'écran, et collez le lien dans votre biographie pour enregistrer un maximum de parrainages !</i></p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right block: Sales history (4 columns) */}
            <div className="lg:col-span-4 bg-gray-950/60 rounded-3xl border border-gray-900 p-5 flex flex-col h-[520px]">
              <div className="flex items-center justify-between pb-4 border-b border-gray-900 flex-shrink-0">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4.5 w-4.5 text-yellow-400" />
                  <h3 className="font-display font-black text-sm text-white uppercase">HISTORIQUE DES VENTES</h3>
                </div>
                <span className="text-[10px] font-mono font-bold text-green-400 bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                  {resellerSales.length} Vente(s)
                </span>
              </div>

              <div className="flex-1 overflow-y-auto pt-4 space-y-3 pr-1">
                {resellerSales.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-2">
                    <Users className="h-8 w-8 text-gray-800" />
                    <h4 className="text-white text-xs font-bold">Aucune vente enregistrée</h4>
                    <p className="text-gray-500 text-[10px] max-w-xs leading-relaxed">
                      Dès qu'un client s'enregistre ou achète un pack d'UC avec votre code de parrainage, la vente s'affiche ici et votre commission est créditée automatiquement !
                    </p>
                  </div>
                ) : (
                  resellerSales.map((sale) => (
                    <div key={sale.id} className="bg-[#050508] p-3.5 rounded-xl border border-gray-850 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-white font-mono">{sale.buyerName}</p>
                          <span className="text-[8px] text-gray-500 font-mono block">Réf: {sale.orderId} • {sale.date}</span>
                        </div>
                        <span className="bg-green-500/15 text-green-400 text-[8px] font-bold px-1.5 py-0.5 rounded border border-green-500/10">
                          {sale.status === 'completed' ? 'LIVRÉ ✓' : 'EN ATTENTE'}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-baseline pt-1.5 border-t border-gray-900/60">
                        <span className="text-[10px] text-gray-400">Pack: <b>{sale.ucAmount} UC</b></span>
                        <div className="text-right">
                          <span className="text-yellow-400 font-bold font-mono text-xs">+{sale.commissionEarned} FCFA</span>
                          <p className="text-[8px] text-gray-500 font-mono">Commission ({commissionRate}%)</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. STATUS IS PENDING: Application In Review */}
      {resellerStatus === 'pending' && (
        <div className="max-w-xl mx-auto bg-[#050508] border border-yellow-400/20 p-8 rounded-3xl text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-2xl"></div>
          
          <div className="w-16 h-16 bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
            <Shield className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h3 className="font-display font-black text-2xl text-white">DEMANDE EN COURS D'EXAMEN</h3>
            <p className="text-xs text-gray-500 uppercase font-mono tracking-widest text-yellow-400">GB STORES UC • PROGRAMME PARTENAIRE</p>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed">
            Merci beaucoup pour votre intérêt ! Votre candidature pour rejoindre notre réseau de partenaires et revendeurs est en cours d'analyse par l'administrateur de GB STORES.
          </p>

          <div className="bg-gray-950 p-4 rounded-2xl border border-gray-900 text-left space-y-2 text-xs">
            <span className="font-mono font-bold text-yellow-400 block">PROCHAINES ÉTAPES :</span>
            <p className="text-gray-400">1. L'administrateur va vérifier les informations de votre profil de jeu et de contact.</p>
            <p className="text-gray-400">2. Vous recevrez une validation de statut directement dans votre espace revendeur.</p>
            <p className="text-gray-400">3. Notre support officiel vous contactera sur WhatsApp pour finaliser l'intégration et vous fournir des visuels publicitaires.</p>
          </div>

          <p className="text-[11px] text-gray-500 font-mono">
            Support Technique : +226 76 54 97 37
          </p>
        </div>
      )}

      {/* 3. STATUS IS NONE / REJECTED / GUEST: Show Explanations and Application form */}
      {(resellerStatus === 'none' || resellerStatus === 'rejected') && (
        <div className="space-y-12">
          
          {/* Why join bento explanation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#050508] border border-gray-850 p-6 rounded-2xl space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 rounded-xl flex items-center justify-center">
                <Coins className="h-5 w-5" />
              </div>
              <h4 className="font-display font-bold text-white text-base">Tarifs d'Achat Spéciaux</h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Achetez les packs d'UC PUBG MOBILE à des tarifs de gros très réduits (jusqu'à 15% de réduction) et revendez-les au prix fort pour empocher de grosses marges de bénéfice.
              </p>
            </div>

            <div className="bg-[#050508] border border-gray-850 p-6 rounded-2xl space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 bg-green-500/10 text-green-400 border border-green-500/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h4 className="font-display font-bold text-white text-base">Commissions Récurrentes</h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Gagnez un pourcentage automatique sur chaque recharge validée de vos filleuls. Vous n'avez rien d'autre à faire que de partager votre lien d'invitation !
              </p>
            </div>

            <div className="bg-[#050508] border border-gray-850 p-6 rounded-2xl space-y-3 relative overflow-hidden">
              <div className="w-10 h-10 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
              <h4 className="font-display font-bold text-white text-base">Réseau Multi-Pays</h4>
              <p className="text-gray-400 text-xs leading-relaxed">
                Étendez votre activité au Burkina Faso, Mali, Niger, Côte d'Ivoire ou Sénégal. Profitez de nos passerelles de paiement Wave, Moov et Orange Money.
              </p>
            </div>
          </div>

          {/* Core Join / Community Section ("Travailler avec nous" / "Devenir Revendeur") */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Explanations (5 columns) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-gray-950/60 p-6 rounded-3xl border border-gray-900 space-y-5">
                <h3 className="font-display font-black text-lg text-white">REJOINDRE L'ÉQUIPE GB STORES UC</h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Nous recherchons des partenaires motivés pour étendre notre réseau de rechargement de crédits et d'UC PUBG Mobile en Afrique de l'Ouest. Saisissez l'opportunité de travailler avec nous !
                </p>

                <div className="space-y-4 pt-3 border-t border-gray-900/60">
                  <div className="flex items-start space-x-3 text-xs">
                    <div className="w-5 h-5 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                    <div>
                      <p className="font-bold text-white">Postuler comme Revendeur</p>
                      <p className="text-gray-400 text-[11px] mt-0.5">Revendez directement des UC en gérant votre propre portefeuille de joueurs locaux.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 text-xs">
                    <div className="w-5 h-5 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                    <div>
                      <p className="font-bold text-white">Postuler comme Partenaire</p>
                      <p className="text-gray-400 text-[11px] mt-0.5">Faites la promotion de notre plateforme en ligne et gagnez de fortes commissions passives sur chaque vente.</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 text-xs">
                    <div className="w-5 h-5 rounded-full bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 flex items-center justify-center flex-shrink-0 font-bold">3</div>
                    <div>
                      <p className="font-bold text-white">Rejoindre l'équipe / Staff</p>
                      <p className="text-gray-400 text-[11px] mt-0.5">Devenez gestionnaire de communauté, créateur de contenu de marque ou support WhatsApp officiel.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-400/5 border border-yellow-400/15 p-4 rounded-xl flex items-center space-x-3.5">
                  <Info className="h-4.5 w-4.5 text-yellow-400 flex-shrink-0" />
                  <p className="text-[11px] text-gray-400 leading-relaxed">
                    <b>Précision :</b> Après validation de votre candidature, l'administrateur activera vos privilèges et vous aurez un accès complet à l'Espace Revendeur.
                  </p>
                </div>
              </div>
            </div>

            {/* Application form (7 columns) */}
            <div className="lg:col-span-7 bg-gray-950/60 p-6 rounded-3xl border border-gray-900 relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-2xl"></div>
              
              <h3 className="font-display font-black text-lg text-white pb-3 border-b border-gray-900">
                FORMULAIRE DE CANDIDATURE DIRECTE
              </h3>

              {!currentUser ? (
                <div className="py-12 text-center space-y-4">
                  <UserPlus className="h-10 w-10 text-gray-700 mx-auto" />
                  <h4 className="text-white font-bold text-sm">Authentification Requise</h4>
                  <p className="text-gray-500 text-xs max-w-sm mx-auto leading-relaxed">
                    Pour soumettre votre candidature et pouvoir suivre votre dossier, vous devez disposer d'un compte joueur actif sur notre plateforme.
                  </p>
                  <button
                    onClick={() => onNavigateToTab('account')}
                    className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-black font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer"
                  >
                    S'inscrire ou S'identifier en 5 secondes
                  </button>
                </div>
              ) : isSubmitted ? (
                <div className="py-12 text-center space-y-4">
                  <Check className="h-12 w-12 text-green-400 border border-green-500/20 bg-green-500/5 rounded-2xl mx-auto flex items-center justify-center" />
                  <h4 className="text-white font-bold text-base">Candidature Soumise avec Succès !</h4>
                  <p className="text-gray-400 text-xs max-w-md mx-auto leading-relaxed">
                    Votre candidature a été correctement sauvegardée dans notre base de données. L'administrateur va l'examiner et vous contacter rapidement. Merci de faire partie de la communauté GB STORES !
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmitApplication} className="space-y-4 mt-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Role Choice */}
                    <div>
                      <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1.5">Je souhaite postuler comme *</label>
                      <select
                        value={partnerType}
                        onChange={(e) => setPartnerType(e.target.value as any)}
                        className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none"
                      >
                        <option value="reseller">Revendeur d'UC PUBG</option>
                        <option value="partner">Partenaire Affilié / Promoteur</option>
                        <option value="team">Rejoindre l'équipe GB STORES</option>
                      </select>
                    </div>

                    {/* WhatsApp */}
                    <div>
                      <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1.5">Mon numéro WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="Ex: +226 76 54 97 37"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Country */}
                    <div>
                      <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1.5">Pays de résidence *</label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none"
                      >
                        <option value="Burkina Faso">Burkina Faso 🇧🇫</option>
                        <option value="Côte d'Ivoire">Côte d'Ivoire 🇨🇮</option>
                        <option value="Mali">Mali 🇲🇱</option>
                        <option value="Niger">Niger 🇳🇪</option>
                        <option value="Sénégal">Sénégal 🇸🇳</option>
                        <option value="Togo">Togo 🇹🇬</option>
                        <option value="Autre">Autre Pays</option>
                      </select>
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1.5">Ville d'activité *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Ouagadougou, Bobo-Dioulasso..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1.5">Votre motivation / Expérience (Optionnel)</label>
                    <textarea
                      rows={4}
                      placeholder="Pourquoi souhaitez-vous travailler avec nous ? Précisez si vous gérez déjà des groupes de joueurs ou une communauté PUBG Mobile..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                    />
                  </div>

                  {resellerStatus === 'rejected' && (
                    <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-xl text-xs text-red-400">
                      ⚠️ Votre précédente demande a été refusée ou réinitialisée. Vous pouvez soumettre une nouvelle candidature ci-dessus avec de meilleures informations.
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-black rounded-xl text-xs shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                    <span>SOUMETTRE MA CANDIDATURE À L'ADMINISTRATEUR</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
