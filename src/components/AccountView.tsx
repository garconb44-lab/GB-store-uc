import React, { useState } from 'react';
import { UserAccount, OrderItem } from '../types';
import { 
  User, Mail, Phone, Gamepad, Award, 
  History, Calendar, Shield, Save, KeyRound 
} from 'lucide-react';

interface AccountViewProps {
  currentUser: UserAccount | null;
  onLogin: (email: string, phone: string) => boolean;
  onRegister: (data: { name: string; email: string; phone: string; pubgId: string; referredByCode?: string }) => void;
  onUpdateProfile: (name: string, phone: string, pubgId: string) => void;
}

export default function AccountView({ 
  currentUser, 
  onLogin, 
  onRegister,
  onUpdateProfile 
}: AccountViewProps) {
  
  // Toggle forms
  const [isLoginView, setIsLoginView] = useState(true);
  
  // Alert states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  // Login form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  
  // Register form states
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPubgId, setRegPubgId] = useState('');
  const [regReferralCode, setRegReferralCode] = useState('');

  // Edit profile states
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editPubgId, setEditPubgId] = useState(currentUser?.pubgId || '');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    
    if (!loginEmail.trim() || !loginPhone.trim()) {
      setErrorMsg("Veuillez remplir tous les champs !");
      return;
    }
    
    // Attempt login
    const success = onLogin(loginEmail.trim().toLowerCase(), loginPhone.trim());
    if (!success) {
      setErrorMsg("Identifiants incorrects. S'il s'agit de votre première visite, veuillez créer un compte !");
    } else {
      setSuccessMsg("Connexion réussie !");
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    
    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regPubgId.trim()) {
      setErrorMsg("Veuillez remplir tous les champs obligatoires !");
      return;
    }

    onRegister({
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      phone: regPhone.trim(),
      pubgId: regPubgId.trim(),
      referredByCode: regReferralCode.trim() || undefined
    });
    setSuccessMsg("Votre compte a été créé avec succès ! Bienvenue !");
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    
    if (!editName.trim() || !editPhone.trim() || !editPubgId.trim()) {
      setErrorMsg("Veuillez remplir tous les champs !");
      return;
    }
    onUpdateProfile(editName.trim(), editPhone.trim(), editPubgId.trim());
    setIsEditing(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="bg-green-500/10 text-green-400 text-[9px] font-bold px-2 py-0.5 rounded border border-green-500/20 font-mono uppercase">LIVRÉ ✓</span>;
      case 'cancelled':
        return <span className="bg-red-500/10 text-red-400 text-[9px] font-bold px-2 py-0.5 rounded border border-red-500/20 font-mono uppercase">ANNULÉ</span>;
      default:
        return <span className="bg-yellow-500/10 text-yellow-400 text-[9px] font-bold px-2 py-0.5 rounded border border-yellow-500/20 font-mono uppercase">EN ATTENTE</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-4">
      
      {!currentUser ? (
        /* Authentication Screen (Login / Register Card) */
        <div className="max-w-md mx-auto bg-gradient-to-b from-gray-950 to-[#0b0b14] border border-gray-900 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-3xl"></div>
          
          {/* Form Switcher Tabs */}
          <div className="flex border-b border-gray-900 pb-4 mb-6">
            <button
              onClick={() => {
                setIsLoginView(true);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 pb-2 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                isLoginView 
                  ? 'border-yellow-400 text-yellow-400' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Se Connecter
            </button>
            <button
              onClick={() => {
                setIsLoginView(false);
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 pb-2 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                !isLoginView 
                  ? 'border-yellow-400 text-yellow-400' 
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Créer un Compte
            </button>
          </div>

          {/* Clean custom error or success banners */}
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3.5 text-xs mb-5 animate-fade-in flex items-start space-x-2">
              <span className="font-bold flex-shrink-0">⚠️ Échec:</span>
              <span>{errorMsg}</span>
            </div>
          )}
          {successMsg && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl p-3.5 text-xs mb-5 animate-fade-in flex items-start space-x-2">
              <span className="font-bold flex-shrink-0">✅ Succès:</span>
              <span>{successMsg}</span>
            </div>
          )}

          {isLoginView ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-4" id="login-form">
              <p className="text-xs text-gray-400 leading-relaxed text-center pb-2">
                Saisissez l'adresse email et le numéro de téléphone associés à votre compte pour vous connecter de manière instantanée.
              </p>
              
              <div>
                <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1.5">Adresse Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500"><Mail className="h-4 w-4" /></span>
                  <input
                    type="email"
                    required
                    placeholder="Ex: player@gmail.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-xl py-2.5 pl-10 text-xs text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1.5">N° Téléphone</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500"><Phone className="h-4 w-4" /></span>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: +226 76549737"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-xl py-2.5 pl-10 text-xs text-white focus:outline-none focus:ring-1 focus:ring-yellow-400"
                  />
                </div>
              </div>

              {/* Dev notice */}
              <div className="bg-yellow-400/5 p-2.5 rounded-lg border border-yellow-400/10 text-[10px] text-yellow-400/80 font-mono text-center">
                Note d'administration: Pour l'accès admin global, connectez-vous avec: <b>admin@gbstores.com</b> et <b>+22676549737</b>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-black rounded-xl text-xs shadow-lg transition-all cursor-pointer"
                id="login-submit-btn"
              >
                SE CONNECTER
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-4" id="register-form">
              <p className="text-xs text-gray-400 leading-relaxed text-center pb-2">
                Rejoignez GB STORES UC pour sauvegarder vos identifiants de jeu, voir l'historique complet de vos livraisons d'UC, et obtenir un code de parrainage exclusif !
              </p>

              <div>
                <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1.5">Nom Complet *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500"><User className="h-4 w-4" /></span>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Alassane Sanou"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-xl py-2.5 pl-10 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1.5">Adresse Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="Ex: player@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1.5">Téléphone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="Ex: +226 76549737"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-xl py-2.5 px-3.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1.5">ID Joueur PUBG MOBILE *</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500"><Gamepad className="h-4 w-4" /></span>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 5139284711"
                    value={regPubgId}
                    onChange={(e) => setRegPubgId(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-xl py-2.5 pl-10 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1.5">Code de Parrainage d'Ami (Optionnel)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500"><Award className="h-4 w-4" /></span>
                  <input
                    type="text"
                    placeholder="Ex: GB-5A3E"
                    value={regReferralCode}
                    onChange={(e) => setRegReferralCode(e.target.value.toUpperCase())}
                    className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-xl py-2.5 pl-10 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 mt-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-black rounded-xl text-xs shadow-lg transition-all cursor-pointer"
                id="register-submit-btn"
              >
                CRÉER MON COMPTE SÉCURISÉ
              </button>
            </form>
          )}
        </div>
      ) : (
        /* Logged In User Profile Dashboard (2 Columns) */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Column 1: Profile card info (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-gray-950/60 rounded-2xl border border-gray-900 p-6 space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-2xl"></div>
              
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center text-black font-black text-2xl shadow-lg shadow-yellow-400/10">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-display font-black text-xl text-white">{currentUser.name}</h3>
                  <div className="flex items-center space-x-1 mt-1 text-[10px] font-mono text-gray-500 uppercase">
                    <Shield className="h-3.5 w-3.5 text-yellow-400" />
                    <span>{currentUser.isAdmin ? 'Administrateur' : 'Membre Officiel'}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-900 pt-5">
                {isEditing ? (
                  /* Edit Profile Form */
                  <form onSubmit={handleUpdateSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1">Nom Complet</label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-lg py-2 px-3 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1">Téléphone</label>
                      <input
                        type="text"
                        required
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-lg py-2 px-3 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1">ID Joueur PUBG</label>
                      <input
                        type="text"
                        required
                        value={editPubgId}
                        onChange={(e) => setEditPubgId(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-[#050508] border border-gray-800 focus:border-yellow-400 rounded-lg py-2 px-3 text-xs text-white font-mono"
                      />
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="flex-1 py-1.5 bg-gray-900 hover:bg-gray-850 text-gray-400 rounded-lg text-xs font-bold border border-gray-800 transition-colors"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg text-xs font-bold transition-colors flex items-center justify-center space-x-1"
                      >
                        <Save className="h-3.5 w-3.5" />
                        <span>Enregistrer</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Profile details display */
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-900/60 text-xs">
                      <span className="text-gray-500 font-mono">Email</span>
                      <span className="font-bold text-white">{currentUser.email}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-900/60 text-xs">
                      <span className="text-gray-500 font-mono">N° Téléphone</span>
                      <span className="font-bold text-white">{currentUser.phone}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-900/60 text-xs">
                      <span className="text-gray-500 font-mono">ID PUBG Mobile</span>
                      <span className="font-mono font-bold text-yellow-400">{currentUser.pubgId}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-900/60 text-xs">
                      <span className="text-gray-500 font-mono">Date d'inscription</span>
                      <span className="font-bold text-white">{currentUser.joinedDate}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 text-xs">
                      <span className="text-gray-500 font-mono">Mon Code de Parrainage</span>
                      <span className="font-mono font-black text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">{currentUser.referralCode}</span>
                    </div>

                    <button
                      onClick={() => {
                        setEditName(currentUser.name);
                        setEditPhone(currentUser.phone);
                        setEditPubgId(currentUser.pubgId);
                        setIsEditing(true);
                      }}
                      className="w-full mt-2 py-2 bg-gray-900 hover:bg-gray-850 text-white border border-gray-800 hover:border-yellow-400/25 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Modifier mon Profil
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Column 2: Order history / Transactions (7 cols) */}
          <div className="md:col-span-7 bg-gray-950/60 rounded-2xl border border-gray-900 p-6 flex flex-col h-[460px]">
            <div className="flex items-center justify-between pb-4 border-b border-gray-900 flex-shrink-0">
              <div className="flex items-center space-x-2">
                <History className="h-5 w-5 text-yellow-400" />
                <h3 className="font-display font-black text-lg text-white">HISTORIQUE DES COMMANDES</h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-gray-500 bg-gray-900 border border-gray-850 px-2 py-0.5 rounded">
                {currentUser.orders.length} Commande(s)
              </span>
            </div>

            <div className="flex-1 overflow-y-auto pt-4 space-y-4 pr-1">
              {currentUser.orders.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-2.5">
                  <Gamepad className="h-10 w-10 text-gray-700" />
                  <h4 className="text-white text-sm font-bold">Aucune commande enregistrée</h4>
                  <p className="text-gray-500 text-xs max-w-xs leading-relaxed">
                    Vous n'avez pas encore effectué de recharge d'UC sous ce compte. Visitez l'onglet "Tarifs UC" pour effectuer votre première commande !
                  </p>
                </div>
              ) : (
                currentUser.orders.map((order) => (
                  <div key={order.id} className="bg-[#050508] p-4 rounded-xl border border-gray-850 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-white font-mono">CODE: #{order.id}</h4>
                        <div className="flex items-center space-x-1.5 text-[10px] text-gray-500 font-mono mt-0.5">
                          <Calendar className="h-3.5 w-3.5" />
                          <span>{order.date}</span>
                        </div>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="pt-2 border-t border-gray-900 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-gray-400 font-bold">Recharge : </span>
                        <span className="text-yellow-400 font-black">
                          {(order.offer.ucAmount + order.offer.bonusUc).toLocaleString('fr-FR')} UC
                        </span>
                        <span className="text-gray-500 text-[10px] ml-1">({order.quantity} pack(s))</span>
                      </div>
                      <div>
                        <span className="text-gray-500 mr-1 font-mono">Payé:</span>
                        <span className="text-white font-black font-mono">{order.priceTotal.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                    </div>

                    <div className="text-[10px] text-gray-500 font-mono flex items-center justify-between">
                      <span>Via: <b>{order.paymentMethod}</b></span>
                      <span>Joueur ID: <b>{order.pubgId}</b></span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
