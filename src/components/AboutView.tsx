import React from 'react';
import { ShieldCheck, Award, Zap, Heart, MessageSquare } from 'lucide-react';

export default function AboutView() {
  return (
    <div className="space-y-8 animate-fade-in py-4 max-w-4xl mx-auto">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="font-display text-3xl font-black text-white tracking-wide">
          À PROPOS DE <span className="text-yellow-400">GB STORES UC</span>
        </h2>
        <p className="text-sm text-gray-400">
          Découvrez l'histoire de la plus grande plateforme de recharge d'UC PUBG Mobile au Burkina Faso et en Afrique de l'Ouest.
        </p>
      </div>

      {/* Main introduction */}
      <div className="bg-gradient-to-b from-gray-950 to-[#0b0b14] border border-gray-900 rounded-3xl p-6 md:p-8 space-y-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-yellow-500/5 rounded-full blur-3xl -z-10"></div>

        <div className="space-y-4 max-w-3xl mx-auto text-center md:text-left">
          <h3 className="font-display font-black text-xl text-yellow-400">
            NOTRE MISSION
          </h3>
          <p className="text-gray-300 text-sm leading-relaxed">
            Fondée par des passionnés de PUBG MOBILE, <b>GB STORES UC</b> s'est donné pour objectif de simplifier, sécuriser et accélérer l'achat d'UC pour tous les joueurs burkinabè et ouest-africains. 
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Face aux difficultés d'achat international par carte bancaire, nous proposons des passerelles de paiement locales simplifiées telles que <b>Orange Money</b>, <b>Moov Money</b> et <b>Wave</b>. Nous livrons de manière 100% officielle sur votre ID de joueur sous 10 minutes.
          </p>
        </div>
      </div>

      {/* Core Values Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Value 1: Rapide */}
        <div className="bg-[#050508] p-5 rounded-2xl border border-gray-850 text-center space-y-3">
          <div className="bg-yellow-400/10 text-yellow-400 p-3 rounded-xl border border-yellow-400/20 w-fit mx-auto">
            <Zap className="h-5 w-5" />
          </div>
          <h4 className="font-display font-bold text-white text-base">Livraison Éclair</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Notre système automatisé et nos administrateurs réactifs valident vos transactions et rechargent vos UC en moins de 10 minutes chrono.
          </p>
        </div>

        {/* Value 2: Securise */}
        <div className="bg-[#050508] p-5 rounded-2xl border border-gray-850 text-center space-y-3">
          <div className="bg-green-500/10 text-green-400 p-3 rounded-xl border border-green-500/20 w-fit mx-auto">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h4 className="font-display font-bold text-white text-base">Sécurité Absolue</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Nous n'avons besoin d'aucun mot de passe ou code secret. Seul votre ID de joueur est requis, éliminant tout risque de piratage.
          </p>
        </div>

        {/* Value 3: Service */}
        <div className="bg-[#050508] p-5 rounded-2xl border border-gray-850 text-center space-y-3">
          <div className="bg-blue-500/10 text-blue-400 p-3 rounded-xl border border-blue-500/20 w-fit mx-auto">
            <Award className="h-5 w-5" />
          </div>
          <h4 className="font-display font-bold text-white text-base">Recharge Officielle</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Toutes nos recharges proviennent directement des circuits de distribution officiels de Tencent et PUBG Mobile. Aucun ban possible !
          </p>
        </div>
      </div>

      {/* Trust Quote Block */}
      <div className="bg-[#050508] p-6 rounded-2xl border border-gray-850 flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-5 text-center md:text-left">
        <Heart className="h-10 w-10 text-red-500 fill-current flex-shrink-0 animate-pulse" />
        <div>
          <p className="text-sm font-bold text-white font-display uppercase tracking-wider">
            Rejoignez plus de 10,000 joueurs satisfaits
          </p>
          <p className="text-xs text-gray-500 leading-relaxed mt-1">
            Faites confiance à l'expertise de GB STORES UC pour tous vos besoins d'achat et profitez pleinement de vos événements et skins légendaires sur PUBG MOBILE !
          </p>
        </div>
      </div>
    </div>
  );
}
