import React, { useState } from 'react';
import { MessageSquare, Phone, MapPin, Calendar, Clock, ShieldCheck, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export default function ContactView() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData: FAQItem[] = [
    {
      question: "Combien de temps prend la livraison des UC après mon paiement ?",
      answer: "La livraison est ultra-rapide ! Une fois votre commande soumise avec votre capture d'écran de paiement, notre équipe valide la transaction en moins de 10 à 30 minutes durant nos horaires d'ouverture, et vos UC sont directement créditées sur votre ID PUBG Mobile."
    },
    {
      question: "Quels sont les modes de paiement acceptés sur GB STORES ?",
      answer: "Nous acceptons les principaux moyens de paiement mobiles au Burkina Faso : Orange Money et Moov Money. Toutes les informations de transfert et numéros de réception s'affichent automatiquement à l'étape finale dans votre Panier."
    },
    {
      question: "Pourquoi dois-je fournir mon ID PUBG Mobile exact ?",
      answer: "Votre ID numérique PUBG (ex: 5124896730) est la seule coordonnée indispensable pour effectuer la recharge directe officielle. Vous n'avez jamais besoin de partager vos mots de passe ou informations de connexion sociale (Facebook, Twitter). Veillez simplement à ce que votre pseudo soit bien saisi lors de la commande."
    },
    {
      question: "Comment fonctionne le système de revendeur et parrainage ?",
      answer: "En partageant votre code de référence de compte avec d'autres joueurs, vous êtes affilié à leurs achats. Dès qu'ils commandent des UC, vous touchez automatiquement une commission créditée sur votre solde de revendeur, que vous pouvez réclamer ou utiliser pour vos propres achats !"
    },
    {
      question: "Y a-t-il un risque de bannissement pour mon compte de jeu ?",
      answer: "Aucun risque ! Toutes nos transactions de recharge UC s'effectuent par le biais des canaux de distribution officiels de Tencent et de Midasbuy. Vos UC sont 100% légitimes et sécurisées."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-12 animate-fade-in py-4 max-w-4xl mx-auto">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="font-display text-3xl font-black text-white tracking-wide">
          CONTACTEZ <span className="text-yellow-400">L'ADMINISTRATEUR</span>
        </h2>
        <p className="text-sm text-gray-400">
          Un problème avec une commande ? Une question sur nos tarifs ou envie de devenir parrain officiel ? Notre support client est à votre écoute.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Support Direct Action Block */}
        <div className="bg-gradient-to-b from-gray-950 to-[#0b0b14] border border-gray-900 rounded-3xl p-6 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -z-10"></div>
          
          <h3 className="font-display font-black text-lg text-white pb-3 border-b border-gray-900 uppercase">
            Canaux Officiels
          </h3>

          <div className="space-y-4">
            
            {/* WhatsApp Contact */}
            <div className="bg-black/60 p-4 rounded-xl border border-gray-850 flex items-start space-x-3.5 hover:border-green-500/20 transition-all">
              <div className="bg-green-500/10 text-green-400 p-2.5 rounded-xl border border-green-500/20 flex-shrink-0">
                <MessageSquare className="h-5 w-5 fill-current" />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest block">WhatsApp Direct</span>
                <a 
                  href="https://wa.me/22676549737?text=Bonjour%20GB%20STORES%20UC,%20je%20souhaite%20vous%20contacter%20concernant%20vos%20tarifs."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-mono font-black text-white hover:text-green-400 transition-colors block mt-1"
                >
                  +226 76 54 97 37
                </a>
                <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                  Cliquez sur le numéro pour ouvrir directement la discussion et échanger avec l'administrateur.
                </p>
              </div>
            </div>

            {/* Telephone Contact */}
            <div className="bg-black/60 p-4 rounded-xl border border-gray-850 flex items-start space-x-3.5 hover:border-yellow-400/20 transition-all">
              <div className="bg-yellow-400/10 text-yellow-400 p-2.5 rounded-xl border border-yellow-400/20 flex-shrink-0">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest block">Appel Mobile</span>
                <a 
                  href="tel:+22676549737"
                  className="text-base font-mono font-black text-white hover:text-yellow-400 transition-colors block mt-1"
                >
                  +226 76 54 97 37
                </a>
                <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                  Disponible pour appels cellulaires traditionnels directs au Burkina Faso.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Chat Link Button */}
          <a
            href="https://wa.me/22676549737?text=Bonjour%20GB%20STORES%20UC,%20je%20souhaite%20obtenir%20des%20informations%20suppl%C3%A9mentaires."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-black rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-green-500/10 transition-all"
          >
            <MessageSquare className="h-4 w-4 fill-current" />
            <span>DISCUTER SUR WHATSAPP</span>
          </a>
        </div>

        {/* Working Hours & General Details */}
        <div className="space-y-6">
          <div className="bg-[#050508] p-5 rounded-2xl border border-gray-850 space-y-4">
            <h4 className="font-display font-black text-sm text-white flex items-center space-x-2">
              <Clock className="h-4 w-4 text-yellow-400" />
              <span>HORAIRES D'OUVERTURE</span>
            </h4>
            <div className="space-y-3 text-xs text-gray-400 leading-relaxed">
              <div className="flex justify-between items-center py-1.5 border-b border-gray-900">
                <span>Lundi - Vendredi</span>
                <span className="font-mono font-bold text-white">08:00 - 23:00 UTC</span>
              </div>
              <div className="flex justify-between items-center py-1.5 border-b border-gray-900">
                <span>Samedi - Dimanche</span>
                <span className="font-mono font-bold text-white">09:00 - 00:00 UTC</span>
              </div>
              <p className="text-[11px] text-gray-500 italic mt-2">
                Les rechargements demandés en dehors de ces tranches horaires seront livrés dès la reprise le lendemain matin.
              </p>
            </div>
          </div>

          <div className="bg-[#050508] p-5 rounded-2xl border border-gray-850 space-y-4">
            <h4 className="font-display font-black text-sm text-white flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-yellow-400" />
              <span>LOCALISATION PHYSIQUE</span>
            </h4>
            <div className="space-y-1 text-xs text-gray-400 leading-relaxed">
              <p className="font-bold text-white">Ouagadougou, Burkina Faso</p>
              <p>Secteur 22, près du rond-point principal.</p>
              <p className="text-[10px] text-gray-500 font-mono mt-1 block">Achat physique et recharge sur place possible.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive FAQ Accordion Section */}
      <div className="space-y-6 pt-4 border-t border-gray-900" id="interactive-faq-accordion">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-yellow-400/10 text-yellow-400 p-2 rounded-xl border border-yellow-400/20">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display font-black text-base text-white uppercase tracking-wider">
              QUESTIONS FRÉQUENTES (FAQ)
            </h3>
            <p className="text-[10px] font-mono text-gray-500">TOUT SAVOIR SUR LA RECHARGE DE VOS UC PUBG MOBILE</p>
          </div>
        </div>

        <div className="space-y-3">
          {faqData.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index}
                className={`bg-[#050508] border rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen ? 'border-yellow-400/30 shadow-[0_0_20px_rgba(234,179,8,0.05)]' : 'border-gray-850 hover:border-gray-800'
                }`}
                id={`faq-item-${index}`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left transition-colors cursor-pointer"
                >
                  <span className={`text-xs font-bold transition-colors ${isOpen ? 'text-yellow-400' : 'text-gray-200'}`}>
                    {faq.question}
                  </span>
                  <span className="flex-shrink-0 ml-4 text-gray-500">
                    {isOpen ? <ChevronUp className="h-4 w-4 text-yellow-400" /> : <ChevronDown className="h-4 w-4" />}
                  </span>
                </button>
                
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-gray-900/40 text-xs text-gray-400 leading-relaxed font-sans animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
