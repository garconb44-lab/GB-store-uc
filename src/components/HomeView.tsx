import React, { useState, useMemo } from 'react';
import { 
  MessageSquare, Coins, Flame, ShieldCheck, Zap, Share2, Briefcase, 
  Smartphone, Download, Info, CheckCircle, X, Star, Quote, Plus 
} from 'lucide-react';
import { RECENT_TRANSACTIONS } from '../data';
import appLogo from '../assets/images/game_over_logo_1782296492232.jpg';

interface Testimonial {
  id: string;
  name: string;
  pubgId: string;
  rating: number;
  comment: string;
  date: string;
}

const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Inoussa D.',
    pubgId: '519283748',
    rating: 5,
    comment: 'Livraison ultra rapide ! J\'ai reçu mes 325 UC en moins de 10 minutes pour le nouveau pass. Service hyper fiable, je recommande vivement !',
    date: '25/06/2026'
  },
  {
    id: 't-2',
    name: 'Aziz K.',
    pubgId: '588231043',
    rating: 5,
    comment: 'Le meilleur site de recharge UC au Burkina Faso. Très bon taux et l\'assistance WhatsApp est super réactive. Déjà plus de 10 commandes réussies.',
    date: '24/06/2026'
  },
  {
    id: 't-3',
    name: 'Chérifatou O.',
    pubgId: '512209938',
    rating: 5,
    comment: 'Franchement rien à dire. Simple, sécurisé et rapide. Les commissions de parrainage m\'ont permis de recharger gratuitement aujourd\'hui !',
    date: '23/06/2026'
  },
  {
    id: 't-4',
    name: 'Salif S.',
    pubgId: '563402910',
    rating: 4,
    comment: 'Toujours au top ! J\'ai fait l\'achat pour le set Aphrodite et j\'ai économisé plus de 11%. Merci GB STORES !',
    date: '22/06/2026'
  }
];

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  onShare: () => void;
  isInstallable?: boolean;
  isInstalled?: boolean;
  onInstall?: () => void;
}

export default function HomeView({ 
  onNavigate, 
  onShare,
  isInstallable = false,
  isInstalled = false,
  onInstall = () => {}
}: HomeViewProps) {
  const [showGuide, setShowGuide] = useState(false);

  // Testimonial States
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    if (typeof window === 'undefined') return INITIAL_TESTIMONIALS;
    try {
      const stored = localStorage.getItem('gb_stores_testimonials');
      return stored ? JSON.parse(stored) : INITIAL_TESTIMONIALS;
    } catch (e) {
      return INITIAL_TESTIMONIALS;
    }
  });

  const [newFeedbackOpen, setNewFeedbackOpen] = useState(false);
  const [newFeedbackName, setNewFeedbackName] = useState('');
  const [newFeedbackPubgId, setNewFeedbackPubgId] = useState('');
  const [newFeedbackRating, setNewFeedbackRating] = useState(5);
  const [newFeedbackComment, setNewFeedbackComment] = useState('');
  const [newFeedbackSuccess, setNewFeedbackSuccess] = useState(false);
  const [newFeedbackError, setNewFeedbackError] = useState<string | null>(null);

  const handleSubmitTestimonial = (e: React.FormEvent) => {
    e.preventDefault();
    setNewFeedbackError(null);
    setNewFeedbackSuccess(false);

    if (!newFeedbackName.trim()) {
      setNewFeedbackError('Veuillez renseigner votre Nom ou Pseudo !');
      return;
    }
    if (!newFeedbackPubgId.trim()) {
      setNewFeedbackError('Veuillez renseigner votre ID PUBG Mobile !');
      return;
    }
    if (!newFeedbackComment.trim()) {
      setNewFeedbackError('Veuillez écrire votre commentaire !');
      return;
    }

    const newTestimonial: Testimonial = {
      id: `t-user-${Date.now()}`,
      name: newFeedbackName.trim(),
      pubgId: newFeedbackPubgId.trim(),
      rating: newFeedbackRating,
      comment: newFeedbackComment.trim(),
      date: new Date().toLocaleDateString('fr-FR')
    };

    const updated = [newTestimonial, ...testimonials];
    setTestimonials(updated);
    try {
      localStorage.setItem('gb_stores_testimonials', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    // Reset fields & show success state
    setNewFeedbackName('');
    setNewFeedbackPubgId('');
    setNewFeedbackRating(5);
    setNewFeedbackComment('');
    setNewFeedbackSuccess(true);
    setTimeout(() => {
      setNewFeedbackSuccess(false);
      setNewFeedbackOpen(false);
    }, 4000);
  };

  const isIOS = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  }, []);

  const [showIosPrompt, setShowIosPrompt] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    return isIosDevice && !isStandalone;
  });

  return (
    <div className="space-y-10 animate-fade-in py-4">
      {/* Centered Hero Logo Block */}
      <div className="flex flex-col items-center justify-center text-center py-12 px-4 relative">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl -z-10"></div>
        
        {/* Main Logo Container */}
        <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.2)] border-2 border-yellow-400/40 transform hover:scale-105 hover:rotate-2 transition-all duration-500">
          <img
            src={appLogo}
            alt="GB STORES UC Logo"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Title & Slogan */}
        <h1 className="mt-8 font-display text-4xl md:text-5xl lg:text-6xl font-black tracking-wider text-white">
          GB STORES <span className="text-yellow-400">UC</span>
        </h1>
        <p className="mt-3 text-base md:text-lg text-yellow-400/90 font-semibold max-w-xl font-display tracking-wide uppercase">
          Recharge rapide et sécurisée d'UC PUBG MOBILE
        </p>

        {/* WhatsApp Banner */}
        <div className="mt-6 flex flex-col sm:flex-row items-center gap-3 bg-gray-950/80 px-6 py-3 rounded-2xl border border-yellow-400/20 shadow-lg">
          <span className="text-xs text-gray-400 font-mono">SUPPORT DIRECT WHATSAPP :</span>
          <a
            href="https://wa.me/22676549737?text=Bonjour%20GB%20STORES%20UC,%20je%20souhaite%20effectuer%20une%20recharge%20de%20UC."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-green-400 hover:text-green-300 font-mono font-black text-base transition-colors"
          >
            <MessageSquare className="h-5 w-5 fill-current text-green-400" />
            <span>+226 76 54 97 37</span>
          </a>
        </div>
      </div>

      {/* PWA App Installation Section */}
      <div className="bg-gradient-to-r from-yellow-400/10 via-amber-500/5 to-transparent border border-yellow-400/20 rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden" id="pwa-install-banner">
        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl -z-10"></div>
        <div className="flex items-start space-x-4">
          <div className="bg-yellow-400/10 text-yellow-400 p-3.5 rounded-2xl border border-yellow-400/20 flex-shrink-0">
            <Smartphone className="h-6 w-6" />
          </div>
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display font-black text-base md:text-lg text-white uppercase tracking-wider">
                INSTALLER L'APPLICATION OFFICIELLE
              </h3>
              {isInstalled ? (
                <span className="bg-green-500/20 text-green-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-green-500/25 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Installée
                </span>
              ) : (
                <span className="bg-yellow-400/20 text-yellow-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-yellow-400/25">
                  Recommandé
                </span>
              )}
            </div>
            <p className="text-gray-400 text-xs md:text-sm leading-relaxed">
              Installez l'application sur votre écran d'accueil pour un accès ultra-rapide sans passer par le navigateur, des notifications en temps réel et un chargement optimisé.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          {!isInstalled && (
            <button
              onClick={onInstall}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center space-x-2 cursor-pointer shadow-lg shadow-yellow-400/10 w-full sm:w-auto"
            >
              <Download className="h-4.5 w-4.5" />
              <span>Installer maintenant</span>
            </button>
          )}

          <button
            onClick={() => setShowGuide(!showGuide)}
            className="bg-gray-950/60 hover:bg-gray-950 text-gray-300 hover:text-white border border-gray-800 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer w-full sm:w-auto"
          >
            <Info className="h-4.5 w-4.5 text-yellow-400" />
            <span>{showGuide ? "Masquer le guide" : "Guide d'installation"}</span>
          </button>

          <button
            onClick={() => setShowIosPrompt(true)}
            className="bg-gray-950/60 hover:bg-gray-950 text-gray-300 hover:text-white border border-gray-800 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-2 cursor-pointer w-full sm:w-auto"
          >
            <Smartphone className="h-4.5 w-4.5 text-yellow-400" />
            <span>Aide iPhone / iOS</span>
          </button>
        </div>

        {/* Guided details */}
        {showGuide && (
          <div className="w-full lg:col-span-2 border-t border-gray-900/80 pt-5 mt-4 space-y-4 font-mono text-[11px] text-gray-400 leading-relaxed animate-fade-in">
            <h4 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
              <span>🔧 COMMENT INSTALLER SUR VOTRE APPAREIL :</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/40 p-4 rounded-xl border border-gray-900 space-y-2">
                <span className="text-yellow-400 font-bold uppercase block text-xs">📱 Sur Android (Chrome / Edge / Samsung) :</span>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Cliquez sur le bouton <strong className="text-white font-sans">"Installer maintenant"</strong> ci-dessus ou sur l'invite de votre navigateur.</li>
                  <li>Confirmez en cliquant sur <strong className="text-white font-sans">"Installer"</strong> ou <strong className="text-white font-sans">"Ajouter à l'écran d'accueil"</strong>.</li>
                  <li>L'application apparaîtra instantanément avec notre logo officiel !</li>
                </ol>
              </div>
              <div className="bg-black/40 p-4 rounded-xl border border-gray-900 space-y-2">
                <span className="text-yellow-400 font-bold uppercase block text-xs">🍏 Sur iPhone / iPad (Safari) :</span>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Ouvrez l'application dans le navigateur officiel <strong className="text-white font-sans">Safari</strong>.</li>
                  <li>Appuyez sur le bouton de <strong className="text-white font-sans">Partage</strong> (l'icône carrée avec une flèche vers le haut en bas de l'écran).</li>
                  <li>Faites défiler vers le bas et sélectionnez <strong className="text-white font-sans">"Sur l'écran d'accueil"</strong>.</li>
                  <li>Cliquez sur <strong className="text-white font-sans">"Ajouter"</strong> en haut à droite pour finaliser !</li>
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* iOS/Safari PWA Installation Modal */}
      {showIosPrompt && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4 bg-black/85 backdrop-blur-md animate-fade-in" id="ios-install-modal">
          <div className="bg-[#050508] border border-gray-900 rounded-3xl max-w-md w-full p-6 shadow-[0_0_50px_rgba(234,179,8,0.15)] relative space-y-6">
            <button 
              onClick={() => setShowIosPrompt(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white p-1 rounded-full hover:bg-gray-950 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="inline-flex bg-yellow-400/10 text-yellow-400 p-3 rounded-2xl border border-yellow-400/20 mb-2">
                <Smartphone className="h-8 w-8" />
              </div>
              <h3 className="font-display font-black text-lg text-white uppercase tracking-wider">
                INSTALLER SUR IPHONE & IPAD
              </h3>
              <p className="text-gray-400 text-xs font-mono leading-relaxed max-w-sm mx-auto">
                Sur iOS, l'installation se fait en quelques secondes via le navigateur officiel Safari.
              </p>
            </div>

            <div className="bg-black/50 rounded-2xl p-4 border border-gray-900 space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-yellow-400 text-black font-black text-xs h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 font-sans">
                  1
                </div>
                <p className="text-gray-300 text-xs">
                  Assurez-vous d'ouvrir cette page avec le navigateur <strong className="text-white font-sans">Safari</strong>.
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-yellow-400 text-black font-black text-xs h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 font-sans">
                  2
                </div>
                <div className="text-gray-300 text-xs space-y-1">
                  <p className="flex items-center gap-1.5 flex-wrap">
                    Appuyez sur le bouton de <strong className="text-white font-sans">Partage</strong> 
                    <span className="inline-flex items-center gap-1 bg-gray-900 text-yellow-400 px-2 py-0.5 rounded border border-gray-800 text-[10px] font-semibold">
                      <Share2 className="h-3.5 w-3.5 inline" /> Partager
                    </span>
                  </p>
                  <p className="text-[10px] text-gray-500 font-mono">
                    (L'icône carrée avec une flèche vers le haut en bas de votre écran)
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-yellow-400 text-black font-black text-xs h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 font-sans">
                  3
                </div>
                <p className="text-gray-300 text-xs">
                  Faites défiler le menu puis cliquez sur <strong className="text-white font-sans">"Sur l'écran d'accueil"</strong>.
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-yellow-400 text-black font-black text-xs h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 font-sans">
                  4
                </div>
                <p className="text-gray-300 text-xs">
                  Cliquez enfin sur <strong className="text-white font-sans">"Ajouter"</strong> en haut à droite pour valider !
                </p>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <button
                onClick={() => setShowIosPrompt(false)}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer w-full text-center font-sans"
              >
                J'ai compris, afficher l'app !
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Actions Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Tarifs */}
        <div 
          onClick={() => onNavigate('offers')}
          className="bg-gradient-to-b from-gray-950 to-[#0c0c14] border border-gray-800 hover:border-yellow-400/50 p-6 rounded-2xl group cursor-pointer transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
          id="home-card-offers"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/5 rounded-full blur-2xl group-hover:bg-yellow-400/15 transition-all"></div>
          <div className="bg-yellow-400/10 text-yellow-400 p-3.5 rounded-xl border border-yellow-400/20 w-fit mb-4 group-hover:scale-110 transition-transform">
            <Coins className="h-6 w-6" />
          </div>
          <h3 className="font-display text-xl font-bold text-white">Tarifs UC PUBG</h3>
          <p className="text-gray-400 text-xs mt-2 leading-relaxed">
            Consultez notre grille de prix officielle à partir de 850 FCFA. Packs officiels livrés en 10 minutes directement sur votre ID.
          </p>
          <span className="inline-flex items-center space-x-1.5 text-yellow-400 font-bold text-xs mt-4">
            <span>Voir les Tarifs</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </div>

        {/* Card 2: Promotions */}
        <div 
          onClick={() => onNavigate('promotions')}
          className="bg-gradient-to-b from-gray-950 to-[#0c0c14] border border-gray-800 hover:border-yellow-400/50 p-6 rounded-2xl group cursor-pointer transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
          id="home-card-promo"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/15 transition-all"></div>
          <div className="bg-red-500/10 text-red-400 p-3.5 rounded-xl border border-red-500/20 w-fit mb-4 group-hover:scale-110 transition-transform">
            <Flame className="h-6 w-6" />
          </div>
          <h3 className="font-display text-xl font-bold text-white">Promotions Actuelles</h3>
          <p className="text-gray-400 text-xs mt-2 leading-relaxed">
            Profitez de réductions de prix et de bonus d'UC supplémentaires offerts directement par l'administrateur !
          </p>
          <span className="inline-flex items-center space-x-1.5 text-red-400 font-bold text-xs mt-4">
            <span>Découvrir les offres</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </div>

        {/* Card 3: Parrainage */}
        <div 
          onClick={() => onNavigate('referral')}
          className="bg-gradient-to-b from-gray-950 to-[#0c0c14] border border-gray-800 hover:border-yellow-400/50 p-6 rounded-2xl group cursor-pointer transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
          id="home-card-referral"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-400/5 rounded-full blur-2xl group-hover:bg-yellow-400/15 transition-all"></div>
          <div className="bg-amber-500/10 text-amber-400 p-3.5 rounded-xl border border-amber-500/20 w-fit mb-4 group-hover:scale-110 transition-transform">
            <Zap className="h-6 w-6" />
          </div>
          <h3 className="font-display text-xl font-bold text-white">Gagnez des UC Gratuits</h3>
          <p className="text-gray-400 text-xs mt-2 leading-relaxed">
            Invitez vos amis avec votre lien de parrainage unique. Obtenez des bonus récurrents et montez dans le classement !
          </p>
          <span className="inline-flex items-center space-x-1.5 text-amber-400 font-bold text-xs mt-4">
            <span>Parrainer des amis</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </div>

        {/* Card 4: Devenir Revendeur */}
        <div 
          onClick={() => onNavigate('partner')}
          className="bg-gradient-to-b from-gray-950 to-[#0c0c14] border border-gray-800 hover:border-yellow-400/50 p-6 rounded-2xl group cursor-pointer transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
          id="home-card-partner"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/5 rounded-full blur-2xl group-hover:bg-green-500/15 transition-all"></div>
          <div className="bg-green-500/10 text-green-400 p-3.5 rounded-xl border border-green-500/20 w-fit mb-4 group-hover:scale-110 transition-transform">
            <Briefcase className="h-6 w-6" />
          </div>
          <h3 className="font-display text-xl font-bold text-white">Devenir Revendeur</h3>
          <p className="text-gray-400 text-xs mt-2 leading-relaxed">
            Rejoignez notre réseau officiel. Profitez de tarifs d'achat réduits exclusifs et gagnez des commissions sur chaque recharge de votre région !
          </p>
          <span className="inline-flex items-center space-x-1.5 text-green-400 font-bold text-xs mt-4">
            <span>Devenir Partenaire</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </div>
      </div>

      {/* Safety Notice Banner */}
      <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-2xl p-6 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-5 shadow-inner">
        <div className="bg-yellow-400/10 text-yellow-400 p-3 rounded-xl border border-yellow-400/20 flex-shrink-0">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div className="space-y-1 text-center md:text-left">
          <h4 className="font-display font-black text-yellow-400 text-lg uppercase tracking-wide">
            MESSAGE TRÈS IMPORTANT
          </h4>
          <p className="text-gray-300 text-sm font-medium leading-relaxed">
            Nous n'avons pas besoin du code de vérification PUBG MOBILE ou de votre mot de passe.
          </p>
          <p className="text-gray-400 text-xs leading-relaxed">
            Seul l'ID (numéro d'identification) de votre joueur est strictement nécessaire pour effectuer le rechargement de vos UC. Ne partagez jamais vos identifiants secrets.
          </p>
        </div>
      </div>

      {/* Testimonials (Témoignages Clients) Section */}
      <div className="bg-gray-950/20 p-6 rounded-2xl border border-gray-900 space-y-6" id="client-testimonials-section">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-900">
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-400/10 text-yellow-400 p-2.5 rounded-xl border border-yellow-400/20">
              <Quote className="h-5 w-5 transform rotate-180" />
            </div>
            <div>
              <h3 className="font-display font-black text-base text-white uppercase tracking-wider">
                TÉMOIGNAGES CLIENTS
              </h3>
              <p className="text-[10px] font-mono text-gray-500">AVIS DES JOUEURS SATISFAITS DE GB STORES</p>
            </div>
          </div>

          <button
            onClick={() => setNewFeedbackOpen(!newFeedbackOpen)}
            className="inline-flex items-center justify-center space-x-1.5 bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-[0_4px_12px_rgba(234,179,8,0.15)] hover:shadow-[0_4px_20px_rgba(234,179,8,0.3)] self-start sm:self-auto font-sans"
          >
            <Plus className="h-4 w-4" />
            <span>Laisser un avis</span>
          </button>
        </div>

        {/* Dynamic / Interactive Feedback Submission Form */}
        {newFeedbackOpen && (
          <form 
            onSubmit={handleSubmitTestimonial}
            className="bg-[#050508] border border-yellow-400/20 p-5 rounded-2xl space-y-4 animate-fade-in"
          >
            <h4 className="font-display font-black text-xs text-white uppercase tracking-wider text-yellow-400">
              Votre avis nous intéresse !
            </h4>

            {newFeedbackError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3 text-xs font-sans">
                ⚠️ {newFeedbackError}
              </div>
            )}

            {newFeedbackSuccess && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl p-3 text-xs font-sans">
                🎉 Merci ! Votre témoignage a été publié avec succès.
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                  Nom / Pseudo
                </label>
                <input
                  type="text"
                  placeholder="Ex: Aziz K."
                  value={newFeedbackName}
                  onChange={(e) => setNewFeedbackName(e.target.value)}
                  className="w-full bg-black/40 border border-gray-800 focus:border-yellow-400/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                  ID PUBG Mobile
                </label>
                <input
                  type="text"
                  placeholder="Ex: 588231043"
                  value={newFeedbackPubgId}
                  onChange={(e) => setNewFeedbackPubgId(e.target.value)}
                  className="w-full bg-black/40 border border-gray-800 focus:border-yellow-400/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                Note de satisfaction
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewFeedbackRating(star)}
                    className="p-1 hover:scale-115 transition-transform cursor-pointer"
                  >
                    <Star 
                      className={`h-6 w-6 transition-colors ${
                        star <= newFeedbackRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-700'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs text-gray-400 font-mono ml-2">({newFeedbackRating}/5)</span>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-1.5">
                Votre commentaire
              </label>
              <textarea
                rows={3}
                placeholder="Partagez votre expérience avec GB STORES (vitesse de livraison, tarifs...)"
                value={newFeedbackComment}
                onChange={(e) => setNewFeedbackComment(e.target.value)}
                className="w-full bg-black/40 border border-gray-800 focus:border-yellow-400/50 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none font-sans resize-none"
              ></textarea>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setNewFeedbackOpen(false);
                  setNewFeedbackError(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-black uppercase text-gray-400 hover:text-white transition-colors cursor-pointer font-sans"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer font-sans"
              >
                Publier l'avis
              </button>
            </div>
          </form>
        )}

        {/* Testimonials List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonials.map((testi) => (
            <div 
              key={testi.id}
              className="bg-[#050508] border border-gray-900 rounded-2xl p-5 space-y-3 relative overflow-hidden group hover:border-yellow-400/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-3.5 w-3.5 ${
                        i < testi.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-800'
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-[10px] text-gray-500 font-mono">{testi.date}</span>
              </div>

              <p className="text-gray-300 text-xs leading-relaxed italic font-sans">
                "{testi.comment}"
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-gray-900/60 text-[10px] font-mono">
                <span className="text-gray-300 font-bold font-sans">{testi.name}</span>
                <span className="text-yellow-400/80">ID: {testi.pubgId.replace(/(?<=.{3}).(?=.{2})/g, '*')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="bg-gray-950/40 p-6 rounded-2xl border border-gray-800">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-900">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
            <span className="text-xs font-bold text-gray-400 font-mono uppercase tracking-wider">COMMANDES EN DIRECT</span>
          </div>
          <span className="text-[10px] text-gray-500 font-mono">Burkina Faso</span>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {RECENT_TRANSACTIONS.map((tx) => (
            <div key={tx.id} className="bg-[#050508] p-3 rounded-xl border border-gray-800/80 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white font-mono">ID: {tx.playerId}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{tx.timeAgo} • par {tx.paymentMethod}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-yellow-400">+{tx.ucAmount + tx.bonusUc} UC</span>
                <p className="text-[9px] text-green-500 font-bold font-mono">Livré ✓</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
