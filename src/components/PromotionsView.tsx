import React from 'react';
import { Promotion } from '../types';
import { Flame, Calendar, Tag, Gift, AlertCircle } from 'lucide-react';

interface PromotionsViewProps {
  promotions: Promotion[];
  onNavigateToOffers: () => void;
}

export default function PromotionsView({ promotions, onNavigateToOffers }: PromotionsViewProps) {
  const activePromotions = promotions.filter(p => p.active);

  return (
    <div className="space-y-8 animate-fade-in py-4">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 bg-red-500/10 text-red-400 px-3 py-1 rounded-full border border-red-500/20 text-xs font-bold font-mono">
          <Flame className="h-3.5 w-3.5 animate-pulse" />
          <span>OFFRES SPÉCIALES GB STORES</span>
        </div>
        <h2 className="font-display text-3xl font-black text-white tracking-wide mt-2">
          PROMOTIONS & <span className="text-yellow-400">RÉDUCTIONS</span>
        </h2>
        <p className="text-sm text-gray-400">
          Découvrez nos offres spéciales, réductions temporaires et packs bonus d'UC. Ces tarifs et offres sont régulièrement mis à jour par l'administrateur.
        </p>
      </div>

      {activePromotions.length === 0 ? (
        <div className="bg-gray-950/60 rounded-2xl p-8 border border-gray-900 text-center space-y-3">
          <AlertCircle className="h-10 w-10 text-gray-600 mx-auto" />
          <h4 className="font-bold text-white">Aucune promotion active</h4>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Il n'y a pas de promotion active actuellement. Revenez très bientôt pour de nouvelles offres d'UC exceptionnelles ou contactez l'administrateur !
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activePromotions.map((promo) => (
            <div 
              key={promo.id}
              className="bg-gradient-to-br from-gray-950 to-[#0e0e16] border border-red-500/10 hover:border-yellow-400/30 rounded-2xl p-6 relative overflow-hidden group transition-all duration-300"
              id={`promo-item-${promo.id}`}
            >
              {/* Background gradient blur */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -z-10 group-hover:bg-yellow-400/10 transition-all duration-500"></div>
              
              {/* Promo Badge Tag */}
              <div className="absolute top-4 right-4 bg-red-500/15 text-red-400 border border-red-500/20 text-[9px] font-black px-2 py-1 rounded font-mono uppercase tracking-widest">
                {promo.badge}
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-red-500/10 text-red-400 p-2 rounded-xl border border-red-500/20">
                    <Gift className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-white text-lg group-hover:text-yellow-400 transition-colors">
                      {promo.title}
                    </h3>
                    <div className="flex items-center space-x-1.5 text-gray-500 text-[10px] font-mono mt-0.5">
                      <Calendar className="h-3 w-3" />
                      <span>Publié le {promo.date}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-300 text-xs leading-relaxed">
                  {promo.description}
                </p>

                {/* Highlight/Callout Block */}
                {promo.bonusText && (
                  <div className="bg-yellow-400/5 border border-yellow-400/20 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs text-yellow-400 font-bold font-mono">
                    <span className="flex items-center space-x-2">
                      <Tag className="h-3.5 w-3.5 text-yellow-400" />
                      <span>AVANTAGE EXCLUSIF :</span>
                    </span>
                    <span>{promo.bonusText}</span>
                  </div>
                )}

                {/* CTA to prices */}
                <button
                  onClick={onNavigateToOffers}
                  className="w-full py-2.5 bg-gray-900 hover:bg-gray-850 text-white hover:text-yellow-400 border border-gray-800 hover:border-yellow-400/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span>Acheter des UC maintenant</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
