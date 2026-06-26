import { UCOffer, PaymentMethod, RecentTransaction, FAQItem, Promotion, NewsPost } from './types';

export const UC_OFFERS: UCOffer[] = [
  { id: 'uc_60', ucAmount: 60, bonusUc: 4, priceFcfa: 850, tag: 'Débutant' },
  { id: 'uc_300', ucAmount: 300, bonusUc: 25, priceFcfa: 3600, tag: 'Recommandé' },
  { id: 'uc_600', ucAmount: 600, bonusUc: 60, priceFcfa: 7000, isPopular: true, tag: 'Pass Royale' },
  { id: 'uc_1500', ucAmount: 1500, bonusUc: 300, priceFcfa: 17500, tag: 'Avantageux' },
  { id: 'uc_3000', ucAmount: 3000, bonusUc: 850, priceFcfa: 37500, isPopular: true, tag: 'Super Offre' },
  { id: 'uc_6000', ucAmount: 6000, bonusUc: 2100, priceFcfa: 80000, tag: 'Gamer Pro' },
  { id: 'uc_10500', ucAmount: 10500, bonusUc: 3250, priceFcfa: 130000, tag: 'Légendaire' },
  { id: 'uc_12000', ucAmount: 12000, bonusUc: 4200, priceFcfa: 150000, tag: 'Mythique' },
  { id: 'uc_20000', ucAmount: 20000, bonusUc: 6100, priceFcfa: 227000, tag: 'Ultime' },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'orange',
    name: 'Orange Money',
    displayName: 'Orange Money Burkina',
    number: '*144*4*2*76549737*montant#',
    recipientName: 'GB STORES UC SARL',
    instructions: 'Composez le code USSD ci-dessus, ou effectuez le transfert direct au numéro +226 76 54 97 37.',
    colorClass: 'from-orange-500 to-orange-600 focus:ring-orange-500',
    iconName: 'orange',
  },
  {
    id: 'moov',
    name: 'Moov Money',
    displayName: 'Moov Money Burkina',
    number: '*156*4*1*76549737*montant#',
    recipientName: 'GB STORES RECHARGE',
    instructions: 'Composez le code USSD ci-dessus ou faites un transfert direct de compte à compte au +226 76 54 97 37.',
    colorClass: 'from-blue-600 to-indigo-700 focus:ring-blue-500',
    iconName: 'moov',
  },
  {
    id: 'wave',
    name: 'Wave',
    displayName: 'Wave Burkina',
    number: 'Scan QR ou Transfert direct',
    recipientName: 'GB STORES SERVICES',
    instructions: 'Ouvrez l\'application Wave, scannez le code marchand ou envoyez directement au +226 76 54 97 37.',
    colorClass: 'from-cyan-500 to-blue-500 focus:ring-cyan-400',
    iconName: 'wave',
  },
];

export const RECENT_TRANSACTIONS: RecentTransaction[] = [
  { id: 'tx1', playerId: '5139***84', ucAmount: 300, bonusUc: 25, paymentMethod: 'Orange Money', timeAgo: 'Il y a 1 min', status: 'completed' },
  { id: 'tx2', playerId: '5877***11', ucAmount: 3000, bonusUc: 850, paymentMethod: 'Wave', timeAgo: 'Il y a 3 mins', status: 'completed' },
  { id: 'tx3', playerId: '5561***90', ucAmount: 60, bonusUc: 0, paymentMethod: 'Moov Money', timeAgo: 'Il y a 6 mins', status: 'completed' },
  { id: 'tx4', playerId: '5904***32', ucAmount: 6000, bonusUc: 2100, paymentMethod: 'Orange Money', timeAgo: 'Il y a 9 mins', status: 'completed' },
  { id: 'tx5', playerId: '5120***47', ucAmount: 600, bonusUc: 60, paymentMethod: 'Wave', timeAgo: 'Il y a 12 mins', status: 'completed' },
  { id: 'tx6', playerId: '5230***18', ucAmount: 12000, bonusUc: 4200, paymentMethod: 'Orange Money', timeAgo: 'Il y a 15 mins', status: 'completed' },
];

export const FAQ_ITEMS: FAQItem[] = [
  {
    category: 'general',
    question: 'Avez-vous besoin du mot de passe de mon compte PUBG ?',
    answer: 'Absolument pas ! GB STORES UC s\'engage pour la sécurité totale de votre compte. Nous n\'avons besoin de RIEN d\'autre que votre Player ID (ID de joueur) PUBG Mobile pour effectuer la recharge de manière 100% officielle.'
  },
  {
    category: 'general',
    question: 'Combien de temps prend la livraison des UC ?',
    answer: 'La recharge est ultra-rapide ! Généralement, vos UC sont crédités sur votre compte PUBG Mobile dans un délai de 5 à 15 minutes après validation de la preuve de paiement par notre équipe.'
  },
  {
    category: 'payment',
    question: 'Quels sont les moyens de paiement acceptés au Burkina Faso ?',
    answer: 'Nous acceptons les principaux moyens de paiement mobile locaux : Orange Money, Moov Money et Wave. C\'est simple, sécurisé et instantané.'
  },
  {
    category: 'payment',
    question: 'Comment envoyer la preuve de paiement ?',
    answer: 'Après avoir effectué le transfert (Orange Money, Moov ou Wave), faites une capture d\'écran (screenshot) du message de confirmation de transfert reçu ou du reçu de l\'application, puis téléversez-la sur notre configurateur ou envoyez-la directement par WhatsApp.'
  },
  {
    category: 'delivery',
    question: 'Où puis-je trouver mon ID de joueur PUBG Mobile ?',
    answer: 'Ouvrez PUBG Mobile. Dans le coin supérieur gauche, appuyez sur l\'avatar de votre profil. Votre ID de joueur est une suite de chiffres (par exemple : 5139284711) affichée au-dessus de votre pseudonyme. Vous pouvez la copier en un clic.'
  },
  {
    category: 'delivery',
    question: 'Que se passe-t-il si je me trompe d\'ID ?',
    answer: 'Veuillez double-vérifier attentivement votre ID avant de commander. Comme la recharge est traitée directement via l\'API officielle de PUBG Mobile avec l\'ID fourni, nous ne pouvons pas annuler une transaction une fois qu\'elle a été envoyée. Si vous avez un doute, notre support client est disponible sur WhatsApp pour vous aider.'
  }
];

export const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 'promo_aphrodite',
    title: 'Événement Spécial : Aberrant Aphrodite Gilt Set',
    description: 'Équipez le nouveau set légendaire "Aberrant Aphrodite" et dominez le champ de bataille ! Économisez au moins 11% sur tous vos packs d\'UC pour cette occasion exclusive !',
    badge: '11% d\'Économie',
    bonusText: 'Prix Spéciaux',
    active: true,
    date: '2026-06-25'
  },
  {
    id: 'promo_1',
    title: 'Super Bonus de Ramadan & Été',
    description: 'Obtenez jusqu\'à +100 UC supplémentaires sur tous les packs supérieurs à 1500 UC !',
    badge: 'Super Bonus',
    bonusText: '+15% de bonus UC',
    active: true,
    date: '2026-06-25'
  },
  {
    id: 'promo_2',
    title: 'Nouveau Tarif Réduit',
    description: 'Le pack de 60+4 UC est désormais disponible à seulement 850 FCFA au lieu de 900 FCFA !',
    badge: 'Baisse de prix',
    bonusText: '-50 FCFA',
    active: true,
    date: '2026-06-24'
  }
];

export const INITIAL_NEWS: NewsPost[] = [
  {
    id: 'news_aphrodite',
    title: 'Nouveau Set Mythique "Aberrant Aphrodite" Disponible !',
    description: 'Le magnifique set "Aberrant Aphrodite Gilt Set" est enfin prêt à être équipé. Ne ratez pas l\'occasion d\'affirmer votre style sur le champ de bataille PUBG Mobile. Rechargez vos UC à prix réduit chez GB STORES !',
    type: 'video',
    videoUrl: 'https://www.youtube.com/embed/fD3lI2H_7v0',
    date: '2026-06-25',
    active: true
  },
  {
    id: 'news_1',
    title: 'Arrivée de la nouvelle saison Royale Pass !',
    description: 'La nouvelle saison de PUBG MOBILE est officiellement disponible. Rechargez vos UC en quelques secondes pour acquérir le pass d\'élite et débloquer les skins mythiques !',
    type: 'video',
    videoUrl: 'https://www.youtube.com/embed/Z9Uq_16gW4E',
    date: '2026-06-25',
    active: true
  },
  {
    id: 'news_2',
    title: 'Affiche Officielle GB STORES UC',
    description: 'Découvrez notre nouvelle affiche publicitaire officielle pour vos partages sur WhatsApp et Facebook.',
    type: 'image',
    date: '2026-06-23',
    active: true
  }
];

