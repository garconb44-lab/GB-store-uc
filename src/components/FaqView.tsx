import React, { useState } from 'react';
import { 
  HelpCircle, ChevronDown, ChevronUp, Search, 
  Truck, Wallet, ShieldCheck, MessageSquare, 
  Gift, RefreshCw, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FaqItem {
  id: string;
  category: 'delivery' | 'payment' | 'security' | 'general';
  question: string;
  answer: string;
  icon: any;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'delivery',
    question: 'Combien de temps prend la livraison des UC après mon paiement ?',
    answer: 'La livraison est ultra rapide ! Dès réception de votre preuve de paiement sur WhatsApp, notre équipe traite votre demande. En moyenne, vos UC sont crédités directement sur votre ID de jeu PUBG Mobile en moins de 10 minutes chrono.',
    icon: Truck
  },
  {
    id: 'faq-2',
    category: 'payment',
    question: 'Quelles sont les méthodes de paiement acceptées au Burkina Faso ?',
    answer: 'Nous acceptons tous les moyens de paiement locaux populaires et sécurisés : Orange Money, Moov Money, Wave, ainsi que les virements ou dépôts. Tout se fait facilement depuis votre mobile sans frais cachés.',
    icon: Wallet
  },
  {
    id: 'faq-3',
    category: 'security',
    question: 'Mon compte PUBG Mobile risque-t-il d\'être banni ou piraté ?',
    answer: 'Absolument pas ! GB STORES recharge vos UC via les canaux de distribution 100% officiels (Midasbuy et Tencent). De plus, nous ne vous demanderons JAMAIS vos identifiants de connexion ou mot de passe : seule votre ID numérique de joueur (ex: 519283748) suffit pour la livraison. C\'est 100% sécurisé.',
    icon: ShieldCheck
  },
  {
    id: 'faq-4',
    category: 'general',
    question: 'Comment passer une commande étape par étape ?',
    answer: 'C\'est extrêmement simple :\n1. Allez dans l\'onglet "Tarifs UC" et ajoutez le pack de votre choix au panier.\n2. Allez dans votre "Panier", entrez votre ID PUBG, votre nom de joueur et numéro de téléphone.\n3. Choisissez votre mode de paiement, effectuez le transfert et importez la capture d\'écran de la transaction.\n4. Cliquez sur "Valider sur WhatsApp". Vous serez redirigé vers notre assistant WhatsApp avec le message pré-rempli pour une livraison instantanée.',
    icon: Sparkles
  },
  {
    id: 'faq-5',
    category: 'payment',
    question: 'Puis-je commander pour un ami ou faire un cadeau ?',
    answer: 'Oui, tout à fait ! Lors de la saisie de la commande dans le panier, il vous suffit de renseigner l\'ID PUBG Mobile et le nom de jeu de votre ami. Les UC lui seront livrés directement.',
    icon: Gift
  },
  {
    id: 'faq-6',
    category: 'general',
    question: 'Que se passe-t-il si je me trompe d\'ID de joueur lors de ma saisie ?',
    answer: 'Par mesure de sécurité, nous vérifions toujours la correspondance entre l\'ID de joueur et le Pseudo de jeu officiel avant de valider la livraison. En cas d\'incohérence, notre service client vous contactera immédiatement sur WhatsApp pour corriger l\'erreur avant d\'effectuer le transfert.',
    icon: RefreshCw
  },
  {
    id: 'faq-7',
    category: 'security',
    question: 'Qu\'est-ce que l\'Espace Revendeur et comment y adhérer ?',
    answer: 'L\'Espace Revendeur s\'adresse aux personnes souhaitant lancer un business de recharge ou acheter des UC en grande quantité pour leur clan. En devenant revendeur, vous bénéficiez de tarifs préférentiels exclusifs ultra avantageux pour maximiser vos bénéfices.',
    icon: MessageSquare
  }
];

export default function FaqView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'delivery' | 'payment' | 'security' | 'general'>('all');
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const filteredFaqs = FAQ_ITEMS.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleToggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const categories = [
    { id: 'all', label: 'Toutes les questions' },
    { id: 'delivery', label: 'Livraison' },
    { id: 'payment', label: 'Paiements' },
    { id: 'security', label: 'Sécurité & ID' },
    { id: 'general', label: 'Fonctionnement' },
  ];

  return (
    <div className="space-y-8 animate-fade-in py-4 max-w-4xl mx-auto" id="faq-view-container">
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full border border-yellow-400/20 text-xs font-mono uppercase tracking-wider mb-2">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Centre d'aide & support</span>
        </div>
        <h2 className="font-display text-3xl font-black text-white tracking-wide uppercase">
          QUESTIONS <span className="text-yellow-400">FRÉQUENTES</span>
        </h2>
        <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
          Tout savoir sur les tarifs, les délais de livraison d'UC et la sécurité de vos achats sur GB STORES.
        </p>
      </div>

      {/* Search and Filters bar */}
      <div className="bg-[#050508] p-4 rounded-2xl border border-gray-900 space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Rechercher une question ou un mot-clé (ex: Orange, délai, ID)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/50 border border-gray-800 focus:border-yellow-400/40 rounded-xl pl-11 pr-4 py-3 text-xs md:text-sm text-white focus:outline-none placeholder-gray-600 transition-colors font-sans"
            id="faq-search-input"
          />
        </div>

        {/* Categories Pills selector */}
        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-yellow-400 text-black shadow-[0_4px_12px_rgba(234,179,8,0.25)]'
                  : 'bg-gray-900 text-gray-400 hover:text-white hover:bg-gray-850 border border-gray-850'
              }`}
              id={`faq-cat-filter-${cat.id}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion Questions List */}
      <div className="space-y-4" id="faq-accordion-list">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((item) => {
            const Icon = item.icon;
            const isOpen = openId === item.id;

            return (
              <div 
                key={item.id}
                className={`bg-gradient-to-b from-[#07070d] to-[#040408] border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen ? 'border-yellow-400/30 shadow-[0_4px_25px_rgba(234,179,8,0.05)]' : 'border-gray-900 hover:border-gray-800'
                }`}
                id={`faq-item-card-${item.id}`}
              >
                {/* Accordion Trigger Header */}
                <button
                  onClick={() => handleToggle(item.id)}
                  className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 cursor-pointer focus:outline-none select-none"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className={`p-2 rounded-xl border flex-shrink-0 transition-colors ${
                      isOpen ? 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400' : 'bg-gray-900 border-gray-850 text-gray-500'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-display font-bold text-white text-xs md:text-sm tracking-wide leading-snug">
                      {item.question}
                    </span>
                  </div>

                  <div className={`p-1.5 rounded-lg border border-gray-900 bg-[#050508] text-gray-500 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-yellow-400 border-yellow-400/20' : ''
                  }`}>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {/* Collapsible Answer container with animation */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                    >
                      <div className="px-5 pb-5 pt-1 border-t border-gray-900/45 text-xs md:text-sm text-gray-300 leading-relaxed space-y-2 whitespace-pre-line font-sans">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 space-y-3 bg-[#050508] border border-gray-900 rounded-2xl">
            <HelpCircle className="h-10 w-10 text-gray-700 mx-auto animate-pulse" />
            <h4 className="text-gray-400 font-bold text-sm">Aucun résultat trouvé</h4>
            <p className="text-gray-600 text-xs">Ajustez votre recherche ou sélectionnez une autre catégorie d'aide.</p>
          </div>
        )}
      </div>

      {/* Support Call to Action */}
      <div className="bg-gradient-to-r from-yellow-400/5 to-amber-500/5 border border-yellow-400/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="space-y-1">
          <h4 className="font-display font-black text-sm text-white tracking-wide uppercase">
            Vous avez une autre question ?
          </h4>
          <p className="text-[11px] text-gray-400 font-sans">
            Notre support client WhatsApp est disponible 7j/7 pour vous assister et répondre à toutes vos requêtes.
          </p>
        </div>
        <a
          href="https://wa.me/22676549737"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-[0_4px_12px_rgba(234,179,8,0.15)] flex items-center space-x-2 font-sans shrink-0 cursor-pointer"
          id="faq-whatsapp-support-cta"
        >
          <MessageSquare className="h-4 w-4 fill-current" />
          <span>Contacter l'Assistance</span>
        </a>
      </div>
    </div>
  );
}
