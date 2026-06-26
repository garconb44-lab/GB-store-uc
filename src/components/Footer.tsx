import React, { useState } from 'react';
import { Smartphone, Download, CheckCircle, Info, Heart, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import appLogo from '../assets/images/game_over_logo_1782296492232.jpg';

interface FooterProps {
  isInstallable: boolean;
  isInstalled: boolean;
  onInstall: () => void;
  onNavigate: (tab: string) => void;
}

export default function Footer({ isInstallable, isInstalled, onInstall, onNavigate }: FooterProps) {
  const [showGuide, setShowGuide] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <footer className="bg-[#050508] border-t border-gray-900 mt-auto pt-10 pb-8 px-4 font-sans text-gray-400" id="global-app-footer">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Main Installation Call-To-Action (Bottom block) */}
        <div className="bg-gradient-to-r from-yellow-400/5 via-amber-500/5 to-transparent border border-yellow-400/10 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4" id="footer-install-cta">
          <div className="flex items-center space-x-3.5">
            <div className="bg-yellow-400/10 text-yellow-400 p-2.5 rounded-xl border border-yellow-400/20">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-white uppercase tracking-wider">GB STORES APPLICATION MOBILE</h4>
                {isInstalled ? (
                  <span className="bg-green-500/20 text-green-400 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-green-500/25 flex items-center gap-1">
                    <CheckCircle className="w-2.5 h-2.5" /> Installée
                  </span>
                ) : (
                  <span className="bg-yellow-400/20 text-yellow-400 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border border-yellow-400/25">
                    Installez l'App
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-1">Installez l'application sur votre écran d'accueil pour un accès instantané et ultra-rapide.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {!isInstalled && (
              <div className="relative flex-1 md:flex-initial group">
                <button
                  onClick={() => {
                    onInstall();
                    if (!isInstallable) {
                      setShowTooltip(!showTooltip);
                    }
                  }}
                  onMouseEnter={() => !isInstallable && setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="w-full bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 hover:from-yellow-300 hover:via-yellow-400 hover:to-amber-450 text-black px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all transform hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2 cursor-pointer font-black shadow-[0_0_20px_rgba(234,179,8,0.35)] hover:shadow-[0_0_25px_rgba(234,179,8,0.55)] border border-yellow-300/40"
                  id="footer-install-button"
                >
                  <Download className="h-4 w-4 animate-bounce" />
                  <span>Installer maintenant</span>
                </button>

                {/* Contextual Tooltip */}
                <AnimatePresence>
                  {!isInstallable && showTooltip && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.18 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3.5 w-72 bg-[#050508] border border-yellow-400/30 p-4 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.85)] text-left z-50 text-[11px] leading-relaxed font-sans text-gray-300 space-y-2 pointer-events-none"
                    >
                      <div className="font-bold text-yellow-400 flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                        <HelpCircle className="h-3.5 w-3.5 text-yellow-400 shrink-0" />
                        <span>Installation Manuelle</span>
                      </div>
                      <p className="text-gray-400">Votre navigateur ou cet iframe ne supporte pas l'installation en 1 clic. Pour l'installer :</p>
                      <div className="border-t border-gray-900 pt-2 space-y-1.5 font-sans">
                        <p><span className="text-white font-bold">🍏 Safari (iPhone) :</span> Appuyez sur partager <span className="text-yellow-400">⎋</span> puis <span className="text-white">"Sur l'écran d'accueil"</span>.</p>
                        <p><span className="text-white font-bold">🤖 Chrome / Edge :</span> Ouvrez le menu <span className="text-yellow-400">⋮</span> puis choisissez <span className="text-white">"Ajouter à l'écran d'accueil"</span>.</p>
                      </div>
                      {/* Tooltip arrows */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-[#050508] z-50"></div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-yellow-400/30 -mt-[1px] -z-10"></div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            <button
              onClick={() => setShowGuide(!showGuide)}
              className="flex-1 md:flex-initial bg-gray-900 hover:bg-gray-850 text-gray-300 hover:text-white border border-gray-800 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5 cursor-pointer font-bold"
              id="footer-guide-button"
            >
              <Info className="h-4 w-4 text-yellow-400" />
              <span>{showGuide ? "Fermer" : "Guide"}</span>
            </button>
          </div>
        </div>

        {/* Installation guide drawer dropdown */}
        {showGuide && (
          <div className="bg-black/40 p-4 rounded-xl border border-gray-900 space-y-3 font-mono text-[11px] text-gray-400 leading-relaxed animate-fade-in" id="footer-install-guide">
            <p className="text-white font-bold text-xs uppercase tracking-wide">💡 Instructions d'installation rapide :</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-yellow-400 font-bold">🤖 Android (Chrome/Edge/Samsung) :</p>
                <p>Cliquez sur le bouton "Installer maintenant" ci-dessus, puis validez sur l'invite qui s'affiche.</p>
              </div>
              <div className="space-y-1">
                <p className="text-yellow-400 font-bold">🍏 iPhone (Safari) :</p>
                <p>Ouvrez Safari, appuyez sur l'icône de partage, faites défiler vers le bas et sélectionnez "Sur l'écran d'accueil".</p>
              </div>
            </div>
          </div>
        )}

        {/* Brand footer details */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-gray-900/60">
          <div className="flex items-center space-x-3">
            <img 
              src={appLogo} 
              alt="GB STORES" 
              className="w-7 h-7 rounded-lg object-cover border border-gray-800"
              referrerPolicy="no-referrer"
            />
            <span className="font-display font-black text-sm text-white">GB STORES <span className="text-yellow-400">UC</span></span>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-semibold">
            <button onClick={() => onNavigate('home')} className="hover:text-yellow-400 transition-colors cursor-pointer text-gray-400 hover:text-white">Accueil</button>
            <button onClick={() => onNavigate('offers')} className="hover:text-yellow-400 transition-colors cursor-pointer text-gray-400 hover:text-white">Tarifs UC</button>
            <button onClick={() => onNavigate('partner')} className="hover:text-yellow-400 transition-colors cursor-pointer text-gray-400 hover:text-white">Espace Revendeurs</button>
            <button onClick={() => onNavigate('contact')} className="hover:text-yellow-400 transition-colors cursor-pointer text-gray-400 hover:text-white">Contact</button>
            <button onClick={() => onNavigate('faq')} className="hover:text-yellow-400 transition-colors cursor-pointer text-gray-400 hover:text-white">FAQ</button>
          </div>
        </div>

        {/* Intellectual property details */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-gray-500 text-center sm:text-left">
          <p>© 2026 GB STORES UC. Tous droits réservés.</p>
          <p className="flex items-center justify-center gap-1">
            <span>Développé avec</span>
            <Heart className="h-3 w-3 text-red-500 fill-current" />
            <span>pour PUBG Mobile BF</span>
          </p>
        </div>

      </div>
    </footer>
  );
}
