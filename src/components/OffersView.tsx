import React from 'react';
import { UCOffer, CartItem } from '../types';
import { ShoppingBag, Star, Zap, ShoppingCart } from 'lucide-react';
import ucVoucher from '../assets/images/pubg_uc_voucher_1782296939373.jpg';

interface OffersViewProps {
  offers: UCOffer[];
  onAddToCart: (offer: UCOffer) => void;
  onQuickBuy: (offer: UCOffer) => void;
  cartItems: CartItem[];
}

export default function OffersView({ offers, onAddToCart, onQuickBuy, cartItems }: OffersViewProps) {
  
  const getCartQuantity = (offerId: string) => {
    const item = cartItems.find(i => i.offer.id === offerId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="space-y-8 animate-fade-in py-4">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="font-display text-3xl font-black text-white tracking-wide">
          TARIFS <span className="text-yellow-400">UC PUBG MOBILE</span>
        </h2>
        <p className="text-sm text-gray-400">
          Sélectionnez les packs d'UC de votre choix. Ajoutez au panier pour commander plusieurs packs simultanément ou effectuez un achat rapide.
        </p>
      </div>

      {/* Grid of packs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => {
          const inCartQty = getCartQuantity(offer.id);
          const isPopular = offer.isPopular || offer.ucAmount >= 3000;
          return (
            <div 
              key={offer.id}
              className={`relative bg-gradient-to-b from-gray-950 to-[#0c0c14] rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden group hover:scale-[1.02] ${
                isPopular 
                  ? 'border-yellow-400/40 shadow-[0_0_20px_rgba(234,179,8,0.1)] hover:border-yellow-400 hover:shadow-[0_10px_35px_rgba(234,179,8,0.25)]' 
                  : 'border-gray-850 hover:border-yellow-400/30 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
              }`}
              id={`offer-card-${offer.id}`}
            >
              {/* Popular Badge */}
              {isPopular && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-black text-[9px] px-2 py-1 rounded-md tracking-wider uppercase flex items-center space-x-1 shadow-md z-10 font-mono">
                  <Star className="h-2.5 w-2.5 fill-current" />
                  <span>POPULAIRE</span>
                </div>
              )}

              {/* Tag Badge */}
              {offer.tag && !isPopular && (
                <div className="absolute top-3 right-3 bg-gray-900 text-yellow-400 border border-yellow-400/20 font-bold text-[9px] px-2 py-1 rounded-md tracking-wider uppercase z-10 font-mono">
                  {offer.tag}
                </div>
              )}

              {/* Card Header Media */}
              <div className="relative h-36 bg-[#040407] flex items-center justify-center border-b border-gray-900 overflow-hidden">
                {/* Background lighting */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent z-10"></div>
                <div className="absolute w-24 h-24 bg-yellow-400/10 rounded-full blur-2xl group-hover:bg-yellow-400/20 transition-all duration-500"></div>
                
                {/* Stacks Image */}
                <img 
                  src={ucVoucher} 
                  alt="PUBG UC Stack" 
                  className="w-full h-full object-cover opacity-85 transform group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex-1">
                  {/* Amount of UC */}
                  <div className="flex items-baseline space-x-2">
                    <span className="font-display text-3xl font-black text-white tracking-tight">
                      {offer.ucAmount.toLocaleString('fr-FR')}
                    </span>
                    {offer.bonusUc > 0 && (
                      <span className="text-green-400 font-display font-black text-base">
                        + {offer.bonusUc.toLocaleString('fr-FR')} UC
                      </span>
                    )}
                  </div>
                  
                  <p className="text-[11px] font-mono text-gray-500 uppercase tracking-widest mt-1">
                    PUBG MOBILE UC PACK
                  </p>

                  {/* Pricing line */}
                  <div className="mt-4 pt-3 border-t border-gray-900 flex items-center justify-between">
                    <span className="text-gray-400 text-xs">Tarif Burkinabè</span>
                    <span className="text-xl font-display font-black text-yellow-400">
                      {offer.priceFcfa.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="mt-6 space-y-2.5">
                  
                  {/* Quantity In Cart Indicator */}
                  {inCartQty > 0 && (
                    <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-xl px-3 py-1.5 flex items-center justify-between text-xs font-mono text-yellow-400">
                      <span>Déjà au panier</span>
                      <span className="font-bold">{inCartQty} pack(s)</span>
                    </div>
                  )}

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => onAddToCart(offer)}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 bg-gray-900 hover:bg-gray-850 text-gray-200 hover:text-white border border-gray-800 rounded-xl text-xs font-bold transition-all group-hover:border-yellow-400/20 cursor-pointer"
                    id={`add-to-cart-${offer.id}`}
                  >
                    <ShoppingCart className="h-3.5 w-3.5 text-yellow-400" />
                    <span>Ajouter au panier</span>
                  </button>

                  {/* Quick Buy Button */}
                  <button
                    onClick={() => onQuickBuy(offer)}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-black rounded-xl text-xs shadow-md shadow-yellow-400/5 transition-all cursor-pointer"
                    id={`quick-buy-${offer.id}`}
                  >
                    <Zap className="h-3.5 w-3.5" />
                    <span>Recharger maintenant</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
