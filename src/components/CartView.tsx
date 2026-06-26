import React, { useState } from 'react';
import { CartItem, PaymentMethod } from '../types';
import { PAYMENT_METHODS } from '../data';
import { 
  Trash2, ShoppingBag, ArrowRight, User, Phone, 
  Upload, Check, AlertCircle, Sparkles, Coins 
} from 'lucide-react';
import ucVoucher from '../assets/images/pubg_uc_voucher_1782296939373.jpg';

interface CartViewProps {
  cartItems: CartItem[];
  onRemoveItem: (offerId: string) => void;
  onUpdateQuantity: (offerId: string, qty: number) => void;
  onClearCart: () => void;
  onSubmitOrder: (orderData: {
    pubgId: string;
    userName: string;
    userPhone: string;
    paymentMethodId: string;
    screenshot: string | null;
  }) => void;
  currentUser: any;
}

export default function CartView({ 
  cartItems, 
  onRemoveItem, 
  onUpdateQuantity, 
  onClearCart,
  onSubmitOrder,
  currentUser
}: CartViewProps) {
  
  // States
  const [pubgId, setPubgId] = useState(currentUser?.pubgId || '');
  const [userName, setUserName] = useState(currentUser?.name || '');
  const [userPhone, setUserPhone] = useState(currentUser?.phone || '');
  const [selectedPayment, setSelectedPayment] = useState<string>('orange');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [screenshotName, setScreenshotName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Totals
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.offer.priceFcfa * item.quantity), 0);
  const totalUC = cartItems.reduce((acc, item) => acc + ((item.offer.ucAmount + item.offer.bonusUc) * item.quantity), 0);

  const currentPaymentMethod = PAYMENT_METHODS.find(p => p.id === selectedPayment) || PAYMENT_METHODS[0];

  // Handle file upload (mock base64 conversion)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!pubgId.trim()) {
      setErrorMsg("Veuillez saisir votre ID PUBG Mobile !");
      return;
    }
    if (!userName.trim()) {
      setErrorMsg("Veuillez renseigner votre Nom !");
      return;
    }
    if (!userPhone.trim()) {
      setErrorMsg("Veuillez renseigner votre Téléphone !");
      return;
    }
    if (!screenshot) {
      setErrorMsg("Veuillez téléverser une capture d'écran comme preuve de paiement !");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onSubmitOrder({
        pubgId,
        userName,
        userPhone,
        paymentMethodId: selectedPayment,
        screenshot,
      });
      setIsSubmitting(false);
    }, 1200);
  };

  if (cartItems.length === 0) {
    return (
      <div className="space-y-6 text-center py-12 animate-fade-in max-w-md mx-auto">
        <div className="bg-yellow-400/5 text-yellow-400 p-5 rounded-full border border-yellow-400/15 w-fit mx-auto shadow-inner">
          <ShoppingBag className="h-10 w-10" />
        </div>
        <div className="space-y-1.5">
          <h3 className="font-display font-black text-xl text-white">Votre panier est vide</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Parcourez nos offres de recharges UC PUBG Mobile de qualité supérieure à des prix extrêmement compétitifs, ajoutez-les à votre panier pour finaliser votre commande.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in py-4">
      <div className="text-center max-w-2xl mx-auto space-y-1">
        <h2 className="font-display text-3xl font-black text-white tracking-wide">
          VOTRE <span className="text-yellow-400">PANIER</span>
        </h2>
        <p className="text-sm text-gray-400">
          Vérifiez vos articles, renseignez vos informations de livraison PUBG MOBILE et validez avec votre preuve de paiement.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Cart items and total (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-gray-950/60 rounded-2xl border border-gray-900 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-900">
              <span className="text-xs font-bold text-gray-400 font-mono">ARTICLES ({totalItems})</span>
              <button 
                onClick={onClearCart}
                className="text-[10px] text-red-400 hover:text-red-300 font-bold font-mono uppercase tracking-wider flex items-center space-x-1 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Vider le panier</span>
              </button>
            </div>

            <div className="divide-y divide-gray-900">
              {cartItems.map((item) => (
                <div key={item.offer.id} className="py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0 group">
                  <div className="flex items-center space-x-3.5">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-yellow-500/20 flex-shrink-0">
                      <img 
                        src={ucVoucher} 
                        alt="UC Stack" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <h4 className="font-display font-black text-white text-sm">
                        {item.offer.ucAmount.toLocaleString('fr-FR')} {item.offer.bonusUc > 0 ? `+ ${item.offer.bonusUc}` : ''} UC
                      </h4>
                      <p className="text-[10px] text-gray-500 font-mono mt-0.5">
                        {item.offer.priceFcfa.toLocaleString('fr-FR')} FCFA par pack
                      </p>
                    </div>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center bg-black rounded-lg border border-gray-800">
                      <button
                        onClick={() => onUpdateQuantity(item.offer.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-xs text-gray-400 hover:text-white font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs text-white font-mono font-bold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.offer.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-xs text-gray-400 hover:text-white font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-display font-black text-yellow-400 text-sm font-mono min-w-[70px] text-right">
                      {(item.offer.priceFcfa * item.quantity).toLocaleString('fr-FR')} FCFA
                    </span>

                    <button
                      onClick={() => onRemoveItem(item.offer.id)}
                      className="p-1 text-gray-600 hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-4 border-t border-gray-900 space-y-2.5">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Total de Recharges d'UC</span>
                <span className="font-bold text-white font-mono">{totalUC.toLocaleString('fr-FR')} UC</span>
              </div>
              <div className="flex justify-between items-baseline pt-2.5 border-t border-gray-900/60">
                <span className="font-bold text-sm text-white">Montant Total :</span>
                <span className="font-display text-2xl font-black text-yellow-400 font-mono">
                  {totalPrice.toLocaleString('fr-FR')} FCFA
                </span>
              </div>
            </div>
          </div>

          {/* Important Security Shield */}
          <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-2xl p-4 flex items-start space-x-3 shadow-inner">
            <AlertCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <h5 className="text-xs font-bold text-yellow-400 uppercase tracking-wide">
                AUCUN MOT DE PASSE OU CODE DE REQUIS
              </h5>
              <p className="text-gray-400 text-[11px] leading-relaxed">
                Nous avons uniquement besoin de votre <b>ID de joueur</b> (Player ID) pour livrer vos UC PUBG MOBILE de manière instantanée et officielle. Ne donnez jamais vos identifiants !
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Shipping and Proof of payment Form (5 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-5 bg-gray-950/60 rounded-2xl border border-gray-900 p-5 space-y-6">
          <h3 className="text-xs font-bold text-gray-400 font-mono uppercase tracking-wider border-b border-gray-900 pb-2">
            FORMULAIRE DE LIVRAISON
          </h3>

          {/* Player Info Inputs */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                ID Joueur PUBG MOBILE *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                  <Coins className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Ex: 5139284711"
                  value={pubgId}
                  onChange={(e) => setPubgId(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white font-mono placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  Nom Complet *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Alassane Sanou"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                  N° Téléphone *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: +226 76549737"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3">
            <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
              MÉTHODE DE PAIEMENT BURKINA *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedPayment(method.id)}
                  className={`py-2 px-1 text-center rounded-xl border text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    selectedPayment === method.id
                      ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400 shadow-md'
                      : 'bg-[#050508] text-gray-400 border-gray-850 hover:border-gray-800'
                  }`}
                >
                  {method.name}
                </button>
              ))}
            </div>

            {/* USSD / Instructions Display */}
            <div className="bg-[#050508] p-3.5 rounded-xl border border-gray-850 space-y-2 text-center">
              <span className="text-[9px] font-mono font-black text-yellow-500/80 uppercase tracking-widest leading-none block">
                Saisir sur votre téléphone :
              </span>
              <p className="font-mono text-xs font-black text-white select-all bg-black/80 px-2 py-1.5 rounded border border-gray-900 inline-block">
                {currentPaymentMethod.number.replace('montant', totalPrice.toString())}
              </p>
              <p className="text-[10px] text-gray-400 leading-relaxed pt-1.5">
                {currentPaymentMethod.instructions} Destinataire : <b className="text-white">{currentPaymentMethod.recipientName}</b>.
              </p>
            </div>
          </div>

          {/* Screenshot Proof of Payment */}
          <div className="space-y-2">
            <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
              PREUVE DE TRANSFERT (SCREENSHOT) *
            </label>
            <div className="relative border-2 border-dashed border-gray-850 hover:border-yellow-400/30 rounded-xl p-4 transition-all text-center">
              <input
                type="file"
                accept="image/*"
                required
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />
              <div className="space-y-1.5">
                <Upload className="h-6 w-6 text-yellow-400/60 mx-auto" />
                <p className="text-xs text-gray-300 font-medium">Télécharger la preuve</p>
                <p className="text-[10px] text-gray-500 font-mono">Format JPG/PNG • Reçu de transaction</p>
              </div>
            </div>

            {screenshotName && (
              <div className="bg-green-500/5 border border-green-500/20 rounded-xl px-3 py-2 flex items-center justify-between text-xs font-mono text-green-400">
                <span className="flex items-center space-x-1.5 truncate">
                  <Check className="h-3.5 w-3.5" />
                  <span className="truncate">{screenshotName}</span>
                </span>
                <span className="text-[10px] font-bold">PRÊT</span>
              </div>
            )}
          </div>

          {/* Inline custom error message */}
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3 text-xs animate-fade-in font-sans flex items-start space-x-1.5">
              <span className="font-bold">⚠️ Échec:</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Order Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-black rounded-xl text-sm shadow-lg shadow-yellow-400/10 transition-all flex items-center justify-center space-x-2 cursor-pointer ${
              isSubmitting ? 'opacity-80' : ''
            }`}
            id="cart-submit-btn"
          >
            {isSubmitting ? (
              <span>Génération de la commande...</span>
            ) : (
              <>
                <span>VALIDER & ENVOYER SUR WHATSAPP</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
