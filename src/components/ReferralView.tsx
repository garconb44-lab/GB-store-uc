import React from 'react';
import { UserAccount, LeaderboardUser } from '../types';
import { 
  Gift, Share2, Award, Clipboard, MessageCircle, 
  Facebook, TrendingUp, HelpCircle 
} from 'lucide-react';

interface ReferralViewProps {
  currentUser: UserAccount | null;
  onShareLink: () => void;
  onCopyText: (text: string, msg: string) => void;
}

export default function ReferralView({ currentUser, onShareLink, onCopyText }: ReferralViewProps) {
  
  // Dynamic referral link
  const referralLink = currentUser 
    ? `${window.location.origin}/?ref=${currentUser.referralCode}` 
    : `${window.location.origin}/`;

  // Mock Referrers Leaderboard
  const LEADERBOARD: LeaderboardUser[] = [
    { name: 'Issouf Barry', referralCode: 'GB-ISSUF', referralCount: 18, rewardCoins: 15300 },
    { name: 'Karim Ouedraogo', referralCode: 'GB-KARIM', referralCount: 12, rewardCoins: 10200 },
    { name: 'Mariam Diallo', referralCode: 'GB-MARI1', referralCount: 9, rewardCoins: 7650 },
    { name: 'Adama Traoré', referralCode: 'GB-ADAMA', referralCount: 6, rewardCoins: 5100 },
    { name: 'Fatoumata Sawadogo', referralCode: 'GB-FATO1', referralCount: 4, rewardCoins: 3400 },
  ];

  return (
    <div className="space-y-8 animate-fade-in py-4">
      
      {/* Title block */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-1.5 bg-yellow-400/10 text-yellow-400 px-3 py-1 rounded-full border border-yellow-400/20 text-xs font-bold font-mono">
          <Gift className="h-3.5 w-3.5" />
          <span>PROGRAMME DE PARRAINAGE GB STORES</span>
        </div>
        <h2 className="font-display text-3xl font-black text-white tracking-wide mt-2">
          PARRAINEZ DES AMIS, <span className="text-yellow-400">GAGNEZ DES UC !</span>
        </h2>
        <p className="text-sm text-gray-400">
          Invitez vos amis de jeu PUBG Mobile à acheter leurs UC sur notre plateforme et obtenez des récompenses exclusives d'UC attribuées par l'administrateur.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: My Referral Hub (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          <div className="bg-gray-950/60 rounded-2xl border border-gray-900 p-6 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl -z-10"></div>
            
            <h3 className="font-display font-black text-lg text-white pb-3 border-b border-gray-900">
              VOTRE ESPACE PARRAINAGE
            </h3>

            {currentUser ? (
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#050508] p-4 rounded-xl border border-gray-850">
                    <span className="text-[10px] text-gray-500 font-mono uppercase block">Filleuls Inscrits</span>
                    <span className="text-2xl font-display font-black text-white mt-1.5 block">
                      {currentUser.referrals.length}
                    </span>
                    <span className="text-[9px] text-green-400 font-mono mt-1 block">Mise à jour instantanée ✓</span>
                  </div>

                  <div className="bg-[#050508] p-4 rounded-xl border border-gray-850">
                    <span className="text-[10px] text-gray-500 font-mono uppercase block">Mon Code Unique</span>
                    <span className="text-2xl font-display font-black text-yellow-400 mt-1.5 block font-mono">
                      {currentUser.referralCode}
                    </span>
                    <span className="text-[9px] text-gray-500 font-mono mt-1 block">Inviolable & Personnel</span>
                  </div>
                </div>

                {/* Sharing and copying links */}
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Lien de Parrainage Officiel
                    </label>
                    <div className="flex bg-[#050508] border border-gray-850 rounded-xl overflow-hidden pr-1.5 py-1.5 pl-3">
                      <input 
                        type="text" 
                        readOnly 
                        value={referralLink}
                        className="bg-transparent flex-1 text-xs text-gray-400 focus:outline-none font-mono select-all truncate pr-2"
                      />
                      <button
                        onClick={() => onCopyText(referralLink, "🔗 Lien de parrainage copié !")}
                        className="bg-yellow-400 hover:bg-yellow-500 text-black px-3.5 py-1.5 rounded-lg text-xs font-black flex items-center space-x-1 transition-colors cursor-pointer"
                      >
                        <Clipboard className="h-3.5 w-3.5" />
                        <span>Copier</span>
                      </button>
                    </div>
                  </div>

                  {/* Multi-platform Share buttons */}
                  <div className="space-y-2">
                    <span className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
                      Partager directement sur :
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {/* WhatsApp Share */}
                      <a
                        href={`https://wa.me/?text=Salut%20!%20Recharge%20tes%20UC%20PUBG%20MOBILE%20rapidement%20et%20de%20mani%C3%A8re%20s%C3%A9curis%C3%A9e%20sur%20GB%20STORES%20UC.%20Inscris-toi%20avec%20mon%20code%20%3A%20${currentUser.referralCode}%20en%20cliquant%20sur%20ce%20lien%20%3A%20${encodeURIComponent(referralLink)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/25 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>WhatsApp</span>
                      </a>
                      
                      {/* Facebook Share */}
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600/15 hover:bg-blue-600/25 text-blue-400 border border-blue-600/20 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all"
                      >
                        <Facebook className="h-4 w-4" />
                        <span>Facebook</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-4">
                <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                  Vous devez être connecté pour accéder à votre code de parrainage et inviter vos amis. Créez un compte gratuitement en quelques secondes !
                </p>
                <div className="bg-yellow-400/5 p-3 rounded-xl border border-yellow-400/20 inline-flex items-center space-x-2 text-yellow-400 text-xs font-bold">
                  <Award className="h-4 w-4" />
                  <span>Bonus UC de parrainage en attente</span>
                </div>
              </div>
            )}
          </div>

          {/* How Referral Works */}
          <div className="bg-[#050508] p-5 rounded-2xl border border-gray-850 space-y-4">
            <h4 className="font-display font-black text-sm text-white flex items-center space-x-2">
              <HelpCircle className="h-4 w-4 text-yellow-400" />
              <span>COMMENT ÇA MARCHE ?</span>
            </h4>
            <div className="space-y-3.5 text-xs text-gray-400 leading-relaxed">
              <p>
                <b>1. Invitez vos amis :</b> Partagez votre code ou votre lien de parrainage unique par WhatsApp, Facebook ou en face-à-face.
              </p>
              <p>
                <b>2. Enregistrement automatique :</b> Dès qu'un ami s'inscrit en utilisant votre code, il est automatiquement enregistré comme votre filleul dans notre base de données.
              </p>
              <p>
                <b>3. Récompenses de l'Admin :</b> L'administrateur consulte régulièrement la liste des meilleurs parrains et attribue des bonus d'UC gratuits ou des réductions tarifaires exclusives pour vous récompenser.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Leaderboard of best referrers (5 cols) */}
        <div className="md:col-span-5 bg-gray-950/60 rounded-2xl border border-gray-900 p-5 flex flex-col h-[465px]">
          <div className="flex items-center space-x-2 pb-4 border-b border-gray-900 flex-shrink-0">
            <TrendingUp className="h-5 w-5 text-yellow-400" />
            <h3 className="font-display font-black text-sm text-white uppercase">CLASSEMENT DES MEILLEURS PARRAINS</h3>
          </div>

          <div className="flex-1 overflow-y-auto pt-4 space-y-3 pr-1">
            {LEADERBOARD.map((item, index) => {
              const colors = [
                'border-yellow-400/40 bg-yellow-400/5 text-yellow-400',
                'border-gray-400/20 bg-gray-400/5 text-gray-300',
                'border-amber-700/20 bg-amber-700/5 text-amber-500',
              ];
              const isTop3 = index < 3;
              return (
                <div 
                  key={item.referralCode}
                  className={`p-3 rounded-xl border flex items-center justify-between ${
                    isTop3 ? colors[index] : 'border-gray-900 bg-black/40 text-gray-400'
                  }`}
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <span className="font-display font-black text-sm w-5 text-center font-mono">
                      #{index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold text-xs truncate text-white">{item.name}</p>
                      <p className="text-[9px] text-gray-500 font-mono uppercase tracking-widest mt-0.5">Code: {item.referralCode}</p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="text-xs font-black block text-white">{item.referralCount} filleuls</span>
                    <span className="text-[9px] text-yellow-500 font-bold font-mono">Est. +{item.rewardCoins.toLocaleString('fr-FR')} UC</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
